import {useAuth} from "../context";

export const DashboardPage = () => {
    const { user } = useAuth();
    return (
        <>DashboardPage {user.email}</>
    );
};