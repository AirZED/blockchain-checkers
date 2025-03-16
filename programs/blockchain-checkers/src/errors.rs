use anchor_lang::prelude::*;

#[error_code]
pub enum GameError {
    #[msg("Game is full")]
    GameFull,

    #[msg("Player has already joined")]
    AlreadyJoined,

    #[msg("Not a winner")]
    NotAWinner,

    #[msg("Player has already claimed rewards")]
    AlreadyClaimed,

    #[msg("Only the game host can perform this action")]
    NotGameHost,

    #[msg("Invalid player count - must be even and greater than zero")]
    InvalidPlayerCount,

    #[msg("Game has already started")]
    GameAlreadyStarted,

    #[msg("Game has not started yet")]
    GameNotStarted,

    #[msg("Player is not in the game")]
    PlayerNotInGame,

    #[msg("Game not shuffled, and players are not grouped")]
    GameNotShuffled,

    #[msg("Game does not exist")]
    InvalidGame,

    #[msg("Players are not in the same team")]
    PlayersNotInSameTeam,

    #[msg("Not a game winner")]
    NotAGameWinner,

    #[msg("This game has not been funded yet")]
    GameNotFunded,
}
