use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod states;

use instructions::*;
use states::*;

use errors::*;

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
        tournament.make_tournament(total_price, platform_fee, max_players, &ctx.bumps)?;
        tournament.fund_tournament(total_price)?;
        Ok(())
    }
}
