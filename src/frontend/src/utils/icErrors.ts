/**
 * Normalizes errors from Internet Computer backend calls into user-friendly English messages.
 * Handles authorization traps, actor availability issues, and other common errors.
 */

export function normalizeICError(error: unknown): string {
  if (!error) {
    return 'An unknown error occurred. Please try again.';
  }

  const errorMessage = error instanceof Error ? error.message : String(error);

  // Actor not available or still loading
  if (errorMessage.includes('Actor not available')) {
    return 'Please wait for the app to finish loading, then try again.';
  }

  // Authorization/authentication errors
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('unauthorized')) {
    return 'You are not authorized to perform this action. Please sign in and try again.';
  }

  // Trap errors from backend
  if (errorMessage.includes('trap') || errorMessage.includes('Reject')) {
    // Extract the actual error message if possible
    const trapMatch = errorMessage.match(/trap[:\s]+(.+?)(?:\n|$)/i);
    if (trapMatch && trapMatch[1]) {
      return trapMatch[1].trim();
    }
    return 'An error occurred on the server. Please try again.';
  }

  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  // Identity/authentication errors
  if (errorMessage.includes('identity') || errorMessage.includes('authentication')) {
    return 'Authentication error. Please sign in again.';
  }

  // Default: return the original message if it's reasonably short and readable
  if (errorMessage.length < 100 && !errorMessage.includes('Error:')) {
    return errorMessage;
  }

  return 'An error occurred. Please try again.';
}
