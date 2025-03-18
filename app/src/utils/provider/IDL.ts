
export type BlockchainCheckers = {
    "address": "J5zCTZCbJieJ1Wf88ZxACMZyEkVvYpxXQ6nCMULGmLGy",
    "metadata": {
        "name": "blockchainCheckers",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "claimRewards",
            "discriminator": [
                4,
                144,
                132,
                71,
                116,
                23,
                151,
                80
            ],
            "accounts": [
                {
                    "name": "player",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "host"
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "gameVault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "endGame",
            "discriminator": [
                224,
                135,
                245,
                99,
                67,
                175,
                121,
                252
            ],
            "accounts": [
                {
                    "name": "host",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "gameVault",
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "fundGame",
            "discriminator": [
                71,
                9,
                242,
                41,
                192,
                23,
                54,
                224
            ],
            "accounts": [
                {
                    "name": "host",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "host"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "gameVault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "gameAccount",
                    "writable": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "initializeGame",
            "discriminator": [
                44,
                62,
                102,
                247,
                126,
                208,
                130,
                215
            ],
            "accounts": [
                {
                    "name": "host",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "host"
                            },
                            {
                                "kind": "arg",
                                "path": "seed"
                            }
                        ]
                    }
                },
                {
                    "name": "gameVault",
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "seeds",
                    "type": "u64"
                },
                {
                    "name": "gameAccount",
                    "type": "pubkey"
                }
            ]
        },
        {
            "name": "joinGame",
            "discriminator": [
                107,
                112,
                18,
                38,
                56,
                173,
                60,
                128
            ],
            "accounts": [
                {
                    "name": "player",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "gameVault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "gameAccount",
                    "writable": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "placeBet",
            "discriminator": [
                222,
                62,
                67,
                220,
                63,
                166,
                126,
                33
            ],
            "accounts": [
                {
                    "name": "bettor",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "gameVault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "gameAccount",
                    "writable": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "betAmount",
                    "type": "u64"
                },
                {
                    "name": "betOn",
                    "type": "pubkey"
                }
            ]
        },
        {
            "name": "startGame",
            "discriminator": [
                249,
                47,
                252,
                172,
                184,
                162,
                245,
                14
            ],
            "accounts": [
                {
                    "name": "host",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "gameVault",
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "submitGameResult",
            "discriminator": [
                64,
                70,
                142,
                55,
                155,
                245,
                204,
                155
            ],
            "accounts": [
                {
                    "name": "gameAccount",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "gameVault",
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "gameResult",
                    "type": {
                        "defined": {
                            "name": "gameResult"
                        }
                    }
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "game",
            "discriminator": [
                27,
                90,
                166,
                125,
                74,
                100,
                121,
                18
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "gameFull",
            "msg": "Game is full"
        },
        {
            "code": 6001,
            "name": "alreadyJoined",
            "msg": "Player has already joined"
        },
        {
            "code": 6002,
            "name": "notAWinner",
            "msg": "Not a winner"
        },
        {
            "code": 6003,
            "name": "alreadyClaimed",
            "msg": "Player has already claimed rewards"
        },
        {
            "code": 6004,
            "name": "notGameHost",
            "msg": "Only the game host can perform this action"
        },
        {
            "code": 6005,
            "name": "invalidPlayerCount",
            "msg": "Invalid player count - must be even and greater than zero"
        },
        {
            "code": 6006,
            "name": "gameAlreadyStarted",
            "msg": "Game has already started"
        },
        {
            "code": 6007,
            "name": "gameNotStarted",
            "msg": "Game has not started yet"
        },
        {
            "code": 6008,
            "name": "playerNotInGame",
            "msg": "Player is not in the game"
        },
        {
            "code": 6009,
            "name": "gameNotShuffled",
            "msg": "Game not shuffled, and players are not grouped"
        },
        {
            "code": 6010,
            "name": "invalidGame",
            "msg": "Game does not exist"
        },
        {
            "code": 6011,
            "name": "playersNotInSameTeam",
            "msg": "Players are not in the same team"
        },
        {
            "code": 6012,
            "name": "notAGameWinner",
            "msg": "Not a game winner"
        },
        {
            "code": 6013,
            "name": "gameNotFunded",
            "msg": "This game has not been funded yet"
        },
        {
            "code": 6014,
            "name": "invalidGameState",
            "msg": "Invalid game state, you cannot perform this operation now"
        },
        {
            "code": 6015,
            "name": "notEnoughPlayers",
            "msg": "Not enough players"
        },
        {
            "code": 6016,
            "name": "tooManyBets",
            "msg": "Too many bets"
        },
        {
            "code": 6017,
            "name": "playerAlreadyInGame",
            "msg": "Player already in game"
        }
    ],
    "types": [
        {
            "name": "bet",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "staker",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "betOn",
                        "type": "pubkey"
                    }
                ]
            }
        },
        {
            "name": "game",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "seed",
                        "type": "u64"
                    },
                    {
                        "name": "host",
                        "type": "pubkey"
                    },
                    {
                        "name": "players",
                        "type": {
                            "vec": "pubkey"
                        }
                    },
                    {
                        "name": "gameBump",
                        "type": "u8"
                    },
                    {
                        "name": "gameVaultBump",
                        "type": "u8"
                    },
                    {
                        "name": "gameAccount",
                        "type": "pubkey"
                    },
                    {
                        "name": "currentState",
                        "type": {
                            "defined": {
                                "name": "gameState"
                            }
                        }
                    },
                    {
                        "name": "stakePrice",
                        "type": "u64"
                    },
                    {
                        "name": "platformFee",
                        "type": "u64"
                    },
                    {
                        "name": "winner",
                        "type": {
                            "option": "pubkey"
                        }
                    },
                    {
                        "name": "claimedRewards",
                        "type": {
                            "option": "pubkey"
                        }
                    },
                    {
                        "name": "bets",
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "bet"
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "gameResult",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "winner",
                        "type": "pubkey"
                    },
                    {
                        "name": "loser",
                        "type": "pubkey"
                    }
                ]
            }
        },
        {
            "name": "gameState",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "created"
                    },
                    {
                        "name": "funded"
                    },
                    {
                        "name": "started"
                    },
                    {
                        "name": "ended"
                    }
                ]
            }
        }
    ]
};


