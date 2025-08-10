import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "689668dcb09ff1d7f1a2ff4d", 
  requiresAuth: true // Ensure authentication is required for all operations
});
