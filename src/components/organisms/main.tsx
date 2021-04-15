import React from "react";
import {CardsPlayed} from "../../hooks/CardsPlayed";

import BlackCard from "../atoms/BlackCard";
import CardsPlayedDiv from "../molecules/CardsPlayed";

const Main = () => {

    return (
        <div className="mainArea">
            <BlackCard/>
            <div>
                <CardsPlayed>
                    <CardsPlayedDiv/>
                </CardsPlayed>
            </div>
        </div>
    );
}

export default Main;