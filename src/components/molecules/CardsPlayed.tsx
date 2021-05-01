import React, {useContext} from "react";
import Placeholders from "../atoms/Placeholders";
import CommitedCard from "../atoms/CommitedCard";
import {CardsPlayedContext} from "../../hooks/CardsPlayed";
import {BlackCardContext} from "../../hooks/BlackCard";
import {BlackType, CardPlayed} from "../../types/Card";

// TODO blocking from commiting more cards

const CardsPlayed = () => {
    const [cards]: [Array<CardPlayed> | Array<Array<CardPlayed>>] = useContext(CardsPlayedContext)
    const blackType: BlackType = useContext(BlackCardContext)//useState(null)

    // TODO unique keys for 2/3 cards display
    // TODO check later if rendering fine

    return (
        <div id="cards">
            <Placeholders/>
            {cards.length === 0 ? <></> :
                cards.map(
                    (element: CardPlayed | Array<CardPlayed>) => {
                        switch (blackType) {
                            case 0:
                                if (!Array.isArray(element))
                                    return <CommitedCard key={element.matchid} card={element} chosen={!element.chosen}
                                                         revealed={element.revealed || false} playerName={element.playerName || ''}
                                                         player={element.player || 'unknown'}/>
                                break;
                            case 2:
                            case 3:
                                let i = 0
                                if (Array.isArray(element))
                                    return <div key={`${i++}box`} className="box">
                                        {element.map((box: CardPlayed) => {
                                            return <CommitedCard key={`${box.matchid}${i++}`} card={box}
                                                                 chosen={!box.chosen} revealed={box.revealed || false}
                                                                 playerName={box.playerName || ''} player={box.player || 'unknown'}/>
                                        })}
                                    </div>
                                break;
                        }
                        return <></>
                    }
                )}
        </div>
    );
}

export default CardsPlayed
