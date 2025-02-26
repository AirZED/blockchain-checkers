import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BlockchainCheckers } from "../target/types/blockchain_checkers";
import { BN } from "bn.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { expect } from "chai";
import {
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
} from "@solana/web3.js";
import assert from "assert";

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

  console.log("game account");

  let mint: PublicKey;
  let tournamentSeed = new BN(12345);
  let tournamentPDA;
  let tournamentBump;
  let hostAta;
  let player1Ata;
  let player2Ata;
  let player3Ata;
  let player4Ata;
  let tournamentVault;

  before(async () => {
    // Airdrop SOL to participants
    await provider.connection.requestAirdrop(
      host.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    // fund players wallets
    await provider.connection.requestAirdrop(
      player1.publicKey,
      1 * LAMPORTS_PER_SOL
    );
    await provider.connection.requestAirdrop(
      player2.publicKey,
      1 * LAMPORTS_PER_SOL
    );
    await provider.connection.requestAirdrop(
      player3.publicKey,
      1 * LAMPORTS_PER_SOL
    );
    await provider.connection.requestAirdrop(
      player4.publicKey,
      1 * LAMPORTS_PER_SOL
    );

    // Create token mint
    mint = await createMint(
      provider.connection,
      host,
      host.publicKey,
      host.publicKey,
      6
    );

    // Create ATAs for participants
    hostAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      host,
      mint,
      host.publicKey
    );

    player1Ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      player1,
      mint,
      player1.publicKey
    );

    player2Ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      player2,
      mint,
      player2.publicKey
    );

    player3Ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      player3,
      mint,
      player3.publicKey
    );

    player4Ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      player4,
      mint,
      player4.publicKey
    );

    // Mint tokens to players
    await mintTo(
      provider.connection,
      host,
      mint,
      player1Ata.address,
      host.publicKey,
      1000
    );

    await mintTo(
      provider.connection,
      host,
      mint,
      player2Ata.address,
      host.publicKey,
      1000
    );

    await mintTo(
      provider.connection,
      host,
      mint,
      player3Ata.address,
      host.publicKey,
      1000
    );

    await mintTo(
      provider.connection,
      host,
      mint,
      player4Ata.address,
      host.publicKey,
      1000
    );

    // Find tournament PDA
    [tournamentPDA, tournamentBump] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("tournament"),
        host.publicKey.toBuffer(),
        tournamentSeed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    // Find tournament vault
    //   const [vault] = await PublicKey.findProgramAddressSync(
    //     [
    //       tournamentPDA.toBuffer(),
    //       Buffer.from([
    //         6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206, 235,
    //         121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140, 245, 133, 126,
    //         255, 0, 169,
    //       ]),
    //       mint.toBuffer(),
    //     ],
    //     new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
    //   );
    //   tournamentVault = vault;
    // });

    // 1. Initialize tournament
    it("Should initialize a tournament", async () => {
      const tx = await program.methods
        .initializeTournament(
          tournamentSeed,
          new BN(1000), // total prize
          new BN(50), // platform fee
          4 // max players
        )
        .accounts({
          host: host.publicKey,
          mint: mint,
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
      expect(tournamentAccount.mint.toString()).to.equal(mint.toString());
      expect(tournamentAccount.maxPlayers).to.equal(4);
      expect(tournamentAccount.totalPrice.toString()).to.equal("1000");
      expect(tournamentAccount.platformFee.toString()).to.equal("50");
      expect(tournamentAccount.currentState.created).to.not.be.undefined;
    });

    // // 2. Join tournament
    // it("Should allow player 1 to join the tournament", async () => {
    //   const tx = await program.methods
    //     .joinTournament()
    //     .accounts({
    //       player: player1.publicKey,
    //       tournament: tournamentPDA,
    //       mint: mint,
    //       playerAta: player1Ata.address,
    //       tournamentVault: tournamentVault,
    //       systemProgram: SystemProgram.programId,
    //       tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    //       associatedTokenProgram: new PublicKey(
    //         "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
    //       ),
    //     })
    //     .signers([player1])
    //     .rpc();

    //   console.log("Player 1 Join Tournament TX:", tx);

    //   // Verify player was added
    //   const tournamentAccount = await program.account.tournament.fetch(
    //     tournamentPDA
    //   );
    //   expect(tournamentAccount.players).to.include.deep.members([
    //     player1.publicKey,
    //   ]);
    // });

    // it("Should allow player 2 to join the tournament", async () => {
    //   const tx = await program.methods
    //     .joinTournament()
    //     .accounts({
    //       player: player2.publicKey,
    //       tournament: tournamentPDA,
    //       mint: mint,
    //       playerAta: player2Ata.address,
    //       tournamentVault: tournamentVault,
    //       systemProgram: SystemProgram.programId,
    //       tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    //       associatedTokenProgram: new PublicKey(
    //         "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
    //       ),
    //     })
    //     .signers([player2])
    //     .rpc();

    //   console.log("Player 2 Join Tournament TX:", tx);

    //   // Verify player was added
    //   const tournamentAccount = await program.account.tournament.fetch(
    //     tournamentPDA
    //   );
    //   expect(tournamentAccount.players).to.include.deep.members([
    //     player1.publicKey,
    //     player2.publicKey,
    //   ]);
    // });

    // it("Should allow players 3 and 4 to join the tournament", async () => {
    //   // Player 3 joins
    //   await program.methods
    //     .joinTournament()
    //     .accounts({
    //       player: player3.publicKey,
    //       tournament: tournamentPDA,
    //       mint: mint,
    //       playerAta: player3Ata.address,
    //       tournamentVault: tournamentVault,
    //       systemProgram: SystemProgram.programId,
    //       tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    //       associatedTokenProgram: new PublicKey(
    //         "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
    //       ),
    //     })
    //     .signers([player3])
    //     .rpc();

    //   // Player 4 joins
    //   await program.methods
    //     .joinTournament()
    //     .accounts({
    //       player: player4.publicKey,
    //       tournament: tournamentPDA,
    //       mint: mint,
    //       playerAta: player4Ata.address,
    //       tournamentVault: tournamentVault,
    //       systemProgram: SystemProgram.programId,
    //       tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    //       associatedTokenProgram: new PublicKey(
    //         "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
    //       ),
    //     })
    //     .signers([player4])
    //     .rpc();

    //   // Verify all players were added
    //   const tournamentAccount = await program.account.tournament.fetch(
    //     tournamentPDA
    //   );
    //   expect(tournamentAccount.players.length).to.equal(4);
    //   expect(tournamentAccount.players).to.include.deep.members([
    //     player1.publicKey,
    //     player2.publicKey,
    //     player3.publicKey,
    //     player4.publicKey,
    //   ]);
    // });

    // // 3. Match Players
    // it("Should match players into teams", async () => {
    //   const tx = await program.methods
    //     .matchPlayers()
    //     .accounts({
    //       host: host.publicKey,
    //       tournament: tournamentPDA,
    //       mint: mint,
    //       tournamentVault: tournamentVault,
    //       systemProgram: SystemProgram.programId,
    //       tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    //       associatedTokenProgram: new PublicKey(
    //         "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
    //       ),
    //     })
    //     .signers([host])
    //     .rpc();

    //   console.log("Match Players TX:", tx);

    //   // Verify tournament state and teams
    //   const tournamentAccount = await program.account.tournament.fetch(
    //     tournamentPDA
    //   );
    //   expect(tournamentAccount.currentState.shuffled).to.not.be.undefined;
    //   expect(tournamentAccount.teams.length).to.equal(2); // 4 players make 2 teams
    // });

    // // 4. Start Tournament
    // it("Should start the tournament", async () => {
    //   const tx = await program.methods
    //     .startTournament()
    //     .accounts({
    //       host: host.publicKey,
    //       tournament: tournamentPDA,
    //       mint: mint,
    //       tournamentVault: tournamentVault,
    //       systemProgram: SystemProgram.programId,
    //       tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    //       associatedTokenProgram: new PublicKey(
    //         "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
    //       ),
    //     })
    //     .signers([host])
    //     .rpc();

    //   console.log("Start Tournament TX:", tx);

    //   // Verify tournament state
    //   const tournamentAccount = await program.account.tournament.fetch(
    //     tournamentPDA
    //   );
    //   expect(tournamentAccount.currentState.started).to.not.be.undefined;
    // });

    // // 5. Submit Game Result
    // it("Should submit a game result", async () => {
    //   // First get the teams to determine team index
    //   const tournamentBefore = await program.account.tournament.fetch(
    //     tournamentPDA
    //   );
    //   const team0 = tournamentBefore.teams[0];

    //   // Create game result with team 0 winner
    //   const gameResult = {
    //     winner: team0.player1,
    //     loser: team0.player2,
    //     teamIndex: 0,
    //   };

    //   const tx = await program.methods
    //     .submitGameResult(gameResult)
    //     .accounts({
    //       gameAccount: gameAccount.publicKey,
    //       tournament: tournamentPDA,
    //       mint: mint,
    //       tournamentVault: tournamentVault,
    //       systemProgram: SystemProgram.programId,
    //       tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    //       associatedTokenProgram: new PublicKey(
    //         "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
    //       ),
    //     })
    //     .signers([gameAccount])
    //     .rpc();

    //   console.log("Submit Game Result TX:", tx);

    //   // Verify winners were updated
    //   const tournamentAfter = await program.account.tournament.fetch(
    //     tournamentPDA
    //   );
    //   expect(tournamentAfter.winners).to.include.deep.members([team0.player1]);
    // });

    // // 6. End Tournament
    // it("Should end the tournament", async () => {
    //   const tx = await program.methods
    //     .endTournament()
    //     .accounts({
    //       host: host.publicKey,
    //       tournament: tournamentPDA,
    //       mint: mint,
    //       tournamentVault: tournamentVault,
    //       systemProgram: SystemProgram.programId,
    //       tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    //       associatedTokenProgram: new PublicKey(
    //         "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
    //       ),
    //     })
    //     .signers([host])
    //     .rpc();

    //   console.log("End Tournament TX:", tx);

    //   // Verify tournament state
    //   const tournamentAccount = await program.account.tournament.fetch(
    //     tournamentPDA
    //   );
    //   expect(tournamentAccount.currentState.ended).to.not.be.undefined;
    // });

    // // 7. Claim Rewards
    // it("Should allow winners to claim rewards", async () => {
    //   // Get tournament to find the winner
    //   const tournamentBefore = await program.account.tournament.fetch(
    //     tournamentPDA
    //   );
    //   const winner = tournamentBefore.winners[0];

    //   // Figure out which player is the winner
    //   let winnerKeypair;
    //   let winnerAta;

    //   if (winner.equals(player1.publicKey)) {
    //     winnerKeypair = player1;
    //     winnerAta = player1Ata.address;
    //   } else if (winner.equals(player2.publicKey)) {
    //     winnerKeypair = player2;
    //     winnerAta = player2Ata.address;
    //   } else if (winner.equals(player3.publicKey)) {
    //     winnerKeypair = player3;
    //     winnerAta = player3Ata.address;
    //   } else if (winner.equals(player4.publicKey)) {
    //     winnerKeypair = player4;
    //     winnerAta = player4Ata.address;
    //   }

    //   // Check token balance before claiming
    //   const beforeBalance = (
    //     await provider.connection.getTokenAccountBalance(winnerAta)
    //   ).value.amount;

    //   const tx = await program.methods
    //     .claimRewards()
    //     .accounts({
    //       player: winner,
    //       host: host.publicKey,
    //       tournament: tournamentPDA,
    //       mint: mint,
    //       playerAta: winnerAta,
    //       hostAta: hostAta.address,
    //       tournamentVault: tournamentVault,
    //       systemProgram: SystemProgram.programId,
    //       tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    //       associatedTokenProgram: new PublicKey(
    //         "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
    //       ),
    //     })
    //     .signers([winnerKeypair])
    //     .rpc();

    //   console.log("Claim Rewards TX:", tx);

    //   // Verify token balance increased
    //   const afterBalance = (
    //     await provider.connection.getTokenAccountBalance(winnerAta)
    //   ).value.amount;
    //   expect(parseInt(afterBalance)).to.be.greaterThan(parseInt(beforeBalance));

    //   // Verify claimed rewards was updated
    //   const tournamentAfter = await program.account.tournament.fetch(
    //     tournamentPDA
    //   );
    //   expect(tournamentAfter.claimedRewards).to.include.deep.members([winner]);
    // });

    // it("Should fail when a non-winner tries to claim rewards", async () => {
    //   // Find a player who is not a winner
    //   const tournamentAccount = await program.account.tournament.fetch(
    //     tournamentPDA
    //   );
    //   const winners = tournamentAccount.winners;

    //   let nonWinnerKeypair;
    //   let nonWinnerAta;

    //   if (!winners.some((w) => w.equals(player1.publicKey))) {
    //     nonWinnerKeypair = player1;
    //     nonWinnerAta = player1Ata.address;
    //   } else if (!winners.some((w) => w.equals(player2.publicKey))) {
    //     nonWinnerKeypair = player2;
    //     nonWinnerAta = player2Ata.address;
    //   } else if (!winners.some((w) => w.equals(player3.publicKey))) {
    //     nonWinnerKeypair = player3;
    //     nonWinnerAta = player3Ata.address;
    //   } else if (!winners.some((w) => w.equals(player4.publicKey))) {
    //     nonWinnerKeypair = player4;
    //     nonWinnerAta = player4Ata.address;
    //   }

    //   try {
    //     await program.methods
    //       .claimRewards()
    //       .accounts({
    //         player: nonWinnerKeypair.publicKey,
    //         host: host.publicKey,
    //         tournament: tournamentPDA,
    //         mint: mint,
    //         playerAta: nonWinnerAta,
    //         hostAta: hostAta.address,
    //         tournamentVault: tournamentVault,
    //         systemProgram: SystemProgram.programId,
    //         tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    //         associatedTokenProgram: new PublicKey(
    //           "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
    //         ),
    //       })
    //       .signers([nonWinnerKeypair])
    //       .rpc();

    //     expect.fail("Transaction should have failed");
    //   } catch (err) {
    //     expect(err.toString()).to.include("Not a tournament winner");
    //   }
  });
});
