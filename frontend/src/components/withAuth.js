import {useContext, useEffect} from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";

export default function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const { isAuthenticated } = useContext(AuthContext);
        const router = useRouter();

useEffect(() => {
            if (!isAuthenticated) {
                router.push("/login");
            }   
    }, [isAuthenticated, router]);

        if (!isAuthenticated) {
            return <p>Redirecting to login page...</p>;
        }
        return <Component {...props} />;
    };
}
