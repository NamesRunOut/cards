export type BlackType = 0 | 2 | 3

export type BlackCard = {
    id: number
    type: BlackType
    text: string
}

export type CardSauce = {
    id: number
    text: string
    type: BlackType
}

export type Card = {
    cardid: number
    matchid: number
}

export type WhiteCard = {
    card: Card
    sauce: CardSauce
}

export type CardPlayed = {
    card: CardSauce
    matchid: number
    player: string
    revealed: boolean | undefined
    chosen: boolean | undefined
    playerName: string | undefined
}
