use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct Team {
    pub player1: Pubkey,
    pub player2: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq)]
pub enum TournamentState {
    Created,
    Funded,
    Shuffled,
    Started,
    Ended,
}

#[account]
#[derive(InitSpace)]
pub struct Tournament {
    pub seed: u64,
    pub host: Pubkey,

    pub max_players: u8,

    #[max_len(16)]
    pub players: Vec<Pubkey>,
    pub tournament_bump: u8,
    pub tournament_vault_bump: u8,

    pub game_account: Pubkey,

    // pub vault_bump: u8,
    pub current_state: TournamentState,
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

    pub fn shuffle_players(&mut self) {
        if self.players.len() == self.max_players as usize {
            let mut players = self.players.clone();

            // Use tournament seed for deterministic shuffling
            let mut index = self.seed;

            for i in (1..players.len()).rev() {
                // Generate next pseudo-random index using the seed
                index = index.wrapping_mul(1103515245).wrapping_add(12345);
                let j = (index % (i as u64 + 1)) as usize;
                players.swap(i, j);
            }

            // Create teams from shuffled players
            for chunk in players.chunks(2) {
                if let [player1, player2] = chunk {
                    self.teams.push(Team {
                        player1: *player1,
                        player2: *player2,
                    });
                }
            }

            self.current_state = TournamentState::Shuffled;
        }
    }
}
