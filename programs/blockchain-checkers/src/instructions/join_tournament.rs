use anchor_lang::{prelude::*, solana_program};

use crate::{
    errors::TournamentError,
    states::{Tournament, TournamentState},
};

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct JoinTournament<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"tournament", tournament.host.as_ref(), seed.to_le_bytes().as_ref()],
        bump = tournament.tournament_bump,
        constraint = !tournament.is_full() @ TournamentError::TournamentFull,
        constraint = !tournament.has_player(&player.key()) @ TournamentError::AlreadyJoined,
    )]
    pub tournament: Account<'info, Tournament>,

    // For tournament vault access if needed
    #[account(seeds=[b"tournament_vault", tournament.key().as_ref()], bump)]
    pub tournament_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> JoinTournament<'info> {
    pub fn join_tournament(&mut self) -> Result<()> {
        solana_program::log::sol_log(&format!(
            "Current amount of players: {}",
            self.tournament.players.len()
        ));
        solana_program::log::sol_log(&format!("Max Players: {}", self.tournament.max_players));

        require!(
            self.tournament.current_state != TournamentState::Started,
            TournamentError::TournamentAlreadyStarted
        );

        require!(
            self.tournament.players.len() < self.tournament.max_players as usize,
            TournamentError::TournamentFull
        );

        self.tournament.players.push(self.player.key());
        Ok(())
    }
}
