use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::{
    errors::TournamentError,
    states::{GameResult, Tournament, TournamentState},
};

#[derive(Accounts)]
pub struct SubmitGameResult<'info> {
    #[account(mut)]
    pub game_account: Signer<'info>,

    #[account(
        mut,
        seeds = [b"tournament", tournament.host.as_ref(), tournament.seed.to_le_bytes().as_ref()],
        bump = tournament.bump,
        constraint = tournament.current_state == TournamentState::Started @ TournamentError::TournamentNotStarted,
    )]
    pub tournament: Account<'info, Tournament>,

    pub mint: InterfaceAccount<'info, Mint>,

    // For tournament vault access if needed
    #[account(
       mut,
       associated_token::mint = mint,
       associated_token::authority = tournament,
    )]
    pub tournament_vault: InterfaceAccount<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
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
