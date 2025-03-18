import { useState } from 'react';
import { useSocket } from '../context/socketContext';


const CreateGame = () => {
  const [formData, setFormData] = useState({
    gameType: "checkers",
  });

  const { createRoom, roomId } = useSocket();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      gameType: e.target.value,
    }));
  };

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      createRoom()

      

      console.log(roomId)
      // Create tournament transaction will go here
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full ">
      <div className='w-fit gap-[4rem]'>
        <p style={{ fontFamily: '"Kaushan Script", cursive' }} className="text-[4rem]">Create Sonic Zone!</p>

        <div className="flex flex-col gap-2 bg-white w-full p-3">

          <label className="text-black font-semibold">Select Game Type:</label>
          <select
            className="px-3 py-2 border rounded text-black"
            value={formData.gameType}
            onChange={handleSelectChange}
          >
            <option value="checkers">Checkers</option>
          </select>

          <button
            className="px-4 py-2 bg-gray-800 text-[1.2rem] text-white rounded font-semibold cursor-pointer"
            onClick={handleCreateGame}
          >
            Create Game
          </button>
        </div></div>
    </div>
  );
};

export default CreateGame;
