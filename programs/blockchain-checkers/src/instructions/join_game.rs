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
pub struct JoinGame<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [GAME_SEED, game.host.as_ref(), game.seed.to_le_bytes().as_ref()],
        bump = game.game_bump,
        constraint = !game.is_full() @ GameError::GameFull,
        constraint = !game.has_player(&player.key()) @ GameError::AlreadyJoined,
    )]
    pub game: Account<'info, Game>,

    // For game vault access if needed
    #[account(mut, seeds=[GAME_VAULT_SEED, game.key().as_ref()], bump= game.game_vault_bump)]
    pub game_vault: SystemAccount<'info>,

    /// CHECK: This is the account that will receive the platform fee
    #[account(mut, address = game.game_account)]
    pub game_account: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> JoinGame<'info> {
    pub fn join_game(&mut self) -> Result<()> {
        solana_program::log::sol_log(&format!(
            "Current amount of players: {}",
            self.game.players.len()
        ));

        require!(
            self.game.current_state != GameState::Started,
            GameError::GameAlreadyStarted
        );

        require!(
            self.game.current_state == GameState::Funded,
            GameError::GameNotFunded
        );

        require!(
            !self.game.players.contains(&self.player.key()),
            GameError::PlayerAlreadyInGame
        );

        require!(self.game.players.len() < 2, GameError::GameFull);

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts_platform_fee = Transfer {
            from: self.player.to_account_info(),
            to: self.game_account.to_account_info(),
        };
        let transfer_ctx_platfrom_fee =
            CpiContext::new(cpi_program.clone(), cpi_accounts_platform_fee);
        transfer(transfer_ctx_platfrom_fee, self.game.platform_fee)?;

        let cpi_accounts_game_stake = Transfer {
            from: self.player.to_account_info(),
            to: self.game_vault.to_account_info(),
        };

        let transfer_ctx_game_stake = CpiContext::new(cpi_program.clone(), cpi_accounts_game_stake);
        transfer(transfer_ctx_game_stake, self.game.stake_price)?;

        self.game.players.push(self.player.key());

        solana_program::log::sol_log(&format!(
            "Current amount of players: {}",
            self.game.players.len()
        ));
        Ok(())
    }
}
