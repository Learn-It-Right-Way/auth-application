// Custom validation functions
export const isUpperCase = (value: string) => /[A-Z]/.test(value);
export const isLowerCase = (value: string) => /[a-z]/.test(value);
export const hasNumber = (value: string) => /\d/.test(value);
export const hasSpecialCharacter = (value: string) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(value);

const commonWords = ['password', '123456', 'qwerty', 'admin'];

// Check if the password follows a simple pattern (e.g., "abc123" or "aaaaaa")
const simplePatterns = [/^\d+$/, /^[a-z]+$/, /^[A-Z]+$/, /^([a-zA-Z]+|[0-9]+)$/];

export const isUnpredictable = (value: string) => {
    // Check if the password is in the list of common words
    if (commonWords.includes(value.toLowerCase())) {
        return false;
    }

    // Check if the password matches any of the simple patterns
    if (simplePatterns.some((pattern) => pattern.test(value))) {
        return false;
    }

    // If none of the above conditions match, consider it unpredictable
    return true;
};