import { useState } from 'react';
import axios from "axios";
import {useNavigate } from "react-router-dom";
import xss from 'xss';
import {useAuth} from "../context";

export const LoginForm = () => {
    const { setUser, setIsAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        emailError: '',
        passwordError: '',
    });

    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        // Password should be at least 8 characters long
        return password.length >= 8;
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        // Sanitize user input using the xss library
        const sanitizedValue = xss(value);
        setFormData({ ...formData, [name]: sanitizedValue });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Frontend email and password validation
        let isValid = true;
        const updatedErrors = {
            emailError: '',
            passwordError: '',
        };

        if (!validateEmail(formData.email)) {
            updatedErrors.emailError = 'Invalid email format';
            isValid = false;
        }

        if (!validatePassword(formData.password)) {
            updatedErrors.passwordError = 'Password must be at least 8 characters long';
            isValid = false;
        }

        if (!isValid) {
            setErrors(updatedErrors);
            return;
        }

        try {
            // Send a POST request to your backend for authentication
            const response = await axios.post('/api/login', formData);

            if (response.status === 200) {
                setUser(response.data.user);
                setIsAuthenticated(response.data.isAuthenticated);
                // Redirect to the protected route upon successful login
                navigate('/');
            } else {
                // Handle authentication error
                // You can display an error message to the user here
                alert("==login failed==");
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    />
                    <div className="error">{errors.emailError}</div>
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <div className="error">{errors.passwordError}</div>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};