import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import _filter from "lodash/filter";
import _isEmpty from "lodash/isEmpty";

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
      isActive: false,
      turn: 0, // Integer of current turn #, starts at 1 when the first card is pulled
      timers: {}, // Will be for virsus. When the card is pulled, add to this timer counter with a countdown, and text of the secondary prompt
      freeCards: [], // Cards still ready to play. Will randomly be pulled from if the current turn is not a virus
    }
  }),
  getters: {
    hasUserData: (state) => { return !_isEmpty(state.user.userData) },
    isAuthenticated:(state) => { return Boolean(state.user.firebaseUser) },
    isGameActive: (state) => { return state.game.isActive },
    userData: (state) => { return state.user.userData }
  },
  actions: {
    startGame() {
      this.game.isActive = true
    },
    initFirebase() {
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
        const token = credential.accessToken;
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
          let populatedDecks = []
          if(userDocData.decks){
            console.log('userData', userDocData)
            populatedDecks = await this.getDecks(userDocData.decks)
            console.log('final populated decks', populatedDecks)
          }
          this.user.userData = {
            decks: populatedDecks || userDocData.decks
          }
        }
      }
    },
    async getDecks(decks, dontGrab = []) {
      const db = this.firebase.firestore;
      let extraDecks = [];
      decks = decks.filter(x => !dontGrab.includes(x))
      const deckData = await Promise.all(
        decks.map(async (deck) => {
          console.log('deck', deck)
          const deckDocRef = doc(db, "decks", deck);
          const deckSnap = await getDoc(deckDocRef);
          if(deckSnap.exists()){
            const deckData = deckSnap.data();
            if(deckData.decks) extraDecks.push(...deckData.decks)
            return deckData;
          } else {
            console.log('deckSnap does not exist')
          }
        })
      )
      const newExtraDecks = _filter(extraDecks, x => !decks.includes(x))
      let populatedExtraDecks = []
      if(!_isEmpty(newExtraDecks)){
        populatedExtraDecks = await this.getDecks(newExtraDecks, decks)
      }
      return [
        ...deckData,
        ...populatedExtraDecks
      ]
    },
    async getPublicDecks() {
      // TODO: Implement getting decks set to public
    },
    addCardsToGame(cards) {
      this.game.freeCards.push(...cards);
    }
  },
  // persist: {
  //   storage: sessionStorage
  // }
})