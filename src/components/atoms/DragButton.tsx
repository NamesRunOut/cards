import React, {useContext} from "react";
import {SettingsContext} from "../../hooks/Settings";

const DragButton = () => {
    const [canDrag, setCanDrag] = useContext(SettingsContext)

    return (
        <div className="navbar_decks">
            <button onClick={() => setCanDrag((canDrag: boolean) => !canDrag)}>Drag
                cards {canDrag ? 'ON' : 'OFF'}</button>
        </div>
    );
}

export default DragButton