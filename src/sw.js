// Scripts for firebase and firebase messaging

import { initializeApp } from "firebase/app";
import { onBackgroundMessage, getMessaging } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing the generated config
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
};



// Retrieve firebase messaging
const messaging = getMessaging(initializeApp(firebaseConfig));

onBackgroundMessage(messaging, function (payload) {
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.description,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});