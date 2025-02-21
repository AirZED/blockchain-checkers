use anchor_lang::prelude::*;

#[error_code]
pub enum TournamentError {
    #[msg("Tournament is full")]
    TournamentFull,

    #[msg("Player has already joined")]
    AlreadyJoined,

    #[msg("Not a winner")]
    NotAWinner,

    #[msg("Player has already claimed rewards")]
    AlreadyClaimed,

    #[msg("Only the tournament host can perform this action")]
    NotTournamentHost,

    #[msg("Invalid player count - must be even and greater than zero")]
    InvalidPlayerCount,

    #[msg("Tournament has already started")]
    TournamentAlreadyStarted,

    #[msg("Tournament has not started yet")]
    TournamentNotStarted,

    #[msg("Player is not in the tournament")]
    PlayerNotInTournament,
}
