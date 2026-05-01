import type { Movie } from "@/types/movie";

export const sampleMovies: Movie[] = [
  {
    id: "inception",
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi",
    rating: 9.6,
    overview:
      "A skilled thief leads a team through dream worlds to plant an idea in a target's mind.",
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "the-dark-knight",
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    rating: 9.8,
    overview:
      "Batman faces the Joker in a tense battle over the future of Gotham City.",
    posterUrl:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    genre: "Drama",
    rating: 9.4,
    overview:
      "A crew travels beyond Earth to search for a new home for humanity.",
    posterUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
  },
];