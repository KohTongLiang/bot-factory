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
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCE4hSZo8hqRkum6e5PX966jNhwO1MlkRU",
    authDomain: "build-a-bot-project.firebaseapp.com",
    projectId: "build-a-bot-project",
    storageBucket: "build-a-bot-project.appspot.com",
    messagingSenderId: "444636773640",
    appId: "1:444636773640:web:a3d561aa88b85cb41580bd",
    measurementId: "G-59EYCTNWDW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

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
            shareLink: botData.shareLink,
            persona: {
                characteristic: botData.persona.characteristic,
                language: botData.persona.language,
                background: botData.persona.background,
                age: botData.persona.age,
            },
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

const uploadBotImage = async (email: string, botName: string, image: any) => {
    try {
        const botImageRef = ref(storage, `botImages/${email}/${botName}`);
        await uploadBytes(botImageRef, image);
        const downloadUrl = await getDownloadURL(botImageRef);
        console.log(downloadUrl)
        return downloadUrl;
    } catch (error) {
        console.error("Error uploading image: ", error);
    }
}

const deleteBotImage =async (email: string, botName: string) => {
    try {
        const botImageRef = ref(storage, `botImages/${email}/${botName}`);
        return await deleteObject(botImageRef);
    } catch (error) {
        // console.error("Error deleting image: ", error);
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