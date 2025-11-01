import path from 'path';
import { promises as fs } from 'fs';

/**
 * Safely delete a file from the uploads directory
 */
export const deleteUploadedImage = async (imageUrl: string | null): Promise<void> => {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
    return; // Not an uploaded image or invalid URL
  }

  try {
    const filename = imageUrl.replace('/uploads/', '');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadsDir, filename);
    
    // Check if file exists before deleting
    await fs.access(filePath);
    await fs.unlink(filePath);
    console.log(`Deleted old image: ${filename}`);
  } catch (error) {
    // File might not exist or other error - log but don't fail
    console.error('Failed to delete old image:', error);
  }
};

/**
 * Check if a file exists in uploads directory
 */
export const uploadedFileExists = async (imageUrl: string | null): Promise<boolean> => {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
    return false;
  }

  try {
    const filename = imageUrl.replace('/uploads/', '');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadsDir, filename);
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};