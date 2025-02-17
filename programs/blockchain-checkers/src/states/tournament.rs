use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]

pub struct Tournament {
    pub seeds: u64,
    pub host: Pubkey,
    pub players: Vec<Pubkey>,
    pub max_players: u8,
    pub bump: u8,
    pub total_price: u64,
}
