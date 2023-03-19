import { useToast } from "@chakra-ui/react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { arrayUnion, collection, doc, getDoc, limit, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, fetchToken } from "../Config/firebase";
import AuthContext from "./hooks/AuthContext";
import store from 'store'
import { getNew, postImportirAuth } from '../Api/importirApi'
import _axios from "../Api/AxiosBarrier";
import { get } from '../Api/importirApi';

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState('');
    const [tokenId, setTokenId] = useState("");
    const [loading, setLoading] = useState(false);
    const [userStorage, setUserStorage] = useState()
    
    const navigate = useNavigate();
    const toast = useToast();

    const login = (email, password) => {
        loadingShow()
        return signInWithEmailAndPassword(auth, email, password)
            .then(async (response) => {
                const user = response.user
                if (user) {
                    let userData = {}
                    const result = await postImportirAuth(
                        { email: email },
                        'sign-in'
                    )
                    if (result.status === true) {
                        userData.email = email
                        userData.token = result.data
                        userData.status = true
                        // const data = JSON.stringify(userData)
                        setUserStorage(userData)
                        await store.set('userData', userData)
                    }
                }
                try {
                    const docRef = doc(db, "users", response.user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        await updateDoc(docRef, { tokenId: arrayUnion(tokenId) });
                        // console.log('test')
                    } else {
                        console.log("No such document!");
                    }
                    // getCart()
                    loadingClose()
                } catch (error) {
                    console.log(error, "ini error");
                    loadingClose()
                }

                toast({
                    title: "Success Login",
                    description: `Success Login account ${response.user.displayName} `,
                    status: "success",
                    duration: 10000,
                    isClosable: true,
                    position: "top-right",
                });



                return navigate("/");
            })
            .catch((error) => {
                toast({
                    title: "Something wrong !",
                    description: error.message,
                    status: "error",
                    duration: 10000,
                    isClosable: true,
                    position: "top-right",
                });
                loadingClose()
            });
    };

    const signOut = () => {
        return auth.signOut();
    };


    const getUserStorage = async () => {
        if (currentUser !== "") {
            try {
                const res = await store.get("userData");
                setUserStorage(res)

            } catch (error) {
                console.log(error, 'error')
            }
        }
    };

    const signUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const getUser = () => {
        return auth.currentUser;
    };

    const loadingShow = () => {
        setLoading(true)
    }

    const loadingClose = () => {
        setLoading(false)
    }



    



    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            fetchToken(setTokenId)
            // getProductBisnis()
        });
    }, []);
    



    const value = {
        currentUser,
        tokenId,
        getUser,
        login,
        signOut,
        signUp,
        getUserStorage,
        userStorage,
        loadingShow,
        loadingClose,
        loading,

    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
