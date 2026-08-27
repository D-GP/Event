# Next-Gen Event Management Platform (P04)

A comprehensive, fully deployed web application designed for seamless event organization, registration, QR check-in, and automated certification. Powered by Next.js and Google Gemini AI.

## Features

- **AI Event Description Generator**: Let Gemini write engaging, professional event descriptions based on titles and keywords in seconds.
- **Event Creation & Management**: Organizers can create and manage their upcoming events through a centralized dashboard.
- **Frictionless Registration**: Attendees can register quickly, receiving an automated Ticket with a secure QR code.
- **QR Code Check-In**: Organizers can scan attendee QR codes at the venue using their camera (via HTML5 QR Scanner) to instantly verify and check-in guests.
- **Automated Certificates**: Once an attendee is checked-in, they can view and download a beautifully styled PDF Certificate of Attendance.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Vanilla CSS Modules
- **Backend**: Next.js API Routes (Serverless)
- **Database**: SQLite with Prisma ORM
- **AI Integration**: Google Gemini API (`@google/generative-ai`)
- **QR & Certificates**: `qrcode`, `html5-qrcode`, `html2canvas`, `jspdf`

## Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Setup Environment Variables
Create a \`.env\` file in the root directory and add your Google Gemini API key:
\`\`\`env
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

### 3. Initialize Database
Initialize the SQLite database and Prisma client:
\`\`\`bash
npx prisma db push
npx prisma generate
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\` to view the application.

## API Documentation

- \`GET /api/events\` - Fetches all events with registration counts.
- \`POST /api/events\` - Creates a new event (requires \`title\`, \`description\`, \`date\`, \`location\`).
- \`GET /api/events/:id\` - Fetches a specific event by ID.
- \`POST /api/events/:id/register\` - Registers a user for an event (requires \`name\`, \`email\`).
- \`POST /api/events/checkin\` - Checks in an attendee (requires \`registrationId\` from QR).
- \`POST /api/generate-description\` - Generates an event description using AI (requires \`title\`, \`keywords\`).
- \`GET /api/certificates/:id\` - Fetches a registration for certificate verification.

## Architecture

See \`architecture_diagram.md\` for the Mermaid representation.
