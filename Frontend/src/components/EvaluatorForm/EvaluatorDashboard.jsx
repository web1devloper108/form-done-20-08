import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import EvaluatorDashboardAddNewFormModal from "./EvaluatorDashboardAddNewFormModal";
import EvaluatorDashboardEditFormModal from "./EvaluatorDashboardEditFormModal";
import ShareFormModal from "./ShareFormModal";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "./EvaluatorDashboard.css";
import "../Shared/Sidebar2.css";

function EvaluatorDashboard() {
  const [evaluatorForms, setEvaluatorForms] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formsPerPage, setFormsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState({ name: "", email: "", username: "" }); // State for user data
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvaluatorForms();
    fetchUserData(); // Fetch user data on component mount
  }, []);
  // Highlight Start: Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/programmanagers/me",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error("Failed to fetch user data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  // Highlight End: Fetch user data

  useEffect(() => {
    fetchEvaluatorForms();
  }, []);

  const fetchEvaluatorForms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/evaluationForms");
      const data = await response.json();
      setEvaluatorForms(data);
    } catch (error) {
      console.error("Error fetching evaluator forms:", error);
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (form) => {
    setCurrentForm(form);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentForm(null);
  };

  const openShareModal = (form) => {
    setCurrentForm(form);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setCurrentForm(null);
  };

  const deleteForm = async (formToDelete) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui-delete-evaevaluatordashboard">
            <h2
              style={{
                fontSize: "24px",
                textAlign: "center",
                marginBottom: "15PX",
              }}
            >
              Confirm to Delete
            </h2>
            <p style={{ textAlign: "center", marginBottom: "15PX" }}>
              Form structure will be lost. Are you sure you want to delete this
              form?
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              <button
                className="delete-button-alert-yes-evaevaluatordashboard"
                // style={{
                //   backgroundColor: '#dc3545',
                //   color: '#fff',
                //   border: 'none',
                //   padding: '10px 20px',
                //   borderRadius: '4px',
                //   cursor: 'pointer',
                // }}
                onClick={async () => {
                  try {
                    await fetch(
                      `http://localhost:5000/api/evaluationForms/${formToDelete._id}`,
                      {
                        method: "DELETE",
                      }
                    );
                    const updatedForms = evaluatorForms.filter(
                      (form) => form._id !== formToDelete._id
                    );
                    setEvaluatorForms(updatedForms);
                    localStorage.setItem(
                      "evaluatorForms",
                      JSON.stringify(updatedForms)
                    );
                    onClose();
                  } catch (error) {
                    console.error("Error deleting form:", error);
                    onClose();
                  }
                }}
              >
                Yes, Delete it!
              </button>
              <button
                className="modal-button-cancel-no-evaevaluatordashboard"
                // style={{
                //   backgroundColor: '#007bff',
                //   color: '#fff',
                //   border: 'none',
                //   padding: '10px 20px',
                //   borderRadius: '4px',
                //   cursor: 'pointer',
                // }}
                onClick={onClose}
              >
                No
              </button>
            </div>
          </div>
        );
      },
      overlayClassName: "custom-overlay-delete-evaevaluatordashboard",
    });
  };

  const handleFormClick = async (form) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/evaluationForms/form-structure/${form._id}`
      );
      if (response.status === 404) {
        navigate("/evaluator-form", {
          state: { formElements: [], formTitle: form.title, formId: form._id },
        });
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const formStructure = await response.json();
      if (formStructure.fields.length > 0) {
        navigate("/evaluator-form-preview", {
          state: {
            formElements: formStructure.fields,
            formTitle: formStructure.title,
            formId: form._id,
          },
        });
      } else {
        navigate("/evaluator-form", {
          state: { formElements: [], formTitle: form.title, formId: form._id },
        });
      }
    } catch (error) {
      console.error("Error fetching form structure:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const addForm = (form) => {
    const updatedForms = [...evaluatorForms, form];
    setEvaluatorForms(updatedForms);
    localStorage.setItem("evaluatorForms", JSON.stringify(updatedForms));
  };

  const updateForm = (form) => {
    const updatedForms = evaluatorForms.map((f) =>
      f._id === form._id ? form : f
    );
    setEvaluatorForms(updatedForms);
    localStorage.setItem("evaluatorForms", JSON.stringify(updatedForms));
  };

  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const filteredForms = evaluatorForms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentFilteredForms = filteredForms.slice(
    indexOfFirstForm,
    indexOfLastForm
  );
  const totalPages = Math.ceil(filteredForms.length / formsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setFormsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="dashboard-formevaluatordashboard">
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo">
            <img
              src="/navbar/drishtilogo.jpg"
              alt="Logo"
              className="dristilogo"
            />
          </div>
        </div>
        <div className="nav-container" style={{ marginTop: "90px" }}>
          <nav className="nav">
            <ul>
              <li>
                {/* <Link to="/form">
                  <CgNotes className="nav-icon" /> General Form
                </Link> */}
                <Link to="/form">
                  <CgNotes className="nav-icon" /> Create Query Form
                </Link>
              </li>
              <li>
                {/* <Link to="/evaluator-dashboard">
                  <AiOutlineEye className="nav-icon" /> Evaluator Form
                </Link> */}
                <Link to="/evaluator-dashboard">
                  <AiOutlineEye className="nav-icon" /> Create Evaluation Form
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="main-content-formevaluatordashboard">
        <header className="header-formevaluatordashboard">
          <span className="founder-formevaluatordashboard">
            Program Manager
          </span>
          <div className="profile-section-formevaluatordashboard">
            <div className="user-info-formevaluatordashboard">
              <img
                src="/navbar/profilepicture.png"
                alt="User Avatar"
                className="user-initials-formevaluatordashboard"
              />
              <div className="user-details-formevaluatordashboard">
                {/* Highlight Start: Display the logged-in user's name and email */}
                <span className="user-name-formevaluatordashboard">
                  {user.username}{" "}
                </span>
                <br />
                <span className="user-email-formevaluatordashboard">
                  {user.email}
                </span>
                {/* Highlight End: Display the logged-in user's name and email */}
              </div>
            </div>
            <button
              className="logout-button-formevaluatordashboard"
              onClick={handleLogout} // Assuming you have a handleLogout function defined
              style={{ marginLeft: "20px" }}
            >
              Logout
            </button>
          </div>
        </header>
        <section className="content-formevaluatordashboard">
          <div className="content-header-formevaluatordashboard">
            <h3>Evaluator Form</h3>
            <input
              type="text"
              placeholder="Search by title"
              className="search-bar-formevaluatordashboard"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="unique-button-containerevaluatordashboard">
              <button
                className="unique-add-form-buttonevaluatordashboard"
                onClick={openAddModal}
              >
                + Add New
              </button>
              <button
                className="unique-evaluation-startup-buttonevaluatordashboard"
                onClick={() => navigate("/evaluation-startup")}
              >
                Evaluation Startup
              </button>
            </div>
          </div>
          <div className="form-list-formevaluatordashboard">
            <table className="form-table-formevaluatordashboard">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Last Modified</th>
                  <th style={{ paddingLeft: "35px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentFilteredForms.map((form, index) => (
                  <tr key={index}>
                    <td
                      onClick={() => handleFormClick(form)}
                      className="eva-form-titleevaluatordashboard"
                    >
                      {form.title}
                    </td>
                    <td>{form.lastModified}</td>
                    <td>
                      <button
                        className="unique-action-button-formevaluatordashboard share"
                        onClick={(e) => {
                          e.stopPropagation();
                          openShareModal(form);
                        }}
                        data-tooltip-id="share-tooltip"
                        data-tooltip-content="Share"
                      >
                        <AiOutlineShareAlt className="unique-action-iconevaluatordashboard" />
                        <div className="tooltip">Share</div>
                      </button>
                      <button
                        className="unique-action-button-formevaluatordashboard edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(form);
                        }}
                        data-tooltip-id="edit-tooltip"
                        data-tooltip-content="Edit"
                      >
                        <AiOutlineEdit className="unique-action-iconevaluatordashboard" />
                        <div className="tooltip">Edit</div>
                      </button>
                      <button
                        className="unique-action-button-formevaluatordashboard delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteForm(form);
                        }}
                        data-tooltip-id="delete-tooltip"
                        data-tooltip-content="Delete"
                      >
                        <AiOutlineDelete className="unique-action-iconevaluatordashboard" />
                        <div className="tooltip">Delete</div>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-container-formevaluatordashboard">
              <div className="pagination-formevaluatordashboard">
                <FaChevronLeft
                  className={`pagination-arrow-formevaluatordashboard ${
                    currentPage === 1 && "disabled"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                <span className="page-number-formevaluatordashboard">
                  <span className="current-page-formevaluatordashboard">
                    {currentPage}
                  </span>{" "}
                  / {totalPages}
                </span>
                <FaChevronRight
                  className={`pagination-arrow-formevaluatordashboard ${
                    currentPage === totalPages && "disabled"
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </div>
              <div className="exporttablepage-formevaluatordashboard">
                <div className="rows-per-page-formevaluatordashboard">
                  <label>Rows per page</label>
                  <select
                    value={formsPerPage}
                    onChange={handleRowsPerPageChange}
                  >
                    {[5, 10, 15, 20].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="table-bottom-borderevaluatordashboard"></div>
          </div>
        </section>
        {isAddModalOpen && (
          <EvaluatorDashboardAddNewFormModal
            closeModal={closeAddModal}
            addForm={addForm}
          />
        )}
        {isEditModalOpen && (
          <EvaluatorDashboardEditFormModal
            closeModal={closeEditModal}
            form={currentForm}
            updateForm={updateForm}
          />
        )}
        {isShareModalOpen && (
          <ShareFormModal closeModal={closeShareModal} form={currentForm} />
        )}
        <ToastContainer position="bottom-right" />
      </main>
    </div>
  );
}

export default EvaluatorDashboard;

/////before navbar name and email

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBell, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { CgNotes } from "react-icons/cg";
// import {
//   AiOutlineEye,
//   AiOutlineEdit,
//   AiOutlineDelete,
//   AiOutlineShareAlt,
// } from "react-icons/ai";
// import { FiMenu } from "react-icons/fi";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import EvaluatorDashboardAddNewFormModal from "./EvaluatorDashboardAddNewFormModal";
// import EvaluatorDashboardEditFormModal from "./EvaluatorDashboardEditFormModal";
// import ShareFormModal from "./ShareFormModal";
// import { confirmAlert } from "react-confirm-alert";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import { ToastContainer, toast } from "react-toastify";
// import { Tooltip } from "react-tooltip";
// import "react-tooltip/dist/react-tooltip.css";
// import "./EvaluatorDashboard.css";
// import "../Shared/Sidebar2.css";

// function EvaluatorDashboard() {
//   const [evaluatorForms, setEvaluatorForms] = useState([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isShareModalOpen, setIsShareModalOpen] = useState(false);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEvaluatorForms();
//   }, []);

//   const fetchEvaluatorForms = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/evaluationForms");
//       const data = await response.json();
//       setEvaluatorForms(data);
//     } catch (error) {
//       console.error("Error fetching evaluator forms:", error);
//     }
//   };

//   const openAddModal = () => {
//     setIsAddModalOpen(true);
//   };

//   const closeAddModal = () => {
//     setIsAddModalOpen(false);
//   };

//   const openEditModal = (form) => {
//     setCurrentForm(form);
//     setIsEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setCurrentForm(null);
//   };

//   const openShareModal = (form) => {
//     setCurrentForm(form);
//     setIsShareModalOpen(true);
//   };

//   const closeShareModal = () => {
//     setIsShareModalOpen(false);
//     setCurrentForm(null);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="custom-ui-delete-evaevaluatordashboard">
//             <h2
//               style={{
//                 fontSize: "24px",
//                 textAlign: "center",
//                 marginBottom: "15PX",
//               }}
//             >
//               Confirm to Delete
//             </h2>
//             <p style={{ textAlign: "center", marginBottom: "15PX" }}>
//               Form structure will be lost. Are you sure you want to delete this
//               form?
//             </p>
//             <div
//               style={{ display: "flex", justifyContent: "center", gap: "10px" }}
//             >
//               <button
//                 className="delete-button-alert-yes-evaevaluatordashboard"
//                 // style={{
//                 //   backgroundColor: '#dc3545',
//                 //   color: '#fff',
//                 //   border: 'none',
//                 //   padding: '10px 20px',
//                 //   borderRadius: '4px',
//                 //   cursor: 'pointer',
//                 // }}
//                 onClick={async () => {
//                   try {
//                     await fetch(
//                       `http://localhost:5000/api/evaluationForms/${formToDelete._id}`,
//                       {
//                         method: "DELETE",
//                       }
//                     );
//                     const updatedForms = evaluatorForms.filter(
//                       (form) => form._id !== formToDelete._id
//                     );
//                     setEvaluatorForms(updatedForms);
//                     localStorage.setItem(
//                       "evaluatorForms",
//                       JSON.stringify(updatedForms)
//                     );
//                     onClose();
//                   } catch (error) {
//                     console.error("Error deleting form:", error);
//                     onClose();
//                   }
//                 }}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 className="modal-button-cancel-no-evaevaluatordashboard"
//                 // style={{
//                 //   backgroundColor: '#007bff',
//                 //   color: '#fff',
//                 //   border: 'none',
//                 //   padding: '10px 20px',
//                 //   borderRadius: '4px',
//                 //   cursor: 'pointer',
//                 // }}
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-delete-evaevaluatordashboard",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/evaluationForms/form-structure/${form._id}`
//       );
//       if (response.status === 404) {
//         navigate("/evaluator-form", {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//         return;
//       }
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error);
//       }
//       const formStructure = await response.json();
//       if (formStructure.fields.length > 0) {
//         navigate("/evaluator-form-preview", {
//           state: {
//             formElements: formStructure.fields,
//             formTitle: formStructure.title,
//             formId: form._id,
//           },
//         });
//       } else {
//         navigate("/evaluator-form", {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching form structure:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const addForm = (form) => {
//     const updatedForms = [...evaluatorForms, form];
//     setEvaluatorForms(updatedForms);
//     localStorage.setItem("evaluatorForms", JSON.stringify(updatedForms));
//   };

//   const updateForm = (form) => {
//     const updatedForms = evaluatorForms.map((f) =>
//       f._id === form._id ? form : f
//     );
//     setEvaluatorForms(updatedForms);
//     localStorage.setItem("evaluatorForms", JSON.stringify(updatedForms));
//   };

//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = evaluatorForms.filter((form) =>
//     form.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const currentFilteredForms = filteredForms.slice(
//     indexOfFirstForm,
//     indexOfLastForm
//   );
//   const totalPages = Math.ceil(filteredForms.length / formsPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setFormsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };
//   return (
//     <div className="dashboard-formevaluatordashboard">
//       <aside className="sidebar">
//         <div className="logo-container">
//           <div className="logo">
//             <img
//               src="/navbar/drishtilogo.jpg"
//               alt="Logo"
//               className="dristilogo"
//             />
//           </div>
//         </div>
//         <div className="nav-container" style={{ marginTop: "90px" }}>
//           <nav className="nav">
//             <ul>
//               <li>
//                 {/* <Link to="/form">
//                   <CgNotes className="nav-icon" /> General Form
//                 </Link> */}
//                 <Link to="/form">
//                   <CgNotes className="nav-icon" /> Create Query Form
//                 </Link>
//               </li>
//               <li>
//                 {/* <Link to="/evaluator-dashboard">
//                   <AiOutlineEye className="nav-icon" /> Evaluator Form
//                 </Link> */}
//                 <Link to="/evaluator-dashboard">
//                   <AiOutlineEye className="nav-icon" /> Create Evaluation Form
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>
//       <main className="main-content-formevaluatordashboard">
//         <header className="header-formevaluatordashboard">
//           <span className="founder-formevaluatordashboard">
//             Program Manager
//           </span>
//           <div className="profile-section-formevaluatordashboard">
//             <div className="user-info-formevaluatordashboard">
//               <img
//                 src="/navbar/profilepicture.png"
//                 alt="User Avatar"
//                 className="user-initials-formevaluatordashboard"
//               />
//               <div className="user-details-formevaluatordashboard">
//                 <span className="user-name-formevaluatordashboard">
//                   Program Mang{" "}
//                   <RiArrowDropDownLine className="drop-formevaluatordashboard" />
//                 </span>
//                 <br />
//                 <span className="user-email-formevaluatordashboard">
//                   manager@mail.com
//                 </span>
//               </div>
//             </div>
//             <button
//               className="logout-button-formevaluatordashboard"
//               onClick={handleLogout} // Assuming you have a handleLogout function defined
//               style={{ marginLeft: "20px" }}
//             >
//               Logout
//             </button>
//           </div>
//         </header>
//         <section className="content-formevaluatordashboard">
//           <div className="content-header-formevaluatordashboard">
//             <h3>Evaluator Form</h3>
//             <input
//               type="text"
//               placeholder="Search by title"
//               className="search-bar-formevaluatordashboard"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <div className="unique-button-containerevaluatordashboard">
//               <button
//                 className="unique-add-form-buttonevaluatordashboard"
//                 onClick={openAddModal}
//               >
//                 + Add New
//               </button>
//               <button
//                 className="unique-evaluation-startup-buttonevaluatordashboard"
//                 onClick={() => navigate("/evaluation-startup")}
//               >
//                 Evaluation Startup
//               </button>
//             </div>
//           </div>
//           <div className="form-list-formevaluatordashboard">
//             <table className="form-table-formevaluatordashboard">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th style={{ paddingLeft: "35px" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td
//                       onClick={() => handleFormClick(form)}
//                       className="eva-form-titleevaluatordashboard"
//                     >
//                       {form.title}
//                     </td>
//                     <td>{form.lastModified}</td>
//                     <td>
//                       <button
//                         className="unique-action-button-formevaluatordashboard share"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openShareModal(form);
//                         }}
//                         data-tooltip-id="share-tooltip"
//                         data-tooltip-content="Share"
//                       >
//                         <AiOutlineShareAlt className="unique-action-iconevaluatordashboard" />
//                         <div className="tooltip">Share</div>
//                       </button>
//                       <button
//                         className="unique-action-button-formevaluatordashboard edit"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openEditModal(form);
//                         }}
//                         data-tooltip-id="edit-tooltip"
//                         data-tooltip-content="Edit"
//                       >
//                         <AiOutlineEdit className="unique-action-iconevaluatordashboard" />
//                         <div className="tooltip">Edit</div>
//                       </button>
//                       <button
//                         className="unique-action-button-formevaluatordashboard delete"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           deleteForm(form);
//                         }}
//                         data-tooltip-id="delete-tooltip"
//                         data-tooltip-content="Delete"
//                       >
//                         <AiOutlineDelete className="unique-action-iconevaluatordashboard" />
//                         <div className="tooltip">Delete</div>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pagination-container-formevaluatordashboard">
//               <div className="pagination-formevaluatordashboard">
//                 <FaChevronLeft
//                   className={`pagination-arrow-formevaluatordashboard ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                 />
//                 <span className="page-number-formevaluatordashboard">
//                   <span className="current-page-formevaluatordashboard">
//                     {currentPage}
//                   </span>{" "}
//                   / {totalPages}
//                 </span>
//                 <FaChevronRight
//                   className={`pagination-arrow-formevaluatordashboard ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                 />
//               </div>
//               <div className="exporttablepage-formevaluatordashboard">
//                 <div className="rows-per-page-formevaluatordashboard">
//                   <label>Rows per page</label>
//                   <select
//                     value={formsPerPage}
//                     onChange={handleRowsPerPageChange}
//                   >
//                     {[5, 10, 15, 20].map((size) => (
//                       <option key={size} value={size}>
//                         {size}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//             <div className="table-bottom-borderevaluatordashboard"></div>
//           </div>
//         </section>
//         {isAddModalOpen && (
//           <EvaluatorDashboardAddNewFormModal
//             closeModal={closeAddModal}
//             addForm={addForm}
//           />
//         )}
//         {isEditModalOpen && (
//           <EvaluatorDashboardEditFormModal
//             closeModal={closeEditModal}
//             form={currentForm}
//             updateForm={updateForm}
//           />
//         )}
//         {isShareModalOpen && (
//           <ShareFormModal closeModal={closeShareModal} form={currentForm} />
//         )}
//         <ToastContainer position="bottom-right" />
//       </main>
//     </div>
//   );
// }

// export default EvaluatorDashboard;

// //////////////tostify message bottom right
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaBell, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import { CgNotes } from 'react-icons/cg';
// import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineShareAlt } from 'react-icons/ai';
// import { FiMenu } from 'react-icons/fi';
// import { RiArrowDropDownLine } from 'react-icons/ri';
// import EvaluatorDashboardAddNewFormModal from './EvaluatorDashboardAddNewFormModal';
// import EvaluatorDashboardEditFormModal from './EvaluatorDashboardEditFormModal';
// import ShareFormModal from './ShareFormModal';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import { ToastContainer, toast } from "react-toastify";
// import { Tooltip } from 'react-tooltip';
// import 'react-tooltip/dist/react-tooltip.css';
// import './EvaluatorDashboard.css';
// import '../Shared/Sidebar2.css';

// function EvaluatorDashboard() {
//   const [evaluatorForms, setEvaluatorForms] = useState([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isShareModalOpen, setIsShareModalOpen] = useState(false);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEvaluatorForms();
//   }, []);

//   const fetchEvaluatorForms = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/evaluationForms');
//       const data = await response.json();
//       setEvaluatorForms(data);
//     } catch (error) {
//       console.error('Error fetching evaluator forms:', error);
//     }
//   };

//   const openAddModal = () => {
//     setIsAddModalOpen(true);
//   };

//   const closeAddModal = () => {
//     setIsAddModalOpen(false);
//   };

//   const openEditModal = (form) => {
//     setCurrentForm(form);
//     setIsEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setCurrentForm(null);
//   };

//   const openShareModal = (form) => {
//     setCurrentForm(form);
//     setIsShareModalOpen(true);
//   };

//   const closeShareModal = () => {
//     setIsShareModalOpen(false);
//     setCurrentForm(null);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="custom-ui-delete-evaevaluatordashboard">
//             <h2 style={{ fontSize: "24px", textAlign: "center", marginBottom:'15PX' }}>Confirm to Delete</h2>
//             <p style={{ textAlign: "center", marginBottom:'15PX'  }}>Form structure will be lost. Are you sure you want to delete this form?</p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
//               <button
//                 style={{
//                   backgroundColor: '#dc3545',
//                   color: '#fff',
//                   border: 'none',
//                   padding: '10px 20px',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//                 onClick={async () => {
//                   try {
//                     await fetch(`http://localhost:5000/api/evaluationForms/${formToDelete._id}`, {
//                       method: 'DELETE',
//                     });
//                     const updatedForms = evaluatorForms.filter(
//                       (form) => form._id !== formToDelete._id
//                     );
//                     setEvaluatorForms(updatedForms);
//                     localStorage.setItem('evaluatorForms', JSON.stringify(updatedForms));
//                     onClose();
//                   } catch (error) {
//                     console.error('Error deleting form:', error);
//                     onClose();
//                   }
//                 }}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 style={{
//                   backgroundColor: '#007bff',
//                   color: '#fff',
//                   border: 'none',
//                   padding: '10px 20px',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-delete-evaevaluatordashboard",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/evaluationForms/form-structure/${form._id}`);
//       if (response.status === 404) {
//         navigate('/evaluator-form', {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//         return;
//       }
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error);
//       }
//       const formStructure = await response.json();
//       if (formStructure.fields.length > 0) {
//         navigate('/evaluator-form-preview', {
//           state: { formElements: formStructure.fields, formTitle: formStructure.title, formId: form._id },
//         });
//       } else {
//         navigate('/evaluator-form', {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching form structure:', error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const addForm = (form) => {
//     const updatedForms = [...evaluatorForms, form];
//     setEvaluatorForms(updatedForms);
//     localStorage.setItem('evaluatorForms', JSON.stringify(updatedForms));
//   };

