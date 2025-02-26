use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
// use anchor_spl::{
//     token_interface::{TokenAccount, TokenInterface},
// };

use crate::{
    errors::TournamentError,
    states::{Tournament, TournamentState},
};

#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct MakeTouranament<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(
        init,
        payer = host,
        space = 8 + Tournament::INIT_SPACE,
        seeds = [b"tournament", host.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump
    )]
    pub tournament: Account<'info, Tournament>,

    #[account(
        mut,
        seeds = [b"vault", tournament.key().as_ref()],
        bump
    )]
    pub tournament_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
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
        });

        Ok(())
    }

    pub fn fund_tournament(&mut self, amount: u64) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.host.to_account_info(),
            to: self.tournament_vault.to_account_info(),
        };

        let transfer_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(transfer_ctx, amount)?;

        Ok(())
    }
}
