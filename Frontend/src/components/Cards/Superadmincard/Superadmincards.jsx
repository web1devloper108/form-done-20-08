
//Working 8 aug
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaRocket } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import axios from "axios";
import logo from "../../Public/logo.png";
import loginLogo from "../../Public/login.png";
import "./Superadmincard.css"; // Assuming you have a CSS file for styling

const Superadmincards = () => {
  const [cardDetails, setCardDetails] = useState({
    activeOrganizations: 0,
    inactiveOrganizations: 0,
    activeProgramManagers: 0,
    inactiveProgramManagers: 0,
    activeStartups: 0,
    inactiveStartups: 0,
  });
  const [superAdminDetails, setSuperAdminDetails] = useState({});
  const navigate = useNavigate();

  const fetchCardDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        activeOrgs,
        inactiveOrgs,
        activeProgramManagers,
        inactiveProgramManagers,
      ] = await Promise.all([
        axios.get("http://localhost:5000/api/organizations/active", config),
        axios.get("http://localhost:5000/api/organizations/inactive", config),
        axios.get("http://localhost:5000/api/programmanagers/active", config),
        axios.get("http://localhost:5000/api/programmanagers/inactive", config),
      ]);

      setCardDetails({
        activeOrganizations: activeOrgs.data.length,
        inactiveOrganizations: inactiveOrgs.data.length,
        activeProgramManagers: activeProgramManagers.data.length,
        inactiveProgramManagers: inactiveProgramManagers.data.length,
      });
    } catch (error) {
      console.error("Error fetching cards details:", error);
    }
  };

  const fetchSuperAdminDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        "http://localhost:5000/api/superadmins/me",
        config
      );
      setSuperAdminDetails(response.data);
    } catch (error) {
      console.error("Error fetching super admin details:", error);
    }
  };

  useEffect(() => {
    fetchCardDetails();
    fetchSuperAdminDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigation = (route, state) => {
    navigate(route, { state });
  };

  return (
    <div className="card-dashboard">
      <aside className="card-sidebar">
        <div className="card-logo-container">
          <div className="card-logo">
            <img src={logo} alt="Logo" />
          </div>
        </div>
        <div className="card-nav-container">
          <nav className="card-nav">
            <ul>
              <li
                className="card-nav-item"
                style={{ marginTop: "0px" }}
                onClick={() =>
                  handleNavigation("/SuperadminDash", { showActive: true })
                }
              >
                <FaUserCircle className="card-nav-icon" /> Organization
              </li>

              <li
                className="card-nav-item"
                onClick={() => handleNavigation("/admindash")}
              >
                <FaRocket className="card-nav-icon" /> Program Manager
              </li>
              <li
                className="card-nav-item"
                onClick={() => handleNavigation("/SuperadminDash")}
              >
                <FaRocket className="card-nav-icon" /> Startup
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <main className="card-main-content">
        <header className="card-header">
          <span
            className="card-founder"
            style={{ fontSize: "24px", fontWeight: "700" }}
          >
            <FiMenu style={{ color: "#909090" }} /> Super Admin
          </span>

          <div className="card-profile-section">
            <div className="card-user-info">
              <span className="card-user-initials">
                <img src={loginLogo} alt="Login" style={{ width: "40px" }} />
              </span>
              <div className="card-user-details">
                <span className="card-user-name">
                  {superAdminDetails?.name || "Loading..."}
                  <span className="card-drop" />
                </span>
                <span className="card-user-email">
                  {superAdminDetails?.email || "Loading..."}
                </span>
              </div>
              <button
                className="card-logout-button"
                onClick={handleLogout}
                style={{ marginLeft: "10px", padding: "8px" }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="card-content">
          <div className="card-cards-container">
            <div
              className="card-card"
              onClick={() =>
                handleNavigation("/SuperadminDash", { showActive: true })
              }
            >
              <div
                className="card-card-number"
                style={{ backgroundColor: "#6a5acd" }}
              >
                {cardDetails.activeOrganizations}
              </div>
              <div className="card-card-label">Active Organization</div>
            </div>
            <div
              className="card-card"
              onClick={() =>
                handleNavigation("/SuperadminDash", { showActive: false })
              }
            >
              <div
                className="card-card-number"
                style={{ backgroundColor: "#32cd32" }}
              >
                {cardDetails.inactiveOrganizations}
              </div>
              <div className="card-card-label">Inactive Organization</div>
            </div>
            <div
              className="card-card"
              onClick={() => handleNavigation("/admindash")}
            >
              <div
                className="card-card-number"
                style={{ backgroundColor: "#ff69b4" }}
              >
                {cardDetails.activeProgramManagers}
              </div>
              <div className="card-card-label">Active Program Managers</div>
            </div>
            <div
              className="card-card"
              onClick={() => handleNavigation("/admindash/inactive")}
            >
              <div
                className="card-card-number"
                style={{ backgroundColor: "#ffd700" }}
              >
                {cardDetails.inactiveProgramManagers}
              </div>
              <div className="card-card-label">Inactive Program Managers</div>
            </div>
            <div
              className="card-card"
              onClick={() => handleNavigation("/SuperadminDash")}
            >
              <div
                className="card-card-number"
                style={{ backgroundColor: "#9370db" }}
              >
                {cardDetails.activeStartups}
              </div>
              <div className="card-card-label">Active Startup</div>
            </div>
            <div
              className="card-card"
              onClick={() => handleNavigation("/SuperadminDash")}
            >
              <div
                className="card-card-number"
                style={{ backgroundColor: "#9370db" }}
              >
                {cardDetails.inactiveStartups}
              </div>
              <div className="card-card-label">Inactive Startup</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Superadmincards;