//   const updateForm = (form) => {
//     const updatedForms = evaluatorForms.map((f) =>
//       f._id === form._id ? form : f
//     );
//     setEvaluatorForms(updatedForms);
//     localStorage.setItem('evaluatorForms', JSON.stringify(updatedForms));
//   };

//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = evaluatorForms.filter((form) =>
//     form.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const currentFilteredForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);
//   const totalPages = Math.ceil(filteredForms.length / formsPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setFormsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const copyLinkToClipboard = () => {
//     navigator.clipboard.writeText(currentForm.link).then(() => {
//       toast.success("Link copied to clipboard!");
//     }).catch((err) => {
//       console.error("Error copying link:", err);
//     });
//   };

//   return (
//     <div className="dashboard-formevaluatordashboard">
//       <aside className="sidebar">
//         <div className="logo-container">
//           <div className="logo">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="dristilogo" />
//           </div>
//         </div>
//         <div className="nav-container" style={{marginTop:"90px"}}>
//           <nav className="nav" >
//             <ul>
//               <li>
//                 <Link to="/form">
//                   <CgNotes className="nav-icon" /> General Form
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/evaluator-dashboard">
//                   <AiOutlineEye className="nav-icon" /> Evaluator Form
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>
//       <main className="main-content-formevaluatordashboard">
//         <header className="header-formevaluatordashboard">
//           <span className="founder-formevaluatordashboard">
//             <FiMenu style={{ color: '#909090' }} /> Program Manager
//           </span>
//           <div className="profile-section-formevaluatordashboard">
//             <div>
//               <FaBell className="notification-icon-formevaluatordashboard" />
//             </div>
//             <div className="user-info-formevaluatordashboard">
//               <img
//                 src="/navbar/profilepicture.png"
//                 alt="User Avatar"
//                 className="user-initials-formevaluatordashboard"
//               />
//               <div className="user-details-formevaluatordashboard">
//                 <span className="user-name-formevaluatordashboard">
//                   Program Mang <RiArrowDropDownLine className="drop-formevaluatordashboard" />
//                 </span>
//                 <br />
//                 <span className="user-email-formevaluatordashboard">manager@mail.com</span>
//               </div>
//             </div>
//           </div>
//         </header>
//         <section className="content-formevaluatordashboard">
//           <div className="content-header-formevaluatordashboard">
//             <h2>Evaluator Form</h2>
//             <input
//               type="text"
//               placeholder="Search by title"
//               className="search-bar-formevaluatordashboard"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <div className="unique-button-containerevaluatordashboard">
//               <button className="unique-add-form-buttonevaluatordashboard" onClick={openAddModal}>
//                 + Add New
//               </button>
//               <button
//                 className="unique-evaluation-startup-buttonevaluatordashboard"
//                 onClick={() => navigate('/evaluation-startup')}
//               >
//                 Evaluation Startup
//               </button>
//             </div>
//           </div>
//           <div className="form-list-formevaluatordashboard">
//             <table className="form-table-formevaluatordashboard">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th style={{paddingLeft:"35px"}}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td
//                       onClick={() => handleFormClick(form)}
//                       className="eva-form-titleevaluatordashboard"
//                     >
//                       {form.title}
//                     </td>
//                     <td>{form.lastModified}</td>
//                     <td>
//                       <button
//                         className="unique-action-button-formevaluatordashboard share"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openShareModal(form);
//                         }}
//                         data-tooltip-id="share-tooltip"
//                         data-tooltip-content="Share"
//                       >
//                         <AiOutlineShareAlt className="unique-action-iconevaluatordashboard" />
//                         <div className="tooltip">Share</div>
//                       </button>
//                       <button
//                         className="unique-action-button-formevaluatordashboard edit"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openEditModal(form);
//                         }}
//                         data-tooltip-id="edit-tooltip"
//                         data-tooltip-content="Edit"
//                       >
//                         <AiOutlineEdit className="unique-action-iconevaluatordashboard" />
//                         <div className="tooltip">Edit</div>
//                       </button>
//                       <button
//                         className="unique-action-button-formevaluatordashboard delete"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           deleteForm(form);
//                         }}
//                         data-tooltip-id="delete-tooltip"
//                         data-tooltip-content="Delete"
//                       >
//                         <AiOutlineDelete className="unique-action-iconevaluatordashboard" />
//                         <div className="tooltip">Delete</div>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pagination-container-formevaluatordashboard">
//               <div className="pagination-formevaluatordashboard">
//                 <FaChevronLeft
//                   className={`pagination-arrow-formevaluatordashboard ${currentPage === 1 && 'disabled'}`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                 />
//                 <span className="page-number-formevaluatordashboard">
//                   <span className="current-page-formevaluatordashboard">{currentPage}</span> / {totalPages}
//                 </span>
//                 <FaChevronRight
//                   className={`pagination-arrow-formevaluatordashboard ${currentPage === totalPages && 'disabled'}`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                 />
//               </div>
//               <div className="exporttablepage-formevaluatordashboard">
//                 <div className="rows-per-page-formevaluatordashboard">
//                   <label>Rows per page</label>
//                   <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//                     {[5, 10, 15, 20].map(size => (
//                       <option key={size} value={size}>{size}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//             <div className="table-bottom-borderevaluatordashboard"></div>
//           </div>
//         </section>
//         {isAddModalOpen && (
//           <EvaluatorDashboardAddNewFormModal
//             closeModal={closeAddModal}
//             addForm={addForm}
//           />
//         )}
//         {isEditModalOpen && (
//           <EvaluatorDashboardEditFormModal
//             closeModal={closeEditModal}
//             form={currentForm}
//             updateForm={updateForm}
//           />
//         )}
//         {isShareModalOpen && (
//           <ShareFormModal
//             closeModal={closeShareModal}
//             form={currentForm}
//             copyLinkToClipboard={copyLinkToClipboard} // Highlighted: Pass the function to the ShareFormModal
//           />
//         )}
//         <ToastContainer position="bottom-right" /> {/* Highlighted: Ensure ToastContainer is positioned at the bottom right */}
//       </main>
//     </div>
//   );
// }

