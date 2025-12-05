import { useState, useRef } from 'react';
import { ArrowLeft, Moon, Sun, Monitor, Palette, User, Check, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore, ThemeMode, ThemeAccent } from '@/stores/themeStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { uploadToCloudinary } from '@/lib/cloudinary';

const themeModes: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

const themeAccents: { id: ThemeAccent; label: string; color: string }[] = [
  { id: 'default', label: 'Default', color: 'bg-foreground' },
  { id: 'purple', label: 'Purple', color: 'bg-[hsl(270,70%,55%)]' },
  { id: 'blue', label: 'Ocean', color: 'bg-[hsl(210,90%,55%)]' },
  { id: 'coral', label: 'Coral', color: 'bg-[hsl(16,85%,60%)]' },
  { id: 'green', label: 'Forest', color: 'bg-[hsl(150,60%,45%)]' },
];

const Settings = () => {
  const { user, setUser } = useAuthStore();
  const { mode, accent, setMode, setAccent } = useThemeStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'theme'>('profile');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    setUploadingPhoto(true);
    try {
      const result = await uploadToCloudinary(file);
      
      // Update in Firebase
      await updateDoc(doc(db, 'users', user.uid), {
        profileImage: result.secure_url,
      });
      
      // Update local state
      setProfileImage(result.secure_url);
      setUser({
        ...user,
        profileImage: result.secure_url,
      });
      
      toast.success('Profile photo updated!');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        fullName,
        username: username.toLowerCase(),
        bio,
        profileImage,
      });
      
      setUser({
        ...user,
        fullName,
        username: username.toLowerCase(),
        bio,
        profileImage,
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-border bg-background px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
            activeTab === 'profile' 
              ? 'border-b-2 border-foreground text-foreground' 
              : 'text-muted-foreground'
          )}
        >
          <User className="h-4 w-4" />
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
            activeTab === 'theme' 
              ? 'border-b-2 border-foreground text-foreground' 
              : 'text-muted-foreground'
          )}
        >
          <Palette className="h-4 w-4" />
          Appearance
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'profile' ? (
          <div className="mx-auto max-w-md space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <img
                  src={profileImage || user.profileImage}
                  alt={user.username}
                  className="h-24 w-24 rounded-full object-cover"
                />
                {uploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="text-sm font-semibold text-primary"
              >
                {uploadingPhoto ? 'Uploading...' : 'Change profile photo'}
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short bio..."
                  rows={3}
                />
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        ) : (
          <div className="mx-auto max-w-md space-y-8">
            {/* Theme Mode */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Theme Mode
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {themeModes.map((themeMode) => (
                  <button
                    key={themeMode.id}
                    onClick={() => setMode(themeMode.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                      mode === themeMode.id
                        ? 'border-foreground bg-accent'
                        : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <themeMode.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{themeMode.label}</span>
                    {mode === themeMode.id && (
                      <Check className="h-4 w-4 text-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Accent Color
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {themeAccents.map((themeAccent) => (
                  <button
                    key={themeAccent.id}
                    onClick={() => setAccent(themeAccent.id)}
                    className={cn(
                      'group relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all',
                      accent === themeAccent.id
                        ? 'border-foreground'
                        : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <div className={cn('h-8 w-8 rounded-full', themeAccent.color)} />
                    <span className="text-xs font-medium">{themeAccent.label}</span>
                    {accent === themeAccent.id && (
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                        <Check className="h-3 w-3 text-background" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Preview
              </h3>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent" />
                  <div className="flex-1">
                    <div className="h-3 w-24 rounded bg-foreground/80" />
                    <div className="mt-2 h-2 w-16 rounded bg-muted-foreground/50" />
                  </div>
                  <Button size="sm">Follow</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
