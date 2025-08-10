/**
 * Vercel Blob helpers for file uploads (invoices, payment proofs)
 */

import { put, del } from "@vercel/blob";

/**
 * Upload file to Vercel Blob storage
 * @param filename - Name of the file
 * @param file - File data (Buffer, Blob, or ReadableStream)
 * @param options - Upload options
 * @returns Upload result with URL
 */
export async function uploadFile(
  filename: string,
  file: Buffer | Blob | ReadableStream,
  options?: {
    access?: "public"; // Vercel Blob currently supports public during direct put
    addRandomSuffix?: boolean;
  }
) {
  try {
    const blob = await put(filename, file, {
      access: options?.access ?? "public",
      addRandomSuffix: options?.addRandomSuffix ?? true,
    });
    
    return { success: true, url: blob.url };
  } catch (error) {
    console.error("File upload error:", error);
    return { success: false, error: "Upload failed" };
  }
}

/**
 * Delete file from Vercel Blob storage
 * @param url - Blob URL to delete
 * @returns Deletion result
 */
export async function deleteFile(url: string) {
  try {
    await del(url);
    return { success: true };
  } catch (error) {
    console.error("File deletion error:", error);
    return { success: false, error: "Deletion failed" };
  }
}

/**
 * Generate signed URL for secure file uploads
 * @param filename - Target filename
 * @param options - Upload options
 * @returns Signed URL for direct upload
 */
export function getSignedUploadUrl(
  filename: string,
  _options?: {
    access?: "public" | "private";
    addRandomSuffix?: boolean;
  }
) {
  // Note: Vercel Blob doesn't have signed URLs like AWS S3
  // This would be implemented with a custom upload endpoint
  // For now, we'll use direct uploads through our API
  return `/api/upload?filename=${encodeURIComponent(filename)}`;
}

/**
 * Validate file type and size
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSize - Maximum file size in bytes (default: 5MB)
 * @returns Validation result
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/webp"],
  maxSize: number = 5 * 1024 * 1024 // 5MB
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size ${Math.round(file.size / 1024 / 1024)}MB exceeds maximum ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }
  
  return { valid: true };
}
