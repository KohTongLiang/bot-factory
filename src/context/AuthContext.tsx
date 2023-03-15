import { createContext } from "react";
import firebase from "firebase/app";
import { FC, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

type AuthContextType = {
    user: any | null;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: any) {
    const [user, loading] = useAuthState(auth);
    const [authContext, setAuthContext] = useState<AuthContextType>({
        user: null,
        loading: true,
    });

    useEffect(() => {
        console.log("Triggered useEffect");
        if (!loading) {
            setAuthContext({ user, loading });
        }
    }, [user, loading]);

    // useEffect(() => {
    //     console.log("Triggered useEffect");
    //     setAuthContext({ user, loading });
    // }, [loading]);

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};
