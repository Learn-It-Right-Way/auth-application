import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

interface AuthContextType {
    user: any;
    setUser: any;
    isAuthenticated: any;
    setIsAuthenticated: any;
}

const AuthContext = createContext<AuthContextType>(null!);

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider  = ({ children }: { children: JSX.Element }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Send a request to the server to check authentication
        axios
            .get('/api/check-auth')
            .then((response) => {
                setIsAuthenticated(response.data.isAuthenticated);

                // If the user is authenticated, store user details
                if (response.data.isAuthenticated) {
                    setUser(response.data.user);
                }
            })
            .catch((error) => {
                console.error('Authentication check failed:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const value = {
        isAuthenticated,
        user,
        setIsAuthenticated,
        setUser
    };

    if (loading) {
        return <div>loading...</div>
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};