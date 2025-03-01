// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Button from '@mui/material/Button';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1,
// });

// export default function Upload() {
//   const userData = localStorage.getItem('userData');
//   const navigate = useNavigate();
//   const [file, setFile] = React.useState(null);
//   const [extractedText, setExtractedText] = React.useState('');

//   React.useEffect(() => {
//     if (!userData) {
//       navigate('/auth-page');
//     }
//   }, [userData, navigate]);

//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {
//       setFile(event.target.files[0]);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!file) return alert('Please select a file to upload.');
//     const data = JSON.parse(userData);
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('userId', data.userId);
//   //  console.log(userData);
//     //console.log(file);
//     try {
//       const response = await axios.post('http://localhost:3000/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setExtractedText(response.data);
//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('Error uploading file.');
//     }
//   };

//   return (
//     <div className='p-4 flex flex-col gap-4'>
//       <Button
//         component="label"
//         variant="contained"
//         startIcon={<CloudUploadIcon />}
//       >
//         Upload File
//         <VisuallyHiddenInput
//           type="file"
//           onChange={handleFileChange}
//         />
//       </Button>

//       <Button variant='contained' onClick={handleSubmit}>
//         Submit
//       </Button>

     
     
//     </div>
//   );
// }







import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function Upload() {
  const userData = localStorage.getItem('userData');
  const navigate = useNavigate();
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    if (!userData) {
      navigate('/auth-page');
    }
  }, [userData, navigate]);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert('Please select a file to upload.');

    const data = JSON.parse(userData);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', data.userId);

    setIsUploading(true);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/search');
      //alert('File uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='p-4 flex flex-col gap-4'>
      <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
        Upload File
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>

      {file && (
        <div className="text-sm text-gray-700">Selected File: {file.name}</div>
      )}

      <Button variant='contained' onClick={handleSubmit} disabled={isUploading}>
        {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
      </Button>
    </div>
  );
}
