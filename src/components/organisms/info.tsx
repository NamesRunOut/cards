import React from "react";

import Contact from "../atoms/Contact";
import Actions from "../molecules/Actions";
import Scoreboard from "../molecules/Scoreboard";
import Chat from "../molecules/Chat";

const Info = () => {
    return (
        <div className="info">
            <div className="info_score">
                <div className="title">Scoreboard
                    <hr/>
                </div>
                <Scoreboard/>
            </div>
            <div className="info_chat">
                <Chat/>
            </div>
            <div className="info_actions">
                <div className="title">Actions</div>
                <hr/>
                <Actions/>
                <hr/>
                <Contact/>
            </div>
        </div>
    );
}

export default Info