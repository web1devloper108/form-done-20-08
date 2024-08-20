import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment"; // Import Moment.js
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
import AddNewFormModal from "./AddNewFormModal";
import EditFormModal from "./EditFormModal";
import ShareModal from "./ShareModal";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "./Form.css";

const Form = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);
  const [shareableLink, setShareableLink] = useState("");
  const [formDetails, setFormDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formsPerPage, setFormsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState({ name: "", email: "", username: "" }); // State for user data
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
    fetchUserData(); // Fetch user data on component mount
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/forms");
      const data = await response.json();

      const sortedForms = data.sort(
        (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
      );

      setForms(sortedForms);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/programmanagers/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

  const viewResponses = (formId) => {
    navigate(`/general-form-all-responses/${formId}`);
  };

  const addForm = (form) => {
    if (!form.lastModified) {
      form.lastModified = new Date().toISOString();
    }

    setForms([form, ...forms]); // Add the new form to the start of the array
  };

  const editForm = (updatedForm) => {
    const updatedForms = forms.map((form) =>
      form._id === updatedForm._id ? updatedForm : form
    );
    setForms(updatedForms);
  };

  const deleteForm = async (formToDelete) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="confirm-delete-ui">
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
                className="delete-button-alert-generalform"
                onClick={async () => {
                  try {
                    await fetch(
                      `http://localhost:5000/api/forms/${formToDelete._id}`,
                      { method: "DELETE" }
                    );
                    setForms(
                      forms.filter((form) => form._id !== formToDelete._id)
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
                className="modal-button-cancel-no-generalform"
                onClick={onClose}
              >
                No
              </button>
            </div>
          </div>
        );
      },
      overlayClassName: "confirm-delete-overlay",
    });
  };

  const handleFormClick = async (form) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/forms/general/${form._id}`
      );
      if (response.status === 404) {
        navigate("/form-builder", {
          state: {
            formElements: [],
            formTitle: form.title,
            formId: form._id,
          },
        });
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const formStructure = await response.json();
      if (formStructure.fields.length > 0) {
        navigate("/form-preview", {
          state: {
            formElements: formStructure.fields,
            formTitle: formStructure.title,
            formId: form._id,
          },
        });
      } else {
        navigate("/form-builder", {
          state: {
            formElements: [],
            formTitle: form.title,
            formId: form._id,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching form structure:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleShareClick = (formId) => {
    const link = `http://localhost:3000/public-form-preview/${formId}`;
    setShareableLink(link);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying link:", err);
      });
  };

  const closeShareModal = () => {
    setShareableLink("");
  };

  // Pagination related calculations
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const filteredForms = forms.filter((form) =>
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
    <div className="dashboard-form">
      {/* sidebar start */}
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
                <Link to="/form">
                  <CgNotes className="nav-icon" /> Create Query Form
                </Link>
              </li>
              <li>
                <Link to="/evaluator-dashboard">
                  <AiOutlineEye className="nav-icon" /> Create Evaluation Form
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      {/* sidebar end */}
      <main className="main-content-form">
        {/* navbar start */}
        <header className="header-form">
          <span className="founder-form">Program Manager</span>
          <div className="profile-section-form">
            <div className="user-info-form">
              <img
                src="/navbar/profilepicture.png" 
                alt="User Avatar"
                className="user-initials-form"
              />
              <div className="user-details-form">
                <span className="user-name-form">
                  {user.username} 
                </span>
                <br />
                <span className="user-email-form">{user.email}</span>
              </div> 
            </div>
            <button
              className="logout-button-form"
              onClick={handleLogout} // Ensure this function is defined in your component
              style={{ marginLeft: "20px" }} // Add any additional styling as needed
            >
              Logout
            </button>
          </div>
        </header>

        {/* navbar end */}
        <section className="content-form">
          <div className="content-header-form-generalform">
            <h3 className="header-title-generalform">Forms</h3>
            <div className="search-bar-container-generalform">
              <input
                type="text"
                placeholder="Search by title"
                className="search-bar-form-generalform"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="add-form-button-generalform"
              onClick={openAddModal}
            >
              + Add New
            </button>
          </div>

          <div className="form-list-form">
            <table className="form-table-form">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Last Modified</th>
                  <th>Category</th>
                  <th>Label</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentFilteredForms.map((form, index) => (
                  <tr key={index}>
                    <td
                      onClick={() => handleFormClick(form)}
                      className="form-title"
                    >
                      {form.title}
                    </td>
                    {/* HIGHLIGHT START: Format date using Moment.js */}
                    <td>{moment(form.lastModified).format("D/M/YYYY")}</td>
                    {/* HIGHLIGHT END */}
                    <td>{form.category}</td>
                    <td>{form.label}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="action-button-form share"
                        onClick={() => handleShareClick(form._id)}
                        data-tooltip-id="share-tooltip-form"
                        data-tooltip-content="Share"
                      >
                        <AiOutlineShareAlt className="action-icon" />
                        <div className="tooltip-form">Share</div>
                      </button>
                      <button
                        className="action-button-form edit"
                        onClick={() => openEditModal(form)}
                        data-tooltip-id="edit-tooltip-form"
                        data-tooltip-content="Edit"
                      >
                        <AiOutlineEdit className="action-icon" />
                        <div className="tooltip-form">Edit</div>
                      </button>
                      <button
                        className="action-button-form delete"
                        onClick={() => deleteForm(form)}
                        data-tooltip-id="delete-tooltip-form"
                        data-tooltip-content="Delete"
                      >
                        <AiOutlineDelete className="action-icon" />
                        <div className="tooltip-form">Delete</div>
                      </button>
                      <button
                        className="action-button-form view"
                        onClick={() => viewResponses(form._id)}
                        data-tooltip-id="view-tooltip-form"
                        data-tooltip-content="View"
                      >
                        <AiOutlineEye className="action-icon" />
                        <div className="tooltip-form">View Responses</div>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-container-form">
              <div className="pagination-form">
                <FaChevronLeft
                  className={`pagination-arrow-form ${
                    currentPage === 1 && "disabled"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                <span className="page-number-form">
                  <span className="current-page-form">{currentPage}</span> /{" "}
                  {totalPages}
                </span>
                <FaChevronRight
                  className={`pagination-arrow-form ${
                    currentPage === totalPages && "disabled"
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </div>
              <div className="rows-per-page-form">
                <label>Rows per page</label>
                <select value={formsPerPage} onChange={handleRowsPerPageChange}>
                  {[7, 10, 15, 20].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
        {isAddModalOpen && (
          <AddNewFormModal closeModal={closeAddModal} addForm={addForm} />
        )}
        {isEditModalOpen && (
          <EditFormModal
            closeModal={closeEditModal}
            form={currentForm}
            editForm={editForm}
          />
        )}
        {shareableLink && (
          <ShareModal
            shareableLink={shareableLink}
            copyLinkToClipboard={copyLinkToClipboard}
            closeShareModal={closeShareModal}
          />
        )}
        <ToastContainer position="bottom-right" />
      </main>
    </div>
  );
};

export default Form;







// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import moment from "moment"; // Import Moment.js
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
// import AddNewFormModal from "./AddNewFormModal";
// import EditFormModal from "./EditFormModal";
// import ShareModal from "./ShareModal";
// import { ToastContainer, toast } from "react-toastify";
// import { confirmAlert } from "react-confirm-alert";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import "react-toastify/dist/ReactToastify.css";
// import { Tooltip } from "react-tooltip";
// import "react-tooltip/dist/react-tooltip.css";
// import "./Form.css";

// const Form = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [forms, setForms] = useState([]);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [shareableLink, setShareableLink] = useState("");
//   const [formDetails, setFormDetails] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(7);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [user, setUser] = useState({ name: "", email: "" }); // State for user data
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchForms();
//     fetchUserData(); // Fetch user data on component mount
//   }, []);

//   const fetchForms = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/forms");
//       const data = await response.json();

//       const sortedForms = data.sort(
//         (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
//       );

//       setForms(sortedForms);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
//     }
//   };

//   const fetchUserData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/programmanagers/me", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//       } else {
//         console.error("Failed to fetch user data. Status:", response.status);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
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

//   const viewResponses = (formId) => {
//     navigate(`/general-form-all-responses/${formId}`);
//   };

//   const addForm = (form) => {
//     if (!form.lastModified) {
//       form.lastModified = new Date().toISOString();
//     }

//     setForms([form, ...forms]); // Add the new form to the start of the array
//   };

//   const editForm = (updatedForm) => {
//     const updatedForms = forms.map((form) =>
//       form._id === updatedForm._id ? updatedForm : form
//     );
//     setForms(updatedForms);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="confirm-delete-ui">
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
//                 className="delete-button-alert-generalform"
//                 onClick={async () => {
//                   try {
//                     await fetch(
//                       `http://localhost:5000/api/forms/${formToDelete._id}`,
//                       { method: "DELETE" }
//                     );
//                     setForms(
//                       forms.filter((form) => form._id !== formToDelete._id)
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
//                 className="modal-button-cancel-no-generalform"
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "confirm-delete-overlay",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/general/${form._id}`
//       );
//       if (response.status === 404) {
//         navigate("/form-builder", {
//           state: {
//             formElements: [],
//             formTitle: form.title,
//             formId: form._id,
//           },
//         });
//         return;
//       }
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error);
//       }
//       const formStructure = await response.json();
//       if (formStructure.fields.length > 0) {
//         navigate("/form-preview", {
//           state: {
//             formElements: formStructure.fields,
//             formTitle: formStructure.title,
//             formId: form._id,
//           },
//         });
//       } else {
//         navigate("/form-builder", {
//           state: {
//             formElements: [],
//             formTitle: form.title,
//             formId: form._id,
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching form structure:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleShareClick = (formId) => {
//     const link = `http://localhost:3000/public-form-preview/${formId}`;
//     setShareableLink(link);
//   };

//   const copyLinkToClipboard = () => {
//     navigator.clipboard
//       .writeText(shareableLink)
//       .then(() => {
//         toast.success("Link copied to clipboard!");
//       })
//       .catch((err) => {
//         console.error("Error copying link:", err);
//       });
//   };

//   const closeShareModal = () => {
//     setShareableLink("");
//   };

//   // Pagination related calculations
//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = forms.filter((form) =>
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
//     <div className="dashboard-form">
//       {/* sidebar start */}
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
//                 <Link to="/form">
//                   <CgNotes className="nav-icon" /> Create Query Form
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/evaluator-dashboard">
//                   <AiOutlineEye className="nav-icon" /> Create Evaluation Form
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>
//       {/* sidebar end */}
//       <main className="main-content-form">
//         {/* navbar start */}
//         <header className="header-form">
//           <span className="founder-form">Program Manager</span>
//           <div className="profile-section-form">
//             <div className="user-info-form">
//               <img
//                 src="/navbar/profilepicture.png" 
//                 alt="User Avatar"
//                 className="user-initials-form"
//               />
//               <div className="user-details-form">
//                 <span className="user-name-form">
//                   {user.name} <RiArrowDropDownLine className="drop-form" />
//                 </span>
//                 <br />
//                 <span className="user-email-form">{user.email}</span>
//               </div>
//             </div>
//             <button
//               className="logout-button-form"
//               onClick={handleLogout} // Ensure this function is defined in your component
//               style={{ marginLeft: "20px" }} // Add any additional styling as needed
//             >
//               Logout
//             </button>
//           </div>
//         </header>

//         {/* navbar end */}
//         <section className="content-form">
//           <div className="content-header-form-generalform">
//             <h3 className="header-title-generalform">Forms</h3>
//             <div className="search-bar-container-generalform">
//               <input
//                 type="text"
//                 placeholder="Search by title"
//                 className="search-bar-form-generalform"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <button
//               className="add-form-button-generalform"
//               onClick={openAddModal}
//             >
//               + Add New
//             </button>
//           </div>

//           <div className="form-list-form">
//             <table className="form-table-form">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th>Category</th>
//                   <th>Label</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td
//                       onClick={() => handleFormClick(form)}
//                       className="form-title"
//                     >
//                       {form.title}
//                     </td>
//                     {/* HIGHLIGHT START: Format date using Moment.js */}
//                     <td>{moment(form.lastModified).format("D/M/YYYY")}</td>
//                     {/* HIGHLIGHT END */}
//                     <td>{form.category}</td>
//                     <td>{form.label}</td>
//                     <td style={{ textAlign: "center" }}>
//                       <button
//                         className="action-button-form share"
//                         onClick={() => handleShareClick(form._id)}
//                         data-tooltip-id="share-tooltip-form"
//                         data-tooltip-content="Share"
//                       >
//                         <AiOutlineShareAlt className="action-icon" />
//                         <div className="tooltip-form">Share</div>
//                       </button>
//                       <button
//                         className="action-button-form edit"
//                         onClick={() => openEditModal(form)}
//                         data-tooltip-id="edit-tooltip-form"
//                         data-tooltip-content="Edit"
//                       >
//                         <AiOutlineEdit className="action-icon" />
//                         <div className="tooltip-form">Edit</div>
//                       </button>
//                       <button
//                         className="action-button-form delete"
//                         onClick={() => deleteForm(form)}
//                         data-tooltip-id="delete-tooltip-form"
//                         data-tooltip-content="Delete"
//                       >
//                         <AiOutlineDelete className="action-icon" />
//                         <div className="tooltip-form">Delete</div>
//                       </button>
//                       <button
//                         className="action-button-form view"
//                         onClick={() => viewResponses(form._id)}
//                         data-tooltip-id="view-tooltip-form"
//                         data-tooltip-content="View"
//                       >
//                         <AiOutlineEye className="action-icon" />
//                         <div className="tooltip-form">View Responses</div>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pagination-container-form">
//               <div className="pagination-form">
//                 <FaChevronLeft
//                   className={`pagination-arrow-form ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                 />
//                 <span className="page-number-form">
//                   <span className="current-page-form">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <FaChevronRight
//                   className={`pagination-arrow-form ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                 />
//               </div>
//               <div className="rows-per-page-form">
//                 <label>Rows per page</label>
//                 <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//                   {[7, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </section>
//         {isAddModalOpen && (
//           <AddNewFormModal closeModal={closeAddModal} addForm={addForm} />
//         )}
//         {isEditModalOpen && (
//           <EditFormModal
//             closeModal={closeEditModal}
//             form={currentForm}
//             editForm={editForm}
//           />
//         )}
//         {shareableLink && (
//           <ShareModal
//             shareableLink={shareableLink}
//             copyLinkToClipboard={copyLinkToClipboard}
//             closeShareModal={closeShareModal}
//           />
//         )}
//         <ToastContainer position="bottom-right" />
//       </main>
//     </div>
//   );
// };

// export default Form;








// ///////all working a to z latest always in first after refress view response also work
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import moment from "moment"; // Import Moment.js
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
// import AddNewFormModal from "./AddNewFormModal";
// import EditFormModal from "./EditFormModal";
// import ShareModal from "./ShareModal";
// import { ToastContainer, toast } from "react-toastify";
// import { confirmAlert } from "react-confirm-alert";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import "react-toastify/dist/ReactToastify.css";
// import { Tooltip } from "react-tooltip";
// import "react-tooltip/dist/react-tooltip.css";
// import "./Form.css";

// const Form = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [forms, setForms] = useState([]);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [shareableLink, setShareableLink] = useState("");
//   const [formDetails, setFormDetails] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(7);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   const fetchForms = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/forms");
//       const data = await response.json();

//       const sortedForms = data.sort(
//         (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
//       );

//       setForms(sortedForms);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
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

//   const viewResponses = (formId) => {
//     navigate(`/general-form-all-responses/${formId}`);
//   };

//   const addForm = (form) => {
//     if (!form.lastModified) {
//       form.lastModified = new Date().toISOString();
//     }

//     setForms([form, ...forms]); // Add the new form to the start of the array
//   };

//   const editForm = (updatedForm) => {
//     const updatedForms = forms.map((form) =>
//       form._id === updatedForm._id ? updatedForm : form
//     );
//     setForms(updatedForms);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="confirm-delete-ui">
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
//                 className="delete-button-alert-generalform"
//                 onClick={async () => {
//                   try {
//                     await fetch(
//                       `http://localhost:5000/api/forms/${formToDelete._id}`,
//                       { method: "DELETE" }
//                     );
//                     setForms(
//                       forms.filter((form) => form._id !== formToDelete._id)
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
//                 className="modal-button-cancel-no-generalform"
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "confirm-delete-overlay",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/general/${form._id}`
//       );
//       if (response.status === 404) {
//         navigate("/form-builder", {
//           state: {
//             formElements: [],
//             formTitle: form.title,
//             formId: form._id,
//           },
//         });
//         return;
//       }
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error);
//       }
//       const formStructure = await response.json();
//       if (formStructure.fields.length > 0) {
//         navigate("/form-preview", {
//           state: {
//             formElements: formStructure.fields,
//             formTitle: formStructure.title,
//             formId: form._id,
//           },
//         });
//       } else {
//         navigate("/form-builder", {
//           state: {
//             formElements: [],
//             formTitle: form.title,
//             formId: form._id,
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching form structure:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleShareClick = (formId) => {
//     const link = `http://localhost:3000/public-form-preview/${formId}`;
//     setShareableLink(link);
//   };

//   const copyLinkToClipboard = () => {
//     navigator.clipboard
//       .writeText(shareableLink)
//       .then(() => {
//         toast.success("Link copied to clipboard!");
//       })
//       .catch((err) => {
//         console.error("Error copying link:", err);
//       });
//   };

//   const closeShareModal = () => {
//     setShareableLink("");
//   };

//   // Pagination related calculations
//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = forms.filter((form) =>
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
//     <div className="dashboard-form">
//       {/* sidebar start */}
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
//                 <Link to="/form">
//                   <CgNotes className="nav-icon" /> Create Query Form
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/evaluator-dashboard">
//                   <AiOutlineEye className="nav-icon" /> Create Evaluation Form
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>
//       {/* sidebar end */}
//       <main className="main-content-form">
//         {/* navbar start */}
//         <header className="header-form">
//           <span className="founder-form" >Program Manager</span>
//           <div className="profile-section-form">
//             <div className="user-info-form">
//               <img
//                 src="/navbar/profilepicture.png" 
//                 alt="User Avatar"
//                 className="user-initials-form"
//               />
//               <div className="user-details-form">
//                 <span className="user-name-form">
//                   Program Mang <RiArrowDropDownLine className="drop-form" />
//                 </span>
//                 <br />
//                 <span className="user-email-form">manager@mail.com</span>
//               </div>
//             </div>
//             <button
//               className="logout-button-form"
//               onClick={handleLogout} // Ensure this function is defined in your component
//               style={{ marginLeft: "20px" }} // Add any additional styling as needed
//             >
//               Logout
//             </button>
//           </div>
//         </header>

//         {/* navbar end */}
//         <section className="content-form">
//           <div className="content-header-form-generalform">
//             <h3 className="header-title-generalform">Forms</h3>
//             <div className="search-bar-container-generalform">
//               <input
//                 type="text"
//                 placeholder="Search by title"
//                 className="search-bar-form-generalform"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <button
//               className="add-form-button-generalform"
//               onClick={openAddModal}
//             >
//               + Add New
//             </button>
//           </div>

//           <div className="form-list-form">
//             <table className="form-table-form">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th>Category</th>
//                   <th>Label</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td
//                       onClick={() => handleFormClick(form)}
//                       className="form-title"
//                     >
//                       {form.title}
//                     </td>
//                     {/* HIGHLIGHT START: Format date using Moment.js */}
//                     <td>{moment(form.lastModified).format("D/M/YYYY")}</td>
//                     {/* HIGHLIGHT END */}
//                     <td>{form.category}</td>
//                     <td>{form.label}</td>
//                     <td style={{ textAlign: "center" }}>
//                       <button
//                         className="action-button-form share"
//                         onClick={() => handleShareClick(form._id)}
//                         data-tooltip-id="share-tooltip-form"
//                         data-tooltip-content="Share"
//                       >
//                         <AiOutlineShareAlt className="action-icon" />
//                         <div className="tooltip-form">Share</div>
//                       </button>
//                       <button
//                         className="action-button-form edit"
//                         onClick={() => openEditModal(form)}
//                         data-tooltip-id="edit-tooltip-form"
//                         data-tooltip-content="Edit"
//                       >
//                         <AiOutlineEdit className="action-icon" />
//                         <div className="tooltip-form">Edit</div>
//                       </button>
//                       <button
//                         className="action-button-form delete"
//                         onClick={() => deleteForm(form)}
//                         data-tooltip-id="delete-tooltip-form"
//                         data-tooltip-content="Delete"
//                       >
//                         <AiOutlineDelete className="action-icon" />
//                         <div className="tooltip-form">Delete</div>
//                       </button>
//                       <button
//                         className="action-button-form view"
//                         onClick={() => viewResponses(form._id)}
//                         data-tooltip-id="view-tooltip-form"
//                         data-tooltip-content="View"
//                       >
//                         <AiOutlineEye className="action-icon" />
//                         <div className="tooltip-form">View Responses</div>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pagination-container-form">
//               <div className="pagination-form">
//                 <FaChevronLeft
//                   className={`pagination-arrow-form ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                 />
//                 <span className="page-number-form">
//                   <span className="current-page-form">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <FaChevronRight
//                   className={`pagination-arrow-form ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                 />
//               </div>
//               <div className="rows-per-page-form">
//                 <label>Rows per page</label>
//                 <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//                   {[7, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </section>
//         {isAddModalOpen && (
//           <AddNewFormModal closeModal={closeAddModal} addForm={addForm} />
//         )}
//         {isEditModalOpen && (
//           <EditFormModal
//             closeModal={closeEditModal}
//             form={currentForm}
//             editForm={editForm}
//           />
//         )}
//         {shareableLink && (
//           <ShareModal
//             shareableLink={shareableLink}
//             copyLinkToClipboard={copyLinkToClipboard}
//             closeShareModal={closeShareModal}
//           />
//         )}
//         <ToastContainer position="bottom-right" />
//       </main>
//     </div>
//   );
// };

// export default Form;










/////latest is working
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
// import AddNewFormModal from "./AddNewFormModal";
// import EditFormModal from "./EditFormModal";
// import ShareModal from "./ShareModal";
// import { ToastContainer, toast } from "react-toastify";
// import { confirmAlert } from "react-confirm-alert";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import "react-toastify/dist/ReactToastify.css";
// import { Tooltip } from "react-tooltip";
// import "react-tooltip/dist/react-tooltip.css";
// import "./Form.css";

// const Form = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [forms, setForms] = useState([]);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [shareableLink, setShareableLink] = useState("");
//   const [formDetails, setFormDetails] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(7);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   // HIGHLIGHT START: Fetch and sort forms
//   const fetchForms = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/forms");
//       const data = await response.json();

//       // Log data for debugging
//       console.log("Fetched forms:", data);

//       // Sort forms by lastModified in descending order
//       const sortedForms = data.sort(
//         (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
//       );

//       console.log("Sorted forms:", sortedForms);

//       setForms(sortedForms);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
//     }
//   };
//   // HIGHLIGHT END

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

//   const viewResponses = (formId) => {
//     navigate(`/general-form-all-responses/${formId}`);
//   };

//   // HIGHLIGHT START: Add form to the top of the list
//   const addForm = (form) => {
//     // Log form details for debugging
//     console.log("Adding new form:", form);

//     // Set the current timestamp if lastModified is not set
//     if (!form.lastModified) {
//       form.lastModified = new Date().toISOString();
//     }

//     setForms([form, ...forms]); // Add the new form to the start of the array
//   };
//   // HIGHLIGHT END

//   const editForm = (updatedForm) => {
//     const updatedForms = forms.map((form) =>
//       form._id === updatedForm._id ? updatedForm : form
//     );
//     setForms(updatedForms);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="confirm-delete-ui">
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
//                 className="delete-button-alert-generalform"
//                 onClick={async () => {
//                   try {
//                     await fetch(
//                       `http://localhost:5000/api/forms/${formToDelete._id}`,
//                       { method: "DELETE" }
//                     );
//                     setForms(
//                       forms.filter((form) => form._id !== formToDelete._id)
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
//                 className="modal-button-cancel-no-generalform"
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "confirm-delete-overlay",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/general/${form._id}`
//       );
//       if (response.status === 404) {
//         navigate("/form-builder", {
//           state: {
//             formElements: [],
//             formTitle: form.title,
//             formId: form._id,
//           },
//         });
//         return;
//       }
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error);
//       }
//       const formStructure = await response.json();
//       if (formStructure.fields.length > 0) {
//         navigate("/form-preview", {
//           state: {
//             formElements: formStructure.fields,
//             formTitle: formStructure.title,
//             formId: form._id,
//           },
//         });
//       } else {
//         navigate("/form-builder", {
//           state: {
//             formElements: [],
//             formTitle: form.title,
//             formId: form._id,
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching form structure:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleShareClick = (formId) => {
//     const link = `http://localhost:3000/public-form-preview/${formId}`;
//     setShareableLink(link);
//   };

//   const copyLinkToClipboard = () => {
//     navigator.clipboard
//       .writeText(shareableLink)
//       .then(() => {
//         toast.success("Link copied to clipboard!");
//       })
//       .catch((err) => {
//         console.error("Error copying link:", err);
//       });
//   };

//   const closeShareModal = () => {
//     setShareableLink("");
//   };

//   // Pagination related calculations
//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = forms.filter((form) =>
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

//   return (
//     <div className="dashboard-form">
//       {/* sidebar start */}
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
//                 <Link to="/form">
//                   <CgNotes className="nav-icon" /> Create Query Form
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/evaluator-dashboard">
//                   <AiOutlineEye className="nav-icon" /> Create Evaluation Form
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>
//       {/* sidebar end */}
//       <main className="main-content-form">
//         {/* navbar start */}
//         <header className="header-form">
//           <span className="founder-form">
//             <FiMenu style={{ color: "#909090" }} /> Program Manager
//           </span>
//           <div className="profile-section-form">
//             <div>
//               <FaBell className="notification-icon-form" />
//             </div>
//             <div className="user-info-form">
//               <img
//                 src="/navbar/profilepicture.png"
//                 alt="User Avatar"
//                 className="user-initials-form"
//               />
//               <div className="user-details-form">
//                 <span className="user-name-form">
//                   Program Mang <RiArrowDropDownLine className="drop-form" />
//                 </span>
//                 <br />
//                 <span className="user-email-form">manager@mail.com</span>
//               </div>
//             </div>
//           </div>
//         </header>
//         {/* navbar end */}
//         <section className="content-form">
//           <div className="content-header-form">
//             <h2>Forms</h2>
//             <input
//               type="text"
//               placeholder="Search by title"
//               className="search-bar-formevaluatordashboard"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className="add-form-button" onClick={openAddModal}>
//               + Add New
//             </button>
//           </div>
//           <div className="form-list-form">
//             <table className="form-table-form">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th>Category</th>
//                   <th>Label</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td
//                       onClick={() => handleFormClick(form)}
//                       className="form-title"
//                     >
//                       {form.title}
//                     </td>
//                     <td>{form.lastModified}</td>
//                     <td>{form.category}</td>
//                     <td>{form.label}</td>
//                     <td style={{ textAlign: "center" }}>
//                       <button
//                         className="action-button-form share"
//                         onClick={() => handleShareClick(form._id)}
//                         data-tooltip-id="share-tooltip-form"
//                         data-tooltip-content="Share"
//                       >
//                         <AiOutlineShareAlt className="action-icon" />
//                         <div className="tooltip-form">Share</div>
//                       </button>
//                       <button
//                         className="action-button-form edit"
//                         onClick={() => openEditModal(form)}
//                         data-tooltip-id="edit-tooltip-form"
//                         data-tooltip-content="Edit"
//                       >
//                         <AiOutlineEdit className="action-icon" />
//                         <div className="tooltip-form">Edit</div>
//                       </button>
//                       <button
//                         className="action-button-form delete"
//                         onClick={() => deleteForm(form)}
//                         data-tooltip-id="delete-tooltip-form"
//                         data-tooltip-content="Delete"
//                       >
//                         <AiOutlineDelete className="action-icon" />
//                         <div className="tooltip-form">Delete</div>
//                       </button>
//                       <button
//                         className="action-button-form view"
//                         onClick={() => viewResponses(form._id)}
//                         data-tooltip-id="view-tooltip-form"
//                         data-tooltip-content="View"
//                       >
//                         <AiOutlineEye className="action-icon" />
//                         <div className="tooltip-form">View Responses</div>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pagination-container-form">
//               <div className="pagination-form">
//                 <FaChevronLeft
//                   className={`pagination-arrow-form ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                 />
//                 <span className="page-number-form">
//                   <span className="current-page-form">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <FaChevronRight
//                   className={`pagination-arrow-form ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                 />
//               </div>
//               <div className="rows-per-page-form">
//                 <label>Rows per page</label>
//                 <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//                   {[7, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </section>
//         {isAddModalOpen && (
//           <AddNewFormModal closeModal={closeAddModal} addForm={addForm} />
//         )}
//         {isEditModalOpen && (
//           <EditFormModal
//             closeModal={closeEditModal}
//             form={currentForm}
//             editForm={editForm}
//           />
//         )}
//         {shareableLink && (
//           <ShareModal
//             shareableLink={shareableLink}
//             copyLinkToClipboard={copyLinkToClipboard}
//             closeShareModal={closeShareModal}
//           />
//         )}
//         <ToastContainer position="bottom-right" />
//       </main>
//     </div>
//   );
// };

// export default Form;

///////////frm z to a aa raha hai fill hookar  aug 7 all working code with all fun working

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBell, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { CgNotes } from "react-icons/cg";
// import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineShareAlt } from "react-icons/ai";
// import { FiMenu } from "react-icons/fi";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import AddNewFormModal from "./AddNewFormModal";
// import EditFormModal from "./EditFormModal";
// import ShareModal from "./ShareModal";
// import { ToastContainer, toast } from "react-toastify";
// import { confirmAlert } from "react-confirm-alert";
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import { Tooltip } from 'react-tooltip';
// import 'react-tooltip/dist/react-tooltip.css';
// import './Form.css';
// // import '../Shared/Sidebar2.css';

// const Form = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [forms, setForms] = useState([]);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [shareableLink, setShareableLink] = useState("");
//   const [formDetails, setFormDetails] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(7);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   const fetchForms = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/forms");
//       const data = await response.json();
//       setForms(data);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
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

//   const viewResponses = (formId) => {
//     navigate(`/general-form-all-responses/${formId}`);
//   };

//   const addForm = (form) => {
//     setForms([...forms, form]);
//   };

//   const editForm = (updatedForm) => {
//     const updatedForms = forms.map((form) =>
//       form._id === updatedForm._id ? updatedForm : form
//     );
//     setForms(updatedForms);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="confirm-delete-ui">
//             <h2 style={{ fontSize: "24px", textAlign: "center", marginBottom:'15PX' }}>Confirm to Delete</h2>
//             <p style={{ textAlign: "center", marginBottom:'15PX'  }}>
//               Form structure will be lost. Are you sure you want to delete this form?
//             </p>
//             <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
//               <button
//                 className="delete-button-alert-generalform"
//                 // style={{
//                 //   backgroundColor: "#007bff",
//                 //   color: "white",
//                 //   border: "none",
//                 //   padding: "10px 20px",
//                 //   borderRadius: "4px",
//                 //   cursor: "pointer",
//                 // }}
//                 onClick={async () => {
//                   try {
//                     await fetch(`http://localhost:5000/api/forms/${formToDelete._id}`, { method: "DELETE" });
//                     setForms(forms.filter((form) => form._id !== formToDelete._id));
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
//                 className="modal-button-cancel-no-generalform"
//                 // style={{
//                 //   backgroundColor: "#bdbdbd",
//                 //   color: "#007bff",
//                 //   border: "none",
//                 //   padding: "10px 20px",
//                 //   borderRadius: "4px",
//                 //   cursor: "pointer",
//                 // }}
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "confirm-delete-overlay",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${form._id}`);
//       if (response.status === 404) {
//         navigate("/form-builder", {
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
//         navigate("/form-preview", {
//           state: { formElements: formStructure.fields, formTitle: formStructure.title, formId: form._id },
//         });
//       } else {
//         navigate("/form-builder", {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching form structure:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleShareClick = (formId) => {
//     const link = `http://localhost:3000/public-form-preview/${formId}`;
//     setShareableLink(link);
//   };

//   const copyLinkToClipboard = () => {
//     navigator.clipboard.writeText(shareableLink).then(() => {
//       toast.success("Link copied to clipboard!");
//     }).catch((err) => {
//       console.error("Error copying link:", err);
//     });
//   };

//   const closeShareModal = () => {
//     setShareableLink("");
//   };

//   // Pagination related calculations
//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = forms.filter((form) =>
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
//     <div className="dashboard-form">
//       {/* sidebar start */}
//       <aside className="sidebar">
//         <div className="logo-container">
//           <div className="logo">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="dristilogo" />
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
//       {/* sidebar end */}
//       <main className="main-content-form">
//       {/* navbar start */}
//         <header className="header-form">
//           <span className="founder-form">
//             <FiMenu style={{ color: "#909090" }} /> Program Manager
//           </span>
//           <div className="profile-section-form">
//             <div>
//               <FaBell className="notification-icon-form" />
//             </div>
//             <div className="user-info-form">
//               <img src="/navbar/profilepicture.png" alt="User Avatar" className="user-initials-form" />
//               <div className="user-details-form">
//                 <span className="user-name-form">
//                   Program Mang <RiArrowDropDownLine className="drop-form" />
//                 </span>
//                 <br />
//                 <span className="user-email-form">manager@mail.com</span>
//               </div>
//             </div>
//           </div>
//         </header>
//       {/* navbar end */}
//         <section className="content-form">
//           <div className="content-header-form">
//             <h2>Forms</h2>
//             <input
//               type="text"
//               placeholder="Search by title"
//               className="search-bar-formevaluatordashboard"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className="add-form-button" onClick={openAddModal}>
//               + Add New
//             </button>
//           </div>
//           <div className="form-list-form">
//             <table className="form-table-form">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th>Category</th>
//                   <th>Label</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td onClick={() => handleFormClick(form)} className="form-title">
//                       {form.title}
//                     </td>
//                     <td>{form.lastModified}</td>
//                     <td>{form.category}</td>
//                     <td>{form.label}</td>
//                     <td style={{ textAlign: "center" }}>
//                       <button
//                         className="action-button-form share"
//                         onClick={() => handleShareClick(form._id)}
//                         data-tooltip-id="share-tooltip-form"
//                         data-tooltip-content="Share"
//                       >
//                         <AiOutlineShareAlt className="action-icon" />
//                         <div className="tooltip-form">Share</div>
//                       </button>
//                       <button
//                         className="action-button-form edit"
//                         onClick={() => openEditModal(form)}
//                         data-tooltip-id="edit-tooltip-form"
//                         data-tooltip-content="Edit"
//                       >
//                         <AiOutlineEdit className="action-icon" />
//                         <div className="tooltip-form">Edit</div>
//                       </button>
//                       <button
//                         className="action-button-form delete"
//                         onClick={() => deleteForm(form)}
//                         data-tooltip-id="delete-tooltip-form"
//                         data-tooltip-content="Delete"
//                       >
//                         <AiOutlineDelete className="action-icon" />
//                         <div className="tooltip-form">Delete</div>
//                       </button>
//                       <button
//                         className="action-button-form view"
//                         onClick={() => viewResponses(form._id)}
//                         data-tooltip-id="view-tooltip-form"
//                         data-tooltip-content="View"
//                       >
//                         <AiOutlineEye className="action-icon" />
//                         <div className="tooltip-form">View Responses</div>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pagination-container-form">
//               <div className="pagination-form">
//                 <FaChevronLeft
//                   className={`pagination-arrow-form ${currentPage === 1 && "disabled"}`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                 />
//                 <span className="page-number-form">
//                   <span className="current-page-form">{currentPage}</span> / {totalPages}
//                 </span>
//                 <FaChevronRight
//                   className={`pagination-arrow-form ${currentPage === totalPages && "disabled"}`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                 />
//               </div>
//               <div className="rows-per-page-form">
//                 <label>Rows per page</label>
//                 <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//                   {[7, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </section>
//         {isAddModalOpen && (
//           <AddNewFormModal closeModal={closeAddModal} addForm={addForm} />
//         )}
//         {isEditModalOpen && (
//           <EditFormModal closeModal={closeEditModal} form={currentForm} editForm={editForm} />
//         )}
//         {shareableLink && (
//           <ShareModal
//             shareableLink={shareableLink}
//             copyLinkToClipboard={copyLinkToClipboard}
//             closeShareModal={closeShareModal}
//           />
//         )}
//         {/* <ToastContainer /> */}
//         <ToastContainer position="bottom-right" />
//       </main>
//     </div>
//   );
// };

// export default Form;

/////bef generalformallresponses.jsx wali file

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBell, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { CgNotes } from "react-icons/cg";
// import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineShareAlt } from "react-icons/ai";
// import { FiMenu } from "react-icons/fi";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import AddNewFormModal from "./AddNewFormModal";
// import EditFormModal from "./EditFormModal";
// import ShareModal from "./ShareModal";
// import ViewResponseModal from "./ViewResponseModal";
// import { ToastContainer, toast } from "react-toastify";
// import { confirmAlert } from "react-confirm-alert";
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import { Tooltip } from 'react-tooltip';
// import 'react-tooltip/dist/react-tooltip.css';
// import './Form.css';
// // import '../Shared/Sidebar2.css';

// const Form = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewResponseModalOpen, setIsViewResponseModalOpen] = useState(false);
//   const [forms, setForms] = useState([]);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [shareableLink, setShareableLink] = useState("");
//   const [formDetails, setFormDetails] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   const fetchForms = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/forms");
//       const data = await response.json();
//       setForms(data);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
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

//   const openViewResponseModal = async (formTitle) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formTitle}`);
//       const data = await response.json();
//       setFormDetails(data);
//       setIsViewResponseModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching form details:", error);
//     }
//   };

//   const closeViewResponseModal = () => {
//     setIsViewResponseModalOpen(false);
//     setFormDetails(null);
//   };

//   const addForm = (form) => {
//     setForms([...forms, form]);
//   };

//   const editForm = (updatedForm) => {
//     const updatedForms = forms.map((form) =>
//       form._id === updatedForm._id ? updatedForm : form
//     );
//     setForms(updatedForms);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="confirm-delete-ui">
//             <h2 style={{ fontSize: "24px", textAlign: "center", marginBottom:'15PX' }}>Confirm to Delete</h2>
//             <p style={{ textAlign: "center", marginBottom:'15PX'  }}>
//               Form structure will be lost. Are you sure you want to delete this form?
//             </p>
//             <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
//               <button
//                 style={{
//                   backgroundColor: "#dc3545",
//                   color: "#fff",
//                   border: "none",
//                   padding: "10px 20px",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//                 onClick={async () => {
//                   try {
//                     await fetch(`http://localhost:5000/api/forms/${formToDelete._id}`, { method: "DELETE" });
//                     setForms(forms.filter((form) => form._id !== formToDelete._id));
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
//                 style={{
//                   backgroundColor: "#007bff",
//                   color: "#fff",
//                   border: "none",
//                   padding: "10px 20px",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "confirm-delete-overlay",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${form._id}`);
//       if (response.status === 404) {
//         navigate("/form-builder", {
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
//         navigate("/form-preview", {
//           state: { formElements: formStructure.fields, formTitle: formStructure.title, formId: form._id },
//         });
//       } else {
//         navigate("/form-builder", {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching form structure:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleShareClick = (formId) => {
//     const link = `http://localhost:3000/public-form-preview/${formId}`;
//     setShareableLink(link);
//   };

//   const copyLinkToClipboard = () => {
//     navigator.clipboard.writeText(shareableLink).then(() => {
//       toast.success("Link copied to clipboard!");
//     }).catch((err) => {
//       console.error("Error copying link:", err);
//     });
//   };

//   const closeShareModal = () => {
//     setShareableLink("");
//   };

//   // Pagination related calculations
//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = forms.filter((form) =>
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
//     <div className="dashboard-form">
//       {/* sidebar start */}
//       <aside className="sidebar">
//         <div className="logo-container">
//           <div className="logo">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="dristilogo" />
//           </div>
//         </div>
//         <div className="nav-container" style={{ marginTop: "90px" }}>
//           <nav className="nav">
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
//       {/* sidebar end */}
//       <main className="main-content-form">
//       {/* navbar start */}
//         <header className="header-form">
//           <span className="founder-form">
//             <FiMenu style={{ color: "#909090" }} /> Program Manager
//           </span>
//           <div className="profile-section-form">
//             <div>
//               <FaBell className="notification-icon-form" />
//             </div>
//             <div className="user-info-form">
//               <img src="/navbar/profilepicture.png" alt="User Avatar" className="user-initials-form" />
//               <div className="user-details-form">
//                 <span className="user-name-form">
//                   Program Mang <RiArrowDropDownLine className="drop-form" />
//                 </span>
//                 <br />
//                 <span className="user-email-form">manager@mail.com</span>
//               </div>
//             </div>
//           </div>
//         </header>
//       {/* navbar end */}
//         {/* <section className="content-form">
//           <div className="content-header-form">
//             <h2>Forms</h2>
//             <input
//               type="text"
//               placeholder="Search by title"
//               className="search-bar-formevaluatordashboard"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className="add-form-button" onClick={openAddModal}>
//               + Add New
//             </button>
//           </div>
//           <div className="form-list-form">
//             <table className="form-table-form">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th>Category</th>
//                   <th>Label</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td onClick={() => handleFormClick(form)} className="form-title">
//                       {form.title}
//                     </td>
//                     <td>{form.lastModified}</td>
//                     <td>{form.category}</td>
//                     <td>{form.label}</td>
//                     <td style={{ textAlign: "center" }}>
//                       <button
//                         className="action-button-form share"
//                         onClick={() => handleShareClick(form._id)}
//                         data-tooltip-id="share-tooltip-form"
//                         data-tooltip-content="Share"
//                       >
//                         <AiOutlineShareAlt className="action-icon" />
//                         <div className="tooltip-form">Share</div>
//                       </button>
//                       <button
//                         className="action-button-form edit"
//                         onClick={() => openEditModal(form)}
//                         data-tooltip-id="edit-tooltip-form"
//                         data-tooltip-content="Edit"
//                       >
//                         <AiOutlineEdit className="action-icon" />
//                         <div className="tooltip-form">Edit</div>
//                       </button>
//                       <button
//                         className="action-button-form delete"
//                         onClick={() => deleteForm(form)}
//                         data-tooltip-id="delete-tooltip-form"
//                         data-tooltip-content="Delete"
//                       >
//                         <AiOutlineDelete className="action-icon" />
//                         <div className="tooltip-form">Delete</div>
//                       </button>
//                       <button
//                         className="action-button-form view"
//                         onClick={() => openViewResponseModal(form._id)}
//                         data-tooltip-id="view-tooltip-form"
//                         data-tooltip-content="View"
//                       >
//                         <AiOutlineEye className="action-icon" />
//                         <div className="tooltip-form">View</div>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pagination-container-form">
//               <div className="pagination-form">
//                 <FaChevronLeft
//                   className={`pagination-arrow-form ${currentPage === 1 && "disabled"}`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                 />
//                 <span className="page-number-form">
//                   <span className="current-page-form">{currentPage}</span> / {totalPages}
//                 </span>
//                 <FaChevronRight
//                   className={`pagination-arrow-form ${currentPage === totalPages && "disabled"}`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                 />
//               </div>
//               <div className="rows-per-page-form">
//                 <label>Rows per page</label>
//                 <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//                   {[5, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </section> */}
//         <section className="content-form">
//   <div className="content-header-form">
//     <h2>Forms</h2>
//     <div className="search-bar-container-generalforms">
//       <input
//         type="text"
//         placeholder="Search by title"
//         className="search-bar-formevaluatordashboard"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//     </div>
//     <button className="add-form-button" onClick={openAddModal}>
//       + Add New
//     </button>
//   </div>
//   <div className="form-list-form">
//     <table className="form-table-form">
//       <thead>
//         <tr>
//           <th>Title</th>
//           <th>Last Modified</th>
//           <th>Category</th>
//           <th>Label</th>
//           <th style={{ textAlign: "center" }}>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {currentFilteredForms.map((form, index) => (
//           <tr key={index}>
//             <td onClick={() => handleFormClick(form)} className="form-title">
//               {form.title}
//             </td>
//             <td>{form.lastModified}</td>
//             <td>{form.category}</td>
//             <td>{form.label}</td>
//             <td style={{ textAlign: "center" }}>
//               <button
//                 className="action-button-form share"
//                 onClick={() => handleShareClick(form._id)}
//                 data-tooltip-id="share-tooltip-form"
//                 data-tooltip-content="Share"
//               >
//                 <AiOutlineShareAlt className="action-icon" />
//                 <div className="tooltip-form">Share</div>
//               </button>
//               <button
//                 className="action-button-form edit"
//                 onClick={() => openEditModal(form)}
//                 data-tooltip-id="edit-tooltip-form"
//                 data-tooltip-content="Edit"
//               >
//                 <AiOutlineEdit className="action-icon" />
//                 <div className="tooltip-form">Edit</div>
//               </button>
//               <button
//                 className="action-button-form delete"
//                 onClick={() => deleteForm(form)}
//                 data-tooltip-id="delete-tooltip-form"
//                 data-tooltip-content="Delete"
//               >
//                 <AiOutlineDelete className="action-icon" />
//                 <div className="tooltip-form">Delete</div>
//               </button>
//               <button
//                 className="action-button-form view"
//                 onClick={() => openViewResponseModal(form._id)}
//                 data-tooltip-id="view-tooltip-form"
//                 data-tooltip-content="View"
//               >
//                 <AiOutlineEye className="action-icon" />
//                 <div className="tooltip-form">View</div>
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     <div className="pagination-container-form">
//       <div className="pagination-form">
//         <FaChevronLeft
//           className={`pagination-arrow-form ${currentPage === 1 && "disabled"}`}
//           onClick={() => handlePageChange(currentPage - 1)}
//         />
//         <span className="page-number-form">
//           <span className="current-page-form">{currentPage}</span> / {totalPages}
//         </span>
//         <FaChevronRight
//           className={`pagination-arrow-form ${currentPage === totalPages && "disabled"}`}
//           onClick={() => handlePageChange(currentPage + 1)}
//         />
//       </div>
//       <div className="rows-per-page-form">
//         <label>Rows per page</label>
//         <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//           {[5, 10, 15, 20].map((size) => (
//             <option key={size} value={size}>
//               {size}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   </div>
// </section>

//         {isAddModalOpen && (
//           <AddNewFormModal closeModal={closeAddModal} addForm={addForm} />
//         )}
//         {isEditModalOpen && (
//           <EditFormModal closeModal={closeEditModal} form={currentForm} editForm={editForm} />
//         )}
//         {shareableLink && (
//           <ShareModal
//             shareableLink={shareableLink}
//             copyLinkToClipboard={copyLinkToClipboard}
//             closeShareModal={closeShareModal}
//           />
//         )}
//         {isViewResponseModalOpen && (
//           <ViewResponseModal
//             formDetails={formDetails}
//             closeModal={closeViewResponseModal}
//           />
//         )}
//         <ToastContainer />
//       </main>
//     </div>
//   );
// };

// export default Form;

////////ragular workig all bef 24/7

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBell, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { CgNotes } from "react-icons/cg";
// import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineShareAlt } from "react-icons/ai";
// import { FiMenu } from "react-icons/fi";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import AddNewFormModal from "./AddNewFormModal";
// import EditFormModal from "./EditFormModal";
// import ShareModal from "./ShareModal";
// import ViewResponseModal from "./ViewResponseModal";
// import { ToastContainer, toast } from "react-toastify";
// import { confirmAlert } from "react-confirm-alert";
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import { Tooltip } from 'react-tooltip';
// import 'react-tooltip/dist/react-tooltip.css';
// import './Form.css';
// // import '../Shared/Sidebar2.css';

// const Form = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewResponseModalOpen, setIsViewResponseModalOpen] = useState(false);
//   const [forms, setForms] = useState([]);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [shareableLink, setShareableLink] = useState("");
//   const [formDetails, setFormDetails] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   const fetchForms = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/forms");
//       const data = await response.json();
//       setForms(data);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
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

//   const openViewResponseModal = async (formTitle) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formTitle}`);
//       const data = await response.json();
//       setFormDetails(data);
//       setIsViewResponseModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching form details:", error);
//     }
//   };

//   const closeViewResponseModal = () => {
//     setIsViewResponseModalOpen(false);
//     setFormDetails(null);
//   };

//   const addForm = (form) => {
//     setForms([...forms, form]);
//   };

//   const editForm = (updatedForm) => {
//     const updatedForms = forms.map((form) =>
//       form._id === updatedForm._id ? updatedForm : form
//     );
//     setForms(updatedForms);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="confirm-delete-ui">
//             <h2 style={{ fontSize: "24px", textAlign: "center", marginBottom:'15PX' }}>Confirm to Delete</h2>
//             <p style={{ textAlign: "center", marginBottom:'15PX'  }}>
//               Form structure will be lost. Are you sure you want to delete this form?
//             </p>
//             <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
//               <button
//                 style={{
//                   backgroundColor: "#dc3545",
//                   color: "#fff",
//                   border: "none",
//                   padding: "10px 20px",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//                 onClick={async () => {
//                   try {
//                     await fetch(`http://localhost:5000/api/forms/${formToDelete._id}`, { method: "DELETE" });
//                     setForms(forms.filter((form) => form._id !== formToDelete._id));
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
//                 style={{
//                   backgroundColor: "#007bff",
//                   color: "#fff",
//                   border: "none",
//                   padding: "10px 20px",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "confirm-delete-overlay",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${form._id}`);
//       if (response.status === 404) {
//         navigate("/form-builder", {
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
//         navigate("/form-preview", {
//           state: { formElements: formStructure.fields, formTitle: formStructure.title, formId: form._id },
//         });
//       } else {
//         navigate("/form-builder", {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching form structure:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleShareClick = (formId) => {
//     const link = `http://localhost:3000/public-form-preview/${formId}`;
//     setShareableLink(link);
//   };

//   const copyLinkToClipboard = () => {
//     navigator.clipboard.writeText(shareableLink).then(() => {
//       toast.success("Link copied to clipboard!");
//     }).catch((err) => {
//       console.error("Error copying link:", err);
//     });
//   };

//   const closeShareModal = () => {
//     setShareableLink("");
//   };

//   // Pagination related calculations
//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = forms.filter((form) =>
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
//     <div className="dashboard-form">
//       {/* sidebar start */}
//       <aside className="sidebar">
//         <div className="logo-container">
//           <div className="logo">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="dristilogo" />
//           </div>
//         </div>
//         <div className="nav-container" style={{ marginTop: "90px" }}>
//           <nav className="nav">
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
//       {/* sidebar end */}
//       <main className="main-content-form">
//       {/* navbar start */}
//         <header className="header-form">
//           <span className="founder-form">
//             <FiMenu style={{ color: "#909090" }} /> Program Manager
//           </span>
//           <div className="profile-section-form">
//             <div>
//               <FaBell className="notification-icon-form" />
//             </div>
//             <div className="user-info-form">
//               <img src="/navbar/profilepicture.png" alt="User Avatar" className="user-initials-form" />
//               <div className="user-details-form">
//                 <span className="user-name-form">
//                   Program Mang <RiArrowDropDownLine className="drop-form" />
//                 </span>
//                 <br />
//                 <span className="user-email-form">manager@mail.com</span>
//               </div>
//             </div>
//           </div>
//         </header>
//       {/* navbar end */}
//         {/* <section className="content-form">
//           <div className="content-header-form">
//             <h2>Forms</h2>
//             <input
//               type="text"
//               placeholder="Search by title"
//               className="search-bar-formevaluatordashboard"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className="add-form-button" onClick={openAddModal}>
//               + Add New
//             </button>
//           </div>
//           <div className="form-list-form">
//             <table className="form-table-form">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th>Category</th>
//                   <th>Label</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td onClick={() => handleFormClick(form)} className="form-title">
//                       {form.title}
//                     </td>
//                     <td>{form.lastModified}</td>
//                     <td>{form.category}</td>
//                     <td>{form.label}</td>
//                     <td style={{ textAlign: "center" }}>
//                       <button
//                         className="action-button-form share"
//                         onClick={() => handleShareClick(form._id)}
//                         data-tooltip-id="share-tooltip-form"
//                         data-tooltip-content="Share"
//                       >
//                         <AiOutlineShareAlt className="action-icon" />
//                         <div className="tooltip-form">Share</div>
//                       </button>
//                       <button
//                         className="action-button-form edit"
//                         onClick={() => openEditModal(form)}
//                         data-tooltip-id="edit-tooltip-form"
//                         data-tooltip-content="Edit"
//                       >
//                         <AiOutlineEdit className="action-icon" />
//                         <div className="tooltip-form">Edit</div>
//                       </button>
//                       <button
//                         className="action-button-form delete"
//                         onClick={() => deleteForm(form)}
//                         data-tooltip-id="delete-tooltip-form"
//                         data-tooltip-content="Delete"
//                       >
//                         <AiOutlineDelete className="action-icon" />
//                         <div className="tooltip-form">Delete</div>
//                       </button>
//                       <button
//                         className="action-button-form view"
//                         onClick={() => openViewResponseModal(form._id)}
//                         data-tooltip-id="view-tooltip-form"
//                         data-tooltip-content="View"
//                       >
//                         <AiOutlineEye className="action-icon" />
//                         <div className="tooltip-form">View</div>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pagination-container-form">
//               <div className="pagination-form">
//                 <FaChevronLeft
//                   className={`pagination-arrow-form ${currentPage === 1 && "disabled"}`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                 />
//                 <span className="page-number-form">
//                   <span className="current-page-form">{currentPage}</span> / {totalPages}
//                 </span>
//                 <FaChevronRight
//                   className={`pagination-arrow-form ${currentPage === totalPages && "disabled"}`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                 />
//               </div>
//               <div className="rows-per-page-form">
//                 <label>Rows per page</label>
//                 <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//                   {[5, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </section> */}
//         <section className="content-form">
//   <div className="content-header-form">
//     <h2>Forms</h2>
//     <div className="search-bar-container-generalforms">
//       <input
//         type="text"
//         placeholder="Search by title"
//         className="search-bar-formevaluatordashboard"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//     </div>
//     <button className="add-form-button" onClick={openAddModal}>
//       + Add New
//     </button>
//   </div>
//   <div className="form-list-form">
//     <table className="form-table-form">
//       <thead>
//         <tr>
//           <th>Title</th>
//           <th>Last Modified</th>
//           <th>Category</th>
//           <th>Label</th>
//           <th style={{ textAlign: "center" }}>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {currentFilteredForms.map((form, index) => (
//           <tr key={index}>
//             <td onClick={() => handleFormClick(form)} className="form-title">
//               {form.title}
//             </td>
//             <td>{form.lastModified}</td>
//             <td>{form.category}</td>
//             <td>{form.label}</td>
//             <td style={{ textAlign: "center" }}>
//               <button
//                 className="action-button-form share"
//                 onClick={() => handleShareClick(form._id)}
//                 data-tooltip-id="share-tooltip-form"
//                 data-tooltip-content="Share"
//               >
//                 <AiOutlineShareAlt className="action-icon" />
//                 <div className="tooltip-form">Share</div>
//               </button>
//               <button
//                 className="action-button-form edit"
//                 onClick={() => openEditModal(form)}
//                 data-tooltip-id="edit-tooltip-form"
//                 data-tooltip-content="Edit"
//               >
//                 <AiOutlineEdit className="action-icon" />
//                 <div className="tooltip-form">Edit</div>
//               </button>
//               <button
//                 className="action-button-form delete"
//                 onClick={() => deleteForm(form)}
//                 data-tooltip-id="delete-tooltip-form"
//                 data-tooltip-content="Delete"
//               >
//                 <AiOutlineDelete className="action-icon" />
//                 <div className="tooltip-form">Delete</div>
//               </button>
//               <button
//                 className="action-button-form view"
//                 onClick={() => openViewResponseModal(form._id)}
//                 data-tooltip-id="view-tooltip-form"
//                 data-tooltip-content="View"
//               >
//                 <AiOutlineEye className="action-icon" />
//                 <div className="tooltip-form">View</div>
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     <div className="pagination-container-form">
//       <div className="pagination-form">
//         <FaChevronLeft
//           className={`pagination-arrow-form ${currentPage === 1 && "disabled"}`}
//           onClick={() => handlePageChange(currentPage - 1)}
//         />
//         <span className="page-number-form">
//           <span className="current-page-form">{currentPage}</span> / {totalPages}
//         </span>
//         <FaChevronRight
//           className={`pagination-arrow-form ${currentPage === totalPages && "disabled"}`}
//           onClick={() => handlePageChange(currentPage + 1)}
//         />
//       </div>
//       <div className="rows-per-page-form">
//         <label>Rows per page</label>
//         <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//           {[5, 10, 15, 20].map((size) => (
//             <option key={size} value={size}>
//               {size}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   </div>
// </section>

//         {isAddModalOpen && (
//           <AddNewFormModal closeModal={closeAddModal} addForm={addForm} />
//         )}
//         {isEditModalOpen && (
//           <EditFormModal closeModal={closeEditModal} form={currentForm} editForm={editForm} />
//         )}
//         {shareableLink && (
//           <ShareModal
//             shareableLink={shareableLink}
//             copyLinkToClipboard={copyLinkToClipboard}
//             closeShareModal={closeShareModal}
//           />
//         )}
//         {isViewResponseModalOpen && (
//           <ViewResponseModal
//             formDetails={formDetails}
//             closeModal={closeViewResponseModal}
//           />
//         )}
//         <ToastContainer />
//       </main>
//     </div>
//   );
// };

// export default Form;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBell, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { CgNotes } from "react-icons/cg";
// import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineShareAlt } from "react-icons/ai";
// import { FiMenu } from "react-icons/fi";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import AddNewFormModal from "./AddNewFormModal";
// import EditFormModal from "./EditFormModal";
// import ShareModal from "./ShareModal";
// import ViewResponseModal from "./ViewResponseModal";
// import { ToastContainer, toast } from "react-toastify";
// import { confirmAlert } from "react-confirm-alert";
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import { Tooltip } from 'react-tooltip';
// import 'react-tooltip/dist/react-tooltip.css';
// import './Form.css';
// import '../Shared/Sidebar2.css';

// const Form = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewResponseModalOpen, setIsViewResponseModalOpen] = useState(false);
//   const [forms, setForms] = useState([]);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [shareableLink, setShareableLink] = useState("");
//   const [formDetails, setFormDetails] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   const fetchForms = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/forms");
//       const data = await response.json();
//       setForms(data);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
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

//   const openViewResponseModal = async (formTitle) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formTitle}`);
//       const data = await response.json();
//       setFormDetails(data);
//       setIsViewResponseModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching form details:", error);
//     }
//   };

//   const closeViewResponseModal = () => {
//     setIsViewResponseModalOpen(false);
//     setFormDetails(null);
//   };

//   const addForm = (form) => {
//     setForms([...forms, form]);
//   };

//   const editForm = (updatedForm) => {
//     const updatedForms = forms.map((form) =>
//       form._id === updatedForm._id ? updatedForm : form
//     );
//     setForms(updatedForms);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="confirm-delete-ui">
//             <h2 style={{ fontSize: "24px", textAlign: "center" }}>Confirm to Delete</h2>
//             <p style={{ textAlign: "center" }}>
//               Form structure will be lost. Are you sure you want to delete this form?
//             </p>
//             <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
//               <button
//                 style={{
//                   backgroundColor: "#dc3545",
//                   color: "#fff",
//                   border: "none",
//                   padding: "10px 20px",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//                 onClick={async () => {
//                   try {
//                     await fetch(`http://localhost:5000/api/forms/${formToDelete._id}`, { method: "DELETE" });
//                     setForms(forms.filter((form) => form._id !== formToDelete._id));
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
//                 style={{
//                   backgroundColor: "#007bff",
//                   color: "#fff",
//                   border: "none",
//                   padding: "10px 20px",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "confirm-delete-overlay",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${form._id}`);
//       if (response.status === 404) {
//         navigate("/form-builder", {
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
//         navigate("/form-preview", {
//           state: { formElements: formStructure.fields, formTitle: formStructure.title, formId: form._id },
//         });
//       } else {
//         navigate("/form-builder", {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching form structure:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleShareClick = (formId) => {
//     const link = `http://localhost:3000/public-form-preview/${formId}`;
//     setShareableLink(link);
//   };

//   const copyLinkToClipboard = () => {
//     navigator.clipboard.writeText(shareableLink).then(() => {
//       toast.success("Link copied to clipboard!");
//     }).catch((err) => {
//       console.error("Error copying link:", err);
//     });
//   };

//   const closeShareModal = () => {
//     setShareableLink("");
//   };

//   // Pagination related calculations
//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = forms.filter((form) =>
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
//     <div className="dashboard-form">
//       <aside className="sidebar">
//         <div className="logo-container">
//           <div className="logo">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="dristilogo" />
//           </div>
//         </div>
//         <div className="nav-container" style={{ marginTop: "90px" }}>
//           <nav className="nav">
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
//       <main className="main-content-form">
//         <header className="header-form">
//           <span className="founder-form">
//             <FiMenu style={{ color: "#909090" }} /> Program Manager
//           </span>
//           <div className="profile-section-form">
//             <div>
//               <FaBell className="notification-icon-form" />
//             </div>
//             <div className="user-info-form">
//               <img src="/navbar/profilepicture.png" alt="User Avatar" className="user-initials-form" />
//               <div className="user-details-form">
//                 <span className="user-name-form">
//                   Program Mang <RiArrowDropDownLine className="drop-form" />
//                 </span>
//                 <br />
//                 <span className="user-email-form">manager@mail.com</span>
//               </div>
//             </div>
//           </div>
//         </header>
//         <section className="content-form">
//           <div className="content-header-form">
//             <h2>Forms</h2>
//             <input
//               type="text"
//               placeholder="Search by title"
//               className="search-bar-formevaluatordashboard"
//               value={searchTerm} // Add value and onChange
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className="add-form-button" onClick={openAddModal}>
//               + Add New
//             </button>
//           </div>
//           <div className="form-list-form">
//             <table className="form-table-form">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th>Category</th>
//                   <th>Label</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td
//                       onClick={() => handleFormClick(form)}
//                       className="form-title"
//                     >
//                       {form.title}
//                     </td>
//                     <td>{form.lastModified}</td>
//                     <td>{form.category}</td>
//                     <td>{form.label}</td>
//                     <td style={{ textAlign: "center" }}>
//                       <button
//                         className="action-button-form share"
//                         onClick={() => handleShareClick(form._id)}
//                         data-tooltip-id="share-tooltip"
//                         data-tooltip-content="Share"
//                       >
//                         <AiOutlineShareAlt className="action-icon" />
//                         <div className="tooltip">Share</div>
//                       </button>
//                       <button
//                         className="action-button-form edit"
//                         onClick={() => openEditModal(form)}
//                         data-tooltip-id="edit-tooltip"
//                         data-tooltip-content="Edit"
//                       >
//                         <AiOutlineEdit className="action-icon" />
//                         <div className="tooltip">Edit</div>
//                       </button>
//                       <button
//                         className="action-button-form delete"
//                         onClick={() => deleteForm(form)}
//                         data-tooltip-id="delete-tooltip"
//                         data-tooltip-content="Delete"
//                       >
//                         <AiOutlineDelete className="action-icon" />
//                         <div className="tooltip">Delete</div>
//                       </button>
//                       <button
//                         className="action-button-form view"
//                         onClick={() => openViewResponseModal(form._id)}
//                         data-tooltip-id="view-tooltip"
//                         data-tooltip-content="View"
//                       >
//                         <AiOutlineEye className="action-icon" />
//                         <div className="tooltip">View</div>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pagination-container-form">
//               <div className="pagination-form">
//                 <FaChevronLeft
//                   className={`pagination-arrow-form ${currentPage === 1 && "disabled"}`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                 />
//                 <span className="page-number-form">
//                   <span className="current-page-form">{currentPage}</span> / {totalPages}
//                 </span>
//                 <FaChevronRight
//                   className={`pagination-arrow-form ${currentPage === totalPages && "disabled"}`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                 />
//               </div>
//               <div className="rows-per-page-form">
//                 <label>Rows per page</label>
//                 <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//                   {[5, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </section>

//         {isAddModalOpen && (
//           <AddNewFormModal closeModal={closeAddModal} addForm={addForm} />
//         )}
//         {isEditModalOpen && (
//           <EditFormModal closeModal={closeEditModal} form={currentForm} editForm={editForm} />
//         )}
//         {shareableLink && (
//           <ShareModal
//             shareableLink={shareableLink}
//             copyLinkToClipboard={copyLinkToClipboard}
//             closeShareModal={closeShareModal}
//           />
//         )}
//         {isViewResponseModalOpen && (
//           <ViewResponseModal
//             formDetails={formDetails}
//             closeModal={closeViewResponseModal}
//           />
//         )}
//         <ToastContainer />
//       </main>
//     </div>
//   );
// };

// export default Form;

// b tooltip415645

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
// import AddNewFormModal from "./AddNewFormModal";
// import EditFormModal from "./EditFormModal";
// import ShareModal from "./ShareModal";
// import ViewResponseModal from "./ViewResponseModal";
// import { ToastContainer, toast } from "react-toastify";
// import { confirmAlert } from "react-confirm-alert";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import "react-toastify/dist/ReactToastify.css";
// import "./Form.css";
// import "../Shared/Sidebar2.css";

// const Form = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewResponseModalOpen, setIsViewResponseModalOpen] = useState(false);
//   const [forms, setForms] = useState([]);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [shareableLink, setShareableLink] = useState("");
//   const [formDetails, setFormDetails] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formsPerPage, setFormsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   const fetchForms = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/forms");
//       const data = await response.json();
//       setForms(data);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
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

//   const openViewResponseModal = async (formTitle) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/form-submissions/${formTitle}`
//       );
//       const data = await response.json();
//       setFormDetails(data);
//       setIsViewResponseModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching form details:", error);
//     }
//   };

//   const closeViewResponseModal = () => {
//     setIsViewResponseModalOpen(false);
//     setFormDetails(null);
//   };

//   const addForm = (form) => {
//     setForms([...forms, form]);
//   };

//   const editForm = (updatedForm) => {
//     const updatedForms = forms.map((form) =>
//       form._id === updatedForm._id ? updatedForm : form
//     );
//     setForms(updatedForms);
//   };

//   const deleteForm = async (formToDelete) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="confirm-delete-ui">
//             <h2 style={{ fontSize: "24px", textAlign: "center" }}>
//               Confirm to Delete
//             </h2>
//             <p style={{ textAlign: "center" }}>
//               Form structure will be lost. Are you sure you want to delete this
//               form?
//             </p>
//             <div
//               style={{ display: "flex", justifyContent: "center", gap: "10px" }}
//             >
//               <button
//                 style={{
//                   backgroundColor: "#dc3545",
//                   color: "#fff",
//                   border: "none",
//                   padding: "10px 20px",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//                 onClick={async () => {
//                   try {
//                     await fetch(
//                       `http://localhost:5000/api/forms/${formToDelete._id}`,
//                       {
//                         method: "DELETE",
//                       }
//                     );
//                     setForms(
//                       forms.filter((form) => form._id !== formToDelete._id)
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
//                 style={{
//                   backgroundColor: "#007bff",
//                   color: "#fff",
//                   border: "none",
//                   padding: "10px 20px",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//                 onClick={onClose}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "confirm-delete-overlay",
//     });
//   };

//   const handleFormClick = async (form) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/general/${form._id}`
//       );
//       if (response.status === 404) {
//         navigate("/form-builder", {
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
//         navigate("/form-preview", {
//           state: {
//             formElements: formStructure.fields,
//             formTitle: formStructure.title,
//             formId: form._id,
//           },
//         });
//       } else {
//         navigate("/form-builder", {
//           state: { formElements: [], formTitle: form.title, formId: form._id },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching form structure:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleShareClick = (formId) => {
//     const link = `http://localhost:3000/public-form-preview/${formId}`;
//     setShareableLink(link);
//   };

//   const copyLinkToClipboard = () => {
//     navigator.clipboard
//       .writeText(shareableLink)
//       .then(() => {
//         toast.success("Link copied to clipboard!");
//       })
//       .catch((err) => {
//         console.error("Error copying link:", err);
//       });
//   };

//   const closeShareModal = () => {
//     setShareableLink("");
//   };

//   // Pagination related calculations
//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const filteredForms = forms.filter((form) =>
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

//   return (
//     <div className="dashboard-form">
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
//       <main className="main-content-form">
//         <header className="header-form">
//           <span className="founder-form">
//             <FiMenu style={{ color: "#909090" }} /> Program Manager
//           </span>
//           <div className="profile-section-form">
//             <div>
//               <FaBell className="notification-icon-form" />
//             </div>
//             <div className="user-info-form">
//               <img
//                 src="/navbar/profilepicture.png"
//                 alt="User Avatar"
//                 className="user-initials-form"
//               />
//               <div className="user-details-form">
//                 <span className="user-name-form">
//                   Program Mang <RiArrowDropDownLine className="drop-form" />
//                 </span>
//                 <br />
//                 <span className="user-email-form">manager@mail.com</span>
//               </div>
//             </div>
//           </div>
//         </header>
//         <section className="content-form">
//           <div className="content-header-form">
//             <h2>Forms</h2>
//             <input
//               type="text"
//               placeholder="Search by title"
//               className="search-bar-formevaluatordashboard"
//               value={searchTerm} // Add value and onChange
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className="add-form-button" onClick={openAddModal}>
//               + Add New
//             </button>
//           </div>
//           <div className="form-list-form">
//             <table className="form-table-form">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Last Modified</th>
//                   <th>Category</th>
//                   <th>Label</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentFilteredForms.map((form, index) => (
//                   <tr key={index}>
//                     <td
//                       onClick={() => handleFormClick(form)}
//                       className="form-title"
//                     >
//                       {form.title}
//                     </td>
//                     <td>{form.lastModified}</td>
//                     <td>{form.category}</td>
//                     <td>{form.label}</td>
//                     <td style={{ textAlign: "center" }}>
//                       <button
//                         className="action-button-form share"
//                         onClick={() => handleShareClick(form._id)}
//                       >
//                         <AiOutlineShareAlt className="action-icon" />
//                       </button>
//                       <button
//                         className="action-button-form edit"
//                         onClick={() => openEditModal(form)}
//                       >
//                         <AiOutlineEdit className="action-icon" />
//                       </button>
//                       <button
//                         className="action-button-form delete"
//                         onClick={() => deleteForm(form)}
//                       >
//                         <AiOutlineDelete className="action-icon" />
//                       </button>
//                       <button
//                         className="action-button-form view"
//                         onClick={() => openViewResponseModal(form._id)}
//                       >
//                         <AiOutlineEye className="action-icon" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pagination-container-form">
//               <div className="pagination-form">
//                 <FaChevronLeft
//                   className={`pagination-arrow-form ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                 />
//                 <span className="page-number-form">
//                   <span className="current-page-form">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <FaChevronRight
//                   className={`pagination-arrow-form ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                 />
//               </div>
//               <div className="rows-per-page-form">
//                 <label>Rows per page</label>
//                 <select value={formsPerPage} onChange={handleRowsPerPageChange}>
//                   {[5, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </section>

//         {isAddModalOpen && (
//           <AddNewFormModal closeModal={closeAddModal} addForm={addForm} />
//         )}
//         {isEditModalOpen && (
//           <EditFormModal
//             closeModal={closeEditModal}
//             form={currentForm}
//             editForm={editForm}
//           />
//         )}
//         {shareableLink && (
//           <ShareModal
//             shareableLink={shareableLink}
//             copyLinkToClipboard={copyLinkToClipboard}
//             closeShareModal={closeShareModal}
//           />
//         )}
//         {isViewResponseModalOpen && (
//           <ViewResponseModal
//             formDetails={formDetails}
//             closeModal={closeViewResponseModal}
//           />
//         )}
//         <ToastContainer />
//       </main>
//     </div>
//   );
// };

// export default Form;
