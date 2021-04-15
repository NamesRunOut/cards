import React from "react"

const Blocker: React.FC<{ message: string }> = ({message}) => {
    return (
        <div id="blocker"><h2>{message}</h2></div>
    )
}

export default Blocker