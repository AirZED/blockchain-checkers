use anchor_lang::prelude::*;

use crate::{
    constants::{GAME_SEED, GAME_VAULT_SEED},
    errors::GameError,
    states::{Game, GameState},
};

#[derive(Accounts)]
pub struct PlaceStake<'info> {
    #[account(mut)]
    pub staker: Signer<'info>,

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
