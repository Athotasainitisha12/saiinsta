import { useState, useRef } from 'react';
import { X, Image, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useFeedStore, Story } from '@/stores/feedStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryUpload = ({ isOpen, onClose }: StoryUploadProps) => {
  const { user } = useAuthStore();
  const { addStory } = useFeedStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(selectedFile, setUploadProgress);
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
      
      const newStory: Story = {
        id: Date.now().toString(),
        userId: user.uid,
        username: user.username,
        userImage: user.profileImage,
        mediaUrl: result.secure_url,
        mediaType: result.resource_type as 'image' | 'video',
        createdAt: now,
        expiresAt: expiresAt,
        viewedBy: [],
      };

      addStory(newStory);
      toast.success('Story uploaded successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to upload story. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      >
        {/* Header */}
        <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-semibold text-white">Add to Story</h2>
          {preview && (
            <Button
              variant="ghost"
              onClick={handleUpload}
              disabled={uploading}
              className="text-info font-semibold"
            >
              Share
            </Button>
          )}
          {!preview && <div className="w-12" />}
        </div>

        {!preview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <div className="mb-4 rounded-full bg-white/10 p-8">
              <Camera className="h-16 w-16 text-white" strokeWidth={1} />
            </div>
            <h3 className="text-xl font-light text-white">Create a Story</h3>
            <p className="text-center text-sm text-white/60">
              Share a photo or video that disappears after 24 hours
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="story-file-input"
            />
            <Button
              variant="instagram"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex items-center gap-2"
            >
              <Image className="h-5 w-5" />
              Select from Gallery
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[9/16] h-[80vh] max-w-md overflow-hidden rounded-xl"
          >
            {selectedFile?.type.startsWith('video/') ? (
              <video
                src={preview}
                className="h-full w-full object-cover"
                controls
                autoPlay
                muted
                loop
              />
            ) : (
              <img
                src={preview}
                alt="Story preview"
                className="h-full w-full object-cover"
              />
            )}
            
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-20 w-20 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                  <p className="text-lg font-medium text-white">{uploadProgress}%</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};