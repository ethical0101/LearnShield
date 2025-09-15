import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: User['role']) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '';
        let resolvedRole: User['role'] = 'Student';
        // Try to get role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role === 'Admin' || data.role === 'Mentor' || data.role === 'Guardian' || data.role === 'Student') {
              resolvedRole = data.role;
            }
          }
        } catch (e) {
          // fallback to localStorage or email logic if Firestore fails
          const storedRole = localStorage.getItem('LearnShield_role');
          if (storedRole === 'Admin' || storedRole === 'Mentor' || storedRole === 'Guardian' || storedRole === 'Student') {
            resolvedRole = storedRole as User['role'];
          } else {
            if (firebaseUser.email === 'admin@edu.com') resolvedRole = 'Admin';
            else if (firebaseUser.email === 'mentor@edu.com') resolvedRole = 'Mentor';
            else if (firebaseUser.email === 'parent@edu.com') resolvedRole = 'Guardian';
          }
        }
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name,
          role: resolvedRole,
        });
        localStorage.setItem('LearnShield_user', JSON.stringify({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name,
          role: resolvedRole,
        }));
      } else {
        setUser(null);
        localStorage.removeItem('LearnShield_user');
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, role: User['role']): Promise<boolean> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Set displayName
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
        // Save role in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          email,
          name,
          role,
        });
        // Save role in localStorage for fallback
        localStorage.setItem('LearnShield_role', role);
      }
      return true;
    } catch {
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
    localStorage.removeItem('LearnShield_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      loginWithGoogle,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
