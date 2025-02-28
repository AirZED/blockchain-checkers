use anchor_lang::prelude::*;

use crate::{
    errors::TournamentError,
    states::{Tournament, TournamentState},
};

#[derive(Accounts)]
pub struct StartTournament<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(
        mut,
        seeds = [b"tournament", tournament.host.as_ref(), tournament.seed.to_le_bytes().as_ref()],
        bump = tournament.tournament_bump,
    )]
    pub tournament: Account<'info, Tournament>,

    // For tournament vault access if needed
    #[account(seeds=[b"tournament_vault", tournament.key().as_ref()], bump)]
    pub tournament_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> StartTournament<'info> {
    pub fn match_players(&mut self) -> Result<()> {
        self.tournament.shuffle_players();
        Ok(())
    }

    pub fn start_tournament(&mut self) -> Result<()> {
        require!(
            self.tournament.current_state != TournamentState::Shuffled,
            TournamentError::TournamentNotShuffled
        );

        self.tournament.current_state = TournamentState::Started;
        Ok(())
    }

    pub fn end_tournament(&mut self) -> Result<()> {
        self.tournament.current_state = TournamentState::Ended;
        Ok(())
    }
}
