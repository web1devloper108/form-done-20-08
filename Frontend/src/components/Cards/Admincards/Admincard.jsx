// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUserCircle, FaRocket } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";
// import axios from "axios";
// import logo from "../../Public/logo.png";
// import loginLogo from "../../Public/login.png";
// import "./Admincard.css"; // Assuming you have a CSS file for styling

// const Admincards = () => {
//   const [cardDetails, setCardDetails] = useState({
//     activeProgramManagers: 0,
//     inactiveProgramManagers: 0,
//     activeStartups: 0,
//     inactiveStartups: 0,
//   });
//   const [adminDetails, setAdminDetails] = useState({});
//   const navigate = useNavigate();

//   const fetchCardDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const [
//         activeProgramManagers,
//         inactiveProgramManagers,
//         activeStartups,
//         inactiveStartups,
//       ] = await Promise.all([
//         axios.get("http://localhost:5000/api/programmanagers/active", config),
//         axios.get("http://localhost:5000/api/programmanagers/inactive", config),
//         axios.get("http://localhost:5000/api/startups/active", config),
//         axios.get("http://localhost:5000/api/startups/inactive", config),
//       ]);

//       setCardDetails({
//         activeProgramManagers: activeProgramManagers.data.length,
//         inactiveProgramManagers: inactiveProgramManagers.data.length,
//         activeStartups: activeStartups.data.length,
//         inactiveStartups: inactiveStartups.data.length,
//       });
//     } catch (error) {
//       console.error("Error fetching cards details:", error);
//     }
//   };

//   const fetchAdminDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await axios.get(
//         "http://localhost:5000/api/admins/me",
//         config
//       );
//       setAdminDetails(response.data);
//     } catch (error) {
//       console.error("Error fetching admin details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCardDetails();
//     fetchAdminDetails();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handleNavigation = (route, state) => {
//     navigate(route, { state });
//   };

//   return (
//     <div className="admin-card-dashboard">
//       <aside className="admin-card-sidebar">
//         <div className="admin-card-logo-container">
//           <div className="admin-card-logo">
//             <img src={logo} alt="Logo" />
//           </div>
//         </div>
//         <div className="admin-card-nav-container">
//           <nav className="admin-card-nav">
//             <ul>
//               <li
//                 className="admin-card-nav-item"
//                 style={{ marginTop: "0px" }}
//                 onClick={() => handleNavigation("/admindash")}
//               >
//                 <FaUserCircle className="admin-card-nav-icon" /> Program Manager
//               </li>
//               <li
//                 className="admin-card-nav-item"
//                 onClick={() => handleNavigation("/admindash/startup")}
//               >
//                 <FaRocket className="admin-card-nav-icon" /> Startup
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>

//       <main className="admin-card-main-content">
//         <header className="admin-card-header">
//           <span
//             className="admin-card-founder"
//             style={{ fontSize: "24px", fontWeight: "700" }}
//           >
//             <FiMenu style={{ color: "#909090" }} /> Admin
//           </span>

//           <div className="admin-card-profile-section">
//             <div className="admin-card-user-info">
//               <span className="admin-card-user-initials">
//                 <img src={loginLogo} alt="Login" style={{ width: "40px" }} />
//               </span>
//               <div className="admin-card-user-details">
//                 <span className="admin-card-user-name">
//                   {adminDetails?.name || "Loading..."}
//                   <span className="admin-card-drop" />
//                 </span>
//                 <span className="admin-card-user-email">
//                   {adminDetails?.email || "Loading..."}
//                 </span>
//               </div>
//               <button
//                 className="admin-card-logout-button"
//                 onClick={handleLogout}
//                 style={{ marginLeft: "10px", padding: "8px" }}
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </header>

//         <section className="admin-card-content">
//           <div className="admin-card-cards-container">
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admincard")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#ff69b4" }}
//               >
//                 {cardDetails.activeProgramManagers}
//               </div>
//               <div className="admin-card-card-label">
//                 Active Program Managers
//               </div>
//             </div>
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admincard")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#ffd700" }}
//               >
//                 {cardDetails.inactiveProgramManagers}
//               </div>
//               <div className="admin-card-card-label">
//                 Inactive Program Managers
//               </div>
//             </div>
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admincard")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#9370db" }}
//               >
//                 {cardDetails.activeStartups}
//               </div>
//               <div className="admin-card-card-label">Active Startup</div>
//             </div>
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admindash/startup/inactive")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#9370db" }}
//               >
//                 {cardDetails.inactiveStartups}
//               </div>
//               <div className="admin-card-card-label">Inactive Startup</div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Admincards;





