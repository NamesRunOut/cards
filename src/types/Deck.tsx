export type Deck = {
    deck: {
        id: number
        name: string
        color: string | undefined
    },
    checked: boolean
}

export type Category = {
    id: number
    name: string
    color: string
}