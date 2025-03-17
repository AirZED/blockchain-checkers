import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Nav = () => {
    return (<nav className="flex justify-between items-center py-4 px-10 bg-transparent text-white fixed top-0 left-0 right-0 z-50">
        <p style={{ fontFamily: '"Kaushan Script", cursive' }} className="text-[2rem] font-600">SZ</p>

        <ul className="flex gap-8">
            <Link to="/join-game" className="hover:text-gray-500 font-700">Join Game</Link>
            <Link to="/create-game" className="hover:text-gray-500 font-700">Create Game</Link>
            <Link to="/claim-rewards" className="hover:text-gray-500 font-700">Claim Rewards</Link>

        </ul>

        <WalletMultiButton />
    </nav>);
}

export default Nav;