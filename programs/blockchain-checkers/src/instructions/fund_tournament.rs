use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{
    errors::TournamentError,
    states::{Tournament, TournamentState},
};

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
        require!(
            self.tournament.current_state == TournamentState::Created,
            TournamentError::TournamentAlreadyStarted
        );

        // update the state
        self.tournament.current_state = TournamentState::Funded;
        // take platform fee which would be 2% of the price pool
        self.tournament.platform_fee = amount * 2 / 100;

        let total_price = amount - self.tournament.platform_fee;
        self.tournament.total_price = total_price;

        // transfer to the account that collects the platform fee

        // Transfer the amount to the tournament vault
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.host.to_account_info(),
            to: self.tournament_vault.to_account_info(),
        };

        let transfer_ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer(transfer_ctx, total_price)?;

        Ok(())
    }
}
