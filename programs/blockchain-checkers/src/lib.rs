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

    pub fn initialize_tournament(
        ctx: Context<MakeTouranament>,
        seeds: u64,
        game_account: Pubkey,
        max_players: u8,
    ) -> Result<()> {
        let tournament = ctx.accounts;
        tournament.make_tournament(seeds, max_players, game_account, &ctx.bumps)?;
        Ok(())
    }

    pub fn fund_tournament(ctx: Context<FundTouranament>, amount: u64) -> Result<()> {
        let tournament = ctx.accounts;
        tournament.fund_tournament(amount)?;

        Ok(())
    }

    pub fn join_tournament(ctx: Context<JoinTournament>) -> Result<()> {
        let tournament = ctx.accounts;
        tournament.join_tournament()?;

        Ok(())
    }

    pub fn start_tournament(ctx: Context<StartTournament>) -> Result<()> {
        let tournament = ctx.accounts;

        tournament.match_players()?;
        tournament.start_tournament()?;

        Ok(())
    }

    pub fn end_tournament(ctx: Context<StartTournament>) -> Result<()> {
        let tournament = ctx.accounts;
        tournament.end_tournament()
    }

    pub fn submit_game_result(
        ctx: Context<SubmitGameResult>,
        game_result: GameResult,
    ) -> Result<()> {
        let tournament = ctx.accounts;
        tournament.submit_game_result(game_result)?;

        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let tournament = ctx.accounts;

        tournament._claim_rewards()?;

        Ok(())
    }
}
