use anchor_lang::prelude::*;

use crate::{
    constants::{GAME_SEED, GAME_VAULT_SEED},
    errors::GameError,
    states::{Game, GameResult, GameState},
};

#[derive(Accounts)]
pub struct SubmitGameResult<'info> {
    #[account(mut)]
    pub game_account: Signer<'info>,

    #[account(
        mut,
        seeds = [GAME_SEED, game.host.as_ref(), game.seed.to_le_bytes().as_ref()],
        bump = game.game_bump,
        constraint = game.current_state == GameState::Started @ GameError::GameNotStarted,
    )]
    pub game: Account<'info, Game>,

    // For game vault access if needed
    #[account(seeds=[GAME_VAULT_SEED, game.key().as_ref()], bump)]
    pub game_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> SubmitGameResult<'info> {
    pub fn submit_game_result(&mut self, game_result: GameResult) -> Result<()> {
        require!(
            self.game.players.contains(&game_result.winner),
            GameError::PlayerNotInGame
        );
        require!(
            self.game.players.contains(&game_result.loser),
            GameError::PlayerNotInGame
        );

        if self.game.winner == None {
            self.game.winner = Some(game_result.winner);
        }
        self.game.current_state = GameState::Ended;

        Ok(())
    }
}
