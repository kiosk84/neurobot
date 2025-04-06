import logger from './logger';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  dataUrl?: string;
}

export const validateAndProcessImage = (
  file: File
): Promise<ImageValidationResult> => {
  return new Promise((resolve) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      logger.warn({
        event: 'invalid_file_type',
        fileType: file.type,
        fileName: file.name,
      });
      return resolve({
        isValid: false,
        error: 'Unsupported file type. Please use JPG, PNG or WebP.',
      });
    }

    if (file.size > MAX_FILE_SIZE) {
      logger.warn({
        event: 'file_too_large',
        fileSize: file.size,
        fileName: file.name,
      });
      return resolve({
        isValid: false,
        error: 'File size exceeds 5MB limit.',
      });
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      logger.info({
        event: 'image_processed',
        fileName: file.name,
        fileSize: file.size,
      });
      resolve({
        isValid: true,
        dataUrl: e.target?.result as string,
      });
    };

    reader.onerror = () => {
      logger.error({
        event: 'image_processing_error',
        fileName: file.name,
        error: reader.error,
      });
      resolve({
        isValid: false,
        error: 'Failed to process image.',
      });
    };

    reader.readAsDataURL(file);
  });
};