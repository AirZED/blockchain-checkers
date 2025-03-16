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
  const player1 = anchor.web3.Keypair.generate();
  const player2 = anchor.web3.Keypair.generate();


  const game_fee_account = anchor.web3.Keypair.generate();

  let gamePDA;
  let gameBump;
  let gameVault;
  let gameVaultBump;
  let winner;

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

    // Find game vault
    [gamePDA, gameBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("game"),
        player1.publicKey.toBuffer(),
        seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    console.log("✅ Game Account Address: ", gamePDA);

    [gameVault, gameVaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("game_vault"), gamePDA.toBuffer()],
      program.programId
    );

    console.log("✅ Game Vault Account Address: ", gameVault);
  });

  it("initialize game", async () => {
    try {
      const t1 = await airdrop(provider.connection, player1.publicKey, 4);
      console.log("✅ Initialization, host Account funded: ", t1);

      const tx = await program.methods
        .initializeGame(
          seed,
          game_fee_account.publicKey
        )
        .accountsPartial({
          host: player1.publicKey,
          game: gamePDA,
          gameVault: gameVault,
          systemProgram: SystemProgram.programId,
        })
        .signers([player1])
        .rpc();

      console.log("Initialize Game TX:", tx);

      // Verify game state
      const gameAccount = await program.account.game.fetch(
        gamePDA
      );

      expect(gameAccount.host.toString()).to.equal(
        player1.publicKey.toString()
      );

      expect(gameAccount.stakePrice.toString()).to.equal("0");
      expect(gameAccount.currentState.created).to.not.be.undefined;
      expect(gameAccount.gameAccount.toString()).to.equal(
        game_fee_account.publicKey.toString()
      );
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  });

  it("Fund game", async () => {
    try {
      const t1 = await airdrop(provider.connection, player1.publicKey, 10);
      console.log("✅ Fund host Account funded: ", t1);


      let price = 1 * LAMPORTS_PER_SOL;

      const tx = await program.methods
        .fundGame(new BN(1 * LAMPORTS_PER_SOL))
        .accountsPartial({
          host: player1.publicKey,
          game: gamePDA,
          gameAccount: game_fee_account.publicKey,
          gameVault: gameVault,
          systemProgram: SystemProgram.programId,
        })
        .signers([player1])
        .rpc();

      console.log("Initialize Game TX:", tx);

      // Verify game state
      const gameAccount = await program.account.game.fetch(
        gamePDA
      );

      expect(gameAccount.host.toString()).to.equal(
        player1.publicKey.toString()
      );

      const fee = price * 6 / 100;
      let game_stake = price - fee;

      expect(gameAccount.stakePrice.toString()).to.equal(game_stake.toString());
      expect(gameAccount.platformFee.toString()).to.equal(fee.toString())
      expect(gameAccount.currentState.funded).to.not.be.undefined;
      expect(gameAccount.gameAccount.toString()).to.equal(
        game_fee_account.publicKey.toString()
      );
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  });
  it("Join game", async () => {
    try {
      const p2 = await airdrop(provider.connection, player2.publicKey, 1);
      console.log("✅ Player 2 Account funded: ", p2);


      const players = [player2]

      const AllTx = await Promise.all(
        players.map((player) =>
          program.methods
            .joinGame()
            .accountsPartial({
              player: player.publicKey,
              game: gamePDA,
              gameVault: gameVault,
              gameAccount: game_fee_account.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .signers([player])
            .rpc()
        )
      );

      console.log("Joined Game TX:", AllTx);

      // Verify game state
      const gameAccount = await program.account.game.fetch(
        gamePDA
      );

      expect(gameAccount.host.toString()).to.equal(
        player1.publicKey.toString()
      );

      expect(gameAccount.players.length).to.equal(2);
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  });

  it("Start game", async () => {
    try {
      let tx = await program.methods
        .startGame()
        .accountsPartial({
          host: player1.publicKey,
          game: gamePDA,
          gameVault: gameVault,
          systemProgram: SystemProgram.programId,
        })
        .signers([player1])
        .rpc();

      console.log("Started Game TX:", tx);

      // Verify game state
      const gameAccount = await program.account.game.fetch(
        gamePDA
      );

      expect(gameAccount.currentState.started).to.not.be.undefined;
      expect(gameAccount.host.toString()).to.equal(
        player1.publicKey.toString()
      );
      expect(gameAccount.players.length).to.equal(2);
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  });

  it("submit Game Result", async () => {
    try {
      let tx = await program.methods
        .submitGameResult({
          winner: player2.publicKey,
          loser: player1.publicKey,
        })
        .accountsPartial({
          gameAccount: game_fee_account.publicKey,
          game: gamePDA,
          gameVault: gameVault,
          systemProgram: SystemProgram.programId,
        })
        .signers([game_fee_account])
        .rpc();

      console.log("Ended Game TX:", tx);

      // Verify game state
      const gameAccount = await program.account.game.fetch(
        gamePDA
      );

      expect(gameAccount.winner).to.not.be.undefined;
      expect(gameAccount.winner.toString()).to.equal(
        player2.publicKey.toString()
      );
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  });

  it("End game", async () => {
    try {
      let tx = await program.methods
        .endGame()
        .accountsPartial({
          host: player1.publicKey,
          game: gamePDA,
          gameVault: gameVault,
          systemProgram: SystemProgram.programId,
        })
        .signers([player1])
        .rpc();

      console.log("Ended Game TX:", tx);

      // Verify game state
      const gameAccount = await program.account.game.fetch(
        gamePDA
      );

      console.log("gameAccount", gameAccount);

      expect(gameAccount.currentState.ended).to.not.be.undefined;
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  });

  // it("Claim Result", async () => {
  //   try {
  //     let players = [player1, player2,];

  //     players.forEach(async (player) => {
  //       if (player.publicKey.toString() === team.player2.toString()) {
  //         let tx = await program.methods
  //           .claimRewards()
  //           .accountsPartial({
  //             player: team.player2,
  //             host: player1.publicKey,
  //             game: gamePDA,
  //             gameVault: gameVault,
  //             systemProgram: SystemProgram.programId,
  //           })
  //           .signers([player])
  //           .rpc();

  //         console.log("Claimed Reward:", tx);

  //         // Verify game state
  //         const gameAccount = await program.account.game.fetch(
  //           gamePDA
  //         );

  //         console.log("gameAccount", gameAccount);
  //         expect(gameAccount.claimedRewards.toString()).to.equal(player2.publicKey.toString());
  //         expect(gameAccount.claimedRewards[0].toString()).to.equal(
  //           player2.publicKey.toString()
  //         );
  //       }
  //     });
  //   } catch (error) {
  //     console.error("error", error);
  //     throw error;
  //   }
  // });
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
