import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

let isFirebaseInitialized = false;

if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  try {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
    );

    initializeApp({
      credential: cert(serviceAccount)
    });
    
    isFirebaseInitialized = true;
    console.log('🔥 Firebase Admin SDK Initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
  }
} else {
  console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_BASE64 is not set in .env. Auth middleware will run in mock mode for testing.');
}

// Export a dummy object to mimic the admin structure used elsewhere if needed, or just export auth
export const firebaseAdmin = { auth: getAuth as any };
export const isAuthEnabled = isFirebaseInitialized;