// export default EvaluatorDashboard;

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaBell, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa';
// import { CgNotes } from 'react-icons/cg';
// import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineShareAlt } from 'react-icons/ai';
// import { FiMenu } from 'react-icons/fi';
// import { RiArrowDropDownLine } from 'react-icons/ri';
// import EvaluatorDashboardAddNewFormModal from './EvaluatorDashboardAddNewFormModal';
// import EvaluatorDashboardEditFormModal from './EvaluatorDashboardEditFormModal';
// import ShareFormModal from './ShareFormModal';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import './EvaluatorDashboard.css';
// import '../Shared/Sidebar2.css';

// function EvaluatorDashboard() {
//   const [evaluatorForms, setEvaluatorForms] = useState([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isShareModalOpen, setIsShareModalOpen] = useState(false);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState(''); // Add searchTerm state
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEvaluatorForms();
//   }, []);

//   const fetchEvaluatorForms = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/evaluationForms');
//       const data = await response.json();
//       setEvaluatorForms(data);
//     } catch (error) {
//       console.error('Error fetching evaluator forms:', error);
//     }
//   };

//   const openAddModal = () => {
//     setIsAddModalOpen(true);
//   };

//   const closeAddModal = () => {
//     setIsAddModalOpen(false);
//   };

//   const openEditModal = (form) => {
//     setCurrentForm(form);
//     setIsEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setCurrentForm(null);
//   };

