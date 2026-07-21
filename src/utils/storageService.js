import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Uploads a file to Firebase Storage.
 * @param {File} file - The file to upload.
 * @param {string} folder - The destination folder path.
 * @param {function} onProgress - Callback for upload progress (0-100).
 * @returns {Promise<string>} - Resolves with the download URL.
 */
export const uploadFile = (file, folder = 'uploads', onProgress) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `${folder}/${timestamp}_${safeName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error('Storage upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          console.error('Error getting download URL:', error);
          reject(error);
        }
      }
    );
  });
};

/**
 * Deletes a file from Firebase Storage given its download URL.
 * @param {string} fileUrl - The public download URL of the file.
 * @returns {Promise<void>}
 */
export const deleteFileByUrl = async (fileUrl) => {
  if (!fileUrl || !fileUrl.includes('firebasestorage.googleapis.com')) return;
  
  try {
    // Extract the path from the download URL
    const encodedPath = fileUrl.split('/o/')[1].split('?alt=media')[0];
    const decodedPath = decodeURIComponent(encodedPath);
    const fileRef = ref(storage, decodedPath);
    
    await deleteObject(fileRef);
    console.log(`Successfully deleted orphaned file: ${decodedPath}`);
  } catch (error) {
    console.error('Error deleting file:', error);
    // We don't throw here to prevent disrupting the main user flow if cleanup fails
  }
};
