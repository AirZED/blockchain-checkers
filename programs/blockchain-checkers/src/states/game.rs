use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct GameResult {
    pub winner: Pubkey,
    pub loser: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq)]
pub enum GameState {
    Created,
    Funded,
    Started,
    Ended,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Debug,)]
pub struct Bet {
    pub staker: Pubkey,
    pub amount: u64,
    pub bet_on: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct Game {
    pub seed: u64,
    pub host: Pubkey,

    #[max_len(2)]
    pub players: Vec<Pubkey>,
    pub game_bump: u8,
    pub game_vault_bump: u8,

    pub game_account: Pubkey,

    // pub vault_bump: u8,
    pub current_state: GameState,
    pub stake_price: u64,
    pub platform_fee: u64,
    pub winner: Option<Pubkey>,

    pub claimed_rewards: Option<Pubkey>, // Players who claimed rewards

    #[max_len(10)]
    pub bets: Vec<Bet>,
}

impl Game {
    // helper function to check if a player is a winner
    pub fn is_winner(&self, player: &Pubkey) -> bool {
        match self.winner {
            Some(winner) => *player == winner,
            None => false,
        }
    }
    // Helper function to check if a player has claimed rewards
    pub fn has_claimed(&self, player: &Pubkey) -> bool {
        match self.claimed_rewards {
            Some(claimed_player) => *player == claimed_player,
            None => false,
        }
    }

    pub fn is_full(&self) -> bool {
        self.players.len() >= 2
    }

    pub fn has_player(&self, player: &Pubkey) -> bool {
        self.players.contains(player)
    }

  
}
