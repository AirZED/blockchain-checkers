import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGame = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    maxPlayers: 2,
    entryFee: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement blockchain tournament creation logic here
    try {
      // Create tournament transaction will go here
      navigate('/game');
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Create New Tournament</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Players
              <input
                type="number"
                name="maxPlayers"
                min="2"
                max="16"
                value={formData.maxPlayers}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Entry Fee (SOL)
              <input
                type="number"
                name="entryFee"
                min="0"
                step="0.01"
                value={formData.entryFee}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Tournament
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGame;
