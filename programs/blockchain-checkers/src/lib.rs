use anchor_lang::prelude::*;

declare_id!("AxDTpDD8WSX667JZzh9XM6HYc5WWrAcuE4yUia4pwUUe");

#[program]
pub mod blockchain_checkers {
    use super::*;

    pub fn initialize_tournament(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

