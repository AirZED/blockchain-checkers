use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{
    constants::{TOURNAMENT_SEED, TOURNAMENT_VAULT_SEED},
    errors::TournamentError,
    states::{Tournament, TournamentState},
};

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    pub host: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [TOURNAMENT_SEED, tournament.host.as_ref(), tournament.seed.to_le_bytes().as_ref()],
        bump = tournament.tournament_bump,
        close= host,
        constraint = tournament.current_state == TournamentState::Started || tournament.current_state == TournamentState::Ended @ TournamentError::TournamentNotStarted,
        constraint = tournament.is_winner(&player.key()) @ TournamentError::NotATournamentWinner,
        constraint = !tournament.has_claimed(&player.key()) @ TournamentError::AlreadyClaimed,
    )]
    pub tournament: Account<'info, Tournament>,

    // For tournament vault access if needed
    #[account(mut, seeds=[TOURNAMENT_VAULT_SEED, tournament.key().as_ref()], bump)]
    pub tournament_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> ClaimRewards<'info> {
    pub fn _claim_rewards(&mut self) -> Result<()> {
        let reward_amount = (self.tournament.total_price - self.tournament.platform_fee) as usize
            / &self.tournament.teams.len();

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.tournament_vault.to_account_info(),
            to: self.player.to_account_info(),
        };

        let seeds = [
            TOURNAMENT_VAULT_SEED,
            self.tournament.to_account_info().key.as_ref(),
            &[self.tournament.tournament_vault_bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let transfer_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(transfer_ctx, reward_amount as u64)?;

        Ok(())
    }
}