export const IDL = {
    "address": "J5zCTZCbJieJ1Wf88ZxACMZyEkVvYpxXQ6nCMULGmLGy",
    "metadata": {
        "name": "blockchain_checkers",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "claim_rewards",
            "discriminator": [
                4,
                144,
                132,
                71,
                116,
                23,
                151,
                80
            ],
            "accounts": [
                {
                    "name": "player",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "host"
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "Game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "Game"
                            }
                        ]
                    }
                },
                {
                    "name": "game_vault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "end_game",
            "discriminator": [
                224,
                135,
                245,
                99,
                67,
                175,
                121,
                252
            ],
            "accounts": [
                {
                    "name": "host",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "Game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "Game"
                            }
                        ]
                    }
                },
                {
                    "name": "game_vault",
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "fund_game",
            "discriminator": [
                71,
                9,
                242,
                41,
                192,
                23,
                54,
                224
            ],
            "accounts": [
                {
                    "name": "host",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "host"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "Game"
                            }
                        ]
                    }
                },
                {
                    "name": "game_vault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "game_account",
                    "writable": true
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "initialize_game",
            "discriminator": [
                44,
                62,
                102,
                247,
                126,
                208,
                130,
                215
            ],
            "accounts": [
                {
                    "name": "host",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "host"
                            },
                            {
                                "kind": "arg",
                                "path": "seed"
                            }
                        ]
                    }
                },
                {
                    "name": "game_vault",
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "seeds",
                    "type": "u64"
                },
                {
                    "name": "game_account",
                    "type": "pubkey"
                }
            ]
        },
        {
            "name": "join_game",
            "discriminator": [
                107,
                112,
                18,
                38,
                56,
                173,
                60,
                128
            ],
            "accounts": [
                {
                    "name": "player",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "Game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "Game"
                            }
                        ]
                    }
                },
                {
                    "name": "game_vault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "game_account",
                    "writable": true
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "place_bet",
            "discriminator": [
                222,
                62,
                67,
                220,
                63,
                166,
                126,
                33
            ],
            "accounts": [
                {
                    "name": "bettor",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "Game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "Game"
                            }
                        ]
                    }
                },
                {
                    "name": "game_vault",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "game_account",
                    "writable": true
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "bet_amount",
                    "type": "u64"
                },
                {
                    "name": "bet_on",
                    "type": "pubkey"
                }
            ]
        },
        {
            "name": "start_game",
            "discriminator": [
                249,
                47,
                252,
                172,
                184,
                162,
                245,
                14
            ],
            "accounts": [
                {
                    "name": "host",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "Game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "Game"
                            }
                        ]
                    }
                },
                {
                    "name": "game_vault",
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "submit_game_result",
            "discriminator": [
                64,
                70,
                142,
                55,
                155,
                245,
                204,
                155
            ],
            "accounts": [
                {
                    "name": "game_account",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "game",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game.host",
                                "account": "Game"
                            },
                            {
                                "kind": "account",
                                "path": "game.seed",
                                "account": "Game"
                            }
                        ]
                    }
                },
                {
                    "name": "game_vault",
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    97,
                                    109,
                                    101,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "game"
                            }
                        ]
                    }
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "game_result",
                    "type": {
                        "defined": {
                            "name": "GameResult"
                        }
                    }
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "Game",
            "discriminator": [
                27,
                90,
                166,
                125,
                74,
                100,
                121,
                18
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "GameFull",
            "msg": "Game is full"
        },
        {
            "code": 6001,
            "name": "AlreadyJoined",
            "msg": "Player has already joined"
        },
        {
            "code": 6002,
            "name": "NotAWinner",
            "msg": "Not a winner"
        },
        {
            "code": 6003,
            "name": "AlreadyClaimed",
            "msg": "Player has already claimed rewards"
        },
        {
            "code": 6004,
            "name": "NotGameHost",
            "msg": "Only the game host can perform this action"
        },
        {
            "code": 6005,
            "name": "InvalidPlayerCount",
            "msg": "Invalid player count - must be even and greater than zero"
        },
        {
            "code": 6006,
            "name": "GameAlreadyStarted",
            "msg": "Game has already started"
        },
        {
            "code": 6007,
            "name": "GameNotStarted",
            "msg": "Game has not started yet"
        },
        {
            "code": 6008,
            "name": "PlayerNotInGame",
            "msg": "Player is not in the game"
        },
        {
            "code": 6009,
            "name": "GameNotShuffled",
            "msg": "Game not shuffled, and players are not grouped"
        },
        {
            "code": 6010,
            "name": "InvalidGame",
            "msg": "Game does not exist"
        },
        {
            "code": 6011,
            "name": "PlayersNotInSameTeam",
            "msg": "Players are not in the same team"
        },
        {
            "code": 6012,
            "name": "NotAGameWinner",
            "msg": "Not a game winner"
        },
        {
            "code": 6013,
            "name": "GameNotFunded",
            "msg": "This game has not been funded yet"
        },
        {
            "code": 6014,
            "name": "InvalidGameState",
            "msg": "Invalid game state, you cannot perform this operation now"
        },
        {
            "code": 6015,
            "name": "NotEnoughPlayers",
            "msg": "Not enough players"
        },
        {
            "code": 6016,
            "name": "TooManyBets",
            "msg": "Too many bets"
        },
        {
            "code": 6017,
            "name": "PlayerAlreadyInGame",
            "msg": "Player already in game"
        }
    ],
    "types": [
        {
            "name": "Bet",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "staker",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "bet_on",
                        "type": "pubkey"
                    }
                ]
            }
        },
        {
            "name": "Game",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "seed",
                        "type": "u64"
                    },
                    {
                        "name": "host",
                        "type": "pubkey"
                    },
                    {
                        "name": "players",
                        "type": {
                            "vec": "pubkey"
                        }
                    },
                    {
                        "name": "game_bump",
                        "type": "u8"
                    },
                    {
                        "name": "game_vault_bump",
                        "type": "u8"
                    },
                    {
                        "name": "game_account",
                        "type": "pubkey"
                    },
                    {
                        "name": "current_state",
                        "type": {
                            "defined": {
                                "name": "GameState"
                            }
                        }
                    },
                    {
                        "name": "stake_price",
                        "type": "u64"
                    },
                    {
                        "name": "platform_fee",
                        "type": "u64"
                    },
                    {
                        "name": "winner",
                        "type": {
                            "option": "pubkey"
                        }
                    },
                    {
                        "name": "claimed_rewards",
                        "type": {
                            "option": "pubkey"
                        }
                    },
                    {
                        "name": "bets",
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "Bet"
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "GameResult",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "winner",
                        "type": "pubkey"
                    },
                    {
                        "name": "loser",
                        "type": "pubkey"
                    }
                ]
            }
        },
        {
            "name": "GameState",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Created"
                    },
                    {
                        "name": "Funded"
                    },
                    {
                        "name": "Started"
                    },
                    {
                        "name": "Ended"
                    }
                ]
            }
        }
    ]
}