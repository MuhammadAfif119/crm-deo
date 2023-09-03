// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

import song from "../assets/CoinDrop-Notification.mp3"
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDHwfzgKXqfknEy3bctrbrlu37_hKeJevo",
  authDomain: "deoapp-indonesia.firebaseapp.com",
  databaseURL: "https://deoapp-indonesia-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "deoapp-indonesia",
  storageBucket: "deoapp-indonesia.appspot.com",
  messagingSenderId: "814589130399",
  appId: "1:814589130399:web:a0bb255936eefd57e554aa",
  measurementId: "G-B9FPJL2RD0",
  token_option: "BHcgLCKeUP3IkJIIMaGoVhFzbnjWx6-sSJ6JWQNKAU9nXMN3xK2TOmVEHVsqSJ1V9M_JGKW2rs0SbHZw1CDE3dA", // your vapid key
};

// const firebaseConfig = {
//   apiKey: "AIzaSyA-p2OkCT9rjeta1lQM4krUfllcSWl_E1s",
//   authDomain: "buildfire-project.firebaseapp.com",
//   databaseURL: "https://buildfire-project-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "buildfire-project",
//   storageBucket: "buildfire-project.appspot.com",
//   messagingSenderId: "2213424327",
//   appId: "1:2213424327:web:9f216a47897c3209fbe2e2",
//   measurementId: "G-MMP1NFBP7C"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app)
const database = getDatabase(app)
const storage = getStorage(app);
const configMessage = getMessaging(app);
auth.languageCode = 'id';

export {app,analytics,auth,db, storage, database}
export const fetchToken = async () => {
  try {
    const token = await getToken(configMessage, { vapidKey: firebaseConfig.token_option });
    if (token) {
      return token
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