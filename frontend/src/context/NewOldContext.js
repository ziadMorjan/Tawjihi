import { createContext, useState } from "react";

export const NewOldContext = createContext();

export const NewOldProvider = ({ children }) => {
    const [isNew, setIsNew] = useState('new');

    return (
        <NewOldContext.Provider value={{ isNew, setIsNew }}>
            {children}
        </NewOldContext.Provider>
    );
};
