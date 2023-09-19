import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {DashboardPage, LoginForm, RegistrationForm} from "./pages";
import {PrivateRoute} from "./components";
import {AuthProvider} from "./context";

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
        element: <PrivateRoute>
            <DashboardPage />
        </PrivateRoute>,
    }
]);

function App() {
  return (
      <AuthProvider>
          <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
      </ AuthProvider>
  )
}

export default App
