use anchor_lang::{
    prelude::*,
    solana_program,
    system_program::{transfer, Transfer},
};

use crate::{
    errors::TournamentError,
    states::{Game, GameState},
};

#[derive(Accounts)]
pub struct FundTouranament<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(
        mut,
        seeds = [b"tournament", host.key().as_ref(), tournament.seed.to_le_bytes().as_ref()],
        bump= tournament.tournament_bump,
    )]
    pub tournament: Account<'info, Game>,

    #[account(
        mut,
        seeds = [b"tournament_vault", tournament.key().as_ref()],
        bump = tournament.tournament_vault_bump,
    )]
    pub tournament_vault: SystemAccount<'info>,

    /// CHECK: This is the account that will receive the platform fee
    #[account(mut, address = tournament.game_account)]
    pub game_account: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> FundTouranament<'info> {
    pub fn fund_tournament(&mut self, amount: u64) -> Result<()> {
        require!(
            self.tournament.current_state == GameState::Created,
            TournamentError::TournamentAlreadyStarted
        );

        solana_program::log::sol_log(&format!("Amount: {}", amount));

        // update the state
        let platform_fee = amount * 5 / 100;
        let total_price = amount - platform_fee;

        self.tournament.total_price = total_price;
        self.tournament.platform_fee = platform_fee;

        // solana_program::log::sol_log(&format!("Platform fee: {}", platform_fee));
        // solana_program::log::sol_log(&format!("Total price: {}", total_price));

        let cpi_program = self.system_program.to_account_info();

        // transfer to the account that collects the platform fee
        let cpi_accounts = Transfer {
            from: self.host.to_account_info(),
            to: self.game_account.to_account_info(),
        };
        let transfer_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);
        transfer(transfer_ctx, platform_fee)?;

        // Transfer the amount to the tournament vault
        let cpi_accounts = Transfer {
            from: self.host.to_account_info(),
            to: self.tournament_vault.to_account_info(),
        };
        let transfer_ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer(transfer_ctx, total_price)?;

        self.tournament.current_state = GameState::Funded;

        Ok(())
    }
}
