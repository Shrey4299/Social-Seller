importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBLfuOQhtQNrkDR0PKOmgSksPACRZilqdk",
  authDomain: "otp-project-6c8bb.firebaseapp.com",
  projectId: "otp-project-6c8bb",
  storageBucket: "otp-project-6c8bb.appspot.com",
  messagingSenderId: "719976557656",
  appId: "1:719976557656:web:67b22502545787af022e2d",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
