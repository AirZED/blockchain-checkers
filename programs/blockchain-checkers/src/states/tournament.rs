use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token_2022::spl_token_2022::solana_zk_token_sdk::encryption::pedersen::H;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Debug)]
struct Stake {
    pub staker: Pubkey,
    pub amount: u64,
    pub bet_on: Pubkey, // Player or team being bet on
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Debug)]
pub struct HeadToHeadPlayerMatch {
    pub id: u8,
    pub player1: Pubkey,
    pub player2: Pubkey,
    pub winner: Option<Pubkey>,

    #[max_len(16)]
    pub stakes: Vec<Stake>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Debug)]
pub struct SinglePlayerMatch {
    pub player: Pubkey,
    pub player_score: u8,

    #[max_len(16)]
    pub stakes: Vec<Stake>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Debug)]
pub enum Match {
    SinglePlayer(SinglePlayerMatch),
    HeadToHeadPlayer(HeadToHeadPlayerMatch),
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq)]
pub enum TournamentState {
    Created,
    Funded,
    Shuffled,
    Started,
    Ended,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq)]
pub enum TournametType {
    FreeForAll, //1
    HeadToHead, //2
}

#[account]
#[derive(InitSpace)]
pub struct Tournament {
    pub seed: u64,
    pub host: Pubkey,
    pub tournament_type: TournametType,

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
    pub teams: Vec<Match>,

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

    pub fn init_free_for_all(&mut self) {
        if self.tournament_type == TournametType::FreeForAll {
            self.teams.clear();

            for player in &self.players {
                self.teams.push(Match::SinglePlayer(SinglePlayerMatch {
                    player: *player,
                    stakes: Vec::new(),
                    player_score: 0,
                }));
            }
        }
    }

    pub fn shuffle_players(&mut self) {
        if self.players.len() % 2 == 0 && self.tournament_type == TournametType::HeadToHead {
            let mut players = self.players.clone();

            solana_program::log::sol_log(&format!("Players: {:#?}", self.players));

            // Use tournament seed for deterministic shuffling
            let mut index = self.seed;

            for i in (1..players.len()).rev() {
                // Generate next pseudo-random index using the seed
                index = index.wrapping_mul(1103515245).wrapping_add(12345);
                let j = (index % (i as u64 + 1)) as usize;
                players.swap(i, j);
            }

            self.teams.clear();

            // Create teams from shuffled players
            for (idx, chunk) in players.chunks(2).enumerate() {
                if let [player1, player2] = chunk {
                    self.teams
                        .push(Match::HeadToHeadPlayer(HeadToHeadPlayerMatch {
                            id: idx as u8,
                            player1: *player1,
                            player2: *player2,
                            winner: None,
                            stakes: Vec::new(),
                        }));
                }
            }

            self.current_state = TournamentState::Shuffled;

            solana_program::log::sol_log(&format!("Shuffled: {:#?}", self.teams));
        }
    }
}
