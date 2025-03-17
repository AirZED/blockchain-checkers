pub fn calc_game_platform_fee(game_stake_price: u64) -> u64 {
    game_stake_price * 6 / 100
}

pub fn calc_bet_platform_fee(bet_stake_price: u64) -> u64 {
    bet_stake_price * 3 / 100
}
