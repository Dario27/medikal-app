// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging , getToken } from "firebase/messaging";

export class   Firebase {

    private messaging:any
    
     constructor(){ }

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    runFirebase(){
        const firebaseConfig = {
            apiKey: "AIzaSyCmag_Wc7Pi8ufmtR45hsTPvK910y7r1BM",
            authDomain: "mediktes.firebaseapp.com",
            projectId: "mediktes",
            storageBucket: "mediktes.appspot.com",
            messagingSenderId: "745695586682",
            appId: "1:745695586682:web:ad2e41b182cade8264cec3",
            measurementId: "G-1SMCB2YR40"
        };
    
         // Initialize Firebase
         const app = initializeApp(firebaseConfig);
         console.log("app ", app)
         // Initialize Firebase Cloud Messaging and get a reference to the service
         //this.messaging = getMessaging(app);
         //const analytics = getAnalytics(app);
         return app
    }

    async getTokenMessaging(app:FirebaseApp ,apiKey : string){
        /* console.log("entramos al message")
        this.messaging = getMessaging(app);
        const messaging = this.messaging.isSupported() ? this.messaging() : null
        console.log("messaging is supported", messaging)
        getToken(this.messaging, { vapidKey: apiKey }).then((currentToken) => {
            if (currentToken) {
                // Send the token to your server and update the UI if necessary
                    console. log("message sent to server")                    
                // ...
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                // ...
            }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
                // ...
            }); */
    }
}