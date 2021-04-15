import {BlackType, CardPlayed} from "../types/Card";
import {Player} from "../types/Player";

function insertionSort(inputArr: Array<CardPlayed>) {
    let n = inputArr.length;
    for (let i = 1; i < n; i++) {
        let current = inputArr[i];
        let j = i - 1;
        while ((j > -1) && (current.player < inputArr[j].player)) {
            inputArr[j + 1] = inputArr[j];
            j--;
        }
        inputArr[j + 1] = current;
    }
    return inputArr;
}

export const handleHighlight = (cardid: number, players: Player, cards: any, setCards: Function, settmpcards: Function, blackType: BlackType) => {
    // TODO check later if rendering fine

    //console.log('highlight1', cards)

    if (cards.length === 0) return

    let winningPlayer = {id: 'unknown', name: 'unknown'}
    let tmp = []

    switch (blackType) {
        case 0:
            for (let i = 0; i < cards.length; i++) {
                if (cards[i].matchid === cardid) {
                    winningPlayer = {id: cards[i].player, name: players[cards[i].player].name}
                    break
                }
            }

            for (let i = 0; i < cards.length; i++) {
                tmp.push({
                    card: cards[i].card,
                    matchid: cards[i].matchid,
                    player: cards[i].player,
                    playerName: players[cards[i].player].name,
                    chosen: cards[i].player !== winningPlayer.id,
                    revealed: true
                })
            }
            settmpcards([...tmp])
            break;
        case 2:
        case 3:
            for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < cards[i].length; j++)
                    if (cards[i][j].matchid === cardid) {
                        winningPlayer = {id: cards[i][j].player, name: players[cards[i][j].player].name}
                        break
                    }
            }

            let box = []
            for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < cards[i].length; j++) {
                    //console.log( cards[i][j].player, winningPlayer.id,  cards[i][j].player !== winningPlayer.id)
                    box.push({
                        card: cards[i][j].card,
                        matchid: cards[i][j].matchid,
                        player: cards[i][j].player,
                        playerName: players[cards[i][j].player].name,
                        chosen: cards[i][j].player !== winningPlayer.id,
                        revealed: true
                    })
                }
                tmp.push(box)
                box = []
            }
            //console.log(tmp)
            settmpcards([...tmp])
            break;
    }
}

export const handlePlayedCards = (playedCards: Array<CardPlayed>, type: BlackType, cards: Array<CardPlayed>, setCards: Function, settmpcards: Function, blackType: BlackType) => {
    //console.log('played', cards, playedCards.length, type)

    // TODO mix recieved cards

    if (playedCards.length === 0) {
        settmpcards([])
        return
    }
    switch (type) {
        case 0:
            //console.log('0')
            settmpcards([...playedCards])
            break;
        case 2:
        case 3:
            //console.log('2 or 3')
            let played = playedCards
            insertionSort(played)
            let box = [played[0]]
            let tmp = []
            for (let i = 1; i < played.length; i++) {
                if (played[i].player === played[i - 1].player) box.push(played[i])
                else {
                    tmp.push(box)
                    box = [played[i]]
                }
            }
            tmp.push(box)
            settmpcards([...tmp])
            //console.log('setup', tmp)
            break;
    }
}