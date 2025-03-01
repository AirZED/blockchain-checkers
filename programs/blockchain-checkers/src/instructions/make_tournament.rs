use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{
    errors::TournamentError,
    states::{game, Tournament, TournamentState},
};

#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct MakeTouranament<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    // I need a third parameter to make a single user able to create multiple tournaments
    #[account(
        init,
        payer = host,
        space = 8 + Tournament::INIT_SPACE,
        seeds = [b"tournament", host.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump
    )]
    pub tournament: Account<'info, Tournament>,

    #[account(
        seeds = [b"tournament_vault", tournament.key().as_ref()],
        bump
    )]
    pub tournament_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> MakeTouranament<'info> {
    pub fn make_tournament(
        &mut self,
        seed: u64,
        max_players: u8,
        game_account: Pubkey,
        bumps: &MakeTouranamentBumps,
    ) -> Result<()> {
        require!(
            max_players % 2 == 0 && max_players > 0,
            TournamentError::InvalidPlayerCount
        );

        self.tournament.set_inner(Tournament {
            seed,
            host: self.host.key(),
            players: Vec::new(),
            teams: Vec::new(),
            max_players,
            total_price: 0,
            tournament_bump: bumps.tournament,
            tournament_vault_bump: bumps.tournament_vault,
            game_account,
            platform_fee: 0,
            winners: Vec::new(),
            current_state: TournamentState::Created,
            claimed_rewards: Vec::new(),
        });

        Ok(())
    }
}
