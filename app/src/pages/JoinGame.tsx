import { useState } from "react";
import { socket } from "../utils/socket";


const JoinGame = () => {

    const [roomInputValue, setRoomInputValue] = useState("");


    const joinRoom = (roomId: string) => {
        console.log("Joining room:", roomId);
        socket?.emit("joinRoom", roomId);
    };


    return (<div className="flex flex-col items-center justify-center h-full">
        <p style={{ fontFamily: '"Kaushan Script", cursive' }} className="text-[4rem]">Join Sonic Zone!</p>


        <div className="flex flex-col gap-2 bg-white w-fit p-3" >
            <input
                type="text"
                placeholder="Room ID"
                className="px-2 py-2 border text-[1.2rem] text-gray-800 text-center rounded focus:outline-none border-gray-800"
                value={roomInputValue}
                onChange={(e) => setRoomInputValue(e.target.value)}
            />
            <button
                onClick={() => roomInputValue && joinRoom(roomInputValue)}
                className="px-4 py-2 bg-gray-800 text-[1.2rem] text-white rounded font-semibold"
            >
                Enter
            </button>
        </div>

    </div>);
}

export default JoinGame;