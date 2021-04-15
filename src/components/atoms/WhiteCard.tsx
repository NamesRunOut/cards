import React, {useContext} from "react"
import {motion} from "framer-motion"
import {SettingsContext} from "../../hooks/Settings";

const item = {
    hidden: {x: 100, opacity: 0},
    visible: {
        x: 0,
        opacity: 1
    }
}

const WhiteCard: React.FC<{ card: any, commitFunction: Function }> = ({card, commitFunction}) => {
    const [canDrag] = useContext(SettingsContext)

    if (card.sauce === undefined || card.card === undefined) return <></>
    return (
        <motion.div
            drag={!!canDrag}
            layout
            className='card'
            variants={item}
            whileHover={{scale: 1.1}}
            onClick={() => commitFunction(card.card.matchid, card.sauce.id)}
            style={{backgroundImage: card.sauce.type === 1 ? `url(${card.sauce.text})` : ''}}>
            {(card.sauce.type === 0 || card.sauce.type === 2) ? `${card.sauce.text} [${card.card.matchid}]` : ''}
        </motion.div>
    )
}

export default WhiteCard