# Cine Ratings

A full-stack movie rating and review application built with Next.js, TypeScript, and MongoDB. It features a comprehensive user authentication system with distinct roles for regular users and an administrator.

## Features

- **Dual Authentication System**: Separate login flows for regular users and a single administrator.
- **Role-Based Access Control**:
  - **Admin**: Can create, view, update, and delete movies from a dedicated admin panel.
  - **User**: Can sign up, log in, view movies, and add/edit/delete their own reviews.
- **Movie Management**: Admins can manage the movie catalog, including titles, genres, posters, and other details.
- **Review System**: Authenticated users can post, edit, and delete their own ratings and reviews for movies.
- **API Endpoints**: A complete set of RESTful API endpoints for managing movies, users, and reviews.
- **Responsive Design**: A clean, modern UI built with Tailwind CSS that works on all devices.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using the native MongoDB driver)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: Custom session-based authentication using signed `httpOnly` cookies.

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- Node.js (v18 or later)
- npm
- A MongoDB database (local or a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd cine-ratings
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

1.  **Create an environment file:**
    Create a file named `.env.local` in the root of the project.

2.  **Add environment variables:**
    Copy the following variables into your `.env.local` file and replace the placeholder values with your own.

    ```env
    # MongoDB
    MONGODB_URI="your_mongodb_connection_string"

    # Admin Credentials
    ADMIN_USERNAME="admin"
    ADMIN_PASSWORD="admin@123"
    ```

    - `MONGODB_URI`: Your full MongoDB connection string.
    - `ADMIN_USERNAME` & `ADMIN_PASSWORD`: The credentials for the built-in administrator account.

### Running the Application

Execute the following command to start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Authentication and Roles

The application has two distinct user roles: **User** and **Admin**.

### Admin

- **Username**: `admin` (or as set in `.env.local`)
- **Password**: `admin@123` (or as set in `.env.local`)

The admin logs in through the "Admin Login" toggle on the login page. After authenticating, the admin is redirected to the `/admin` dashboard, where they can manage the entire movie catalog.

### User

Regular users can create an account via the signup page. Once logged in, they can:
- View the list of all movies on the homepage.
- View detailed information for each movie.
- Add, edit, or delete their own reviews on movie pages.

Users cannot access the `/admin` panel.

## API Endpoints

The application exposes several API routes for data management:

- `POST /api/auth/signup`: Creates a new user.
- `POST /api/auth/login`: Authenticates a user or admin and creates a session.
- `POST /api/auth/logout`: Clears the user session.
- `GET /api/auth/check`: Checks if a user is currently authenticated.

- `GET, POST /api/movies`: Get all movies or create a new movie (Admin only).
- `GET, PUT, DELETE /api/movies/[id]`: Get, update, or delete a specific movie (Admin only for PUT/DELETE).

- `GET, POST /api/reviews`: Get all reviews or create a new review.
- `PUT, DELETE /api/reviews/[id]`: Update or delete a specific review (author only).

