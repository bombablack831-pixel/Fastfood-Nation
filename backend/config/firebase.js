const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK
 * Note: You need to download your serviceAccountKey.json from Firebase Console
 * and either place it in the config folder or use environment variables.
 */

const initializeFirebase = () => {
    try {
        if (!process.env.FIREBASE_PROJECT_ID) {
            console.warn('Firebase details missing in .env - Push notifications will be disabled');
            return;
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });

        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Firebase initialization error:', error.message);
    }
};

module.exports = { admin, initializeFirebase };
