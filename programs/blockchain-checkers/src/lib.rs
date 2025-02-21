use anchor_lang::prelude::*;

mod constants;
mod errors;
mod instructions;
mod states;

use instructions::*;

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

    // pub fn join_tournament(ctx: Context<JoinTournament>) -> Result<()> {
    //     let tournament = ctx.accounts;
    //     tournament.join_tournament()
    // }

    // pub fn start_tournament(ctx: Context<StartTournament>) -> Result<()> {
    //     let tournament = ctx.accounts;
    //     tournament.start_tournament()
    // }

    // pub fn end_tournament(ctx: Context<EndTournament>) -> Result<()> {
    //     let tournament = ctx.accounts;
    //     tournament.end_tournament()
    // }

    // pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
    // }
}
