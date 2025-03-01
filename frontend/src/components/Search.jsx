import { Button } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Search() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const userData = localStorage.getItem('userData');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate('/auth-page');
    }
  }, [userData, navigate]);

  const handleSearch = async () => {
    if (!query) return;

    try {
      const userId = JSON.parse(userData).userId;
      const response = await axios.post('http://localhost:3000/search', {
        query,
        userId
      });
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
    <div className='w-full flex flex-row gap-1'>
      <div className='w-[20%] rounded-lg shadow-lg flex flex-col gap-4 bg-gray-100 p-4 items-start min-h-screen justify-start'>
        <div>
          <h2 className='text-purple-700 font-bold text-lg tracking-tighter'>
            Previous Upload Documents
          </h2>
        </div>
        <div className='p-2 bg-white hover:bg-gray-50 rounded-lg cursor-pointer'>
          Alice Wonderland
        </div>
        <div className='p-2 bg-white hover:bg-gray-50 rounded-lg cursor-pointer'>
          Harry Potter
        </div>
        <div className='p-2 bg-white hover:bg-gray-50 rounded-lg cursor-pointer'>
          Computer Network
        </div>
      </div>

      <div className='flex-1 w-full h-full'>
        <div className='h-[90vh] font-sans text-gray-600 bg-gray-50 overflow-y-auto p-8'>
          {answer ? <div dangerouslySetInnerHTML={{ __html: answer }} /> : 'Search for something to see results here.'}
        </div>

        <div className='mt-2'>
          <input
            placeholder='Ask me a question?'
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='w-full lg:w-[70%] p-2 bg-slate-100 rounded-lg outline-none mx-6'
          />
          <Button
            onClick={handleSearch}
            className='px-4 py-2 bg-purple-700 text-white rounded-lg'>
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Search;
