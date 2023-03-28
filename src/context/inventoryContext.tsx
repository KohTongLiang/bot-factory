import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { BotProfile } from "../constants/properties";
import { AuthContext } from '../context/AuthContext';
import { getAllBots, db } from "../firebase";

type InventoryContextType = {
    bots: Array<BotProfile>;
    reload: Function;
};

export const InventoryContext = createContext<InventoryContextType>({
    bots: [],
    reload: () => { }
});

export function InventoryProvider({ children }: any) {
    const { user, loading } = useContext(AuthContext);

    const loadBot = async (uid: string) => {
        const returnedBots = await getAllBots(uid);
        setInventoryContext({ ...inventoryContext, bots: returnedBots });
    };

    const [inventoryContext, setInventoryContext] = useState<InventoryContextType>({
        bots: [],
        reload: loadBot
    });

    useEffect(() => {
        if (user) loadBot(user.uid);
    }, [user]);

    return (
        <InventoryContext.Provider value={inventoryContext}>
            {children}
        </InventoryContext.Provider>
    );
};
