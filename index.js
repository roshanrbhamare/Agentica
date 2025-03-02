
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const { connectDB, User } = require("./db");
const cors = require("cors");
//const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { title } = require("process");
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


const app = express();
const PORT = 3000;
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLY;// Replace with your API key

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve static files
app.use(express.static("public"));




// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Extract text from PDFs
const extractTextFromPDF = async (filePath) => {
  const data = await pdfParse(fs.readFileSync(filePath));
  return data.text;
};

// Extract text from DOCX
const extractTextFromDocx = async (filePath) => {
  const data = await mammoth.extractRawText({ path: filePath });
  return data.value;
};

// Extract text from images (OCR)
const extractTextFromImage = async (filePath) => {
  const { data } = await Tesseract.recognize(filePath, "eng");
  return data.text;
};






async function sendTextToPython(text, userID) {
  try {
    // console.log(text);
    //console.log("audio=> " + text);
    const response = await axios.post(`${process.env.FLASK_BACKEND_URL}/store`, {
      user_id: userID,
      text: text
    });
    // console.log(response.data);
    console.log("sucess");
    return response;
  } catch (error) {
    console.error('Error sending text:', error.response ? error.response.data : error.message);
  }
}





async function searchPythonAPI(query, userId) {
  try {
    const response = await axios.post(`${process.env.FLASK_BACKEND_URL}/search`, {
      user_id: userId,
      query: query
    });
    console.log("Answer:", response.data.answer);
    return response.data.answer;
    return
  } catch (error) {
    console.error('Error searching:', error.response ? error.response.data : error.message);
  }
}

const extractTextFromAudioVideo = async (filePath) => {
  try {
    // Verify API key is set
    if (!ASSEMBLYAI_API_KEY) {
      throw new Error('AssemblyAI API key not configured');
    }

    // Upload file with progress
    console.log('Uploading file to AssemblyAI...');
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    const uploadResponse = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      form,
      { headers: { authorization: ASSEMBLYAI_API_KEY, ...form.getHeaders() } }
    );

    // Start transcription
    console.log('Starting transcription...');
    const transcribeResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: uploadResponse.data.upload_url,
      },
      { headers: { authorization: ASSEMBLYAI_API_KEY } }
    );

    const transcriptId = transcribeResponse.data.id;
    console.log(`Transcription ID: ${transcriptId}`);

    // Poll for completion with retries
    let attempts = 0;
    const maxAttempts = 30; // 30 attempts * 3s = 90s timeout
    while (attempts < maxAttempts) {
      attempts++;
      const transcriptResponse = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { authorization: ASSEMBLYAI_API_KEY } }
      );

      const { status, error, text } = transcriptResponse.data;

      console.log(`Attempt ${attempts}: Status - ${status}`);

      if (status === "completed") {
        return text;
      }
      if (status === "error") {
        throw new Error(`Transcription failed: ${error}`);
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    throw new Error('Transcription timed out');
  } catch (error) {
    console.error("Error Details:", {
      message: error.message,
      response: error.response?.data
    });
    throw new Error(`Transcription failed: ${error.message}`);
  }
};

async function getSummaryFromPython(keyword, userId) {
  try {
    console.log(keyword, userId);
    const response = await axios.post(`${process.env.FLASK_BACKEND_URL}/summary`, {
      user_id: userId,
      keyword: keyword
    });
    // console.log("Summary:", response.data.summary);
    return response.data.summary;
  } catch (error) {
    console.error('Error getting summary:', error.response ? error.response.data : error.message);
  }
}


async function getTitleFromPython(text) {
  try {
    console.log("Meta data")
    const response = await axios.post(`${process.env.FLASK_BACKEND_URL}/title`, {
      text: text
    });
     console.log("Title:", response.data.title);
    return response.data.title;
  } catch (error) {
    console.error('Error getting title:', error.response ? error.response.data : error.message);
  }
}

// Ensure we await the promise before using the value








// const extractTextFromAudioVideo = async (filePath) => {
//   try {
//     // Upload file
//     const form = new FormData();
//     form.append("file", fs.createReadStream(filePath));
//     const uploadResponse = await axios.post("https://api.assemblyai.com/v2/upload", form, {
//       headers: { authorization: ASSEMBLYAI_API_KEY, ...form.getHeaders() },
//     });

//     // Start transcription with webhook
//     const transcribeResponse = await axios.post(
//       "https://api.assemblyai.com/v2/transcript",
//       {
//         audio_url: uploadResponse.data.upload_url,
//         webhook_url: "https://your-domain.com/assemblyai-webhook",
//       },
//       { headers: { authorization: ASSEMBLYAI_API_KEY } }
//     );

//     return transcribeResponse.data.id; // Return transcript ID
//   } catch (error) {
//     console.error("Error:", error);
//     return null;
//   }
// };



// Serve the file upload form
app.get("/", (req, res) => {
  res.send("server is running");
});



// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });
};

// Sign Up Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, history: [] });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({ success: true, message: 'User registered successfully', token, userId: newUser._id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({ success: true, message: 'Login successful', token, userId: user._id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});






app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded.");

    const { userId } = req.body;
    
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const fileName = req.file.originalname;
    let extractedText = "";

    if (ext === ".pdf") extractedText = await extractTextFromPDF(filePath);
    else if (ext === ".docx") extractedText = await extractTextFromDocx(filePath);
    else if ([".png", ".jpg", ".jpeg", ".bmp"].includes(ext)) extractedText = await extractTextFromImage(filePath);
    else if ([".mp3", ".wav", ".mp4"].includes(ext)) extractedText = await extractTextFromAudioVideo(filePath);
    else extractedText = fs.readFileSync(filePath, "utf8");

    fs.unlinkSync(filePath); // Clean up uploaded file

    //console.log("filename: " + filePath);

    // Save filename to user's history
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found.");
    const metaData = await getTitleFromPython(extractedText);
    // console.log("metaData: " + metaData);
   // const metaData = "";
   const newDoc = { title: fileName, docId: new mongoose.Types.ObjectId(), metaData };
   console.log(extractedText);
    user.history.push(newDoc);
    await user.save();
    console.log(extractedText);
    // Send extracted text to Python service
    await sendTextToPython(extractedText, userId);

    res.status(200).send({ success: true, document: newDoc });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error extracting text.");
  }
});

app.post('/upload-doc', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("/doc=>" + userId)
    const user = await User.findById(userId);
    let data = [];
    if (!user) return res.status(404).send({ messgae: "User not found.", data });
    user.history.map((e) => {
      data.push({title: e.title,metaData: e.metaData});
    })
    return res.status(200).json({
      message: "Data extracted successfully",
      data
    })
  } catch (error) {
    console.error(err);
    res.status(500).send("Error extracting text.");
  }
})


app.post('/search', async (req, res) => {
  const { query, userId } = req.body;
  console.log(query);
  if (!query || !userId) {
    return res.status(400).json({ error: 'Query and userId are required.' });
  }

  try {
    const answer = await searchPythonAPI(query, userId);
    console.log("anser from => "+answer);
    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search the Python API.' });
  }
});



app.post('/summary', async (req, res) => {
  const { metaData, userId } = req.body;

  if (!metaData || !userId) {
    return res.status(400).json({ error: 'Query and userId are required.' });
  }

  try {
    const answer = await getSummaryFromPython(metaData, userId);
    //console.log(answer);
    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search the Python API.' });
  }
});


app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});

