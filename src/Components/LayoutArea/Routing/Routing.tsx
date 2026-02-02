import { Navigate, Route, Routes } from "react-router-dom";
import "./Routing.css";
import { Home } from "../../PageArea/Home/Home";
import { About } from "../../PageArea/About/About";
import { Page404 } from "../../PageArea/Page404/Page404";
import { Reports } from "../../PageArea/Reports/Reports";
import { Recommendations } from "../../PageArea/Recommendations/Recommendations";

export function Routing() {
    return (
        <div className="Routing">

            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Page404 />} />
            </Routes>

        </div>
    );
}
