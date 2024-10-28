// RootNavigation.js
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Navigate to a specific screen
 * @param {string} name - The name of the screen to navigate to
 * @param {object} params - The parameters to pass to the screen
 */
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.warn('Navigation is not ready');
  }
}