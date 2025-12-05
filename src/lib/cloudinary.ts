const CLOUD_NAME = 'deaixoaf0';
const UPLOAD_PRESET = 'INSTAGRAMA';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: 'image' | 'video';
  format: string;
  width: number;
  height: number;
  duration?: number;
}

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('cloud_name', CLOUD_NAME);

  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          secure_url: response.secure_url,
          public_id: response.public_id,
          resource_type: response.resource_type,
          format: response.format,
          width: response.width,
          height: response.height,
          duration: response.duration,
        });
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Upload failed')));

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);
    xhr.send(formData);
  });
};

export const getOptimizedUrl = (url: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
}) => {
  if (!url.includes('cloudinary.com')) return url;
  
  const { width, height, quality = 80, format = 'auto' } = options || {};
  const transformations = ['f_' + format, 'q_' + quality];
  
  if (width) transformations.push('w_' + width);
  if (height) transformations.push('h_' + height);
  transformations.push('c_fill');
  
  return url.replace('/upload/', `/upload/${transformations.join(',')}/`);
};
