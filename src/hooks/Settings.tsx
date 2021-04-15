import React, {createContext, SetStateAction, useState} from 'react'

export const SettingsContext = createContext<any>([false, undefined])

const Settings = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined }) => {
    const [canDrag, setCanDrag] = useState<boolean>(false)

    return (
        <SettingsContext.Provider value={[canDrag, setCanDrag]}>
            {props.children}
        </SettingsContext.Provider>
    )
}

export {Settings}