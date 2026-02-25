// Cloudinary Configuration from .env
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
export const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;

// Backend URLs
export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// Static Data for Create Class View (Image 24 & 25 logic)
export const SUBJECTS = [
  { id: 1, name: "Mathematics", code: "MATH" },
  { id: 2, name: "English", code: "ENG" },
  { id: 3, name: "Science", code: "SCI" },
  { id: 4, name: "History", code: "HIS" }
];

export const TEACHERS = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alex Johnson" }
];

// File Upload Constraints (Image 28)
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp"
];