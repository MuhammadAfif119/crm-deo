// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
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

firebase.initializeApp(firebaseConfig);

const isSupported = firebase.messaging.isSupported();

if (isSupported) {
  // Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.description,
    // icon: image || "/assets/icons/icon-72x72.png",
  };

    self.registration.showNotification(notificationTitle,
    notificationOptions);
});
}
