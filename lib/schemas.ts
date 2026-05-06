import { z } from "zod";

export const ImagePayloadSchema = z.object({
  filename: z.string().min(1, "Filename is required. Upload an image file.") ,
  mime: z.string().min(1, "MIME type is required. Use a supported image format."),
  data: z.string().min(1, "Image data is required. Choose an image to upload."),
});

export const CreateMovieSchema = z.object({
  title: z.string().min(1, "Title is required. It must be between 1 and 255 characters.").max(255, "Title must be 255 characters or fewer."),
  year: z.number().int("Year must be a whole number.").min(1800, "Year must be 1800 or later.").max(new Date().getFullYear() + 10, `Year must be no later than ${new Date().getFullYear() + 10}.`),
  genre: z.string().min(1, "Genre is required. It must be between 1 and 100 characters.").max(100, "Genre must be 100 characters or fewer."),
  rating: z.number().min(0, "Rating must be between 0 and 10.").max(10, "Rating must be between 0 and 10."),
  overview: z.string().min(10, "Overview is required. It must be between 10 and 5000 characters.").max(5000, "Overview must be 5000 characters or fewer."),
  cardImage: ImagePayloadSchema.optional(),
  detailImage: ImagePayloadSchema.optional(),
});

export const UpdateMovieSchema = CreateMovieSchema;

export const CreateReviewSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required."),
  rating: z.number().min(1, "Rating must be between 1 and 10.").max(10, "Rating must be between 1 and 10."),
  text: z.string().min(10, "Review is required. It must be between 10 and 2000 characters.").max(2000, "Review must be 2000 characters or fewer."),
  author: z.string().min(1, "Author name must be between 1 and 100 characters.").max(100, "Author name must be 100 characters or fewer.").optional(),
});

export const UpdateReviewSchema = CreateReviewSchema;

export const AuthLoginSchema = z.object({
  username: z.string().trim().min(3, "Username is required and must be at least 3 characters long.").max(50, "Username must be 50 characters or fewer."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export const AuthSignupSchema = AuthLoginSchema.extend({
  email: z.string().trim().email("Email is required and must be valid."),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long."),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});

export const AuthRecoverySchema = z.object({
  email: z.string().trim().email("Email is required and must be valid."),
});

export const PasswordResetSchema = z.object({
  token: z.string().min(1, "Reset token is required."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long."),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});

export type CreateMovieInput = z.infer<typeof CreateMovieSchema>;
export type UpdateMovieInput = z.infer<typeof UpdateMovieSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type AuthLoginInput = z.infer<typeof AuthLoginSchema>;
export type AuthSignupInput = z.infer<typeof AuthSignupSchema>;
export type AuthRecoveryInput = z.infer<typeof AuthRecoverySchema>;
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;
