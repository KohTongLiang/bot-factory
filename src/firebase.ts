import { BotProfile } from "./constants/properties";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { uploadBytes, getStorage, ref, deleteObject, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    doc,
    where,
    addDoc,
    getDoc,
    deleteDoc,
} from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();
initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
});


const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
};

const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
};

const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

// Bot operations
const addBot = async (userId: string, bot: BotProfile): Promise<void> => {
    try {
        const userDocRefQuery = query(collection(db, "users"), where("uid", "==", userId));
        const userQuerySnapshot = await getDocs(userDocRefQuery);
        if (userQuerySnapshot.empty) {
            // console.log("User not found.");
            return;
        }
        const userDocRef = userQuerySnapshot.docs[0].ref;
        const botCollectionRef = collection(userDocRef, "bots");
        const docRef = await addDoc(botCollectionRef, bot);
    } catch (error) {
        // console.error("Error adding bot to Firestore: ", error);
    }
};

async function getAllBots(userId: string): Promise<BotProfile[]> {
    const userDocRefQuery = query(collection(db, "users"), where("uid", "==", userId));
    const userQuerySnapshot = await getDocs(userDocRefQuery);
    if (userQuerySnapshot.empty) {
        // console.log("User not found.");
    }
    const userDocRef = userQuerySnapshot.docs[0].ref;
    const botCollectionRef = collection(userDocRef, "bots");
    const q = query(botCollectionRef);
    const botCollection = await getDocs(q);
    const botList: BotProfile[] = [];

    botCollection.forEach((doc: any) => {
        const botData = doc.data();
        const bot: BotProfile = {
            name: botData.name,
            botProfilePic: botData.botProfilePic,
            characteristic: botData.characteristic,
            knowledgeBase: botData.knowledgeBase,
        };
        botList.push(bot);
    });
    return botList;
}

const updateBotConversation = async (userId: string, botName: string, conversation: Array<string>) => {
    try {
        const userDocRefQuery = query(collection(db, "users"), where("uid", "==", userId));
        const userQuerySnapshot = await getDocs(userDocRefQuery);
        if (userQuerySnapshot.empty) {
            console.log("User not found.");
        }
        const userDocRef = userQuerySnapshot.docs[0].ref;
        const botCollectionRef = collection(userDocRef, "bots");
    } catch (error) {
        console.error("Error updating bot in Firestore: ", error);
    }
};

export const deleteBotByName = async (userId: string, botName: string): Promise<void> => {
    try {
        // Get reference to the user's bot collection
        const userDocRefQuery = query(collection(db, "users"), where("uid", "==", userId));
        const userQuerySnapshot = await getDocs(userDocRefQuery);
        if (userQuerySnapshot.empty) {
            console.log("User not found.");
        }
        const userDocRef = userQuerySnapshot.docs[0].ref;
        const botCollectionRef = collection(userDocRef, "bots");

        // Query for the bot document with the given name
        const querySnapshot = await getDocs(query(botCollectionRef, where("name", "==", botName)));

        // If a matching bot document was found, delete it
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await deleteDoc(docRef);
            // console.log("Bot deleted");
        } else {
            // console.log("No bot found with name:", botName);
        }
    } catch (error) {
        // console.error("Error deleting bot:", error);
    }
};
const storage = getStorage();

const uploadBotImage = async (uid: string, botName: string, image: any) => {
    try {
        const botImageRef = ref(storage, `botImages/${uid}/${botName}`);
        const metadata = {
            customMetadata: {
                uid,
                botName,
            },
        };
        await uploadBytes(botImageRef, image, metadata);
        const downloadUrl = await getDownloadURL(botImageRef);
        return downloadUrl;
    } catch (error) {
        console.error("Error uploading image: ", error);
        return;
    }
}

const deleteBotImage = async (email: string, botName: string) => {
    try {
        const botImageRef = ref(storage, `botImages/${email}/${botName}`);
        return await deleteObject(botImageRef);
    } catch (error) {
        console.error("Error deleting image: ", error);
        return;
    }
}



export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    addBot,
    getAllBots,
    uploadBotImage,
    deleteBotImage,
};