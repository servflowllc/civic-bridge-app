# Civic Bridge

**A Bridge Between You and Your Representative.**

Civic Bridge is a non-partisan platform designed to help citizens understand their government and effectively make their voice heard. It combines civic discovery with education, leveraging artificial intelligence to help users articulate their lived reality to those in power.

<div align="center">
<img width="1200" height="475" alt="Civic Bridge Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Features

- **🏛️ Representative Lookup**  
  Instantly identify your Local, State, and Federal officials using your address. We use a combination of Google Places for location and Open Data for legislative matching.

- **👁️ Visual Evidence Analysis**  
  **New!** Upload photos or documents (e.g., potholes, bills, notices). Our multi-modal "Civic Strategist" analyzes the visual evidence to extract key details and incorporates them into your case.

- **🤖 AI-Powered Drafting Assistant**  
  Our "Civic Strategist" (powered by **Google Gemini**) interviews you to understand your specific issue and drafts professional, constitutionally grounded advocacy letters on your behalf.

- **📄 Custom PDF Generation (with Exhibits)**  
  Download formal, printable letters with official "Civic Bridge" branding. Automatically appends your uploaded evidence as a professional "Exhibit A" page, perfectly scaled for printing.

- **📚 Education Hub**  
  Interactive guides and resources to help you understand the legislative process and how to be an effective advocate.

- **👤 Guest Mode & User Accounts**  
  Start identifying reps and drafting letters immediately as a Guest, or sign up to save your history and settings.

## How It Works

1.  **Locate**: Enter your address to find your specific elected officials.
2.  **Discover**: Chat with the AI Strategist. Describe your issue or upload a photo of the problem.
3.  **Draft**: The AI synthesizes your interview into a formal legislative letter.
4.  **Action**: Download the official PDF (with your evidence attached) to mail, or copy the text for their web contact form.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Google Gemini](https://ai.google.dev/) (via `@google/genai`)
- **Maps & Location**: Google Maps JavaScript API (New `PlaceAutocompleteElement`)
- **PDF Generation**: `jspdf`
- **Icons**: `lucide-react`

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Google Cloud Project with **Gemini API** enabled.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/civic-bridge.git
   cd civic-bridge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (or rename `.env.example` if available) and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   > **Note:** The Google Maps API Key is currently loaded via script in `index.html`. For production or personal use, you should verify this key or replace it with your own restrictions.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

- **`/components`**: UI components organized by feature.
  - `/landing`: Home page and address search.
  - `/dashboard`: Representative list and selection.
  - `/portal`: The core Drafting Portal (Chat + Letter Preview).
  - `/education`: Education Hub views.
  - `/common`: Reusable components (Header, Footer, Sidebar).
- **`/services`**: API integrations.
  - `civicService.ts`: Logic for fetching and filtering representatives.
  - `geminiService.ts`: Google Gemini AI integration for chat and drafting.
- **`/types`**: core TypeScript definitions (`Representative`, `UserProfile`, `ChatMessage`).

## Acknowledgements

- **[@unitedstates](https://github.com/unitedstates)**: For maintaining the comprehensive, public-domain database of Congress legislators that powers this app.
- **[Lucide](https://lucide.dev/)**: For the beautiful, consistent icon set.

## License

This project is licensed under the MIT License.