//cureent working 8 aug



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUserCircle, FaRocket } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";
// import axios from "axios";
// import logo from "../../Public/logo.png";
// import loginLogo from "../../Public/login.png";
// import "./Admincard.css"; // Ensure you have the necessary CSS styles

// const Admincards = () => {
//   const [cardDetails, setCardDetails] = useState({
//     activeProgramManagers: 0,
//     inactiveProgramManagers: 0,
//     activeStartups: 0,
//     inactiveStartups: 0,
//   });
//   const [adminDetails, setAdminDetails] = useState({});
//   const navigate = useNavigate();

//   const fetchCardDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const [
//         activeProgramManagers,
//         inactiveProgramManagers,
//         activeStartups,
//         inactiveStartups,
//       ] = await Promise.all([
//         axios.get("http://localhost:5000/api/programmanagers/active", config),
//         axios.get("http://localhost:5000/api/programmanagers/inactive", config),
//         axios.get("http://localhost:5000/api/startups/active", config),
//         axios.get("http://localhost:5000/api/startups/inactive", config),
//       ]);

//       setCardDetails({
//         activeProgramManagers: activeProgramManagers.data.length,
//         inactiveProgramManagers: inactiveProgramManagers.data.length,
//         activeStartups: activeStartups.data.length,
//         inactiveStartups: inactiveStartups.data.length,
//       });
//     } catch (error) {
//       console.error("Error fetching cards details:", error);
//     }
//   };

//   const fetchAdminDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await axios.get(
//         "http://localhost:5000/api/admins/me",
//         config
//       );
//       setAdminDetails(response.data);
//     } catch (error) {
//       console.error("Error fetching admin details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCardDetails();
//     fetchAdminDetails();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handleNavigation = (route, state) => {
//     navigate(route, { state });
//   };

//   return (
//     <div className="admin-card-dashboard">
//       <aside className="admin-card-sidebar">
//         <div className="admin-card-logo-container">
//           <div className="admin-card-logo">
//             <img src={logo} alt="Logo" />
//           </div>
//         </div>
//         <div className="admin-card-nav-container">
//           <nav className="admin-card-nav">
//             <ul>
//               <li
//                 className="admin-card-nav-item"
//                 style={{ marginTop: "0px" }}
//                 onClick={() => handleNavigation("/admindash")}
//               >
//                 <FaUserCircle className="admin-card-nav-icon" /> Program Manager
//               </li>
//               <li
//                 className="admin-card-nav-item"
//                 onClick={() => handleNavigation("/admindash/startup")}
//               >
//                 <FaRocket className="admin-card-nav-icon" /> Startup
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>

//       <main className="admin-card-main-content">
//         <header className="admin-card-header">
//           <span
//             className="admin-card-founder"
//             style={{ fontSize: "24px", fontWeight: "700" }}
//           >
//             <FiMenu style={{ color: "#909090" }} /> Admin
//           </span>

//           <div className="admin-card-profile-section">
//             <div className="admin-card-user-info">
//               <span className="admin-card-user-initials">
//                 <img src={loginLogo} alt="Login" style={{ width: "40px" }} />
//               </span>
//               <div className="admin-card-user-details">
//                 <span className="admin-card-user-name">
//                   {adminDetails?.email || "Loading..."}
//                   <span className="admin-card-drop" />
//                 </span>
//                 <button
//                   className="admin-card-logout-button"
//                   onClick={handleLogout}
//                   style={{ marginLeft: "10px", padding: "8px" }}
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </header>

