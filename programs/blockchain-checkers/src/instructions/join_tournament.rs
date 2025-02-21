use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::states::Tournament;

#[derive(Accounts)]
#[instruction(seed:u64)]
struct JoinTournament<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(mut)]
    pub host: Signer<'info>,

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = host,
        associated_token::mint = mint,
        associated_token::authority = player,
    )]
    pub player_ata_a: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        close= host,
        has_one = host,
        seeds = [b"tournament", host.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump = tournament.bump,
    )]
    pub tournament: Account<'info, Tournament>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
