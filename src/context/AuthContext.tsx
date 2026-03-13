"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { syncUserProfile } from "@/lib/firebase/db";
import { UserProfile } from "@/types/user";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    signInWithGoogle: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            if (currentUser) {
                // Sync UID to cookie for server-side access
                document.cookie = `uid=${currentUser.uid}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
                
                // Fetch/Create profile in Firestore
                try {
                    const userProfile = await syncUserProfile(currentUser);
                    setProfile(userProfile);
                } catch (e) {
                    console.error("Auth: Failed to sync profile", e);
                }
            } else {
                document.cookie = "uid=; path=/; max-age=0; SameSite=Lax";
                setProfile(null);
            }
            
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
