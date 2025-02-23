use anchor_lang::prelude::*;

mod constants;
mod errors;
mod instructions;
mod states;

use instructions::*;
use states::*;

declare_id!("AxDTpDD8WSX667JZzh9XM6HYc5WWrAcuE4yUia4pwUUe");

#[program]
pub mod blockchain_checkers {

    use super::*;

    pub fn initialize_tournament(
        ctx: Context<MakeTouranament>,
        seeds: u64,
        total_price: u64,
        platform_fee: u64,
        max_players: u8,
    ) -> Result<()> {
        let tournament = ctx.accounts;
        tournament.make_tournament(seeds, total_price, platform_fee, max_players, &ctx.bumps)?;
        tournament.fund_tournament(total_price)?;
        Ok(())
    }

    pub fn join_tournament(ctx: Context<JoinTournament>) -> Result<()> {
        let tournament = ctx.accounts;
        tournament.join_tournament()?;

        Ok(())
    }

    pub fn match_players(ctx: Context<StartTournament>) -> Result<()> {
        let tournament = ctx.accounts;
        tournament.match_players()?;

        Ok(())
    }

    pub fn start_tournament(ctx: Context<StartTournament>) -> Result<()> {
        let tournament = ctx.accounts;
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
