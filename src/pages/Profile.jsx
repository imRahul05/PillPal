import { useEffect, useState } from 'react';
import { 
  User, Mail, Phone, Home, Heart, Activity, AlertTriangle, Calendar,
  Edit, Trash2, LogOut, Plus, Filter, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileForm from '@/components/ProfileForm';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { profile, loading, updateProfile } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEditSubmit = async (data) => {
    await updateProfile(data);
    setIsEditDialogOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Card */}
            <Card className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">User Profile</CardTitle>
                <CardDescription>View and manage your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : currentUser && profile ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full h-16 w-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-lg font-semibold">
                        {profile.name ? getInitials(profile.name) : currentUser.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium">{profile.name || 'N/A'}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{profile.age ? `${profile.age} years old` : 'Age not specified'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{profile.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{profile.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Home className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{profile.address || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>Blood Type: {profile.bloodType || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>Height: {profile.height || 'N/A'}, Weight: {profile.weight || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full rounded-lg" onClick={() => setIsEditDialogOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">No profile information</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Please sign in to view your profile.
                    </p>
                    <Button onClick={() => window.location.href = '/login'}>
                      Sign In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Actions Card */}
            {/* <Card className="border-gray-200 dark:border-gray-800 shadow-glass-sm"> */}
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Actions</CardTitle>
                <CardDescription>Manage your account and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="destructive" className="w-full rounded-lg" onClick={handleLogout} style={{ backgroundColor: "red" }}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </CardContent>
            {/* </Card> */}
          </div>
        </div>
      </main>
      

      {/* Edit Profile Dialog */}
      {profile && (
        <ProfileForm
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
          initialData={profile}
        />
      )}
    </div>
  );
};

export default Profile;
