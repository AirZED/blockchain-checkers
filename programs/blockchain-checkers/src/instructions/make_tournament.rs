use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer_checked, TransferChecked},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::{
    errors::TournamentError,
    states::{Tournament, TournamentState},
};

#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct MakeTouranament<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(mint::token_program =token_program )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = host,
        associated_token::token_program = token_program
    )]
    pub maker_ata_a: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = host,
        space = 8 + Tournament::INIT_SPACE,
        seeds = [b"tournament", host.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump
    )]
    pub tournament: Account<'info, Tournament>,

    #[account(
        init,
        payer = host,
        associated_token::mint = mint,
        associated_token::authority = tournament,
        associated_token::token_program = token_program
    )]
    pub tournament_vault: InterfaceAccount<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> MakeTouranament<'info> {
    pub fn make_tournament(
        &mut self,
        seed: u64,
        total_price: u64,
        platform_fee: u64,
        max_players: u8,
        bump: &MakeTouranamentBumps,
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
            total_price,
            bump: bump.tournament,
            platform_fee,
            winners: Vec::new(),
            current_state: TournamentState::Created,
            claimed_rewards: Vec::new(),
            mint: self.mint.key(),
        });

        Ok(())
    }

    pub fn fund_tournament(&mut self, amount: u64) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked {
            from: self.host.to_account_info(),
            to: self.tournament_vault.to_account_info(),
            authority: self.host.to_account_info(),
            mint: self.mint.to_account_info(),
        };

        let transfer_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer_checked(transfer_ctx, amount, self.mint.decimals)?;

        Ok(())
    }
}
