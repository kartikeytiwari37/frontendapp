# Voice Platform Frontend

A React.js frontend application for the Voice Platform that interacts with the voice-backend APIs.

## Features

- Make outbound calls to candidates
- Bulk upload candidates via CSV
- Bulk upload CV files (PDF and Word documents)
- View and filter bulk records
- View and filter interview records
- View interview transcripts and analysis
- Download transcripts and analysis as text files
- Auto-trigger calls to pending candidates

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Voice Backend API running

## Installation

1. Clone the repository
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Configure environment variables:

Create or edit the `.env` file in the frontend directory:

```
REACT_APP_API_BASE_URL=http://localhost:3000
```

Replace the URL with the actual URL of your voice-backend API.

## Usage

### Starting the development server

```bash
npm start
```

This will start the development server at http://localhost:3000.

### Building for production

```bash
npm run build
```

This will create a production-ready build in the `build` directory.

## Project Structure

- `src/components`: React components
- `src/pages`: Page components
- `src/services`: API services
- `src/utils`: Utility functions

## API Integration

The frontend integrates with the following voice-backend APIs:

- Call Management APIs
  - GET `/api/numbers`: Get available phone numbers
  - POST `/api/call`: Initiate a call
  - POST `/api/end-call`: End a call
  - GET `/api/transcript/:callSid`: Get transcript for a call
  - GET `/api/analysis/:callSid`: Get analysis for a call
  - GET `/api/download/:callSid`: Download transcript or analysis
  - POST `/api/auto-trigger-call`: Auto-trigger a call to a pending candidate

- Candidate Management APIs
  - POST `/api/cv/bulk-upload`: Upload multiple CV files
  - POST `/api/candidates/bulk-upload`: Upload candidates via CSV
  - GET `/api/bulk-records/search`: Search bulk records
  - GET `/api/candidateInterviews/search`: Search interview records
  - GET `/api/candidates/bulk-records/:id`: Get a specific bulk record

## Pages

- Home: Dashboard with links to all features
- Make Call: Form to initiate a call to a candidate
- Bulk Upload: Upload candidates via CSV or CV files
- Bulk Records: View and filter bulk records
- Interviews: View and filter interview records
- Bulk Record Detail: View details of a specific bulk record
- Interview Detail: View transcript and analysis for a specific interview
