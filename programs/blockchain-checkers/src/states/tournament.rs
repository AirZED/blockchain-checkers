use anchor_lang::prelude::*;

use crate::errors::TournamentError;

#[account]
#[derive(InitSpace)]

pub struct Tournament {
    pub seeds: u64,
    pub host: Pubkey,
    #[max_len(100)]
    pub players: Vec<Pubkey>,
    pub max_players: u8,
    pub total_price: u64,
    pub bump: u8,
    pub platform_fee: u64,
    #[max_len(50)]
    pub winners: Vec<Pubkey>,
}

impl Tournament {
    // helper function to check if a player is a winner
    pub fn is_winner(&self, player: &Pubkey) -> Option<usize> {
        self.winners.iter().position(|winner| winner == player)
    }

    // function to set winners (to be called by game logic)
    pub fn set_winners(&mut self, winners: Vec<Pubkey>) -> Result<()> {
        for winner in &winners {
            require!(self.players.contains(winner), TournamentError::NotAWinner);
        }

        self.winners = winners;
        Ok(())
    }
}
