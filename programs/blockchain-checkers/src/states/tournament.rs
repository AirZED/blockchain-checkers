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
    pub mint: Pubkey, // Token mint for rewards

    #[max_len(16)]
    pub players: Vec<Pubkey>,
    pub max_players: u8,
    pub bump: u8,
    // pub vault_bump: u8,
    pub started: bool,
    pub total_price: u64,
    pub platform_fee: u64,

    #[max_len(8)]
    pub teams: Vec<Team>,

    #[max_len(8)]
    pub winners: Vec<Pubkey>, // Winners

    #[max_len(8)]
    pub claimed_rewards: Vec<Pubkey>, // Players who claimed rewards
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

    pub fn is_full(&self) -> bool {
        self.players.len() >= self.max_players as usize
    }

    pub fn has_player(&self, player: &Pubkey) -> bool {
        self.players.contains(player)
    }
}
