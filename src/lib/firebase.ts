// src/lib/firebase.ts - FINAL VERSION (Oct 19, 2025)
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  query, 
  where 
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
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// 🔥 HELPER FUNCTIONS CHO COLLECTIONS MỚI
// Cycles collection
export const cyclesCollection = collection(db, 'cycles');

// TrainingHistories collection RIÊNG
export const trainingHistoriesCollection = collection(db, 'trainingHistories');

// Users collection
export const usersCollection = collection(db, 'users');

// 🔥 USER DOCUMENT HELPER
export const getUserDoc = (userId: string) => doc(db, 'users', userId);

// 🔥 TRAINING HISTORY QUERY HELPER
export const getUserTrainingHistoriesQuery = (userId: string) => 
  query(trainingHistoriesCollection, where('userId', '==', userId));

export { app, db, storage, auth };