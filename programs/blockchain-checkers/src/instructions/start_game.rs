use anchor_lang::prelude::*;

use crate::{
    constants::{GAME_SEED, GAME_VAULT_SEED},
    errors::GameError,
    states::{Game, GameState},
};

#[derive(Accounts)]
pub struct StartGame<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(
        mut,
        seeds = [GAME_SEED, game.host.as_ref(), game.seed.to_le_bytes().as_ref()],
        bump = game.game_bump,
    )]
    pub game: Account<'info, Game>,

    // For game vault access if needed
    #[account(seeds=[GAME_VAULT_SEED, game.key().as_ref()], bump)]
    pub game_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> StartGame<'info> {
    pub fn start_game(&mut self) -> Result<()> {
        require!(
            self.game.current_state == GameState::Funded,
            GameError::GameNotFunded
        );

        self.game.current_state = GameState::Started;
        Ok(())
    }

    pub fn end_game(&mut self) -> Result<()> {
        self.game.current_state = GameState::Ended;
        Ok(())
    }
}
