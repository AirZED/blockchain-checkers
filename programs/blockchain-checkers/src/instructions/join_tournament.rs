use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::states::Tournament;

#[derive(Accounts)]
struct JoinTournament<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(mut)]
    pub player: Signer<'info>,

    pub mint_a: InterfaceAccount<'info, Mint>,

    pub mint_b: InterfaceAccount<'info, Mint>,

    pub host_ata_a: InterfaceAccount<'info, TokenAccount>,

    pub player_ata_a: InterfaceAccount<'info, TokenAccount>,

    pub tournament: Account<'info, Tournament>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
