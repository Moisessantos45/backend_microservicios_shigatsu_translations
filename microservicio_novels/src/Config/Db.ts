import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { config } from "dotenv";

config();

const firebaseConfig = {
  project_id: process.env.PROJECT_ID,
  private_key: process.env.PRIVATE_KEY,
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
  client_email: process.env.CLIENT_EMAIL,
};

initializeApp({
  credential: cert(firebaseConfig),
});

const dbFirebase = getFirestore();
export default dbFirebase;
