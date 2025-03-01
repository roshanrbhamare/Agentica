import { Button } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DocIcons from './DocIcons';

function Search() {
  const [history,setHistory] = useState([]);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading,setLoading] = useState(false);
  const userData = localStorage.getItem('userData');
  const navigate = useNavigate();
  const fetchHistory = async(userId)=>{
    const res1 = await axios.post('http://localhost:3000/upload-doc',{userId: userId});
   setHistory(res1.data.data);
  }

  useEffect(() => {
    if (!userData) {
      navigate('/auth-page');
    }
    const data = JSON.parse(userData);
fetchHistory(data.userId);
  }, [userData, navigate]);

  const handleSearch = async () => {
    if (!query) return;

    try {
      const userId = JSON.parse(userData).userId;
      setLoading(true);
      const response = await axios.post('http://localhost:3000/search', {
        query,
        userId
      });
      setLoading(false);
      const formattedAnswer = formatAnswer(response.data.answer);
      setAnswer(formattedAnswer);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch search results.');
    }
  };

  const formatAnswer = (text) => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\* ([^*]+)/g, '<li>$1</li>') // Bullet points
      .replace(/\n/g, '<br />'); // New lines
  };

  return (
    <div className='w-full flex flex-row'>
      <div className='w-[20%] overflow-y-auto  shadow-lg flex flex-col gap-4 bg-[#222831] p-4 items-start min-h-screen justify-start'>
        <div>
          {
            history.length === 0 ? <h2 className='text-red-700 font-bold text-lg tracking-tighter'>
            No Previous Upload Documents
          </h2> : <div>
          <h2 className='text-[#EEEEEE] font-bold text-lg tracking-tighter'>
            Previous Upload Documents
          </h2>
                {
                  history.map((e)=>{
                    return <div className='flex items-center gap-2 p-2 my-4 bg-purple-700 text-white font-bold  rounded-lg cursor-pointer'>
                      <DocIcons/>
                      <div>
                    {
                      e
                    }
                  </div>
                    </div>
                  })
                }
          </div>
}
        </div>
        
        {/* <div className='p-2 bg-white hover:bg-gray-50 rounded-lg cursor-pointer'>
          Harry Potter
        </div>
        <div className='p-2 bg-white hover:bg-gray-50 rounded-lg cursor-pointer'>
          Computer Network
        </div> */}
      </div>

      <div className='flex-1 w-full h-full'>
        <div className='h-[90vh] font-sans text-white bg-[#31363F] overflow-y-auto p-8'>
          {
            loading && <Loading/>
          }
          {(answer&&!loading )&&<div dangerouslySetInnerHTML={{ __html: answer }} />}
        </div>

        <div className=' bg-[#222831]  py-2'>
          <input
            placeholder='Ask me a question?'
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='w-full lg:w-[70%] p-2 bg-gray-600 text-white rounded-lg outline-none mx-6'
          />
          <Button
            onClick={handleSearch}
            className=' m-2 px-4 py-2 bg-purple-700 text-white rounded-lg'>
            Search
          </Button>
          <button
            onClick={() => navigate('/upload')}
            className='m-2 px-4 py-2 bg-purple-700 text-white rounded-lg'>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
export default Search;




