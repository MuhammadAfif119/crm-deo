// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

import song from "../assets/CoinDrop-Notification.mp3"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAlXO4Yo-1AvWUrhQ3-Xn5FfhwFCY_mUq4',
  authDomain: 'belanja-co-id.firebaseapp.com',
  databaseURL:
    'https://belanja-co-id-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'belanja-co-id',
  storageBucket: 'belanja-co-id.appspot.com',
  messagingSenderId: '642634353607',
  appId: '1:642634353607:web:02e05ca9eebdce542167e2',
  measurementId: 'G-MFNK2E1E75',
  token_option: "BOB0K1Tfn-Z9FY8x_66YcRPw2b2xO220QPUTueLSacqchs4ZJhpRcoLygWpLG2yzPStqwggDgVavCRTwDyADdVg", // your vapid key
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app);
const configMessage = getMessaging(app);
auth.languageCode = 'id';

export {app,analytics,auth,db}
export const fetchToken = async (setTokenId) => {
  try {
    const token = await getToken(configMessage, { vapidKey: firebaseConfig.token_option });
    if (token) {
      // console.log(token, "this is push notif token");
      setTokenId(token);
    } else {
      console.log("no push notif token for now");
    }
  } catch (error) {}
};

export const onMessageListener = (toast) => {
	onMessage(configMessage, (payload) => {
		const notif = new Audio(song)
		notif.play();
		const { data } = payload
		const { title, description } = data
		toast({
			title: title,
			description: description,
			position: 'top-right',
			isClosable: true,
		})
	});
};