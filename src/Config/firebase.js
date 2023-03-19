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
  apiKey: "AIzaSyA-p2OkCT9rjeta1lQM4krUfllcSWl_E1s",
  authDomain: "buildfire-project.firebaseapp.com",
  projectId: "buildfire-project",
  storageBucket: "buildfire-project.appspot.com",
  messagingSenderId: "2213424327",
  appId: "1:2213424327:web:9f216a47897c3209fbe2e2",
  measurementId: "G-MMP1NFBP7C",
  token_option: "BPdQWjdl69AqNC55m3oTZyMyUjSBMFjgkdgPAYuEdfTFtY0mEBL2V7mI3KgboDBTYccMlK6cOf5otN9HlDu4JW8", // your vapid key

};
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