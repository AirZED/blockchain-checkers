use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer, Mint, TokenAccount, TokenInterface},
};

use crate::{
    errors::TournamentError,
    states::{Tournament, TournamentState},
};

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"tournament", tournament.host.as_ref(), seed.to_le_bytes().as_ref()],
        bump = tournament.bump,
        constraint = tournament.current_state == TournamentState::Started || tournament.current_state == TournamentState::Ended @ TournamentError::TournamentNotStarted,
        constraint = tournament.is_winner(&player.key()) @ TournamentError::NotATournamentWinner,
        constraint = !tournament.has_claimed(&player.key()) @ TournamentError::AlreadyClaimed,
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

impl<'info> ClaimRewards<'info> {
    pub fn claim_rewards(&mut self) -> Result<()> {
        let winner_count = self.tournament.winners.len() as u64;
        let reward_amount =
            (self.tournament.total_price - self.tournament.platform_fee) / winner_count;

        Ok(())
    }

    
}
