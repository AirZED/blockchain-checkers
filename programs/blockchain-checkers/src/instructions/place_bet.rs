use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{
    constants::{GAME_SEED, GAME_VAULT_SEED},
    errors::GameError,
    states::{Bet, Game, GameState},
    utils::calc_bet_platform_fee,
};

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub bettor: Signer<'info>,

    #[account(
        mut,
        seeds = [GAME_SEED, game.host.as_ref(), game.seed.to_le_bytes().as_ref()],
        bump = game.game_bump,
        constraint = game.current_state == GameState::Funded @ GameError::InvalidGameState,
        constraint = game.players.len() == 2 @ GameError::NotEnoughPlayers,
    )]
    pub game: Account<'info, Game>,

    #[account(mut, seeds=[GAME_VAULT_SEED, game.key().as_ref()], bump = game.game_vault_bump)]
    pub game_vault: SystemAccount<'info>,

    /// CHECK: This is the account that will receive the platform fee
    #[account(mut, address = game.game_account)]
    pub game_account: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> PlaceBet<'info> {
    pub fn place_bet(&mut self, bet_amount: u64, bet_on: Pubkey) -> Result<()> {
        require!(self.game.bets.len() < 10, GameError::TooManyBets);

        let platform_fee = calc_bet_platform_fee(bet_amount);
        let bet_price = bet_amount - platform_fee;

        let cpi_program = self.system_program.to_account_info();

        // transfer to the account that collects the platform fee
        let cpi_accounts_platform_fee = Transfer {
            from: self.bettor.to_account_info(),
            to: self.game_account.to_account_info(),
        };
        let transfer_ctx_platform_fee =
            CpiContext::new(cpi_program.clone(), cpi_accounts_platform_fee);
        transfer(transfer_ctx_platform_fee, platform_fee)?;

        // Transfer the amount to the game vault
        let cpi_accounts_game_stake = Transfer {
            from: self.bettor.to_account_info(),
            to: self.game_vault.to_account_info(),
        };
        let transfer_ctx_game_stake = CpiContext::new(cpi_program, cpi_accounts_game_stake);
        transfer(transfer_ctx_game_stake, bet_price)?;

        let stake = Bet {
            staker: self.bettor.key(),
            amount: bet_amount,
            bet_on,
        };

        self.game.bets.push(stake);

        Ok(())
    }
}
