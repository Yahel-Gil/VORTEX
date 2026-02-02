import { NavLink } from "react-router-dom";
import "./Menu.css";

export function Menu() {
    return (
        <nav className="Menu">
            <div className="nav-links">
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/reports">Reports</NavLink>
                <NavLink to="/recommendations">Recommendations</NavLink>
                <NavLink to="/about">About</NavLink>
            </div>
        </nav>
    );
}