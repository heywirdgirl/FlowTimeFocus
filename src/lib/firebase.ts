// src/lib/firebase.ts - FIXED VERSION (Oct 19, 2025) - NO DUPLICATES!
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  query, 
  where,
  Firestore,
  CollectionReference,
  DocumentReference,
  Query
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔥 SINGLE EXPORTS - NO DUPLICATES!
export const db: Firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export { app };

// 🔥 COLLECTION REFERENCES
export const cyclesCollection: CollectionReference = collection(db, 'cycles');
export const trainingHistoriesCollection: CollectionReference = collection(db, 'trainingHistories');
export const usersCollection = collection(db, 'users');

// 🔥 DOCUMENT REFERENCES
export const getUserDoc = (userId: string): DocumentReference => doc(db, 'users', userId);

// 🔥 QUERY HELPERS
export const getUserTrainingHistoriesQuery = (userId: string): Query => 
  query(trainingHistoriesCollection, where('userId', '==', userId));