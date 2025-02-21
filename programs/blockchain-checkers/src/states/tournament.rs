use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct Team {
    pub player1: Pubkey,
    pub player2: Pubkey,
}

#[account]
#[derive(InitSpace)]

pub struct Tournament {
    pub seed: u64,
    pub host: Pubkey,

    #[max_len(100)]
    pub players: Vec<Pubkey>,

    #[max_len(50)]
    pub teams: Vec<Team>,

    pub max_players: u8,
    pub total_price: u64,
    pub bump: u8,
    pub platform_fee: u64,
    pub started: bool,

    #[max_len(50)]
    pub winners: Vec<Pubkey>,

    #[max_len(50)] // Track who has claimed rewards
    pub claimed_rewards: Vec<Pubkey>,
}

impl Tournament {
    // helper function to check if a player is a winner
    pub fn is_winner(&self, player: &Pubkey) -> bool {
        self.winners.contains(player)
    }
    // Helper function to check if a player has claimed rewards
    pub fn has_claimed(&self, player: &Pubkey) -> bool {
        self.claimed_rewards.contains(player)
    }
}
