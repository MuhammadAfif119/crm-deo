// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

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
