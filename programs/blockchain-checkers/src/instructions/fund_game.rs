use anchor_lang::{
    prelude::*,
    solana_program,
    system_program::{transfer, Transfer},
};

use crate::{
    constants::{GAME_SEED, GAME_VAULT_SEED},
    errors::GameError,
    states::{Game, GameState},
};

#[derive(Accounts)]
pub struct FundGame<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(
        mut,
        seeds = [GAME_SEED, host.key().as_ref(), game.seed.to_le_bytes().as_ref()],
        bump= game.game_bump,
    )]
    pub game: Account<'info, Game>,

    #[account(
        mut,
        seeds = [GAME_VAULT_SEED, game.key().as_ref()],
        bump = game.game_vault_bump,
    )]
    pub game_vault: SystemAccount<'info>,

    /// CHECK: This is the account that will receive the platform fee
    #[account(mut, address = game.game_account)]
    pub game_account: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> FundGame<'info> {
    pub fn fund_game(&mut self, stake_price: u64) -> Result<()> {
        require!(
            self.game.current_state == GameState::Created,
            GameError::GameAlreadyStarted
        );

        solana_program::log::sol_log(&format!("Amount: {}", stake_price));

        // update the state
        let platform_fee = stake_price * 5 / 100;
        let total_price = stake_price - platform_fee;

        self.game.stake_price = total_price;
        self.game.platform_fee = platform_fee;

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

        // Transfer the amount to the game vault
        let cpi_accounts = Transfer {
            from: self.host.to_account_info(),
            to: self.game_vault.to_account_info(),
        };
        let transfer_ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer(transfer_ctx, total_price)?;

        self.game.current_state = GameState::Funded;

        Ok(())
    }
}
