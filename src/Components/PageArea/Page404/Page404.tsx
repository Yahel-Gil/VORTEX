import { useNavigate } from "react-router-dom";
import "./Page404.css";

export function Page404() {

    // Initialize navigation:
    const navigate = useNavigate();

    // Go back to home:
    const handleBack = () => {
        navigate("/home");
    };

    return (
        <div className="Page404">
            <div className="content-box">
                
                
                <h1>404</h1>
                
                
                <div className="message">
                    <h3>Page Not Found</h3>
                    <p>The requested page could not be located.</p>
                </div>

               
                <button onClick={handleBack}>Go Back Home</button>

            </div>
        </div>
    );
}