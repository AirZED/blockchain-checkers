use anchor_lang::prelude::*;

use crate::{
    errors::TournamentError,
    states::{Game, GameResult, GameState},
};

#[derive(Accounts)]
pub struct SubmitGameResult<'info> {
    #[account(mut)]
    pub game_account: Signer<'info>,

    #[account(
        mut,
        seeds = [b"tournament", tournament.host.as_ref(), tournament.seed.to_le_bytes().as_ref()],
        bump = tournament.tournament_bump,
        constraint = tournament.current_state == TournamentState::Started @ TournamentError::TournamentNotStarted,
    )]
    pub tournament: Account<'info, Game>,

    // For tournament vault access if needed
    #[account(seeds=[b"tournament_vault", tournament.key().as_ref()], bump)]
    pub tournament_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> SubmitGameResult<'info> {
    pub fn submit_game_result(&mut self, game_result: GameResult) -> Result<()> {
        let team = self
            .tournament
            .teams
            .get(game_result.team_index as usize)
            .ok_or(TournamentError::InvalidTournament)?;

        require!(
            (team.player1 == game_result.winner && team.player2 == game_result.loser)
                || (team.player1 == game_result.loser && team.player2 == game_result.winner),
            TournamentError::PlayersNotInSameTeam
        );

        if !self.tournament.winners.contains(&game_result.winner) {
            self.tournament.winners.push(game_result.winner);
        }

        Ok(())
    }
}
