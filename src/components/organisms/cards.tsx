import React, {useContext} from "react";

import {motion} from "framer-motion"

import {PlayerCardsContext} from "../../hooks/PlayerCards";
import Loader from "../atoms/Loader";
import WhiteCardComponent from "../atoms/WhiteCard";
import Blocker from "../atoms/Blocker";
import {WhiteCard} from "../../types/Card";

const container = {
    transition: {
        ease: "easeIn",
        duration: 1
    }
};

const Cards = () => {
    const [whiteCards, , loader, message, cardCommited] = useContext<[Array<WhiteCard>, any, boolean, string | null, any]>(PlayerCardsContext)
    //console.log('render')
    return (
        <motion.div
            layout
            id="yourCards"
            initial="hidden"
            animate="visible"
            // @ts-ignore
            variants={container}
        >
            {loader && <Loader/>}
            {message !== null && <Blocker message={message}/>}
            {whiteCards?.map(card => <WhiteCardComponent
                key={card?.card?.matchid || 'temp'}
                card={card}
                commitFunction={cardCommited}/>)}
        </motion.div>
    );
}

export default Cards;