//   const openShareModal = (form) => {
//     setCurrentForm(form);
//     setIsShareModalOpen(true);
//   };

//   const closeShareModal = () => {
//     setIsShareModalOpen(false);
//     setCurrentForm(null);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="custom-ui-delete-evaevaluatordashboard">
//             <h2 style={{ fontSize: '24px', textAlign: 'center' }}>Confirm to Delete</h2>
//             <p style={{ textAlign: 'center' }}>Form structure will be lost. Are you sure you want to delete this form?</p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
//               <button
//                 style={{
//                   backgroundColor: '#dc3545',
//                   color: '#fff',
//                   border: 'none',
//                   padding: '10px 20px',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//                 onClick={async () => {
//                   try {
//                     await fetch(`http://localhost:5000/api/evaluationForms/${formToDelete._id}`, {
//                       method: 'DELETE',
//                     });
//                     const updatedForms = evaluatorForms.filter(
//                       (form) => form._id !== formToDelete._id
//                     );
//                     setEvaluatorForms(updatedForms);
//                     localStorage.setItem('evaluatorForms', JSON.stringify(updatedForms));
//                     onClose();
//                   } catch (error) {
//                     console.error('Error deleting form:', error);
//                     onClose();
//                   }
//                 }}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 style={{
//                   backgroundColor: '#007bff',
//                   color: '#fff',
//                   border: 'none',
//                   padding: '10px 20px',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-delete-evaevaluatordashboard",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/evaluationForms/form-structure/${form._id}`);
//       if (response.status === 404) {
//         navigate('/evaluator-form', {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//         return;
//       }
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error);
//       }
//       const formStructure = await response.json();
//       if (formStructure.fields.length > 0) {
//         navigate('/evaluator-form-preview', {
//           state: { formElements: formStructure.fields, formTitle: formStructure.title, formId: form._id },
//         });
//       } else {
//         navigate('/evaluator-form', {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching form structure:', error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const addForm = (form) => {
//     const updatedForms = [...evaluatorForms, form];
//     setEvaluatorForms(updatedForms);
//     localStorage.setItem('evaluatorForms', JSON.stringify(updatedForms));
//   };

