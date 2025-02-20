use anchor_lang::prelude::*;

mod instructions;
mod states;
mod errors;

use instructions::*;
use states::*;

use errors::*;

declare_id!("AxDTpDD8WSX667JZzh9XM6HYc5WWrAcuE4yUia4pwUUe");

#[program]
pub mod blockchain_checkers {
    use super::*;

    pub fn initialize_tournament(ctx: Context<MakeTouranament>) -> Result<()> {
        let tournament = ctx.accounts;
        tournament.make_tournament();
        Ok(())
    }
}
