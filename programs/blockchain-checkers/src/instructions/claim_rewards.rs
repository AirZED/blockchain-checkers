use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{
    constants::{GAME_SEED, GAME_VAULT_SEED},
    errors::GameError,
    states::{Game, GameState},
};

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    pub host: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [GAME_SEED, game.host.as_ref(), game.seed.to_le_bytes().as_ref()],
        bump = game.game_bump,
        close= host,
        constraint = game.current_state == GameState::Started || game.current_state == GameState::Ended @ GameError::GameNotStarted,
        constraint = game.is_winner(&player.key()) @ GameError::NotAGameWinner,
        constraint = !game.has_claimed(&player.key()) @ GameError::AlreadyClaimed,
    )]
    pub game: Account<'info, Game>,

    // For game vault access if needed
    #[account(mut, seeds=[GAME_VAULT_SEED, game.key().as_ref()], bump)]
    pub game_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> ClaimRewards<'info> {
    pub fn _claim_rewards(&mut self) -> Result<()> {
        let reward_amount = (self.game.stake_price * 2 - self.game.platform_fee * 2) as usize;

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.game_vault.to_account_info(),
            to: self.player.to_account_info(),
        };

        let seeds = [
            GAME_VAULT_SEED,
            self.game.to_account_info().key.as_ref(),
            &[self.game.game_vault_bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let transfer_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(transfer_ctx, reward_amount as u64)?;

        Ok(())
    }
}
