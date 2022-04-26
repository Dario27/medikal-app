"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Firebase = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
class Firebase {
    constructor() { }
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    runFirebase() {
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
        const app = (0, app_1.initializeApp)(firebaseConfig);
        console.log("app ", app);
        // Initialize Firebase Cloud Messaging and get a reference to the service
        //this.messaging = getMessaging(app);
        //const analytics = getAnalytics(app);
        return app;
    }
    getTokenMessaging(app, apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.Firebase = Firebase;
//# sourceMappingURL=firebase.js.map