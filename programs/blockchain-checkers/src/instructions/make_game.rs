use anchor_lang::prelude::*;

use crate::{
    constants::{GAME_SEED, GAME_VAULT_SEED},
    states::{Game, GameState},
};

#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct MakeGame<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    // I need a third parameter to make a single user able to create multiple games
    #[account(
        init,
        payer = host,
        space = 8 + Game::INIT_SPACE,
        seeds = [GAME_SEED, host.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump
    )]
    pub game: Account<'info, Game>,

    #[account(
        seeds = [GAME_VAULT_SEED, game.key().as_ref()],
        bump
    )]
    pub game_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> MakeGame<'info> {
    pub fn make_game(
        &mut self,
        seed: u64,
        stake_price: u64,
        game_account: Pubkey,
        bumps: &MakeGameBumps,
    ) -> Result<()> {
        self.game.set_inner(Game {
            seed,
            host: self.host.key(),
            players: vec![self.host.key()],
            stake_price,
            game_bump: bumps.game,
            game_vault_bump: bumps.game_vault,
            game_account,
            platform_fee: 0,
            winner: None,
            current_state: GameState::Created,
            claimed_rewards: None,
            bets: Vec::new(),
        });

        Ok(())
    }
}
