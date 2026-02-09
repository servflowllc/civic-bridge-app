import { loadStripe } from '@stripe/stripe-js';

const getEnvStr = (key: string, fallback: string) => {
    try {
        return process.env[key] || fallback;
    } catch {
        return fallback;
    }
}

// Initialize Stripe
const stripePromise = loadStripe(getEnvStr('STRIPE_PUBLIC_KEY', 'pk_test_mock_key'));

const DONATION_LINK = getEnvStr('STRIPE_DONATION_LINK', 'https://buy.stripe.com/mock_donation');
const SUBSCRIPTION_LINK = getEnvStr('STRIPE_SUBSCRIPTION_LINK', 'https://buy.stripe.com/mock_subscription');

export const handleDonation = () => {
  // Placeholder for future donation logic
  alert("Donation system coming soon. Thank you for your interest in supporting Civic Bridge!");
};

export const handleSubscription = async () => {
  // Placeholder for future subscription logic
  alert("Civic+ subscriptions are currently in development. Please join the waitlist in the Upgrade tab.");
};

// Fallback for demo purposes if keys aren't real
export const simulateProUpgrade = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve(false);
    }, 1500);
  });
};