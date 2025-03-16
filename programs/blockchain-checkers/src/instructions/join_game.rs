use anchor_lang::{prelude::*, solana_program};

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
    #[account(seeds=[GAME_VAULT_SEED, game.key().as_ref()], bump)]
    pub game_vault: SystemAccount<'info>,

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

        require!(self.game.players.len() < 2, GameError::GameFull);

        self.game.players.push(self.player.key());
        Ok(())
    }
}
