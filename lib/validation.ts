import type { z } from "zod";

const fieldLabels: Record<string, string> = {
  title: "Title",
  year: "Year",
  genre: "Genre",
  rating: "Rating",
  overview: "Overview",
  movieId: "Movie ID",
  text: "Review",
  author: "Author name",
  filename: "Filename",
  mime: "MIME type",
  data: "Image data",
  cardImage: "Card image",
  detailImage: "Detail image",
};

function toLabel(field: string) {
  return fieldLabels[field] || field.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (character) => character.toUpperCase());
}

export function formatValidationError(error: z.ZodError): string {
  const flattened = error.flatten();
  const parts = [
    ...flattened.formErrors,
    ...Object.entries(flattened.fieldErrors).flatMap(([field, messages]) =>
      (messages ?? []).map((message) => `${toLabel(field)}: ${message}`)
    ),
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : "Validation failed";
}