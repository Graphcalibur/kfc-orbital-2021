import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    return <nav className="navbar navbar-expand-lg navbar-dark box mb-3">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">CodeRacer</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/lang">Race</Link>
                    <Link className="nav-link" to="/lang">Practice</Link>
                </div>
            </div>
        </div>
    </nav>
}

export default NavBar;