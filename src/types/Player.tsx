export type PlayerProperties = {
    amountPicked: number
    id: string
    name: string
    pick: boolean
    played: boolean
    points: number
    rerolled: boolean
    tag: number
    tzar: boolean
    voted: boolean
}

export interface Player {
    [id: string]: PlayerProperties
}

export type PlayerScoreboardRecord = {
    name: string
    status: string
    points: number
    id: string
}