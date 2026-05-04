import { z } from "zod";

export const ImagePayloadSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  mime: z.string().min(1, "MIME type is required"),
  data: z.string().min(1, "Image data is required"),
});

export const CreateMovieSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  year: z.number().int().min(1800, "Year must be 1800 or later").max(new Date().getFullYear() + 10, "Year cannot be in the far future"),
  genre: z.string().min(1, "Genre is required").max(100, "Genre must be less than 100 characters"),
  rating: z.number().min(0, "Rating must be at least 0").max(10, "Rating must be at most 10"),
  overview: z.string().min(10, "Overview must be at least 10 characters").max(5000, "Overview must be less than 5000 characters"),
  cardImage: ImagePayloadSchema.optional(),
  detailImage: ImagePayloadSchema.optional(),
});

export const UpdateMovieSchema = CreateMovieSchema;

export const CreateReviewSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
  text: z.string().min(10, "Review must be at least 10 characters").max(2000, "Review must be less than 2000 characters"),
  author: z.string().min(1, "Author name is required").max(100, "Author name must be less than 100 characters").optional(),
});

export type CreateMovieInput = z.infer<typeof CreateMovieSchema>;
export type UpdateMovieInput = z.infer<typeof UpdateMovieSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
