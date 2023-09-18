import './App.css';
import {createBrowserRouter, RouterProvider, useLocation, Navigate} from "react-router-dom";
import {DashboardPage, LoginForm, RegistrationForm} from "./pages";
import React from "react";

export function useAuth() {
    return React.useContext(AuthContext);
}

function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

const router = createBrowserRouter([
    {
        path: "/register",
        element: <RegistrationForm />,
    },
    {
        path: "/login",
        element: <LoginForm />,
    },
    {
        path: "/",
        element: <RequireAuth>
            <DashboardPage />
        </RequireAuth>,
    }
]);

interface AuthContextType {
    user: any;
    signin: (user: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<any>(null);

    let signin = (newUser: string, callback: VoidFunction) => {
        console.log("==sign in==");
        setUser(newUser);
        callback();
    };

    let signout = (callback: VoidFunction) => {
        console.log("==sign out==");
        setUser(null);
        callback();
    };

    let value = { user, signin, signout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function App() {
  return (
      <AuthProvider>
          <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
      </ AuthProvider>
  )
}

export default App
