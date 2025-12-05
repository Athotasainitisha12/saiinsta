import { useState, useRef } from 'react';
import { ArrowLeft, Image, X, MapPin, Hash, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useFeedStore, Post } from '@/stores/feedStore';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Create = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addPost } = useFeedStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const extractHashtags = (text: string): string[] => {
    const regex = /#(\w+)/g;
    const matches = text.match(regex);
    return matches ? matches.map((tag) => tag.slice(1).toLowerCase()) : [];
  };

  const handleShare = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(selectedFile, setUploadProgress);
      
      const newPost: Post = {
        id: Date.now().toString(),
        userId: user.uid,
        username: user.username,
        userImage: user.profileImage,
        mediaUrl: result.secure_url,
        mediaType: result.resource_type as 'image' | 'video',
        caption,
        hashtags: extractHashtags(caption),
        location: location || undefined,
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        isSaved: false,
        createdAt: new Date(),
      };

      addPost(newPost);
      toast.success('Post shared successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-divider bg-background px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">New post</h1>
        <Button
          variant="ghost"
          onClick={handleShare}
          disabled={!selectedFile || uploading}
          className="text-info font-semibold"
        >
          Share
        </Button>
      </header>

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center px-4 py-20"
          >
            <div className="mb-6 rounded-full bg-muted p-6">
              <Image className="h-12 w-12 text-muted-foreground" strokeWidth={1} />
            </div>
            <h2 className="mb-2 text-xl font-light">Drag photos and videos here</h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <Button
              variant="instagram"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              Select from computer
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col"
          >
            {/* Preview */}
            <div className="relative aspect-square bg-muted">
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="absolute right-2 top-2 bg-background/80 backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </Button>
              
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-16 w-16 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                    <p className="text-white font-medium">{uploadProgress}%</p>
                  </div>
                </div>
              )}
            </div>

            {/* Caption & Details */}
            <div className="flex flex-col divide-y divide-divider">
              <div className="px-4 py-4">
                <div className="flex items-start gap-3">
                  <img
                    src={user?.profileImage}
                    alt={user?.username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <textarea
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-0 bg-transparent p-0 focus-visible:ring-0"
                />
              </div>

              <div className="px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  <Hash className="mr-1 inline h-4 w-4" />
                  Add hashtags to your caption to reach more people
                </p>
              </div>

              <div className="px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  <AtSign className="mr-1 inline h-4 w-4" />
                  Tag people in your post
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Create;
