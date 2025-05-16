
# Deployment Assignment

This is a simple web application created for the deployment assignment. It consists of a backend API endpoint that accepts POST requests with data, and a frontend that displays the most recent data received by the backend.

## Project Structure

```
project/
├── src/
│   ├── backend/         # Express.js backend server
│   ├── pages/           # React frontend pages
│   └── ...
└── ...
```

## Requirements

- Node.js (v16 or higher)
- npm or yarn

## Development Setup

1. Install dependencies:

```bash
# Install backend dependencies
cd src/backend
npm install

# Install frontend dependencies
cd ../..
npm install
```

2. Create a `.env` file in the root directory with:

```
VITE_API_URL=http://localhost:3001
```

3. Start the development servers:

```bash
# Start backend server
cd src/backend
npm run dev

# In a separate terminal, start frontend
cd ../..
npm run dev
```

## API Endpoint

The backend provides the following API endpoint:

- **POST /api/create-answer**
  - Accepts JSON body in the format: `{ "data": "some-text-here" }`
  - Stores the received data for later retrieval

- **GET /api/answer**
  - Returns the most recently stored data

## Frontend Pages

- **/** - Main page with info about the project
- **/answer** - Simple page that displays the most recent data received by the backend in a `<span id="answer">` element

## Deployment

To deploy this application to AWS EC2:

1. Launch an EC2 instance and connect to it
2. Clone this repository
3. Install Node.js on your EC2 instance
4. Install dependencies for both frontend and backend
5. Build the frontend with `npm run build`
6. Update the `.env` file with your EC2 instance's public IP
7. Start the backend server with PM2: `pm2 start src/backend/server.js`

For detailed deployment instructions, see the [AWS Deployment Guide](aws-deployment-guide.md).
