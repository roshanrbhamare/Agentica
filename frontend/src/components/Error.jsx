import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>
      
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-purple-800 text-gray-900 rounded-xl hover:bg-purple-700 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default Error;
