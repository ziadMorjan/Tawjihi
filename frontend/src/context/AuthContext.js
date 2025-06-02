import { createContext, useState } from "react";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    // Global Data
    const [auth, setIsAuth] = useState(false);
    return (
        // Provider Context
        <AuthContext.Provider value={{ auth, setIsAuth }}>
            {children}
        </AuthContext.Provider>
    );
}