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
  const player5 = anchor.web3.Keypair.generate();
  const player6 = anchor.web3.Keypair.generate();

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

  it("initialize tournament", async () => {
    try {
      const t1 = await airdrop(provider.connection, host.publicKey, 4);
      console.log("✅ Initialization, host Account funded: ", t1);

      const tx = await program.methods
        .initializeTournament(
          seed,
          gameAccount.publicKey,
          8 // max players
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

      expect(tournamentAccount.host.toString()).to.equal(
        host.publicKey.toString()
      );

      expect(tournamentAccount.maxPlayers).to.equal(8);
      expect(tournamentAccount.totalPrice.toString()).to.equal("0");
      expect(tournamentAccount.currentState.created).to.not.be.undefined;
      expect(tournamentAccount.gameAccount.toString()).to.equal(
        gameAccount.publicKey.toString()
      );
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  });

  it("Fund tournament", async () => {
    try {
      const t1 = await airdrop(provider.connection, host.publicKey, 10);
      console.log("✅ Fund host Account funded: ", t1);

      const tx = await program.methods
        .fundTournament(new BN(1 * LAMPORTS_PER_SOL))
        .accountsPartial({
          host: host.publicKey,
          tournament: tournamentPDA,
          gameAccount: gameAccount.publicKey,
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

      expect(tournamentAccount.host.toString()).to.equal(
        host.publicKey.toString()
      );

      expect(tournamentAccount.totalPrice.toString()).to.equal("950000000");
      expect(tournamentAccount.currentState.funded).to.not.be.undefined;
      expect(tournamentAccount.gameAccount.toString()).to.equal(
        gameAccount.publicKey.toString()
      );
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  });
  it("Join tournament", async () => {
    try {
      const p1 = await airdrop(provider.connection, player1.publicKey, 0.1);
      const p2 = await airdrop(provider.connection, player2.publicKey, 0.1);
      const p3 = await airdrop(provider.connection, player3.publicKey, 0.1);
      const p4 = await airdrop(provider.connection, player4.publicKey, 0.1);
      const p5 = await airdrop(provider.connection, player5.publicKey, 0.1);
      const p6 = await airdrop(provider.connection, player6.publicKey, 0.1);

      console.log("✅ Player 1 Account funded: ", p1);
      console.log("✅ Player 2 Account funded: ", p2);
      console.log("✅ Player 3 Account funded: ", p3);
      console.log("✅ Player 4 Account funded: ", p4);
      console.log("✅ Player 5 Account funded: ", p5);
      console.log("✅ Player 6 Account funded: ", p6);

      const players = [player1, player2, player3, player4, player5, player6];

      const AllTx = await Promise.all(
        players.map((player) =>
          program.methods
            .joinTournament()
            .accountsPartial({
              player: player.publicKey,
              tournament: tournamentPDA,
              tournamentVault: tournamentVault,
              systemProgram: SystemProgram.programId,
            })
            .signers([player])
            .rpc()
        )
      );

      console.log("Joined Tournament TX:", AllTx);

      // Verify tournament state
      const tournamentAccount = await program.account.tournament.fetch(
        tournamentPDA
      );

      expect(tournamentAccount.host.toString()).to.equal(
        host.publicKey.toString()
      );

      expect(tournamentAccount.players.length).to.equal(6);
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  });

  it("Start tournament", async () => {
    try {
      let tx = await program.methods
        .startTournament()
        .accountsPartial({
          host: host.publicKey,
          tournament: tournamentPDA,
          tournamentVault: tournamentVault,
          systemProgram: SystemProgram.programId,
        })
        .signers([host])
        .rpc();

      console.log("Started Tournament TX:", tx);

      // Verify tournament state
      const tournamentAccount = await program.account.tournament.fetch(
        tournamentPDA
      );

      console.log("tournamentAccount", tournamentAccount);

      expect(tournamentAccount.currentState.started).to.not.be.undefined;
      expect(tournamentAccount.host.toString()).to.equal(
        host.publicKey.toString()
      );
      expect(tournamentAccount.teams.length).to.equal(3);
      expect(tournamentAccount.players.length).to.equal(6);
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