//   const updateForm = (form) => {
//     const updatedForms = evaluatorForms.map((f) =>
//       f._id === form._id ? form : f
//     );
//     setEvaluatorForms(updatedForms);
//     localStorage.setItem('evaluatorForms', JSON.stringify(updatedForms));
//   };

//   // Pagination related calculations
//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = evaluatorForms.filter((form) =>
//     form.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const currentFilteredForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);
//   const totalPages = Math.ceil(filteredForms.length / formsPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setFormsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   return (
//     <div className="dashboard-formevaluatordashboard">
//       <aside className="sidebar">
//         <div className="logo-container">
//            <div className="logo">
//              <img src="/navbar/drishtilogo.jpg" alt="Logo" className="dristilogo" />
//            </div>
//          </div>
//          <div className="nav-container" style={{marginTop:"90px"}}>
//          <nav className="nav" >
//            <ul>
//                <li>
//                  <Link to="/form">
//                    <CgNotes className="nav-icon" /> General Form
//                  </Link>
//                </li>
//               <li>
//                 <Link to="/evaluator-dashboard">
//                   <AiOutlineEye className="nav-icon" /> Evaluator Form
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>
//       <main className="main-content-formevaluatordashboard">
//         <header className="header-formevaluatordashboard">
//           <span className="founder-formevaluatordashboard">
//             <FiMenu style={{ color: '#909090' }} /> Program Manager
//           </span>
//           <div className="profile-section-formevaluatordashboard">
//             <div>
//               <FaBell className="notification-icon-formevaluatordashboard" />
//             </div>
//             <div className="user-info-formevaluatordashboard">
//               <img
//                 src="/navbar/profilepicture.png"
//                 alt="User Avatar"
//                 className="user-initials-formevaluatordashboard"
//               />
//               <div className="user-details-formevaluatordashboard">
//                 <span className="user-name-formevaluatordashboard">
//                   Program Mang <RiArrowDropDownLine className="drop-formevaluatordashboard" />
//                 </span>
//                 <br />
//                 <span className="user-email-formevaluatordashboard">manager@mail.com</span>
//               </div>
//             </div>
//           </div>
//         </header>
//         <section className="content-formevaluatordashboard">
//           <div className="content-header-formevaluatordashboard">
//             <h2>Evaluator Form</h2>
//             <input
//             type="text"
//             placeholder="Search by title"
//             className="search-bar-formevaluatordashboard"
//             value={searchTerm} // Add value and onChange
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//             <div className="unique-button-containerevaluatordashboard">
//               <button className="unique-add-form-buttonevaluatordashboard" onClick={openAddModal}>
//                 + Add New
//               </button>
//               <button
//                 className="unique-evaluation-startup-buttonevaluatordashboard"
//                 onClick={() => navigate('/evaluation-startup')}
//               >
//                 Evaluation Startup
//               </button>
//             </div>
//           </div>
//           <div className="form-list-formevaluatordashboard">
//             <table className="form-table-formevaluatordashboard">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th style={{paddingLeft:"35px"}}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td
//                       onClick={() => handleFormClick(form)}
//                       className="eva-form-titleevaluatordashboard"
//                     >
//                       {form.title}
//                     </td>
//                     <td>{form.lastModified}</td>
//                     <td>
//                       <button
//                         className="unique-action-button-formevaluatordashboard share"
//                         title="Share"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openShareModal(form);
//                         }}
//                       >
//                         <AiOutlineShareAlt className="unique-action-iconevaluatordashboard" />
//                       </button>
//                       <button
//                         className="unique-action-button-formevaluatordashboard edit"
//                         title="Edit"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openEditModal(form);
//                         }}
//                       >
//                         <AiOutlineEdit className="unique-action-iconevaluatordashboard" />
//                       </button>
//                       <button
//                         className="unique-action-button-formevaluatordashboard delete"
//                         title="Delete"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           deleteForm(form);
//                         }}
//                       >
//                         <AiOutlineDelete className="unique-action-iconevaluatordashboard" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           <div className="pagination-container-formevaluatordashboard">
//             <div className="pagination-formevaluatordashboard">
//               <FaChevronLeft
//                 className={`pagination-arrow-formevaluatordashboard ${currentPage === 1 && 'disabled'}`}
//                 onClick={() => handlePageChange(currentPage - 1)}
//               />
//               <span className="page-number-formevaluatordashboard">
//                 <span className="current-page-formevaluatordashboard">{currentPage}</span> / {totalPages}
//               </span>
//               <FaChevronRight
//                 className={`pagination-arrow-formevaluatordashboard ${currentPage === totalPages && 'disabled'}`}
//                 onClick={() => handlePageChange(currentPage + 1)}
//               />
//             </div>
//             <div className="exporttablepage-formevaluatordashboard">
//               <div className="rows-per-page-formevaluatordashboard">
//                 <label>Rows per page</label>
//                 <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//                   {[5, 10, 15, 20].map(size => (
//                     <option key={size} value={size}>{size}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//           <div className="table-bottom-borderevaluatordashboard"></div>
//           </div>
//         </section>
//         {isAddModalOpen && (
//           <EvaluatorDashboardAddNewFormModal
//             closeModal={closeAddModal}
//             addForm={addForm}
//           />
//         )}
//         {isEditModalOpen && (
//           <EvaluatorDashboardEditFormModal
//             closeModal={closeEditModal}
//             form={currentForm}
//             updateForm={updateForm}
//           />
//         )}
//         {isShareModalOpen && (
//           <ShareFormModal
//             closeModal={closeShareModal}
//             form={currentForm}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

