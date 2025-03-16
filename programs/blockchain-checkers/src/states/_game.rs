use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct GameResult {
    pub winner: Pubkey,
    pub loser: Pubkey,
    pub team_index: u8,
}
