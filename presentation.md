# Next-Gen Event Management Platform
*Final Presentation*

---

## Slide 1: The Problem
Event management is fragmented. Organizers struggle with writer's block when creating event pages, checking in attendees is slow, and issuing certificates manually is time-consuming.

---

## Slide 2: The Solution
A unified, AI-powered Event Management Platform that handles:
- **Event Creation**: With AI-generated descriptions.
- **Registration**: Frictionless signup for attendees.
- **Check-in**: Instant QR code scanning at the door.
- **Certificates**: Automated, customized PDF generation.

---

## Slide 3: Core Technologies
- **Frontend**: Next.js 15 App Router, React
- **Design System**: Premium Vanilla CSS (Glassmorphism, Micro-animations)
- **Backend/DB**: Next.js Serverless APIs + Prisma ORM
- **AI Integration**: Google Gemini API for intelligent copywriting
- **Utilities**: HTML5 QR Code Scanner, QRCode Gen, jsPDF/HTML2Canvas

---

## Slide 4: AI Event Description Generator
- Uses **Google Gemini 1.5 Flash**.
- Organizers provide a Title and optional Keywords.
- AI generates a compelling, structured 2-3 paragraph description, significantly reducing time-to-publish.

---

## Slide 5: The Registration & Check-in Flow
1. **Attendee Registers**: Instantly receives a unique QR Ticket on their screen.
2. **Organizer Scans**: Using the built-in HTML5 camera scanner in the dashboard.
3. **Database Updates**: Attendee is marked as `checkedIn: true`.

---

## Slide 6: Automated Certificate Generation
- Post check-in, attendees can download their certificate.
- The platform uses `html2canvas` to capture a beautifully styled DOM element and `jspdf` to convert it to a landscape PDF.
- Prevents unverified attendees from downloading certificates.

---

## Slide 7: Live Demonstration
[Link to local deployment: `http://localhost:3000`]
- We will demonstrate creating an event, registering, scanning the QR code, and downloading the certificate.

---

## Slide 8: Future Enhancements
- Email integration for ticket delivery.
- Payment gateway (Stripe) for paid events.
- Advanced AI integrations (e.g., AI schedule generator, AI chat assistant for attendees).
