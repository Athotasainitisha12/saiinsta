import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface User {
  uid: string;
  email: string | null;
  username: string;
  fullName: string;
  profileImage: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  musicalNote?: string;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  firebaseUser: null,
  loading: true,
  error: null,
  initialized: false,

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        set({ 
          user: {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            username: userData.username,
            fullName: userData.fullName,
            profileImage: userData.profileImage,
            bio: userData.bio,
            followersCount: userData.followersCount || 0,
            followingCount: userData.followingCount || 0,
            postsCount: userData.postsCount || 0,
            musicalNote: userData.musicalNote,
            createdAt: userData.createdAt?.toDate() || new Date(),
          },
          firebaseUser: userCredential.user,
          loading: false 
        });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, username: string, fullName: string) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username: username.toLowerCase(),
        fullName,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: '',
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      set({ 
        user: {
          ...userData,
          createdAt: new Date(),
        } as User,
        firebaseUser: userCredential.user,
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await firebaseSignOut(auth);
      set({ user: null, firebaseUser: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

// Auth state listener
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      useAuthStore.setState({
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: userData.username,
          fullName: userData.fullName,
          profileImage: userData.profileImage,
          bio: userData.bio,
          followersCount: userData.followersCount || 0,
          followingCount: userData.followingCount || 0,
          postsCount: userData.postsCount || 0,
          musicalNote: userData.musicalNote,
          createdAt: userData.createdAt?.toDate() || new Date(),
        },
        firebaseUser,
        loading: false,
        initialized: true,
      });
    } else {
      useAuthStore.setState({ loading: false, initialized: true });
    }
  } else {
    useAuthStore.setState({ user: null, firebaseUser: null, loading: false, initialized: true });
  }
});
