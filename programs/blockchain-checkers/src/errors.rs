use anchor_lang::prelude::*;

#[error_code]
pub enum TournamentError {
    #[msg("Tournament is full")]
    TournamentFull,

    #[msg("Player has already joined")]
    AlreadyJoined,

    #[msg("Not a winner")]
    NotAWinner,

    #[msg("Prize already claimed")]
    PrizeAlreadyClaimed,

    #[msg("Invalid player count")]
    InvalidPlayerCount,
}
