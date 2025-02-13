# OG Image Generator

A monorepo project for generating Open Graph images using Vercel's OG library. The project consists of a React frontend with Monaco editor for HTML template editing and a Node.js backend for image generation.

## Project Structure

```
.
├── frontend/         # React frontend application
├── backend/         # Express backend server
└── package.json     # Root package.json for workspace management
```

## Prerequisites

- Node.js (v16 or later)
- Yarn package manager

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development servers:
   ```bash
   # Start both frontend and backend
   yarn dev

   # Or start them separately:
   yarn frontend  # Starts frontend on port 5173
   yarn backend   # Starts backend on port 3000
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Use the Monaco editor to write your HTML template
3. Click "Generate Image" to create an OG image
4. The generated image will appear in the preview panel

## Features

- Live HTML template editing with Monaco Editor
- Real-time image preview
- Vercel OG image generation
- TypeScript support
- Modern UI with Tailwind CSS

## License

MIT
