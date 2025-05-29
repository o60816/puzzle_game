# Puzzle Game
## Description

Puzzle Game is a full-stack application built with a **NestJS** backend and a **React** frontend. It provides a platform for users to interact with puzzles, track rankings, and manage user data. The application also integrates with the **LINE Messaging API** to function as a chatbot, allowing users to interact with the system directly through LINE.

## Features

### Backend
- **NestJS Framework**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **MySQL Integration**: Database support for user and problem data.
- **RESTful API**: Endpoints for managing users, messages, and problems.
- **LINE Chatbot Integration**: Interact with the application via the LINE Messaging API.
- **Logging and Interceptors**: Custom logging and error handling.
- **Unit and E2E Testing**: Comprehensive test coverage using Jest.

### Frontend
- **React Framework**: A modern JavaScript library for building user interfaces.
- **User Management**: Components for displaying user lists and rankings.
- **Responsive Design**: Styled with CSS for a clean and user-friendly interface.

### Deployment
- **Docker Support**: Docker Compose configuration for containerized deployment.
- **Ngrok Integration**: Configuration for exposing local servers to the internet, useful for LINE webhook testing.

## LINE Chatbot Integration

The application integrates with the LINE Messaging API to provide chatbot functionality. Users can interact with the system by sending messages to the LINE bot. The bot processes user inputs and responds with relevant information or actions.

### Setting Up the LINE Bot
1. Create a LINE Developer account and set up a new Messaging API channel.
2. Obtain the **Channel Secret** and **Channel Access Token** from the LINE Developer Console.
3. Configure the webhook URL to point to your server (use Ngrok for local development).
4. Add the Channel Access Token to your `.env` file:
   ```env
   CHANNEL_ACCESS_TOKEN=your_channel_access_token
   ```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Docker and Docker Compose
- MySQL
- Ngrok (for LINE webhook testing)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd puzzle_game
   ```

2. Install dependencies for the backend:
   ```bash
   npm install
   ```

3. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up the database:
   - Import the `init.sql` file from the `mysql-dump` directory into your MySQL instance.

5. Configure environment variables:
   - Create `.env` files for both the backend and frontend with the necessary configurations.

## Running the App

### Backend
```bash
# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

### Frontend
```bash
# Navigate to the frontend directory
cd frontend

# Start the development server
npm start
```

### Docker
```bash
# Build and start the containers
docker-compose up --build
```

### Ngrok (for LINE Webhook)
```bash
# Start Ngrok to expose your local server
ngrok http 3000
```
Copy the Ngrok URL and update the webhook URL in the LINE Developer Console.

## Testing

### Backend
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend
```bash
# Run tests
npm test
```

## Project Structure

### Backend
- **src/api**: Contains modules for `users` and `messages`.
- **src/model**: Database modules and providers for `users` and `problems`.
- **src/utils**: Utility functions for logging, error handling, and token management.
- **test**: E2E test cases.

### Frontend
- **src/components**: React components for user-related features.
- **public**: Static assets like `favicon.ico` and `index.html`.

### Database
- **mysql-dump/init.sql**: SQL script for initializing the database schema.

### Configuration
- **docker-compose.yaml**: Docker Compose configuration for containerized deployment.
- **ngrok.yml**: Configuration for Ngrok.
