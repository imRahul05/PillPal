
import { useState, useEffect } from 'react';
import { ref, set, get, update, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Fetch user profile when component mounts or user changes
  useEffect(() => {
    if (!currentUser) {
      setProfile(null);
      setProviders([]);
      setLoading(false);
      return;
    }
    
    const userProfileRef = ref(database, `users/${currentUser.uid}/profile`);
    const userProvidersRef = ref(database, `users/${currentUser.uid}/providers`);
    
    // Get initial user profile data
    const fetchData = async () => {
      try {
        // Profile listener
        const profileUnsubscribe = onValue(userProfileRef, (snapshot) => {
          const profileData = snapshot.val();
          if (profileData) {
            setProfile(profileData);
          } else {
            // Initialize with user's email if profile doesn't exist
            const newProfile = {
              name: currentUser.displayName || 'User',
              email: currentUser.email || '',
            };
            setProfile(newProfile);
            // Save the initial profile
            set(userProfileRef, newProfile);
          }
        });
        
        // Providers listener
        const providersUnsubscribe = onValue(userProvidersRef, (snapshot) => {
          const providersData = snapshot.val();
          if (providersData) {
            const providersList = Object.entries(providersData).map(([id, provider]) => ({
              id,
              ...(provider)
            }));
            setProviders(providersList);
          } else {
            setProviders([]);
          }
          setLoading(false);
        });
        
        return () => {
          profileUnsubscribe();
          providersUnsubscribe();
        };
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    const unsubscribes = fetchData();
    return () => {
      if (unsubscribes) {
        unsubscribes.then(unsub => {
          if (unsub) unsub();
        });
      }
    };
  }, [currentUser, toast]);
  
  // Update user profile
  const updateProfile = async (updatedProfile) => {
    if (!currentUser || !profile) return false;
    
    try {
      const userProfileRef = ref(database, `users/${currentUser.uid}/profile`);
      await update(userProfileRef, updatedProfile);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Update provider
  const updateProvider = async (id, updatedProvider) => {
    if (!currentUser) return false;
    
    try {
      const providerRef = ref(database, `users/${currentUser.uid}/providers/${id}`);
      await update(providerRef, updatedProvider);
      
      toast({
        title: "Success",
        description: "Provider updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating provider:", error);
      toast({
        title: "Error",
        description: "Failed to update provider. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Add provider
  const addProvider = async (provider) => {
    if (!currentUser) return null;
    
    try {
      const providersRef = ref(database, `users/${currentUser.uid}/providers`);
      const newProviderKey = Date.now().toString();
      const newProviderRef = ref(database, `users/${currentUser.uid}/providers/${newProviderKey}`);
      
      await set(newProviderRef, provider);
      
      toast({
        title: "Success",
        description: "Provider added successfully",
      });
      
      return newProviderKey;
    } catch (error) {
      console.error("Error adding provider:", error);
      toast({
        title: "Error",
        description: "Failed to add provider. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  return {
    profile,
    providers,
    loading,
    updateProfile,
    updateProvider,
    addProvider
  };
}