//         <section className="admin-card-content">
//           <div className="admin-card-cards-container">
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admindash")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#ff69b4" }}
//               >
//                 {cardDetails.activeProgramManagers}
//               </div>
//               <div className="admin-card-card-label">
//                 Active Program Managers
//               </div>
//             </div>
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admindash/inactive")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#ffd700" }}
//               >
//                 {cardDetails.inactiveProgramManagers}
//               </div>
//               <div className="admin-card-card-label">
//                 Inactive Program Managers
//               </div>
//             </div>
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admindash/startup")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#9370db" }}
//               >
//                 {cardDetails.activeStartups}
//               </div>
//               <div className="admin-card-card-label">Active Startups</div>
//             </div>
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admindash/startup/inactive")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#9370db" }}
//               >
//                 {cardDetails.inactiveStartups}
//               </div>
//               <div className="admin-card-card-label">Inactive Startups</div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Admincards;








//working perfectly count
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import logo from "../../Public/logo.png";
import loginLogo from "../../Public/login.png";
import "./Admincard.css"; // Ensure you have the necessary CSS styles

const Admincards = () => {
  const [cardDetails, setCardDetails] = useState({
    activeProgramManagers: 0,
    inactiveProgramManagers: 0,
  });
  const [adminDetails, setAdminDetails] = useState({});
  const navigate = useNavigate();

  const fetchCardDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [activeProgramManagersCount, inactiveProgramManagersCount] =
        await Promise.all([
          axios.get(
            "http://localhost:5000/api/programmanagers/active/count",
            config
          ),
          axios.get(
            "http://localhost:5000/api/programmanagers/inactive/count",
            config
          ),
        ]);

      setCardDetails({
        activeProgramManagers: activeProgramManagersCount.data.count,
        inactiveProgramManagers: inactiveProgramManagersCount.data.count,
      });
    } catch (error) {
      console.error("Error fetching cards details:", error);
    }
  };

  const fetchAdminDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        "http://localhost:5000/api/admins/me",
        config
      );
      setAdminDetails(response.data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  useEffect(() => {
    fetchCardDetails();
    fetchAdminDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigation = (route, state) => {
    navigate(route, { state });
  };

  return (
    <div className="admin-card-dashboard">
      <aside className="admin-card-sidebar">
        <div className="admin-card-logo-container">
          <div className="admin-card-logo">
            <img src={logo} alt="Logo" />
          </div>
        </div>
        <div className="admin-card-nav-container">
          <nav className="admin-card-nav">
            <ul>
              <li
                className="admin-card-nav-item"
                style={{ marginTop: "0px" }}
                onClick={() => handleNavigation("/admindash")}
              >
                <FaUserCircle className="admin-card-nav-icon" /> Program Manager
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <main className="admin-card-main-content">
        <header className="admin-card-header">
          <span
            className="admin-card-founder"
            style={{ fontSize: "24px", fontWeight: "700" }}
          >
            Program Manager Dashboard
          </span>

          <div className="admin-card-profile-section">
            <div className="admin-card-user-info">
              <span className="admin-card-user-initials">
                <img src={loginLogo} alt="Login" style={{ width: "40px" }} />
              </span>
              <div className="admin-card-user-details">
                <span className="admin-card-user-name">
                  {adminDetails?.email || "Loading..."}
                  <span className="admin-card-drop" />
                </span>
                <button
                  className="admin-card-logout-button"
                  onClick={handleLogout}
                  style={{ marginLeft: "10px", padding: "8px" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="admin-card-content">
          <div className="admin-card-cards-container">
            <div
              className="admin-card-card"
              onClick={() => handleNavigation("/admindash")}
            >
              <div
                className="admin-card-card-number"
                style={{ backgroundColor: "#ff69b4" }}
              >
                {cardDetails.activeProgramManagers}
              </div>
              <div className="admin-card-card-label">
                Active Program Managers
              </div>
            </div>
            <div
              className="admin-card-card"
              onClick={() => handleNavigation("/admindash/inactive")}
            >
              <div
                className="admin-card-card-number"
                style={{ backgroundColor: "#ffd700" }}
              >
                {cardDetails.inactiveProgramManagers}
              </div>
              <div className="admin-card-card-label">
                Inactive Program Managers
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admincards;








// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUserCircle, FaRocket } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";
// import axios from "axios";
// import logo from "../../Public/logo.png";
// import loginLogo from "../../Public/login.png";
// import "./Admincard.css"; // Ensure you have the necessary CSS styles

// const Admincards = () => {
//   const [cardDetails, setCardDetails] = useState({
//     activeProgramManagers: 0,
//     inactiveProgramManagers: 0,
//     activeStartups: 0,
//     inactiveStartups: 0,
//   });
//   const [adminDetails, setAdminDetails] = useState({});
//   const navigate = useNavigate();

//   const fetchCardDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const [
//         activeProgramManagersCount,
//         inactiveProgramManagersCount,
//         activeStartupsCount,
//         inactiveStartupsCount,
//       ] = await Promise.all([
//         axios.get(
//           "http://localhost:5000/api/programmanagers/active/count",
//           config
//         ),
//         axios.get(
//           "http://localhost:5000/api/programmanagers/inactive/count",
//           config
//         ),
//         axios.get("http://localhost:5000/api/startups/active/count", config),
//         axios.get("http://localhost:5000/api/startups/inactive/count", config),
//       ]);

//       setCardDetails({
//         activeProgramManagers: activeProgramManagersCount.data.count,
//         inactiveProgramManagers: inactiveProgramManagersCount.data.count,
//         activeStartups: activeStartupsCount.data.count,
//         inactiveStartups: inactiveStartupsCount.data.count,
//       });
//     } catch (error) {
//       console.error("Error fetching cards details:", error);
//     }
//   };

//   const fetchAdminDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await axios.get(
//         "http://localhost:5000/api/admins/me",
//         config
//       );
//       setAdminDetails(response.data);
//     } catch (error) {
//       console.error("Error fetching admin details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCardDetails();
//     fetchAdminDetails();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handleNavigation = (route, state) => {
//     navigate(route, { state });
//   };

//   return (
//     <div className="admin-card-dashboard">
//       <aside className="admin-card-sidebar">
//         <div className="admin-card-logo-container">
//           <div className="admin-card-logo">
//             <img src={logo} alt="Logo" />
//           </div>
//         </div>
//         <div className="admin-card-nav-container">
//           <nav className="admin-card-nav">
//             <ul>
//               <li
//                 className="admin-card-nav-item"
//                 style={{ marginTop: "0px" }}
//                 onClick={() => handleNavigation("/admindash")}
//               >
//                 <FaUserCircle className="admin-card-nav-icon" /> Program Manager
//               </li>
//               <li
//                 className="admin-card-nav-item"
//                 onClick={() => handleNavigation("/admindash/startup")}
//               >
//                 <FaRocket className="admin-card-nav-icon" /> Startup
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>

//       <main className="admin-card-main-content">
//         <header className="admin-card-header">
//           <span
//             className="admin-card-founder"
//             style={{ fontSize: "24px", fontWeight: "700" }}
//           >
//             <FiMenu style={{ color: "#909090" }} /> Admin
//           </span>

//           <div className="admin-card-profile-section">
//             <div className="admin-card-user-info">
//               <span className="admin-card-user-initials">
//                 <img src={loginLogo} alt="Login" style={{ width: "40px" }} />
//               </span>
//               <div className="admin-card-user-details">
//                 <span className="admin-card-user-name">
//                   {adminDetails?.email || "Loading..."}
//                   <span className="admin-card-drop" />
//                 </span>
//                 <button
//                   className="admin-card-logout-button"
//                   onClick={handleLogout}
//                   style={{ marginLeft: "10px", padding: "8px" }}
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </header>

//         <section className="admin-card-content">
//           <div className="admin-card-cards-container">
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admindash")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#ff69b4" }}
//               >
//                 {cardDetails.activeProgramManagers}
//               </div>
//               <div className="admin-card-card-label">
//                 Active Program Managers
//               </div>
//             </div>
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admindash/inactive")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#ffd700" }}
//               >
//                 {cardDetails.inactiveProgramManagers}
//               </div>
//               <div className="admin-card-card-label">
//                 Inactive Program Managers
//               </div>
//             </div>
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admindash/startup")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#9370db" }}
//               >
//                 {cardDetails.activeStartups}
//               </div>
//               <div className="admin-card-card-label">Active Startups</div>
//             </div>
//             <div
//               className="admin-card-card"
//               onClick={() => handleNavigation("/admindash/startup/inactive")}
//             >
//               <div
//                 className="admin-card-card-number"
//                 style={{ backgroundColor: "#9370db" }}
//               >
//                 {cardDetails.inactiveStartups}
//               </div>
//               <div className="admin-card-card-label">Inactive Startups</div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Admincards;
