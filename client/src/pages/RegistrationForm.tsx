import {useState} from "react";
import axios from 'axios';

export const RegistrationForm = () => {
    // State to manage form input values
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // State to manage errors
    const [errors, setErrors] = useState({
        usernameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
    });

    // Function to validate email format
    const isValidEmail = (email: string) => {
        // Use a regular expression or other validation method to check email format
        // For example, you can use the following regex:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Function to validate username format
    const isValidUsername = (username: string) => {
        // Use a regular expression or other validation method to check username format
        // For example, you can use the following regex:
        const usernameRegex = /^[a-zA-Z0-9_]+$/; // Allows letters, numbers, and underscores
        return usernameRegex.test(username);
    };

    // Helper function to check if the password has at least one uppercase letter
    const hasUpperCase = (str: string) => /[A-Z]/.test(str);

    // Helper function to check if the password has at least one lowercase letter
    const hasLowerCase = (str: string) => /[a-z]/.test(str);

    // Helper function to check if the password has at least one number
    const hasNumber = (str: string) => /\d/.test(str);

    // Helper function to check if the password has at least one special character
    const hasSpecialCharacter = (str: string) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\\-=/|]/.test(str);

    // Helper function to check if the password is unpredictable
    const isUnpredictable = (str: string) => {
        // Check if the password contains common words (you can expand the list)
        const commonWords = ['password', '123456', 'qwerty', 'admin'];

        // Check if the password follows a simple pattern (e.g., "abc123" or "aaaaaa")
        const simplePatterns = [/^\d+$/, /^[a-z]+$/, /^[A-Z]+$/, /^([a-zA-Z]+|[0-9]+)$/];

        // Check if the password is in the list of common words
        if (commonWords.includes(str.toLowerCase())) {
            return false;
        }

        // Check if the password matches any of the simple patterns
        if (simplePatterns.some((pattern) => pattern.test(str))) {
            return false;
        }

        // If none of the above conditions match, consider it unpredictable
        return true;
    };

    // Function to handle form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Validate form inputs
        const validationErrors: any = {};

        if (!formData.username.trim()) {
            validationErrors.usernameError = 'Username is required';
        } else if (formData.username.length < 3) {
            validationErrors.usernameError = 'Username must be at least 3 characters';
        } else if (formData.username.length > 20) {
            validationErrors.usernameError = 'Username cannot exceed 20 characters';
        } else if (!isValidUsername(formData.username)) {
            validationErrors.usernameError = 'Invalid username format';
        }

        if (!formData.email.trim()) {
            validationErrors.emailError = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            validationErrors.emailError = 'Invalid email format';
        }

        if (!formData.password.trim()) {
            validationErrors.passwordError = 'Password is required';
        } else if (formData.password.length < 8) {
            validationErrors.passwordError = 'Password must be at least 8 characters long';
        } else if (!hasUpperCase(formData.password)) {
            validationErrors.passwordError = 'Password must contain at least one uppercase letter';
        } else if (!hasLowerCase(formData.password)) {
            validationErrors.passwordError = 'Password must contain at least one lowercase letter';
        } else if (!hasNumber(formData.password)) {
            validationErrors.passwordError = 'Password must contain at least one number';
        } else if (!hasSpecialCharacter(formData.password)) {
            validationErrors.passwordError = 'Password must contain at least one special character';
        } else if (!isUnpredictable(formData.password)) {
            validationErrors.passwordError = 'Password is too predictable';
        }

        if (!formData.confirmPassword.trim()) {
            validationErrors.confirmPasswordError = 'Confirm Password is required';
        } else if (formData.confirmPassword !== formData.password) {
            validationErrors.confirmPasswordError = 'Passwords do not match';
        }

        // Check if there are any validation errors
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return
        }

        // If no errors, submit the form data to the server or perform further actions
        // You can make an API request here to register the user
        // Reset form data and errors after successful submission
        // If no validation errors, send a POST request to your backend
        const response = await axios.post('http://localhost:3200/api/register', formData);

        // Handle the response from your server
        if (response.status === 201) {
            // Registration successful
            alert('User registered successfully!');
        } else {
            // Handle other responses, e.g., display error messages
            alert('Registration failed. Please try again.');
        }

        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
        setErrors({
            usernameError: '',
            emailError: '',
            passwordError: '',
            confirmPasswordError: '',
        });
    };

    return (
        <div>
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <div className="error">{errors.usernameError}</div>
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="error">{errors.emailError}</div>
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <div className="error">{errors.passwordError}</div>
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    <div className="error">{errors.confirmPasswordError}</div>
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
};