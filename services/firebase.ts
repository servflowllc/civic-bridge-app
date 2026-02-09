import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { UserProfile, ActivityLog } from '../types';

// Safely get env config
const getFirebaseConfig = () => {
  try {
    return process.env.FIREBASE_CONFIG ? JSON.parse(process.env.FIREBASE_CONFIG) : {
      apiKey: "MOCK_KEY",
      authDomain: "mock-project.firebaseapp.com",
      projectId: "mock-project",
      storageBucket: "mock-project.appspot.com",
      messagingSenderId: "00000000000",
      appId: "1:00000000000:web:00000000000000"
    };
  } catch (e) {
    return {
      apiKey: "MOCK_KEY",
      authDomain: "mock-project.firebaseapp.com",
      projectId: "mock-project",
      storageBucket: "mock-project.appspot.com",
      messagingSenderId: "00000000000",
      appId: "1:00000000000:web:00000000000000"
    };
  }
};

// Initialize Firebase
const app = initializeApp(getFirebaseConfig());
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- Auth Services ---

export const signInWithGoogle = async (): Promise<{ user: UserProfile, isNewUser: boolean }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create basic profile
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    let userProfile: UserProfile;
    let isNewUser = false;

    if (userSnap.exists()) {
      userProfile = userSnap.data() as UserProfile;
    } else {
      isNewUser = true;
      userProfile = {
        id: user.uid,
        name: user.displayName || 'Citizen',
        email: user.email || '',
        avatar: user.photoURL || '',
        isVerified: false,
        isPro: false
      };
      await setDoc(userRef, userProfile);
    }
    
    return { user: userProfile, isNewUser };
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};

// --- User Data Services ---

export const updateUserAddress = async (uid: string, address: string) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { address, isVerified: true }, { merge: true });
};

export const updateSubscriptionStatus = async (uid: string, isPro: boolean) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { isPro }, { merge: true });
};

// --- Activity Log Services ---

export const saveLog = async (uid: string, log: Omit<ActivityLog, 'id'>) => {
  try {
    const logsRef = collection(db, 'users', uid, 'activity_logs');
    await addDoc(logsRef, log);
  } catch (error) {
    console.error("Error saving log", error);
  }
};

export const subscribeToUserLogs = (uid: string, callback: (logs: ActivityLog[]) => void) => {
  const logsRef = collection(db, 'users', uid, 'activity_logs');
  const q = query(logsRef, orderBy('date', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const logs: ActivityLog[] = [];
    snapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() } as ActivityLog);
    });
    callback(logs);
  });
};