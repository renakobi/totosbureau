// Simple profanity filter for community comments
// In a real application, you'd want a more comprehensive solution

const inappropriateWords = [
  // Basic profanity
  'damn', 'hell', 'crap', 'stupid', 'idiot', 'moron',
  // Actual profanity words
  'shit', 'fuck', 'bitch', 'ass', 'asshole', 'bastard',
  'hate', 'kill', 'die', 'death', 'murder',
  // Spam indicators
  'buy now', 'click here', 'free money', 'win big',
  // All caps spam
  'spam', 'advertise', 'promote'
];

export const containsInappropriateContent = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  
  // Check for inappropriate words using word boundaries
  for (const word of inappropriateWords) {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      return true;
    }
  }
  
  // Check for excessive caps (spam indicator) - more lenient
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.9 && text.length > 15) {
    return true;
  }
  
  // Check for excessive repetition - more lenient
  const words = text.toLowerCase().split(/\s+/);
  const wordCounts: { [key: string]: number } = {};
  for (const word of words) {
    if (word.length > 4) { // Only check words longer than 4 characters
      wordCounts[word] = (wordCounts[word] || 0) + 1;
      if (wordCounts[word] > 5) { // Allow more repetition
        return true;
      }
    }
  }
  
  // Check for excessive special characters - more lenient
  const specialCharRatio = (text.match(/[!@#$%^&*()_+={}[\]|\\:";'<>?,./]/g) || []).length / text.length;
  if (specialCharRatio > 0.5) { // More lenient
    return true;
  }
  
  return false;
};

export const getFilteredMessage = (text: string): string => {
  let filteredText = text;
  
  // Replace inappropriate words with asterisks
  for (const word of inappropriateWords) {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  }
  
  return filteredText;
};

// Test function to verify the filter works
export const testProfanityFilter = () => {
  const testCases = [
    { text: "This is a normal comment", shouldBlock: false },
    { text: "This is damn good", shouldBlock: true },
    { text: "I love my pet", shouldBlock: false },
    { text: "This is stupid", shouldBlock: true },
    { text: "BUY NOW CLICK HERE", shouldBlock: true },
    { text: "My cat is amazing!", shouldBlock: false }
  ];

  console.log('Testing profanity filter:');
  testCases.forEach(({ text, shouldBlock }) => {
    const result = containsInappropriateContent(text);
    const status = result === shouldBlock ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}: "${text}" - Blocked: ${result}, Expected: ${shouldBlock}`);
  });
};
