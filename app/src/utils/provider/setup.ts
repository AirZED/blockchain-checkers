import { AnchorProvider, Program, Wallet, web3 } from "@coral-xyz/anchor";
import { Connection, } from "@solana/web3.js";
import { BlockchainCheckers, IDL } from "./IDL";



const network = "https://api.testnet.sonic.game";
const opts = {
    preflightCommitment: "processed",
};
export const systemProgramId = web3.SystemProgram.programId;



export const makeProvider= (wallet: Wallet) => {
    const connection = new Connection(network, opts.preflightCommitment as web3.Commitment);
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });

    return provider
};


