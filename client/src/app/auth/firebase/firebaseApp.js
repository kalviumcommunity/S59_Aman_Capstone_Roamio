import firebaseConfig from '@/app/config/firebase.config'
import {initializeApp} from 'firebase/app'
import {GoogleAuthProvider , getAuth } from 'firebase/auth'

const firebaseApp = initializeApp(firebaseConfig.firebaseConfig);


export const firebaseAuth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider()
export default firebaseApp;