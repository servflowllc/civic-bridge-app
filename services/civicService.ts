import { Representative } from '../types';

// DATA SOURCES:
// We use Open Data from the UnitedStates GitHub organization.
// This replaces the need for the Google Civic Information API for federal data.
// We try these URLs in order. If one fails (CORS or Network), we try the next.
const DATA_URLS = [
    // 1. GitHub Pages (Usually very reliable and CORS friendly)
    'https://unitedstates.github.io/congress-legislators/legislators-current.json',
    // 2. Raw GitHub Content (Standard fallback)
    'https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-current.json',
    // 3. jsDelivr CDN (Fastest, but sometimes strict on caching)
    'https://cdn.jsdelivr.net/gh/unitedstates/congress-legislators@main/legislators-current.json'
];

export const fetchRepresentatives = async (address: string): Promise<Representative[]> => {
    try {
        console.log("[DEBUG] Civic Service: Starting lookup via Open Data...");

        // 1. Extract State from Address
        const stateAbbr = getStateFromAddress(address);

        if (!stateAbbr) {
            console.warn("[DEBUG] Could not detect state from address string. Returning empty array.");
            return [];
        }

        console.log(`[DEBUG] Detected State: ${stateAbbr}. Fetching Federal Data...`);

        // 2. Fetch data with Fallback Logic
        let allLegislators = null;
        let lastError = null;

        for (const url of DATA_URLS) {
            try {
                console.log(`[DEBUG] Attempting fetch from: ${url}`);
                const response = await fetch(url);
                if (response.ok) {
                    allLegislators = await response.json();
                    console.log(`[DEBUG] Successfully fetched data from: ${url}`);
                    break; // Success, stop trying other URLs
                } else {
                    console.warn(`[DEBUG] Fetch failed for ${url}: ${response.status}`);
                }
            } catch (e) {
                console.warn(`[DEBUG] Network error for ${url}:`, e);
                lastError = e;
            }
        }

        if (!allLegislators) {
            console.error("All data sources failed. Returning empty array.");
            return [];
        }

        // 3. Filter for the user's state
        const stateLegs = allLegislators.filter((leg: any) => {
            const terms = leg.terms;
            if (!terms || terms.length === 0) return false;
            const lastTerm = terms[terms.length - 1];
            return lastTerm.state === stateAbbr;
        });

        if (stateLegs.length === 0) {
            console.warn(`[DEBUG] No legislators found for state ${stateAbbr} in dataset.`);
            return [];
        }

        // 4. Separate Senators and Representatives
        const senators = stateLegs.filter((leg: any) => leg.terms[leg.terms.length - 1].type === 'sen');
        const houseReps = stateLegs.filter((leg: any) => leg.terms[leg.terms.length - 1].type === 'rep');

        const displayReps: Representative[] = [];

        // Add Senators
        senators.forEach((leg: any, index: number) => {
            displayReps.push(mapToRepresentative(leg, index));
        });

        // Add 1 House Rep (Approximation based on address hash)
        if (houseReps.length > 0) {
            const index = address.length % houseReps.length;
            const assignedRep = houseReps[index];
            displayReps.push(mapToRepresentative(assignedRep, 99));
        }

        if (displayReps.length === 0) {
            return [];
        }

        return displayReps;

    } catch (error) {
        console.error("[DEBUG] Civic Service Critical Failure:", error);
        return [];
    }
};

// --- Helpers ---

const mapToRepresentative = (leg: any, index: number): Representative => {
    const term = leg.terms[leg.terms.length - 1];
    const role = term.type === 'sen' ? 'U.S. Senator' : 'U.S. Representative';

    // Improved Party Detection
    let party: Representative['party'] = 'Independent';
    const rawParty = term.party ? term.party.toLowerCase() : '';

    if (rawParty.includes('democrat')) {
        party = 'Democrat';
    } else if (rawParty.includes('republican')) {
        party = 'Republican';
    }

    // BioGuide ID for images
    const bioguideId = leg.id.bioguide;
    const imageUrl = `https://theunitedstates.io/images/congress/225x275/${bioguideId}.jpg`;

    const name = `${leg.name.first} ${leg.name.last}`;

    return {
        id: `fed_${bioguideId}`,
        name: name,
        role: role,
        level: 'Federal',
        party: party,
        imageUrl: imageUrl,
        lastContacted: null,
        lifetimeContactCount: 0,
        contactUrl: term.url || `https://www.congress.gov/member/${bioguideId}`,
        mailingAddress: term.address || `Washington, DC Office`
    };
};

const US_STATES = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"];

const getStateFromAddress = (address: string): string | null => {
    const upperAddr = address.toUpperCase();

    // Strategy 1: Look for State Code immediately preceding a Zip Code (5 digits)
    const zipMatch = upperAddr.match(/\b([A-Z]{2})\s+\d{5}/);
    if (zipMatch) {
        const potentialState = zipMatch[1];
        if (US_STATES.includes(potentialState)) {
            return potentialState;
        }
    }

    // Strategy 2: Look for State Code followed by comma, space, or end of line
    let foundState = null;
    let lastIndex = -1;

    for (const state of US_STATES) {
        const regex = new RegExp(`\\b${state}\\b`, 'g');
        let match;
        while ((match = regex.exec(upperAddr)) !== null) {
            if (match.index > lastIndex) {
                lastIndex = match.index;
                foundState = state;
            }
        }
    }

    return foundState;
};