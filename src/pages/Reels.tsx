import { useState, useRef } from 'react';
import { Film, Plus, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Music2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useFeedStore, Reel } from '@/stores/feedStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Reels = () => {
  const { user } = useAuthStore();
  const { reels, addReel, likeReel, unlikeReel, saveReel, unsaveReel } = useFeedStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [caption, setCaption] = useState('');
  const [currentReelIndex, setCurrentReelIndex] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }
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
    setCaption('');
    setShowUpload(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(selectedFile, setUploadProgress);

      const newReel: Reel = {
        id: Date.now().toString(),
        userId: user.uid,
        username: user.username,
        userImage: user.profileImage,
        mediaUrl: result.secure_url,
        caption,
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        isSaved: false,
        createdAt: new Date(),
        audio: 'Original Audio',
      };

      addReel(newReel);
      toast.success('Reel uploaded successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to upload reel. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLike = (reelId: string, isLiked: boolean) => {
    if (isLiked) {
      unlikeReel(reelId);
    } else {
      likeReel(reelId);
    }
  };

  const handleSave = (reelId: string, isSaved: boolean) => {
    if (isSaved) {
      unsaveReel(reelId);
    } else {
      saveReel(reelId);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-white">Reels</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowUpload(true)}
          className="text-white hover:bg-white/10"
        >
          <Camera className="h-6 w-6" />
        </Button>
      </header>

      {/* Reels Feed */}
      {reels.length > 0 ? (
        <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
          {reels.map((reel, index) => (
            <div
              key={reel.id}
              className="relative h-screen w-full snap-start snap-always"
            >
              <video
                src={reel.mediaUrl}
                className="h-full w-full object-cover"
                loop
                autoPlay={index === currentReelIndex}
                muted
                playsInline
                onClick={(e) => {
                  const video = e.currentTarget;
                  video.paused ? video.play() : video.pause();
                }}
                onPlay={() => setCurrentReelIndex(index)}
              />

              {/* Overlay content */}
              <div className="absolute bottom-20 left-4 right-16 z-10">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={reel.userImage}
                    alt={reel.username}
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                  <span className="font-semibold text-white">{reel.username}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-white/50 bg-transparent text-white text-xs hover:bg-white/10"
                  >
                    Follow
                  </Button>
                </div>
                {reel.caption && (
                  <p className="text-sm text-white mb-2">{reel.caption}</p>
                )}
                <div className="flex items-center gap-2 text-white/80">
                  <Music2 className="h-4 w-4" />
                  <span className="text-xs">{reel.audio}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="absolute bottom-24 right-3 z-10 flex flex-col items-center gap-5">
                <button
                  onClick={() => handleLike(reel.id, reel.isLiked)}
                  className="flex flex-col items-center gap-1"
                >
                  <Heart
                    className={cn(
                      'h-7 w-7',
                      reel.isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                    )}
                  />
                  <span className="text-xs text-white">{reel.likesCount}</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                  <MessageCircle className="h-7 w-7 text-white" />
                  <span className="text-xs text-white">{reel.commentsCount}</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                  <Send className="h-7 w-7 text-white" />
                </button>
                <button
                  onClick={() => handleSave(reel.id, reel.isSaved)}
                  className="flex flex-col items-center gap-1"
                >
                  <Bookmark
                    className={cn(
                      'h-7 w-7',
                      reel.isSaved ? 'fill-white text-white' : 'text-white'
                    )}
                  />
                </button>
                <button>
                  <MoreHorizontal className="h-7 w-7 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-screen flex-col items-center justify-center px-4">
          <div className="mb-6 rounded-full bg-white/10 p-6">
            <Film className="h-16 w-16 text-white" strokeWidth={1} />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">No Reels Yet</h2>
          <p className="mb-6 text-center text-sm text-white/60">
            Be the first to share a reel! Tap the camera icon to get started.
          </p>
          <Button
            variant="instagram"
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Reel
          </Button>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          >
            {/* Header */}
            <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <h2 className="text-lg font-semibold text-white">New Reel</h2>
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
              {!preview && <div className="w-16" />}
            </div>

            {!preview ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-6"
              >
                <div className="mb-4 rounded-full bg-white/10 p-8">
                  <Film className="h-16 w-16 text-white" strokeWidth={1} />
                </div>
                <h3 className="text-xl font-light text-white">Create a Reel</h3>
                <p className="text-center text-sm text-white/60 max-w-xs">
                  Share short, entertaining videos with your followers
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="reel-file-input"
                />
                <Button
                  variant="instagram"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 flex items-center gap-2"
                >
                  <Film className="h-5 w-5" />
                  Select Video from Gallery
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 px-4 pt-16"
              >
                <div className="relative aspect-[9/16] h-[60vh] max-w-sm overflow-hidden rounded-xl">
                  <video
                    src={preview}
                    className="h-full w-full object-cover"
                    controls
                    autoPlay
                    muted
                    loop
                  />

                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-20 w-20 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                        <p className="text-lg font-medium text-white">{uploadProgress}%</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full max-w-sm">
                  <textarea
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full resize-none rounded-lg bg-white/10 p-3 text-sm text-white outline-none placeholder:text-white/50"
                    rows={3}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reels;