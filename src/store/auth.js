import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    firebase: {
      firebase: null,
      firestore: null
    },
    user: {
      firebaseUser: null,
      userData: null
    },
    game: {
      turn: 0, // Integer of current turn #, starts at 1 when the first card is pulled
      timers: {}, // Will be for virsus. When the card is pulled, add to this timer counter with a countdown, and text of the secondary prompt
      freeCards: [], // Cards still ready to play. Will randomly be pulled from if the current turn is not a virus
    }
  }),
  // getters: {
  // },
  actions: {
    initFirebase() {
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries

      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      const firebaseConfig = {
        apiKey: "AIzaSyAvRU0kYOhaQXHOMQuzMNmn5JTgTGalj6U",
        authDomain: "untitled-drinking-game.firebaseapp.com",
        projectId: "untitled-drinking-game",
        storageBucket: "untitled-drinking-game.appspot.com",
        messagingSenderId: "997660850486",
        appId: "1:997660850486:web:096922cf429694d4125b97",
        measurementId: "G-6KVXLM36R5"
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);

      const db = getFirestore(app);
      this.firebase.firebase = app;
      this.firebase.firestore = db;
    },
    async authWithGooglePopup() {
      console.log('inside authWithGoogle')
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // console.log('credential', credential)
        const token = credential.accessToken;
        // console.log('access token', token)
        const user = result.user;
        console.log('user:', user)
        this.user.firebaseUser = user;
        this.getUserData();
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      })
    },
    async getUserData(){
      const uid = this.user.firebaseUser.uid;
      const db = this.firebase.firestore;
      if(uid){
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if(userDocSnap.exists()){
          const userDocData = userDocSnap.data();
          // Inflate the decks
          if(userDocData.decks){
            const deckData = await Promise.all(
              userDocData.decks.map(async (deck) => {
                const deckDocRef = doc(db, "decks", deck);
                const deckSnap = await getDoc(deckDocRef);
                if(deckSnap.exists()){
                  console.log(deckSnap.data());
                } else {
                  console.log('deckSnap does not exist')
                }
              })
            )
          }
          // console.log(userDocSnap.data());
        }
      }
    }
  },
  persist: {
    storage: sessionStorage
  }
})