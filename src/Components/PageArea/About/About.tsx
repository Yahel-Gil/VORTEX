import myPhoto from "../../../assets/me.png";
import "./About.css";

export function About() {
    return (
        <div className="About-page-context">
            <header className="page-header">
                <h1>About the Mission</h1>
                <div className="header-underline"></div>
            </header>

            <div className="about-wrapper">
                {/* Left Side: Personal Profile */}
                <aside className="profile-sidebar">
                    <div className="image-frame">
                        <img src={myPhoto} alt="Yahel Gil" className="developer-photo" />
                    </div>
                    <div className="profile-meta">
                        <h2>Yahel Gil</h2>
                        <p className="contact-link">yahelgil1999@gmail.com</p>
                    </div>
                </aside>

                {/* Right Side: Project Insight */}
                <main className="project-insight">
                    <section className="insight-section">
                        <h3>Market Intelligence v1.0</h3>
                        <p>
                            A crypto tracking app that monitors live prices and manages a personal watchlist. 
                            It features an AI-driven analyst that provides simple buy or sell recommendations based on market data.
                        </p>
                    </section>

                    <section className="insight-section">
                        <h3>The Technical Edge</h3>
                        <p>
                            Built with React and Redux for state management and UI. 
                            The app integrates a crypto API for real-time data and OpenAI to generate automated investment advice.
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
}