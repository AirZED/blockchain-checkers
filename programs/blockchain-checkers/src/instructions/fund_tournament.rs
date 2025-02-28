use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::states::Tournament;

#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct FundTouranament<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(
        mut,
        seeds = [b"tournament", host.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump= tournament.tournament_bump,
    )]
    pub tournament: Account<'info, Tournament>,

    #[account(
        mut,
        seeds = [b"tournament_vault", tournament.key().as_ref()],
        bump = tournament.tournament_vault_bump,
    )]
    pub tournament_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> FundTouranament<'info> {
    pub fn fund_tournament(&mut self, amount: u64) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.host.to_account_info(),
            to: self.tournament_vault.to_account_info(),
        };

        let transfer_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(transfer_ctx, amount)?;

        Ok(())
    }
}
