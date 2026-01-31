// Simple script to clear localStorage for testing
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  console.log('Cleared localStorage');
} else {
  console.log('localStorage not available');
}