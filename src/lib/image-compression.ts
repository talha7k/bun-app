// Client-side image compression utility

// Check WebP support
const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  TARGET_SIZE: 300 * 1024, // 300KB (more aggressive)
  MAX_WIDTH: 1200,
  MAX_HEIGHT: 800,
  QUALITY: 0.8, // Slightly lower for better compression
  FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  OUTPUT_FORMAT: 'image/webp' // Convert to WebP for better compression
};

// Initialize WebP support
let webPSupported = false;
checkWebPSupport().then(supported => {
  webPSupported = supported;
  if (!supported) {
    (IMAGE_CONFIG as any).OUTPUT_FORMAT = 'image/jpeg'; // Fallback to JPEG
  }
});

/**
 * Validate image file before processing
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!IMAGE_CONFIG.FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed formats: ${IMAGE_CONFIG.FORMATS.map(f => f.replace('image/', '')).join(', ')}`
    };
  }

  // Check file size
  if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${IMAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  return { valid: true };
};

/**
 * Compress image using canvas API
 */
export const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > IMAGE_CONFIG.MAX_WIDTH || height > IMAGE_CONFIG.MAX_HEIGHT) {
          if (width > height) {
            width = IMAGE_CONFIG.MAX_WIDTH;
            height = Math.round(IMAGE_CONFIG.MAX_WIDTH / aspectRatio);
          } else {
            height = IMAGE_CONFIG.MAX_HEIGHT;
            width = Math.round(IMAGE_CONFIG.MAX_HEIGHT * aspectRatio);
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);

        // Try different quality levels to achieve target size
        const compressAtQuality = (quality: number): Promise<Blob> => {
          return new Promise((resolve) => {
            canvas.toBlob(
              (blob) => resolve(blob!),
              IMAGE_CONFIG.OUTPUT_FORMAT, // Always use WebP for better compression
              quality
            );
          });
        };

        const attemptCompression = async (quality: number): Promise<File> => {
          const blob = await compressAtQuality(quality);
          
          if (blob.size <= IMAGE_CONFIG.TARGET_SIZE || quality <= 0.2) {
            // Generate unique filename with WebP extension
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 8);
            const baseName = file.name.replace(/\.[^/.]+$/, ''); // Remove original extension
            const filename = `${baseName}_${timestamp}_${random}.webp`;
            
            return new File([blob], filename, { type: IMAGE_CONFIG.OUTPUT_FORMAT });
          }

          // Try lower quality if still too large (more aggressive)
          return attemptCompression(Math.max(0.2, quality - 0.08));
        };

        attemptCompression(IMAGE_CONFIG.QUALITY)
          .then(resolve)
          .catch(reject);

      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Process image file with validation and compression
 */
export const processImageFile = async (file: File): Promise<{ file: File; originalSize: number; compressedSize: number; compressionRatio: number }> => {
  // Validate first
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const originalSize = file.size;
  
  // If file is already small enough, return as-is
  if (originalSize <= IMAGE_CONFIG.TARGET_SIZE) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0
    };
  }

  // Compress image
  const compressedFile = await compressImage(file);
  const compressionRatio = ((originalSize - compressedFile.size) / originalSize) * 100;

  return {
    file: compressedFile,
    originalSize,
    compressedSize: compressedFile.size,
    compressionRatio: Math.round(compressionRatio * 100) / 100
  };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};