// export default EvaluatorDashboard;

/////b npm install react-tooltip

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaBell, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa';
// import { CgNotes } from 'react-icons/cg';
// import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineShareAlt } from 'react-icons/ai';
// import { FiMenu } from 'react-icons/fi';
// import { RiArrowDropDownLine } from 'react-icons/ri';
// import EvaluatorDashboardAddNewFormModal from './EvaluatorDashboardAddNewFormModal';
// import EvaluatorDashboardEditFormModal from './EvaluatorDashboardEditFormModal';
// import ShareFormModal from './ShareFormModal';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import './EvaluatorDashboard.css';
// import '../Shared/Sidebar2.css';

// function EvaluatorDashboard() {
//   const [evaluatorForms, setEvaluatorForms] = useState([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isShareModalOpen, setIsShareModalOpen] = useState(false);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState(''); // Add searchTerm state
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEvaluatorForms();
//   }, []);

//   const fetchEvaluatorForms = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/evaluationForms');
//       const data = await response.json();
//       setEvaluatorForms(data);
//     } catch (error) {
//       console.error('Error fetching evaluator forms:', error);
//     }
//   };

//   const openAddModal = () => {
//     setIsAddModalOpen(true);
//   };

//   const closeAddModal = () => {
//     setIsAddModalOpen(false);
//   };

