use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

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
        bump = tournament.bump,
        constraint = !tournament.is_full() @ TournamentError::TournamentFull,
        constraint = !tournament.has_player(&player.key()) @ TournamentError::AlreadyJoined,
    )]
    pub tournament: Account<'info, Tournament>,

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init_if_needed,
        payer = player,
        associated_token::mint = mint,
        associated_token::authority = player,
    )]
    pub player_ata: InterfaceAccount<'info, TokenAccount>,

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

impl<'info> JoinTournament<'info> {
    pub fn join_tournament(&mut self) -> Result<()> {
        require!(
            self.tournament.players.len() >= self.tournament.max_players as usize,
            TournamentError::TournamentFull
        );

        require!(
            self.tournament.current_state != TournamentState::Started,
            TournamentError::TournamentAlreadyStarted
        );

        self.tournament.players.push(self.player.key());
        Ok(())
    }
}
