import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BlockchainCheckers } from "../target/types/blockchain_checkers";
import { BN } from "bn.js";

import { expect } from "chai";
import {
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
} from "@solana/web3.js";
import { randomBytes } from "crypto";
import { confirmTransaction } from "@solana-developers/helpers";

describe("blockchain-checkers", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .BlockchainCheckers as Program<BlockchainCheckers>;

  // Common variables for tests
  const host = anchor.web3.Keypair.generate();
  const player1 = anchor.web3.Keypair.generate();
  const player2 = anchor.web3.Keypair.generate();
  const player3 = anchor.web3.Keypair.generate();
  const player4 = anchor.web3.Keypair.generate();
  const gameAccount = anchor.web3.Keypair.generate();

  let tournamentPDA;
  let tournamentBump;
  let tournamentVault;
  let tournamentVaultBump;

  const seed = new BN(123);

  before(async () => {
    // Airdrop SOL to participants

    // const t2 = airdrop(provider.connection, player1.publicKey, 0.2);
    // console.log("✅ PLayer 1 Account funded: ", t2);

    // const t3 = airdrop(provider.connection, player2.publicKey, 0.2);
    // console.log("✅ PLayer 2 Account funded: ", t3);

    // const t4 = airdrop(provider.connection, player3.publicKey, 0.2);
    // console.log("✅ PLayer 3 Account funded: ", t4);

    // const t5 = airdrop(provider.connection, player4.publicKey, 0.2);
    // console.log("✅ PLayer 4 Account funded: ", t5);

    // const t6 = airdrop(provider.connection, gameAccount.publicKey, 0.2);
    // console.log("✅ Game Account funded: ", t6);

    // Find tournament vault
    [tournamentPDA, tournamentBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("tournament"),
        host.publicKey.toBuffer(),
        seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    console.log("✅ Tournament Account Address: ", tournamentPDA);

    [tournamentVault, tournamentVaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("tournament_vault"), tournamentPDA.toBuffer()],
      program.programId
    );

    console.log("✅ Tournament Vault Account Address: ", tournamentVault);
  });

  it("Should initialize a tournament", async () => {
    try {
      const t1 = await airdrop(
        provider.connection,
        host.publicKey,
        4000000000
      );
      console.log("✅ Host Account funded: ", t1);

      const tx = await program.methods
        .initializeTournament(
          seed,
          new BN(2000), // total prize
          new BN(200), // platform fee
          4 // max players
        )
        .accountsPartial({
          host: host.publicKey,
          tournament: tournamentPDA,
          tournamentVault: tournamentVault,
          systemProgram: SystemProgram.programId,
        })
        .signers([host])
        .rpc();

      console.log("Initialize Tournament TX:", tx);

      // Verify tournament state
      const tournamentAccount = await program.account.tournament.fetch(
        tournamentPDA
      );

      console.log("✅ Tournament Account: ", tournamentAccount);

      expect(tournamentAccount.host.toString()).to.equal(
        host.publicKey.toString()
      );

      expect(tournamentAccount.maxPlayers).to.equal(4);
      expect(tournamentAccount.totalPrice.toString()).to.equal("20");
      expect(tournamentAccount.platformFee.toString()).to.equal("0.01");
      expect(tournamentAccount.currentState.created).to.not.be.undefined;
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  });
});

async function airdrop(
  connection: Connection,
  address: PublicKey,
  amount: number
) {
  let airdrop_signature = await connection.requestAirdrop(
    address,
    amount * LAMPORTS_PER_SOL
  );

  let confirmedAirdrop = await confirmTransaction(
    connection,
    airdrop_signature,
    "confirmed"
  );

  console.log("✅ Airdrop Confirmed: ", confirmedAirdrop);

  return confirmedAirdrop;
}
