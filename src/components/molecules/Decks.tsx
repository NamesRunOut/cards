import React, {useContext, useEffect, useState} from "react";

import {SocketContext} from '../../hooks/Socket'
import {Category, Deck} from "../../types/Deck";

const Decks: React.FC<{ response: boolean }> = ({response}) => {
    const socket: any = useContext(SocketContext)
    const [decks, setDecks] = useState<Array<Deck>>([])

    const changeDecks = (e: EventTarget & HTMLInputElement) => {
        let {value, checked} = e
        let tmp = [...decks]
        for (let i = 0; i < tmp.length; i++)
            if (parseFloat(String(tmp[i].deck.id)) === parseFloat(value)) {
                tmp[i].checked = checked
                break
            }
        setDecks([...tmp])
    }

    const sendDecks = () => {
        let tmp = []
        for (let i = 0; i < decks.length; i++)
            if (decks[i].checked)
                tmp.push(decks[i].deck.id)
        socket.emit('setDecks', tmp)
    }

    useEffect(() => {
        socket.on('recieveCategories', function (cat: Array<Category>) {
            let tmp = []
            for (let i = 0; i < cat.length; i++)
                tmp.push({deck: cat[i], checked: true})
            setDecks([...tmp])
        });
        //console.log(decks.length===0, response)
    }, [socket]);

    return (
        <div className="navbar_decks">
            <button id="deckButton" onClick={sendDecks} disabled={decks.length === 0 || response}>Decks select</button>
            <div className="navbar_decks_content" id="catplace">
                {decks.length !== 0 ? decks.map(deck => <span key={deck.deck.id}>
                    <input type="checkbox"
                           className="deck"
                           value={deck.deck.id}
                           checked={deck.checked}
                           onChange={(event) => changeDecks(event.target)}/>
                    <label htmlFor={String(deck.deck.id)}>
                        {deck.deck.name}
                    </label>
                    <br/>
                </span>) :
                    <span>Sometimes it takes a while for the API/server to start. If you can't see any decks, please reload the page after a few minutes</span>
                }
            </div>
        </div>
    );
}

export default Decks