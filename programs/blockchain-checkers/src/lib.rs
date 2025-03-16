use anchor_lang::prelude::*;

mod constants;
mod errors;
mod instructions;
mod states;

use instructions::*;
use states::*;

declare_id!("J5zCTZCbJieJ1Wf88ZxACMZyEkVvYpxXQ6nCMULGmLGy");

#[program]
pub mod blockchain_checkers {

    use super::*;

    pub fn initialize_game(
        ctx: Context<MakeGame>,
        seeds: u64,
        stake_price: u64,
        game_account: Pubkey,
    ) -> Result<()> {
        let game = ctx.accounts;
        game.make_game(seeds, stake_price, game_account, &ctx.bumps)?;
        Ok(())
    }

    pub fn fund_game(ctx: Context<FundGame>, amount: u64) -> Result<()> {
        let game = ctx.accounts;
        game.fund_game(amount)?;

        Ok(())
    }

    pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
        let game = ctx.accounts;
        game.join_game()?;

        Ok(())
    }

    pub fn start_game(ctx: Context<StartGame>) -> Result<()> {
        let game = ctx.accounts;

        game.start_game()?;

        Ok(())
    }

    pub fn end_game(ctx: Context<StartGame>) -> Result<()> {
        let game = ctx.accounts;
        game.end_game()
    }

    pub fn submit_game_result(
        ctx: Context<SubmitGameResult>,
        game_result: GameResult,
    ) -> Result<()> {
        let game = ctx.accounts;
        game.submit_game_result(game_result)?;

        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let game = ctx.accounts;

        game._claim_rewards()?;

        Ok(())
    }
}