//   const openEditModal = (form) => {
//     setCurrentForm(form);
//     setIsEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setCurrentForm(null);
//   };

//   const openShareModal = (form) => {
//     setCurrentForm(form);
//     setIsShareModalOpen(true);
//   };

//   const closeShareModal = () => {
//     setIsShareModalOpen(false);
//     setCurrentForm(null);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="custom-ui-delete-evaevaluatordashboard">
//             <h2 style={{ fontSize: '24px', textAlign: 'center' }}>Confirm to Delete</h2>
//             <p style={{ textAlign: 'center' }}>Form structure will be lost. Are you sure you want to delete this form?</p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
//               <button
//                 style={{
//                   backgroundColor: '#dc3545',
//                   color: '#fff',
//                   border: 'none',
//                   padding: '10px 20px',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//                 onClick={async () => {
//                   try {
//                     await fetch(`http://localhost:5000/api/evaluationForms/${formToDelete._id}`, {
//                       method: 'DELETE',
//                     });
//                     const updatedForms = evaluatorForms.filter(
//                       (form) => form._id !== formToDelete._id
//                     );
//                     setEvaluatorForms(updatedForms);
//                     localStorage.setItem('evaluatorForms', JSON.stringify(updatedForms));
//                     onClose();
//                   } catch (error) {
//                     console.error('Error deleting form:', error);
//                     onClose();
//                   }
//                 }}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 style={{
//                   backgroundColor: '#007bff',
//                   color: '#fff',
//                   border: 'none',
//                   padding: '10px 20px',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-delete-evaevaluatordashboard",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/evaluationForms/form-structure/${form._id}`);
//       if (response.status === 404) {
//         navigate('/evaluator-form', {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//         return;
//       }
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error);
//       }
//       const formStructure = await response.json();
//       if (formStructure.fields.length > 0) {
//         navigate('/evaluator-form-preview', {
//           state: { formElements: formStructure.fields, formTitle: formStructure.title, formId: form._id },
//         });
//       } else {
//         navigate('/evaluator-form', {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching form structure:', error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const addForm = (form) => {
//     const updatedForms = [...evaluatorForms, form];
//     setEvaluatorForms(updatedForms);
//     localStorage.setItem('evaluatorForms', JSON.stringify(updatedForms));
//   };

