import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGame = () => {
  const [formData, setFormData] = useState({
    entryFee: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement blockchain tournament creation logic here
    try {
      // Create tournament transaction will go here
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p style={{ fontFamily: '"Kaushan Script", cursive' }} className="text-[4rem]">Create Sonic Zone!</p>




      <p>Create your own game and invite players </p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Game
      </button>

    </div>
  );
};

export default CreateGame;
