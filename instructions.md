
# Civic Bridge: Live Guest MVP Deployment Plan

## 1. Project Status & Goal
**Current State:** "Guest Mode Live MVP"
**Goal:** Activate the application for non-logged-in users (Guests) using real Google APIs for AI and Maps, while using Open Data for civic information. Logged-in features (Auth, Persistence, Stripe) remain disabled/mocked, redirecting to the "Civic+ Coming Soon" page.

---

## 2. API Architecture (The "Live" Stack)

### A. Civic Information (Open Data)
*   **Purpose:** Fetch elected officials based on the user's address.
*   **Status:** Logic exists in `civicService.ts` using GitHub Open Data.

### B. Google Gemini API (AI Studio)
*   **Purpose:** Power the "Civic Strategist" chat and draft generation.
*   **Updates Needed:** 
    *   Enable **Google Search Grounding** (already in code).
    *   Enable **Google Maps Grounding** (already in code).

### C. Google Maps Places API (New)
*   **Purpose:** Address Autocomplete on the Landing Page.
*   **Why:** The legacy Autocomplete widget is deprecated for new customers. We must use the **Places API (New)** and the `PlaceAutocompleteElement` web component.
*   **ACTIVATION STEP:** You must go to Google Cloud Console > APIs & Services > Library and enable **"Places API (New)"**.

---

## 3. Action Items

### Phase 1: Credentials (User Task)
You need to generate the following keys. Since you are deploying for testing, you can restrict them to your domain later.

1.  **Gemini API Key:**
    *   Go to [Google AI Studio](https://aistudio.google.com/).
    *   Create an API Key.
    *   **Env Variable:** `REACT_APP_GEMINI_API_KEY` (or `process.env.API_KEY` depending on build tool).

2.  **Google Cloud API Key (Maps):**
    *   Go to [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a Project.
    *   **Enable APIs:**
        *   Google Maps JavaScript API.
        *   **Places API (New)** (Crucial: Search for "New").
    *   Create Credentials -> API Key.

---

### Phase 2: Developer Implementation Steps

#### Step 1: Upgrade Gemini Service (Maps Grounding)
*   **File:** `services/geminiService.ts`
*   **Task:** Update `generateCivicResponse` config.
*   **Change:** Add `googleMaps` to the `tools` array.
*   **Logic:** Pass the user's `guestAddress` into the `toolConfig` so the AI knows "where" the user is located when querying Maps.

#### Step 2: Implement Address Autocomplete (UPDATED)
*   **Files:** `components/landing/LandingPage.tsx`, `components/onboarding/AddressInput.tsx`
*   **Task:** Replace legacy `Autocomplete` with `<gmp-place-autocomplete>`.
*   **Logic:** 
    *   Load the Google Maps script with `v=weekly`.
    *   Use the Custom Element logic to capture the `gmp-places-select` event.
    *   Extract the formatted address.

#### Step 3: Wire `App.tsx` for Guest Mode
*   **File:** `App.tsx`
*   **Task:**
    *   Remove `MOCK_REPRESENTATIVES` fallback in `handleFetchReps` (or keep as error fallback only).
    *   Ensure `handleStartGuest` passes the *real* address from Phase 2 to `fetchRepresentatives`.
    *   Ensure `DraftingPortal` receives the `guestAddress` prop to pass to Gemini for grounding.
