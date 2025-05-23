# MyPolls

MyPolls is a full-stack web application designed to simplify the process of creating and participating in polls. This project was developed as part of a full-stack web development course and showcases skills in frontend and backend development, API integration, and database management.

## Features
- **User Authentication**: Secure sign-in and session management using JWT.
- **Poll Creation**: Users can create polls with multiple options and post them to a dashboard.
- **Voting**: Authenticated users can vote on polls and see real-time updates.
- **Dashboard**: View a list of recent polls and their results.
- **Error Handling**: Displays user-friendly error messages for various scenarios.

## Technology Stack
- **Frontend**: [Next.js](https://nextjs.org), TypeScript, CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: [Vercel](https://vercel.com)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/KirkA94/FINALPROJECT.git
   cd FINALPROJECT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory and add the following:
     ```
     DATABASE_URL=your_postgresql_database_url
     JWT_ACCESS_TOKEN_SECRET=your_jwt_secret
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints
1. **User Management**:
   - **POST /api/users**: Create a new user.
   - **GET /api/users/:id**: Fetch user details.

2. **Polls**:
   - **POST /api/polls**: Create a new poll.
   - **GET /api/polls**: Fetch all polls.
   - **POST /api/polls/:id/vote**: Submit a vote for a poll.

3. **Authentication**:
   - **POST /api/auth/refresh**: Refresh the access token.

## Deployment
The app is fully optimized for deployment on Vercel. Ensure all environment variables are set up in the Vercel dashboard.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## About the Developer
This project was developed by Kirk Austin as a final assignment for a full-stack web development course. It reflects best practices in modern web development and aims to deliver a smooth and engaging user experience.