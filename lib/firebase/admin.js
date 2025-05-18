import { initializeApp, getApps } from "firebase-admin/app";

const initFirebaseAdmin = () => {
  const apps = getApps();

  if(!apps.length){
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n" );
        
      })
    });

  }
}

return {
  auth : getAuth(),
  db: getFireStore()
}

export {auth, db} = initFirebaseAdmin()
