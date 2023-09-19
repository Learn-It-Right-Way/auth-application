import {Navigate} from 'react-router-dom';
import {useAuth} from "../context";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const auth = useAuth();

    if (!auth.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};