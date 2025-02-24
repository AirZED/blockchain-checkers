use anchor_lang::{accounts::signer, prelude::*, solana_program::program_pack::Sealed};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer_checked, TransferChecked},
    token_interface::{transfer_fee, Mint, TokenAccount, TokenInterface},
};

use crate::{
    constants::TOURNAMENT_SEED,
    errors::TournamentError,
    states::{Tournament, TournamentState},
};

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    pub host: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [b"tournament", tournament.host.as_ref(), seed.to_le_bytes().as_ref()],
        bump = tournament.bump,
        close= host,
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
        init_if_needed,
        payer = player,
        associated_token::mint = mint,
        associated_token::authority = host,
    )]
    pub host_ata: InterfaceAccount<'info, TokenAccount>,

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
    pub fn _claim_rewards(&mut self) -> Result<()> {
        let team_tount = self.tournament.teams.len();
        let reward_amount =
            (self.tournament.total_price - self.tournament.platform_fee) / team_tount as u64;

        self.withdraw_spl_from_vault(reward_amount)?;
        self.send_spl_to_winner(reward_amount)?;

        Ok(())
    }

    pub fn withdraw_spl_from_vault(&mut self, reward_amount: u64) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();
        let seed = &self.tournament.seed.to_le_bytes();
        let bump = self.tournament.bump;
        let decimals = self.mint.decimals;
        let host = self.host.key();

        let cpi_accounts = TransferChecked {
            from: self.tournament_vault.to_account_info(),
            to: self.player_ata.to_account_info(),
            authority: self.tournament.to_account_info(),
            mint: self.mint.to_account_info(),
        };

        let seeds = [TOURNAMENT_SEED, host.as_ref(), seed.as_ref(), &[bump]];
        let signer_seeds = &[&seeds[..]];

        let transfer_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer_checked(transfer_ctx, reward_amount, decimals)?;

        Ok(())
    }

    pub fn send_spl_to_winner(&mut self, reward_amount: u64) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();
        let decimals = self.mint.decimals;

        let cpi_accounts = TransferChecked {
            from: self.host_ata.to_account_info(),
            to: self.player_ata.to_account_info(),
            authority: self.host.to_account_info(),
            mint: self.mint.to_account_info(),
        };

        let transfer_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer_checked(transfer_ctx, reward_amount, decimals)?;


        // closes the accout as well with it is done
        Ok(())
    }

   
}