//   const updateForm = (form) => {
//     const updatedForms = evaluatorForms.map((f) =>
//       f._id === form._id ? form : f
//     );
//     setEvaluatorForms(updatedForms);
//     localStorage.setItem('evaluatorForms', JSON.stringify(updatedForms));
//   };

//   // Pagination related calculations
//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = evaluatorForms.filter((form) =>
//     form.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const currentFilteredForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);
//   const totalPages = Math.ceil(filteredForms.length / formsPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setFormsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   return (
//     <div className="dashboard-formevaluatordashboard">
//       <aside className="sidebar">
//         <div className="logo-container">
//            <div className="logo">
//              <img src="/navbar/drishtilogo.jpg" alt="Logo" className="dristilogo" />
//            </div>
//          </div>
//          <div className="nav-container" style={{marginTop:"90px"}}>
//          <nav className="nav" >
//            <ul>
//                <li>
//                  <Link to="/form">
//                    <CgNotes className="nav-icon" /> General Form
//                  </Link>
//                </li>
//               <li>
//                 <Link to="/evaluator-dashboard">
//                   <AiOutlineEye className="nav-icon" /> Evaluator Form
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>
//       <main className="main-content-formevaluatordashboard">
//         <header className="header-formevaluatordashboard">
//           <span className="founder-formevaluatordashboard">
//             <FiMenu style={{ color: '#909090' }} /> Program Manager
//           </span>
//           {/* <input
//             type="text"
//             placeholder="Search by title"
//             className="search-bar-formevaluatordashboard"
//             value={searchTerm} // Add value and onChange
//             onChange={(e) => setSearchTerm(e.target.value)}
//           /> */}
//           <div className="profile-section-formevaluatordashboard">
//             <div>
//               <FaBell className="notification-icon-formevaluatordashboard" />
//             </div>
//             <div className="user-info-formevaluatordashboard">
//               <img
//                 src="/navbar/profilepicture.png"
//                 alt="User Avatar"
//                 className="user-initials-formevaluatordashboard"
//               />
//               <div className="user-details-formevaluatordashboard">
//                 <span className="user-name-formevaluatordashboard">
//                   Program Mang <RiArrowDropDownLine className="drop-formevaluatordashboard" />
//                 </span>
//                 <br />
//                 <span className="user-email-formevaluatordashboard">manager@mail.com</span>
//               </div>
//             </div>
//           </div>
//         </header>
//         <section className="content-formevaluatordashboard">
//           <div className="content-header-formevaluatordashboard">
//             <h2>Evaluator Form</h2>
//             <input
//             type="text"
//             placeholder="Search by title"
//             className="search-bar-formevaluatordashboard"
//             value={searchTerm} // Add value and onChange
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//             <div className="unique-button-containerevaluatordashboard">
//               <button className="unique-add-form-buttonevaluatordashboard" onClick={openAddModal}>
//                 + Add New
//               </button>
//               <button
//                 className="unique-evaluation-startup-buttonevaluatordashboard"
//                 onClick={() => navigate('/evaluation-startup')}
//               >
//                 Evaluation Startup
//               </button>
//             </div>
//           </div>
//           <div className="form-list-formevaluatordashboard">
//             <table className="form-table-formevaluatordashboard">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th style={{paddingLeft:"35px"}}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td
//                       onClick={() => handleFormClick(form)}
//                       className="eva-form-titleevaluatordashboard"
//                     >
//                       {form.title}
//                     </td>
//                     <td>{form.lastModified}</td>
//                     <td>
//                       <button
//                         className="unique-action-button-formevaluatordashboard share"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openShareModal(form);
//                         }}
//                       >
//                         <AiOutlineShareAlt className="unique-action-iconevaluatordashboard" />
//                       </button>
//                       <button
//                         className="unique-action-button-formevaluatordashboard edit"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openEditModal(form);
//                         }}
//                       >
//                         <AiOutlineEdit className="unique-action-iconevaluatordashboard" />
//                       </button>
//                       <button
//                         className="unique-action-button-formevaluatordashboard delete"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           deleteForm(form);
//                         }}
//                       >
//                         <AiOutlineDelete className="unique-action-iconevaluatordashboard" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           <div className="pagination-container-formevaluatordashboard">
//             <div className="pagination-formevaluatordashboard">
//               <FaChevronLeft
//                 className={`pagination-arrow-formevaluatordashboard ${currentPage === 1 && 'disabled'}`}
//                 onClick={() => handlePageChange(currentPage - 1)}
//               />
//               <span className="page-number-formevaluatordashboard">
//                 <span className="current-page-formevaluatordashboard">{currentPage}</span> / {totalPages}
//               </span>
//               <FaChevronRight
//                 className={`pagination-arrow-formevaluatordashboard ${currentPage === totalPages && 'disabled'}`}
//                 onClick={() => handlePageChange(currentPage + 1)}
//               />
//             </div>
//             <div className="exporttablepage-formevaluatordashboard">
//               <div className="rows-per-page-formevaluatordashboard">
//                 <label>Rows per page</label>
//                 <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//                   {[5, 10, 15, 20].map(size => (
//                     <option key={size} value={size}>{size}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//           <div className="table-bottom-borderevaluatordashboard"></div>
//           </div>
//         </section>
//         {isAddModalOpen && (
//           <EvaluatorDashboardAddNewFormModal
//             closeModal={closeAddModal}
//             addForm={addForm}
//           />
//         )}
//         {isEditModalOpen && (
//           <EvaluatorDashboardEditFormModal
//             closeModal={closeEditModal}
//             form={currentForm}
//             updateForm={updateForm}
//           />
//         )}
//         {isShareModalOpen && (
//           <ShareFormModal
//             closeModal={closeShareModal}
//             form={currentForm}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

// export default EvaluatorDashboard;
