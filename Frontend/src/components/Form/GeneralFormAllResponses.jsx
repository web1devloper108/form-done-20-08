// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./GeneralFormAllResponses.css";
// import { FaPrint } from "react-icons/fa"; 

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [selectedResponses, setSelectedResponses] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [responsesPerPage, setResponsesPerPage] = useState(10); 
//   const [allSelected, setAllSelected] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();

//         if (!Array.isArray(data)) {
//           throw new Error("Unexpected response format");
//         }

//         setFormDetails(data);

//         if (data.length === 0) {
//           toast.info("No responses yet");
//         }
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   // Start of code change - Export to CSV with Toastify Message
//   const handleExportToCSV = () => {
//     if (selectedResponses.length === 0) {
//       toast.error("Please select at least one row to export."); // Show Toastify message
//       return;
//     }

//     const csvContent = convertToCSV(selectedResponses);
//     downloadCSV(csvContent, "form_responses.csv");
//   };
//   // End of code change

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(",")).join("\n");
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", fileName);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };

//   const formatUrl = (url) => {
//     if (!/^https?:\/\//i.test(url)) {
//       return `https://${url}`;
//     }
//     return url;
//   };

//   const indexOfLastResponse = currentPage * responsesPerPage;
//   const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
//   const currentResponses = formDetails.slice(
//     indexOfFirstResponse,
//     indexOfLastResponse
//   );
//   const totalPages = Math.ceil(formDetails.length / responsesPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setResponsesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // Start of code change - Select All across all pages
//   const handleSelectAll = () => {
//     if (allSelected) {
//       setSelectedResponses([]);
//     } else {
//       setSelectedResponses(formDetails);
//     }
//     setAllSelected(!allSelected);
//   };
//   // End of code change

//   useEffect(() => {
//     setAllSelected(selectedResponses.length === formDetails.length);
//   }, [selectedResponses, formDetails]);

//   const handleSelect = (response) => {
//     if (selectedResponses.includes(response)) {
//       setSelectedResponses(selectedResponses.filter((r) => r !== response));
//     } else {
//       setSelectedResponses([...selectedResponses, response]);
//     }
//   };

//   const startIndex = indexOfFirstResponse + 1;
//   const endIndex = Math.min(indexOfLastResponse, formDetails.length);
//   const totalResponses = formDetails.length;
//   // Place this function definition inside your component, but before the return statement

//   const handlePrintAllResponses = () => {
//     const printableContent = formDetails
//       .map(
//         (response, index) =>
//           `<div key=${index} style="page-break-after: always;">
//       ${Object.keys(response.formData)
//         .map(
//           (key) =>
//             `<div>
//           <strong style="width: 200px;">${key}:</strong>
//           ${
//             isValidUrl(response.formData[key])
//               ? `<a href="${formatUrl(
//                   response.formData[key]
//                 )}" target="_blank" rel="noopener noreferrer">${
//                   response.formData[key]
//                 }</a>`
//               : `<span>${response.formData[key]}</span>`
//           }
//         </div>`
//         )
//         .join("")}
//       <hr />
//       ${
//         response.files && response.files.length > 0
//           ? `<div>
//           <h4>Documents</h4>
//           ${response.files
//             .map((file, index) => {
//               const fileKey = Object.keys(response.formData).find((key) =>
//                 response.formData[key].includes(file.originalName)
//               );
//               return `<div key=${index}>
//                 <strong style="width: 315px;">${fileKey}:</strong>
//                 <a href="http://localhost:5000/${file.path}" target="_blank" rel="noopener noreferrer">${file.originalName}</a>
//               </div>`;
//             })
//             .join("")}
//         </div>`
//           : ""
//       }
//     </div>`
//       )
//       .join("");

//     const newWindow = window.open("", "", "width=800,height=600");

//     // Start of code change - Hide "React App" during print
//     newWindow.document.write(
//       `<html><head><style>
//         @media print {
//           /* Hides elements with these classes */
//           .react-app-title {
//             display: none !important;
//           }
//         }
//         </style></head><body>${printableContent}</body></html>`
//     );
//     // End of code change

//     newWindow.document.close();
//     newWindow.focus();
//     newWindow.print();
//     newWindow.close();
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <ToastContainer position="bottom-right" />
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4 className="react-app-title">Response Details</h4>{" "}
//               {/* React App title */}
//               <div style={{ display: "flex", gap: "10px" }}>
//                 {" "}
//                 {/* Adjust the gap as needed */}
//                 <button
//                   className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                   onClick={() => window.print()} // Print current response
//                 >
//                   <FaPrint
//                     style={{ marginRight: "5px" }}
//                     className="print-response-icon-generalformallresponses"
//                   />
//                   Print Response
//                 </button>
//                 <button
//                   className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                   onClick={handleBackToResponses}
//                 >
//                   Back to Responses
//                 </button>
//               </div>
//             </div>

//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: "40px" }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <strong style={{ width: "200px" }}>{key}:</strong>{" "}
//                     {isValidUrl(selectedResponse.formData[key]) ? (
//                       <a
//                         href={formatUrl(selectedResponse.formData[key])}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="link-response-generalformallresponses"
//                       >
//                         {selectedResponse.formData[key]}
//                       </a>
//                     ) : (
//                       <span>{selectedResponse.formData[key]}</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <h4 className="documents-generalformallresponses">
//                     Documents
//                   </h4>
//                   {selectedResponse.files.map((file, index) => {
//                     const fileKey = Object.keys(selectedResponse.formData).find(
//                       (key) =>
//                         selectedResponse.formData[key].includes(
//                           file.originalName
//                         )
//                     );
//                     return (
//                       <div key={index} style={{ display: "flex", gap: "10px" }}>
//                         <strong style={{ width: "315px" }}>{fileKey}:</strong>
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-response-generalformallresponses"
//                         >
//                           {file.originalName}
//                         </a>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4 className="custom-print-title">All Responses</h4>{" "}
//               {/* Print All Responses title */}
//               <div style={{ display: "flex", gap: "10px" }}>
//                 {" "}
//                 {/* Adjust the gap as needed */}
//                 <button
//                   className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                   onClick={handleExportToCSV}
//                 >
//                   Export to CSV
//                 </button>
//                 <button
//                   className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                   onClick={handlePrintAllResponses} // Print all responses
//                 >
//                   <FaPrint
//                     style={{ marginRight: "5px" }}
//                     className="print-response-icon-generalformallresponses"
//                   />{" "}
//                   Print All Responses
//                 </button>
//               </div>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 <li
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                     marginTop: "30px",
//                     fontWeight: "bold",
//                     alignItems: "center",
//                   }}
//                 >
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <input
//                       type="checkbox"
//                       onChange={handleSelectAll}
//                       checked={allSelected}
//                       style={{ marginRight: "10px" }}
//                     />
//                     <span>Name</span>
//                   </div>
//                   <span>Email</span>
//                   <span>Qualification(Recent One)</span>
//                   <span>Individual</span>
//                 </li>
//                 {currentResponses.map((response, index) => (
//                   <li
//                     key={index}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <div style={{ display: "flex", alignItems: "center" }}>
//                       <input
//                         type="checkbox"
//                         onChange={() => handleSelect(response)}
//                         checked={selectedResponses.includes(response)}
//                         style={{ marginRight: "10px" }}
//                       />
//                       {response.formData["Name"] ? (
//                         <span style={{ textAlign: "left", width: "120px" }}>
//                           {response.formData["Name"]}
//                         </span>
//                       ) : (
//                         <span>{`Response ${index + 1}`}</span>
//                       )}
//                     </div>
//                     {/* <span>{response.formData["Email"]}</span>
//                     <span>
//                       {response.formData["Qualification(Recent One)"]}
//                     </span> */}
//                     <span style={{ textAlign: "left", width: "200px" }}>
//                       {response.formData["Email"]}
//                     </span>
//                     <span style={{ textAlign: "left", width: "200px" }}>
//                       {response.formData["Qualification(Recent One)"]}
//                     </span>
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div>
//                 <div className="no-responses-found-generalformallresponses">
//                   <img
//                     src="/founders/notfound.png"
//                     alt="Logo"
//                     style={{
//                       marginTop: "70px",
//                       width: "120px",
//                       height: "120px",
//                     }}
//                   />
//                   <h4>No responses yet</h4>
//                 </div>
//               </div>
//             )}
//             <div className="pagination-container">
//               <div className="pagination">
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   style={{
//                     backgroundColor: currentPage === 1 ? "inherit" : "",
//                     cursor: currentPage === 1 ? "not-allowed" : "pointer",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "transparent";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "";
//                     }
//                   }}
//                 >
//                   &lt;
//                 </button>
//                 <span className="page-number">
//                   <span className="current-page">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   style={{
//                     backgroundColor:
//                       currentPage === totalPages ? "inherit" : "",
//                     cursor:
//                       currentPage === totalPages ? "not-allowed" : "pointer",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "transparent";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "";
//                     }
//                   }}
//                 >
//                   &gt;
//                 </button>
//               </div>
//               <div className="rows-info-generalformallresponses">
//                 <span>
//                   Showing {startIndex} - {endIndex} of {totalResponses} Results
//                 </span>
//               </div>
//               <div className="rows-per-page">
//                 <label>Rows per page</label>
//                 <select
//                   value={responsesPerPage}
//                   onChange={handleRowsPerPageChange}
//                 >
//                   {[2, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;








/////////uplode on but not open file in new page 

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from 'moment';
import "./GeneralFormAllResponses.css";
import { FaPrint } from "react-icons/fa";

const GeneralFormAllResponses = () => {
  const { formId } = useParams();
  const [formDetails, setFormDetails] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [selectedResponses, setSelectedResponses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [responsesPerPage, setResponsesPerPage] = useState(10); 
  const [allSelected, setAllSelected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/forms/form-submissions/${formId}`
        );
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response format");
        }

        setFormDetails(data);

        if (data.length === 0) {
          toast.info("No responses yet");
        }
      } catch (error) {
        console.error("Error fetching form details:", error);
      }
    };

    fetchFormDetails();
  }, [formId]);

  const handleViewDetails = (response) => {
    setSelectedResponse(response);
  };

  const handleBackToResponses = () => {
    setSelectedResponse(null);
  };

  // Start of code change - Export to CSV with Toastify Message
  const handleExportToCSV = () => {
    if (selectedResponses.length === 0) {
      toast.error("Please select at least one row to export."); // Show Toastify message
      return;
    }

    const csvContent = convertToCSV(selectedResponses);
    downloadCSV(csvContent, "form_responses.csv");
  };
  // End of code change

  const convertToCSV = (data) => {
    const array = [Object.keys(data[0].formData)].concat(
      data.map((item) => Object.values(item.formData))
    );
    return array.map((row) => row.join(",")).join("\n");
  };

  const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const formatUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const indexOfLastResponse = currentPage * responsesPerPage;
  const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
  const currentResponses = formDetails.slice(
    indexOfFirstResponse,
    indexOfLastResponse
  );
  const totalPages = Math.ceil(formDetails.length / responsesPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setResponsesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Start of code change - Select All across all pages
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedResponses([]);
    } else {
      setSelectedResponses(formDetails);
    }
    setAllSelected(!allSelected);
  };
  // End of code change

  useEffect(() => {
    setAllSelected(selectedResponses.length === formDetails.length);
  }, [selectedResponses, formDetails]);

  const handleSelect = (response) => {
    if (selectedResponses.includes(response)) {
      setSelectedResponses(selectedResponses.filter((r) => r !== response));
    } else {
      setSelectedResponses([...selectedResponses, response]);
    }
  };

  const startIndex = indexOfFirstResponse + 1;
  const endIndex = Math.min(indexOfLastResponse, formDetails.length);
  const totalResponses = formDetails.length;
  // Place this function definition inside your component, but before the return statement

  const handlePrintAllResponses = () => {
    const printableContent = formDetails
      .map(
        (response, index) =>
          `<div key=${index} style="page-break-after: always;">
      ${Object.keys(response.formData)
        .map(
          (key) =>
            `<div>
          <strong style="width: 200px;">${key}:</strong>
          ${
            isValidUrl(response.formData[key])
              ? `<a href="${formatUrl(
                  response.formData[key]
                )}" target="_blank" rel="noopener noreferrer">${
                  response.formData[key]
                }</a>`
              : `<span>${response.formData[key]}</span>`
          }
        </div>`
        )
        .join("")}
      <hr />
      ${
        response.files && response.files.length > 0
          ? `<div>
          <h4>Documents</h4>
          ${response.files
            .map((file, index) => {
              const fileKey = Object.keys(response.formData).find((key) =>
                response.formData[key].includes(file.originalName)
              );
              return `<div key=${index}>
                <strong style="width: 315px;">${fileKey}:</strong>
                <a href="http://localhost:5000/${file.path}" target="_blank" rel="noopener noreferrer">${file.originalName}</a>
              </div>`;
            })
            .join("")}
        </div>`
          : ""
      }
    </div>`
      )
      .join("");

    const newWindow = window.open("", "", "width=800,height=600");

    // Start of code change - Hide "React App" during print
    newWindow.document.write(
      `<html><head><style>
        @media print {
          /* Hides elements with these classes */
          .react-app-title {
            display: none !important;
          }
        }
        </style></head><body>${printableContent}</body></html>`
    );
    // End of code change

    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  return (
    <div className="custom-background-generalformallresponses">
      <ToastContainer position="bottom-right" />
      <div className="custom-container-generalformallresponses">
        {selectedResponse ? (
          <div>
            <div className="custom-response-header-generalformallresponses">
              <h4 className="react-app-title">Response Details</h4>{" "}
              {/* React App title */}
              <div style={{ display: "flex", gap: "10px" }}>
                {" "}
                {/* Adjust the gap as needed */}
                <button
                  className="custom-button-export-delete-backtoresponses-generalformallresponses"
                  onClick={() => window.print()} // Print current response
                >
                  <FaPrint
                    style={{ marginRight: "5px" }}
                    className="print-response-icon-generalformallresponses"
                  />
                  Print Response
                </button>
                <button
                  className="custom-button-export-delete-backtoresponses-generalformallresponses"
                  onClick={handleBackToResponses}
                >
                  Back to Responses
                </button>
              </div>
            </div>

            <hr />
            <div
              className="custom-response-details-generalformallresponses"
              style={{ marginTop: "40px" }}
            >
              {Object.keys(selectedResponse.formData).map((key) => (
                <div
                  key={key}
                  className="custom-response-item-generalformallresponses"
                >
                  <div style={{ display: "flex", gap: "10px" }}>
                    <strong style={{ width: "200px" }}>{key}:</strong>{" "}
                    {isValidUrl(selectedResponse.formData[key]) ? (
                      <a
                        href={formatUrl(selectedResponse.formData[key])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-response-generalformallresponses"
                      >
                        {selectedResponse.formData[key]}
                      </a>
                    ) : (
                      <span>{selectedResponse.formData[key]}</span>
                    )}
                  </div>
                </div>
              ))}
              <hr />
              {selectedResponse.files && selectedResponse.files.length > 0 && (
                <div className="custom-response-item-generalformallresponses">
                  <h4 className="documents-generalformallresponses">
                    Documents
                  </h4>
                  {selectedResponse.files.map((file, index) => {
                    const fileKey = Object.keys(selectedResponse.formData).find(
                      (key) =>
                        selectedResponse.formData[key].includes(
                          file.originalName
                        )
                    );
                    return (
                      <div key={index} style={{ display: "flex", gap: "10px" }}>
                        <strong style={{ width: "315px" }}>{fileKey}:</strong>
                        <a
                          href={`http://localhost:5000/${file.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-response-generalformallresponses"
                        >
                          {file.originalName}
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="custom-response-header-generalformallresponses">
              <h4 className="custom-print-title">All Responses</h4>{" "}
              {/* Print All Responses title */}
              <div style={{ display: "flex", gap: "10px" }}>
                {" "}
                {/* Adjust the gap as needed */}
                <button
                  className="custom-button-export-delete-backtoresponses-generalformallresponses"
                  onClick={handleExportToCSV}
                >
                  Export to CSV
                </button>
                <button
                  className="custom-button-export-delete-backtoresponses-generalformallresponses"
                  onClick={handlePrintAllResponses} // Print all responses
                >
                  <FaPrint
                    style={{ marginRight: "5px" }}
                    className="print-response-icon-generalformallresponses"
                  />{" "}
                  Print All Responses
                </button>
              </div>
            </div>
            {formDetails && formDetails.length > 0 ? (
              <ul className="custom-response-list-generalformallresponses">
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    marginTop: "30px",
                    fontWeight: "bold",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={allSelected}
                      style={{ marginRight: "10px" }}
                    />
                    <span>Name</span>
                  </div>
                  <span>Email</span>
                  <span>Qualification(Recent One)</span>
                  <span>Applied On</span> {/* HIGHLIGHT: Adding Applied On column */} 
                  <span>Individual</span>
                </li>
                {currentResponses.map((response, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        onChange={() => handleSelect(response)}
                        checked={selectedResponses.includes(response)}
                        style={{ marginRight: "10px" }}
                      />
                      {response.formData["Name"] ? (
                        <span style={{ textAlign: "left", width: "120px" }}>
                          {response.formData["Name"]}
                        </span>
                      ) : (
                        <span>{`Response ${index + 1}`}</span>
                      )}
                    </div>
                    {/* <span>{response.formData["Email"]}</span>
                    <span>
                      {response.formData["Qualification(Recent One)"]}
                    </span> */}
                    <span style={{ textAlign: "left", width: "200px" }}>
                      {response.formData["Email"]}
                    </span>
                    <span style={{ textAlign: "left", width: "200px" }}> 
                      {response.formData["Qualification(Recent One)"]}
                    </span>
                    {/* <span style={{ textAlign: "left", width: "140px" }}>{new Date(response.createdAt).toLocaleDateString()}</span> */}
                    <span style={{ textAlign: "left", width: "140px" }}>{moment(response.createdAt).format('DD/MM/YYYY')}</span>
                    <button
                      className="custom-button-view-details-generalformallresponses"
                      onClick={() => handleViewDetails(response)}
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <div className="no-responses-found-generalformallresponses">
                  <img
                    src="/founders/notfound.png"
                    alt="Logo"
                    style={{
                      marginTop: "70px",
                      width: "120px",
                      height: "120px",
                    }}
                  />
                  <h4>No responses yet</h4>
                </div>
              </div>
            )}
            <div className="pagination-container">
              <div className="pagination">
                <button
                  className={`pagination-arrow-generalformallresponses ${
                    currentPage === 1 && "disabled"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  style={{
                    backgroundColor: currentPage === 1 ? "inherit" : "",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = "";
                    }
                  }}
                >
                  &lt;
                </button>
                <span className="page-number">
                  <span className="current-page">{currentPage}</span> /{" "}
                  {totalPages}
                </span>
                <button
                  className={`pagination-arrow-generalformallresponses ${
                    currentPage === totalPages && "disabled"
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  style={{
                    backgroundColor:
                      currentPage === totalPages ? "inherit" : "",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) {
                      e.target.style.backgroundColor = "";
                    }
                  }}
                >
                  &gt;
                </button>
              </div>
              <div className="rows-info-generalformallresponses">
                <span>
                  Showing {startIndex} - {endIndex} of {totalResponses} Results
                </span>
              </div>
              <div className="rows-per-page">
                <label>Rows per page</label>
                <select
                  value={responsesPerPage}
                  onChange={handleRowsPerPageChange}
                >
                  {[2, 10, 15, 20].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        <button
          className="custom-button-close-modal-generalformallresponses"
          onClick={() => navigate(-1)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GeneralFormAllResponses;























////b apploed on in table 

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./GeneralFormAllResponses.css";
// import { FaPrint } from "react-icons/fa";

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [selectedResponses, setSelectedResponses] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [responsesPerPage, setResponsesPerPage] = useState(10); 
//   const [allSelected, setAllSelected] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();

//         if (!Array.isArray(data)) {
//           throw new Error("Unexpected response format");
//         }

//         setFormDetails(data);

//         if (data.length === 0) {
//           toast.info("No responses yet");
//         }
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   // Start of code change - Export to CSV with Toastify Message
//   const handleExportToCSV = () => {
//     if (selectedResponses.length === 0) {
//       toast.error("Please select at least one row to export."); // Show Toastify message
//       return;
//     }

//     const csvContent = convertToCSV(selectedResponses);
//     downloadCSV(csvContent, "form_responses.csv");
//   };
//   // End of code change

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(",")).join("\n");
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", fileName);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };

//   const formatUrl = (url) => {
//     if (!/^https?:\/\//i.test(url)) {
//       return `https://${url}`;
//     }
//     return url;
//   };

//   const indexOfLastResponse = currentPage * responsesPerPage;
//   const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
//   const currentResponses = formDetails.slice(
//     indexOfFirstResponse,
//     indexOfLastResponse
//   );
//   const totalPages = Math.ceil(formDetails.length / responsesPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setResponsesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // Start of code change - Select All across all pages
//   const handleSelectAll = () => {
//     if (allSelected) {
//       setSelectedResponses([]);
//     } else {
//       setSelectedResponses(formDetails);
//     }
//     setAllSelected(!allSelected);
//   };
//   // End of code change

//   useEffect(() => {
//     setAllSelected(selectedResponses.length === formDetails.length);
//   }, [selectedResponses, formDetails]);

//   const handleSelect = (response) => {
//     if (selectedResponses.includes(response)) {
//       setSelectedResponses(selectedResponses.filter((r) => r !== response));
//     } else {
//       setSelectedResponses([...selectedResponses, response]);
//     }
//   };

//   const startIndex = indexOfFirstResponse + 1;
//   const endIndex = Math.min(indexOfLastResponse, formDetails.length);
//   const totalResponses = formDetails.length;
//   // Place this function definition inside your component, but before the return statement

//   const handlePrintAllResponses = () => {
//     const printableContent = formDetails
//       .map(
//         (response, index) =>
//           `<div key=${index} style="page-break-after: always;">
//       ${Object.keys(response.formData)
//         .map(
//           (key) =>
//             `<div>
//           <strong style="width: 200px;">${key}:</strong>
//           ${
//             isValidUrl(response.formData[key])
//               ? `<a href="${formatUrl(
//                   response.formData[key]
//                 )}" target="_blank" rel="noopener noreferrer">${
//                   response.formData[key]
//                 }</a>`
//               : `<span>${response.formData[key]}</span>`
//           }
//         </div>`
//         )
//         .join("")}
//       <hr />
//       ${
//         response.files && response.files.length > 0
//           ? `<div>
//           <h4>Documents</h4>
//           ${response.files
//             .map((file, index) => {
//               const fileKey = Object.keys(response.formData).find((key) =>
//                 response.formData[key].includes(file.originalName)
//               );
//               return `<div key=${index}>
//                 <strong style="width: 315px;">${fileKey}:</strong>
//                 <a href="http://localhost:5000/${file.path}" target="_blank" rel="noopener noreferrer">${file.originalName}</a>
//               </div>`;
//             })
//             .join("")}
//         </div>`
//           : ""
//       }
//     </div>`
//       )
//       .join("");

//     const newWindow = window.open("", "", "width=800,height=600");

//     // Start of code change - Hide "React App" during print
//     newWindow.document.write(
//       `<html><head><style>
//         @media print {
//           /* Hides elements with these classes */
//           .react-app-title {
//             display: none !important;
//           }
//         }
//         </style></head><body>${printableContent}</body></html>`
//     );
//     // End of code change

//     newWindow.document.close();
//     newWindow.focus();
//     newWindow.print();
//     newWindow.close();
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <ToastContainer position="bottom-right" />
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4 className="react-app-title">Response Details</h4>{" "}
//               {/* React App title */}
//               <div style={{ display: "flex", gap: "10px" }}>
//                 {" "}
//                 {/* Adjust the gap as needed */}
//                 <button
//                   className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                   onClick={() => window.print()} // Print current response
//                 >
//                   <FaPrint
//                     style={{ marginRight: "5px" }}
//                     className="print-response-icon-generalformallresponses"
//                   />
//                   Print Response
//                 </button>
//                 <button
//                   className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                   onClick={handleBackToResponses}
//                 >
//                   Back to Responses
//                 </button>
//               </div>
//             </div>

//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: "40px" }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <strong style={{ width: "200px" }}>{key}:</strong>{" "}
//                     {isValidUrl(selectedResponse.formData[key]) ? (
//                       <a
//                         href={formatUrl(selectedResponse.formData[key])}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="link-response-generalformallresponses"
//                       >
//                         {selectedResponse.formData[key]}
//                       </a>
//                     ) : (
//                       <span>{selectedResponse.formData[key]}</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <h4 className="documents-generalformallresponses">
//                     Documents
//                   </h4>
//                   {selectedResponse.files.map((file, index) => {
//                     const fileKey = Object.keys(selectedResponse.formData).find(
//                       (key) =>
//                         selectedResponse.formData[key].includes(
//                           file.originalName
//                         )
//                     );
//                     return (
//                       <div key={index} style={{ display: "flex", gap: "10px" }}>
//                         <strong style={{ width: "315px" }}>{fileKey}:</strong>
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-response-generalformallresponses"
//                         >
//                           {file.originalName}
//                         </a>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4 className="custom-print-title">All Responses</h4>{" "}
//               {/* Print All Responses title */}
//               <div style={{ display: "flex", gap: "10px" }}>
//                 {" "}
//                 {/* Adjust the gap as needed */}
//                 <button
//                   className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                   onClick={handleExportToCSV}
//                 >
//                   Export to CSV
//                 </button>
//                 <button
//                   className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                   onClick={handlePrintAllResponses} // Print all responses
//                 >
//                   <FaPrint
//                     style={{ marginRight: "5px" }}
//                     className="print-response-icon-generalformallresponses"
//                   />{" "}
//                   Print All Responses
//                 </button>
//               </div>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 <li
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                     marginTop: "30px",
//                     fontWeight: "bold",
//                     alignItems: "center",
//                   }}
//                 >
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <input
//                       type="checkbox"
//                       onChange={handleSelectAll}
//                       checked={allSelected}
//                       style={{ marginRight: "10px" }}
//                     />
//                     <span>Name</span>
//                   </div>
//                   <span>Email</span>
//                   <span>Qualification(Recent One)</span>
//                   <span>Individual</span>
//                 </li>
//                 {currentResponses.map((response, index) => (
//                   <li
//                     key={index}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <div style={{ display: "flex", alignItems: "center" }}>
//                       <input
//                         type="checkbox"
//                         onChange={() => handleSelect(response)}
//                         checked={selectedResponses.includes(response)}
//                         style={{ marginRight: "10px" }}
//                       />
//                       {response.formData["Name"] ? (
//                         <span style={{ textAlign: "left", width: "120px" }}>
//                           {response.formData["Name"]}
//                         </span>
//                       ) : (
//                         <span>{`Response ${index + 1}`}</span>
//                       )}
//                     </div>
//                     {/* <span>{response.formData["Email"]}</span>
//                     <span>
//                       {response.formData["Qualification(Recent One)"]}
//                     </span> */}
//                     <span style={{ textAlign: "left", width: "200px" }}>
//                       {response.formData["Email"]}
//                     </span>
//                     <span style={{ textAlign: "left", width: "200px" }}>
//                       {response.formData["Qualification(Recent One)"]}
//                     </span>
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div>
//                 <div className="no-responses-found-generalformallresponses">
//                   <img
//                     src="/founders/notfound.png"
//                     alt="Logo"
//                     style={{
//                       marginTop: "70px",
//                       width: "120px",
//                       height: "120px",
//                     }}
//                   />
//                   <h4>No responses yet</h4>
//                 </div>
//               </div>
//             )}
//             <div className="pagination-container">
//               <div className="pagination">
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   style={{
//                     backgroundColor: currentPage === 1 ? "inherit" : "",
//                     cursor: currentPage === 1 ? "not-allowed" : "pointer",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "transparent";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "";
//                     }
//                   }}
//                 >
//                   &lt;
//                 </button>
//                 <span className="page-number">
//                   <span className="current-page">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   style={{
//                     backgroundColor:
//                       currentPage === totalPages ? "inherit" : "",
//                     cursor:
//                       currentPage === totalPages ? "not-allowed" : "pointer",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "transparent";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "";
//                     }
//                   }}
//                 >
//                   &gt;
//                 </button>
//               </div>
//               <div className="rows-info-generalformallresponses">
//                 <span>
//                   Showing {startIndex} - {endIndex} of {totalResponses} Results
//                 </span>
//               </div>
//               <div className="rows-per-page">
//                 <label>Rows per page</label>
//                 <select
//                   value={responsesPerPage}
//                   onChange={handleRowsPerPageChange}
//                 >
//                   {[2, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;






















/////show list only name and individual 09 08 2024
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./GeneralFormAllResponses.css";

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [selectedResponses, setSelectedResponses] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [responsesPerPage, setResponsesPerPage] = useState(10);
//   const [allSelected, setAllSelected] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();

//         if (!Array.isArray(data)) {
//           throw new Error("Unexpected response format");
//         }

//         setFormDetails(data);

//         if (data.length === 0) {
//           toast.info("No responses yet");
//         }
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     if (selectedResponses.length === 0) {
//       toast.error("Please select at least one row to export.");
//       return;
//     }

//     const csvContent = convertToCSV(selectedResponses);
//     downloadCSV(csvContent, "form_responses.csv");
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(",")).join("\n");
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", fileName);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };

//   const formatUrl = (url) => {
//     if (!/^https?:\/\//i.test(url)) {
//       return `https://${url}`;
//     }
//     return url;
//   };

//   const indexOfLastResponse = currentPage * responsesPerPage;
//   const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
//   const currentResponses = formDetails.slice(
//     indexOfFirstResponse,
//     indexOfLastResponse
//   );
//   const totalPages = Math.ceil(formDetails.length / responsesPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setResponsesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handleSelectAll = () => {
//     if (allSelected) {
//       setSelectedResponses([]);
//     } else {
//       setSelectedResponses(formDetails);
//     }
//     setAllSelected(!allSelected);
//   };

//   useEffect(() => {
//     setAllSelected(selectedResponses.length === formDetails.length);
//   }, [selectedResponses, formDetails]);

//   const handleSelect = (response) => {
//     if (selectedResponses.includes(response)) {
//       setSelectedResponses(selectedResponses.filter((r) => r !== response));
//     } else {
//       setSelectedResponses([...selectedResponses, response]);
//     }
//   };

//   const startIndex = indexOfFirstResponse + 1;
//   const endIndex = Math.min(indexOfLastResponse, formDetails.length);
//   const totalResponses = formDetails.length;

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleBackToResponses}
//               >
//                 Back to Responses
//               </button>
//             </div>
//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: "40px" }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <strong style={{ width: "200px" }}>{key}:</strong>{" "}
//                     {isValidUrl(selectedResponse.formData[key]) ? (
//                       <a
//                         href={formatUrl(selectedResponse.formData[key])}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="link-response-generalformallresponses"
//                       >
//                         {selectedResponse.formData[key]}
//                       </a>
//                     ) : (
//                       <span>{selectedResponse.formData[key]}</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <h4 className="documents-generalformallresponses">
//                     Documents
//                   </h4>
//                   {selectedResponse.files.map((file, index) => {
//                     const fileKey = Object.keys(selectedResponse.formData).find(
//                       (key) =>
//                         selectedResponse.formData[key].includes(
//                           file.originalName
//                         )
//                     );
//                     return (
//                       <div key={index} style={{ display: "flex", gap: "10px" }}>
//                         <strong style={{ width: "315px" }}>{fileKey}:</strong>
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-response-generalformallresponses"
//                         >
//                           {file.originalName}
//                         </a>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleExportToCSV}
//               >
//                 Export to CSV
//               </button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 <li
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                     fontWeight: "bold",
//                     alignItems: "center",
//                   }}
//                 >
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <input
//                       type="checkbox"
//                       onChange={handleSelectAll}
//                       checked={allSelected}
//                       style={{ marginRight: "10px" }}
//                     />
//                     <span>Name</span>
//                   </div>
//                   <span>Individual</span>
//                 </li>
//                 {currentResponses.map((response, index) => (
//                   <li
//                     key={index}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <div style={{ display: "flex", alignItems: "center" }}>
//                       <input
//                         type="checkbox"
//                         onChange={() => handleSelect(response)}
//                         checked={selectedResponses.includes(response)}
//                         style={{ marginRight: "10px" }}
//                       />
//                       {response.formData["Name"] ? (
//                         <span>{response.formData["Name"]}</span>
//                       ) : (
//                         <span>{`Response ${index + 1}`}</span>
//                       )}
//                     </div>
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div>
//                 {/* <p>No responses yet.</p> */}
//                 <div className="no-responses-found-generalformallresponses">
//                   <img
//                     src="/founders/notfound.png"
//                     alt="Logo"
//                     style={{
//                       marginTop: "70px",
//                       width: "120px",
//                       height: "120px",
//                     }}
//                   />
//                   <h4>No responses yet</h4>
//                 </div>
//               </div>
//             )}
//             <div className="pagination-container">
//               <div className="pagination">
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   style={{
//                     backgroundColor: currentPage === 1 ? "inherit" : "",
//                     cursor: currentPage === 1 ? "not-allowed" : "pointer",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "transparent";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "";
//                     }
//                   }}
//                 >
//                   &lt;
//                 </button>
//                 <span className="page-number">
//                   <span className="current-page">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   style={{
//                     backgroundColor:
//                       currentPage === totalPages ? "inherit" : "",
//                     cursor:
//                       currentPage === totalPages ? "not-allowed" : "pointer",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "transparent";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "";
//                     }
//                   }}
//                 >
//                   &gt;
//                 </button>
//               </div>
//               <div className="rows-info-generalformallresponses">
//                 <span>
//                   Showing {startIndex} - {endIndex} of {totalResponses} Results
//                 </span>
//               </div>
//               <div className="rows-per-page">
//                 <label>Rows per page</label>
//                 <select
//                   value={responsesPerPage}
//                   onChange={handleRowsPerPageChange}
//                 >
//                   {[2, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//         {/* <ToastContainer position="bottom-right" /> */}
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

///////////not error but 2 tostify message
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./GeneralFormAllResponses.css";

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]); // Initialize as an array
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [selectedResponses, setSelectedResponses] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [responsesPerPage, setResponsesPerPage] = useState(10);
//   const [allSelected, setAllSelected] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();

//         if (!Array.isArray(data)) {
//           throw new Error("Unexpected response format");
//         }

//         setFormDetails(data);

//         if (data.length === 0) {
//           toast.info("No responses yet");
//         }
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//         toast.error("Error fetching form details");
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     if (selectedResponses.length === 0) {
//       toast.error("Please select at least one row to export.");
//       return;
//     }

//     const csvContent = convertToCSV(selectedResponses);
//     downloadCSV(csvContent, "form_responses.csv");
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(",")).join("\n");
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", fileName);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };

//   const formatUrl = (url) => {
//     if (!/^https?:\/\//i.test(url)) {
//       return `https://${url}`;
//     }
//     return url;
//   };

//   const indexOfLastResponse = currentPage * responsesPerPage;
//   const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
//   const currentResponses = formDetails.slice(
//     indexOfFirstResponse,
//     indexOfLastResponse
//   );
//   const totalPages = Math.ceil(formDetails.length / responsesPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setResponsesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handleSelectAll = () => {
//     if (allSelected) {
//       setSelectedResponses([]);
//     } else {
//       setSelectedResponses(formDetails);
//     }
//     setAllSelected(!allSelected);
//   };

//   useEffect(() => {
//     setAllSelected(selectedResponses.length === formDetails.length);
//   }, [selectedResponses, formDetails]);

//   const handleSelect = (response) => {
//     if (selectedResponses.includes(response)) {
//       setSelectedResponses(selectedResponses.filter((r) => r !== response));
//     } else {
//       setSelectedResponses([...selectedResponses, response]);
//     }
//   };

//   const startIndex = indexOfFirstResponse + 1;
//   const endIndex = Math.min(indexOfLastResponse, formDetails.length);
//   const totalResponses = formDetails.length;

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleBackToResponses}
//               >
//                 Back to Responses
//               </button>
//             </div>
//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: "40px" }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <strong style={{ width: "200px" }}>{key}:</strong>{" "}
//                     {isValidUrl(selectedResponse.formData[key]) ? (
//                       <a
//                         href={formatUrl(selectedResponse.formData[key])}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="link-response-generalformallresponses"
//                       >
//                         {selectedResponse.formData[key]}
//                       </a>
//                     ) : (
//                       <span>{selectedResponse.formData[key]}</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <h4 className="documents-generalformallresponses">
//                     Documents
//                   </h4>
//                   {selectedResponse.files.map((file, index) => {
//                     const fileKey = Object.keys(
//                       selectedResponse.formData
//                     ).find((key) =>
//                       selectedResponse.formData[key].includes(file.originalName)
//                     );
//                     return (
//                       <div key={index} style={{ display: "flex", gap: "10px" }}>
//                         <strong style={{ width: "315px" }}>{fileKey}:</strong>
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-response-generalformallresponses"
//                         >
//                           {file.originalName}
//                         </a>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleExportToCSV}
//               >
//                 Export to CSV
//               </button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 <li
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                     fontWeight: "bold",
//                     alignItems: "center",
//                   }}
//                 >
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <input
//                       type="checkbox"
//                       onChange={handleSelectAll}
//                       checked={allSelected}
//                       style={{ marginRight: "10px" }}
//                     />
//                     <span>Name</span>
//                   </div>
//                   <span>Individual</span>
//                 </li>
//                 {currentResponses.map((response, index) => (
//                   <li
//                     key={index}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <div style={{ display: "flex", alignItems: "center" }}>
//                       <input
//                         type="checkbox"
//                         onChange={() => handleSelect(response)}
//                         checked={selectedResponses.includes(response)}
//                         style={{ marginRight: "10px" }}
//                       />
//                       {response.formData["Name"] ? (
//                         <span>{response.formData["Name"]}</span>
//                       ) : (
//                         <span>{`Response ${index + 1}`}</span>
//                       )}
//                     </div>
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//             <div className="pagination-container">
//               <div className="pagination">
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   style={{
//                     backgroundColor: currentPage === 1 ? "inherit" : "",
//                     cursor: currentPage === 1 ? "not-allowed" : "pointer",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "transparent";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "";
//                     }
//                   }}
//                 >
//                   &lt;
//                 </button>
//                 <span className="page-number">
//                   <span className="current-page">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   style={{
//                     backgroundColor:
//                       currentPage === totalPages ? "inherit" : "",
//                     cursor:
//                       currentPage === totalPages ? "not-allowed" : "pointer",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "transparent";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "";
//                     }
//                   }}
//                 >
//                   &gt;
//                 </button>
//               </div>
//               <div className="rows-info-generalformallresponses">
//                 <span>
//                   Showing {startIndex} - {endIndex} of {totalResponses} Results
//                 </span>
//               </div>
//               <div className="rows-per-page">
//                 <label>Rows per page</label>
//                 <select
//                   value={responsesPerPage}
//                   onChange={handleRowsPerPageChange}
//                 >
//                   {[2, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//         <ToastContainer position="bottom-right" />
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

////////allgood before 08/08/2024
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast from react-toastify
// import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify
// import "./GeneralFormAllResponses.css"; // Ensure this file has the necessary styles

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [selectedResponses, setSelectedResponses] = useState([]); // State to track selected responses
//   const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
//   const [responsesPerPage, setResponsesPerPage] = useState(10); // Rows per page
//   const [allSelected, setAllSelected] = useState(false); // State for master checkbox
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();
//         setFormDetails(data);

//         // Debugging statement to check fetched data
//         // console.log("Fetched Form Details:", data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   // START: Export to CSV with selected responses
//   const handleExportToCSV = () => {
//     if (selectedResponses.length === 0) {
//       toast.error("Please select at least one row to export."); // Show error if no response is selected
//       return;
//     }

//     const csvContent = convertToCSV(selectedResponses);
//     downloadCSV(csvContent, "form_responses.csv");
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(",")).join("\n");
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", fileName);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };
//   // END: Export to CSV with selected responses

//   // START: Function to check if a string is a valid URL
//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };
//   // END: Function to check if a string is a valid URL

//   // START: Function to ensure URL starts with a valid protocol
//   const formatUrl = (url) => {
//     if (!/^https?:\/\//i.test(url)) {
//       return `https://${url}`;
//     }
//     return url;
//   };
//   // END: Function to ensure URL starts with a valid protocol

//   // Pagination logic
//   const indexOfLastResponse = currentPage * responsesPerPage;
//   const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
//   const currentResponses = formDetails.slice(
//     indexOfFirstResponse,
//     indexOfLastResponse
//   );
//   const totalPages = Math.ceil(formDetails.length / responsesPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setResponsesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // START: Checkbox logic
//   const handleSelectAll = () => {
//     // Highlight start: Update logic to select all rows across all pages
//     if (allSelected) {
//       setSelectedResponses([]);
//     } else {
//       setSelectedResponses(formDetails); // Select all items across all pages
//     }
//     setAllSelected(!allSelected);
//     // Highlight end
//   };

//   useEffect(() => {
//     // Highlight start: Use useEffect to sync allSelected with the state of selectedResponses
//     setAllSelected(selectedResponses.length === formDetails.length);
//     // Highlight end
//   }, [selectedResponses, formDetails]);

//   const handleSelect = (response) => {
//     if (selectedResponses.includes(response)) {
//       setSelectedResponses(selectedResponses.filter((r) => r !== response));
//     } else {
//       setSelectedResponses([...selectedResponses, response]);
//     }
//   };
//   // END: Checkbox logic

//   // Calculate the range of displayed rows
//   const startIndex = indexOfFirstResponse + 1;
//   const endIndex = Math.min(indexOfLastResponse, formDetails.length);
//   const totalResponses = formDetails.length;

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleBackToResponses}
//               >
//                 Back to Responses
//               </button>
//             </div>
//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: "40px" }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <strong style={{ width: "200px" }}>{key}:</strong>{" "}
//                     {isValidUrl(selectedResponse.formData[key]) ? (
//                       <a
//                         href={formatUrl(selectedResponse.formData[key])}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="link-response-generalformallresponses"
//                       >
//                         {selectedResponse.formData[key]}
//                       </a>
//                     ) : (
//                       <span>{selectedResponse.formData[key]}</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <h4 className="documents-generalformallresponses">
//                     Documents
//                   </h4>
//                   {selectedResponse.files.map((file, index) => {
//                     const fileKey = Object.keys(selectedResponse.formData).find(
//                       (key) =>
//                         selectedResponse.formData[key].includes(
//                           file.originalName
//                         )
//                     );
//                     return (
//                       <div key={index} style={{ display: "flex", gap: "10px" }}>
//                         <strong style={{ width: "315px" }}>{fileKey}:</strong>
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-response-generalformallresponses"
//                         >
//                           {file.originalName}
//                         </a>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleExportToCSV}
//               >
//                 Export to CSV
//               </button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {/* START: Adding headings for Name and Individual */}
//                 <li
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                     fontWeight: "bold",
//                     alignItems: "center", // Align items to center for checkbox alignment
//                   }}
//                 >
//                   {/* START: Checkbox with reduced gap */}
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <input
//                       type="checkbox"
//                       onChange={handleSelectAll}
//                       checked={allSelected}
//                       style={{ marginRight: "10px" }} // Adjust margin for checkbox
//                     />
//                     <span>Name</span>
//                   </div>
//                   {/* END: Checkbox with reduced gap */}
//                   <span>Individual</span>
//                 </li>
//                 {/* END: Adding headings for Name and Individual */}
//                 {currentResponses.map((response, index) => (
//                   <li
//                     key={index}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     {/* START: Checkbox for each row */}
//                     <div style={{ display: "flex", alignItems: "center" }}>
//                       <input
//                         type="checkbox"
//                         onChange={() => handleSelect(response)}
//                         checked={selectedResponses.includes(response)}
//                         style={{ marginRight: "10px" }} // Adjust margin for checkbox
//                       />
//                       {response.formData["Name"] ? (
//                         <span>{response.formData["Name"]}</span>
//                       ) : (
//                         <span>{`Response ${index + 1}`}</span>
//                       )}
//                     </div>
//                     {/* END: Checkbox for each row */}
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}

//             {/* START: Pagination and Rows per page controls */}
//             <div className="pagination-container">
//               <div className="pagination">
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   style={{
//                     backgroundColor: currentPage === 1 ? "inherit" : "", // Default background color for disabled button
//                     cursor: currentPage === 1 ? "not-allowed" : "pointer", // Change cursor to indicate non-clickable
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "transparent"; // Set hover background color to transparent
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = ""; // Reset background color on mouse leave
//                     }
//                   }}
//                 >
//                   &lt;
//                 </button>
//                 <span className="page-number">
//                   <span className="current-page">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   style={{
//                     backgroundColor:
//                       currentPage === totalPages ? "inherit" : "", // Default background color for disabled button
//                     cursor:
//                       currentPage === totalPages ? "not-allowed" : "pointer", // Change cursor to indicate non-clickable
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "transparent"; // Set hover background color to transparent
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = ""; // Reset background color on mouse leave
//                     }
//                   }}
//                 >
//                   &gt;
//                 </button>
//               </div>
//               {/* START: Display current range of rows and total number of rows */}
//               <div className="rows-info-generalformallresponses">
//                 <span>
//                   Showing {startIndex} - {endIndex} of {totalResponses} Results
//                 </span>
//               </div>
//               {/* END: Display current range of rows and total number of rows */}
//               <div className="rows-per-page">
//                 <label>Rows per page</label>
//                 <select
//                   value={responsesPerPage}
//                   onChange={handleRowsPerPageChange}
//                 >
//                   {[2, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             {/* END: Pagination and Rows per page controls */}
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//         {/* START: ToastContainer for notifications */}
//         <ToastContainer position="bottom-right" />
//         {/* END: ToastContainer for notifications */}
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

/////////good gapp bu not all row select of all page
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast from react-toastify
// import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify
// import "./GeneralFormAllResponses.css"; // Ensure this file has the necessary styles

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [selectedResponses, setSelectedResponses] = useState([]); // State to track selected responses
//   const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
//   const [responsesPerPage, setResponsesPerPage] = useState(10); // Rows per page
//   const [allSelected, setAllSelected] = useState(false); // State for master checkbox
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();
//         setFormDetails(data);

//         // Debugging statement to check fetched data
//         // console.log("Fetched Form Details:", data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   // START: Export to CSV with selected responses
//   const handleExportToCSV = () => {
//     if (selectedResponses.length === 0) {
//       toast.error("Please select at least one row to export."); // Show error if no response is selected
//       return;
//     }

//     const csvContent = convertToCSV(selectedResponses);
//     downloadCSV(csvContent, "form_responses.csv");
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(",")).join("\n");
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", fileName);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };
//   // END: Export to CSV with selected responses

//   // START: Function to check if a string is a valid URL
//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };
//   // END: Function to check if a string is a valid URL

//   // START: Function to ensure URL starts with a valid protocol
//   const formatUrl = (url) => {
//     if (!/^https?:\/\//i.test(url)) {
//       return `https://${url}`;
//     }
//     return url;
//   };
//   // END: Function to ensure URL starts with a valid protocol

//   // Pagination logic
//   const indexOfLastResponse = currentPage * responsesPerPage;
//   const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
//   const currentResponses = formDetails.slice(
//     indexOfFirstResponse,
//     indexOfLastResponse
//   );
//   const totalPages = Math.ceil(formDetails.length / responsesPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setResponsesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // START: Checkbox logic
//   const handleSelectAll = () => {
//     if (allSelected) {
//       setSelectedResponses([]);
//     } else {
//       setSelectedResponses(currentResponses);
//     }
//     setAllSelected(!allSelected);
//   };

//   const handleSelect = (response) => {
//     if (selectedResponses.includes(response)) {
//       setSelectedResponses(selectedResponses.filter((r) => r !== response));
//     } else {
//       setSelectedResponses([...selectedResponses, response]);
//     }
//   };
//   // END: Checkbox logic

//   // Calculate the range of displayed rows
//   const startIndex = indexOfFirstResponse + 1;
//   const endIndex = Math.min(indexOfLastResponse, formDetails.length);
//   const totalResponses = formDetails.length;

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleBackToResponses}
//               >
//                 Back to Responses
//               </button>
//             </div>
//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: "40px" }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <strong style={{ width: "200px" }}>{key}:</strong>{" "}
//                     {isValidUrl(selectedResponse.formData[key]) ? (
//                       <a
//                         href={formatUrl(selectedResponse.formData[key])}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="link-response-generalformallresponses"
//                       >
//                         {selectedResponse.formData[key]}
//                       </a>
//                     ) : (
//                       <span>{selectedResponse.formData[key]}</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <h4 className="documents-generalformallresponses">
//                     Documents
//                   </h4>
//                   {selectedResponse.files.map((file, index) => {
//                     const fileKey = Object.keys(selectedResponse.formData).find(
//                       (key) =>
//                         selectedResponse.formData[key].includes(
//                           file.originalName
//                         )
//                     );
//                     return (
//                       <div key={index} style={{ display: "flex", gap: "10px" }}>
//                         <strong style={{ width: "315px" }}>{fileKey}:</strong>
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-response-generalformallresponses"
//                         >
//                           {file.originalName}
//                         </a>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleExportToCSV}
//               >
//                 Export to CSV
//               </button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {/* START: Adding headings for Name and Individual */}
//                 <li
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                     fontWeight: "bold",
//                     alignItems: "center", // Align items to center for checkbox alignment
//                   }}
//                 >
//                   {/* START: Checkbox with reduced gap */}
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <input
//                       type="checkbox"
//                       onChange={handleSelectAll}
//                       checked={allSelected}
//                       style={{ marginRight: "10px" }} // Adjust margin for checkbox
//                     />
//                     <span>Name</span>
//                   </div>
//                   {/* END: Checkbox with reduced gap */}
//                   <span>Individual</span>
//                 </li>
//                 {/* END: Adding headings for Name and Individual */}
//                 {currentResponses.map((response, index) => (
//                   <li
//                     key={index}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     {/* START: Checkbox for each row */}
//                     <div style={{ display: "flex", alignItems: "center" }}>
//                       <input
//                         type="checkbox"
//                         onChange={() => handleSelect(response)}
//                         checked={selectedResponses.includes(response)}
//                         style={{ marginRight: "10px" }} // Adjust margin for checkbox
//                       />
//                       {response.formData["Name"] ? (
//                         <span>{response.formData["Name"]}</span>
//                       ) : (
//                         <span>{`Response ${index + 1}`}</span>
//                       )}
//                     </div>
//                     {/* END: Checkbox for each row */}
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}

//             {/* START: Pagination and Rows per page controls */}
//             <div className="pagination-container">
//               <div className="pagination">
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   style={{
//                     backgroundColor: currentPage === 1 ? "inherit" : "", // Default background color for disabled button
//                     cursor: currentPage === 1 ? "not-allowed" : "pointer", // Change cursor to indicate non-clickable
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "transparent"; // Set hover background color to transparent
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = ""; // Reset background color on mouse leave
//                     }
//                   }}
//                 >
//                   &lt;
//                 </button>
//                 <span className="page-number">
//                   <span className="current-page">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   style={{
//                     backgroundColor:
//                       currentPage === totalPages ? "inherit" : "", // Default background color for disabled button
//                     cursor:
//                       currentPage === totalPages ? "not-allowed" : "pointer", // Change cursor to indicate non-clickable
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "transparent"; // Set hover background color to transparent
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = ""; // Reset background color on mouse leave
//                     }
//                   }}
//                 >
//                   &gt;
//                 </button>
//               </div>
//               {/* START: Display current range of rows and total number of rows */}
//               <div className="rows-info-generalformallresponses">
//                 <span>
//                   Showing {startIndex} - {endIndex} of {totalResponses} Results
//                 </span>
//               </div>
//               {/* END: Display current range of rows and total number of rows */}
//               <div className="rows-per-page">
//                 <label>Rows per page</label>
//                 <select
//                   value={responsesPerPage}
//                   onChange={handleRowsPerPageChange}
//                 >
//                   {[2, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             {/* END: Pagination and Rows per page controls */}
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//         {/* START: ToastContainer for notifications */}
//         <ToastContainer position="bottom-right" />
//         {/* END: ToastContainer for notifications */}
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

////////too much gap[ check and column ]
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast from react-toastify
// import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify
// import "./GeneralFormAllResponses.css"; // Ensure this file has the necessary styles

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [selectedResponses, setSelectedResponses] = useState([]); // State to track selected responses
//   const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
//   const [responsesPerPage, setResponsesPerPage] = useState(10); // Rows per page
//   const [allSelected, setAllSelected] = useState(false); // State for master checkbox
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();
//         setFormDetails(data);

//         // Debugging statement to check fetched data
//         // console.log("Fetched Form Details:", data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   // START: Export to CSV with selected responses
//   const handleExportToCSV = () => {
//     if (selectedResponses.length === 0) {
//       toast.error("Please select at least one row to export."); // Show error if no response is selected
//       return;
//     }

//     const csvContent = convertToCSV(selectedResponses);
//     downloadCSV(csvContent, "form_responses.csv");
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(",")).join("\n");
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", fileName);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };
//   // END: Export to CSV with selected responses

//   // START: Function to check if a string is a valid URL
//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };
//   // END: Function to check if a string is a valid URL

//   // START: Function to ensure URL starts with a valid protocol
//   const formatUrl = (url) => {
//     if (!/^https?:\/\//i.test(url)) {
//       return `https://${url}`;
//     }
//     return url;
//   };
//   // END: Function to ensure URL starts with a valid protocol

//   // Pagination logic
//   const indexOfLastResponse = currentPage * responsesPerPage;
//   const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
//   const currentResponses = formDetails.slice(
//     indexOfFirstResponse,
//     indexOfLastResponse
//   );
//   const totalPages = Math.ceil(formDetails.length / responsesPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setResponsesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // START: Checkbox logic
//   const handleSelectAll = () => {
//     if (allSelected) {
//       setSelectedResponses([]);
//     } else {
//       setSelectedResponses(currentResponses);
//     }
//     setAllSelected(!allSelected);
//   };

//   const handleSelect = (response) => {
//     if (selectedResponses.includes(response)) {
//       setSelectedResponses(selectedResponses.filter((r) => r !== response));
//     } else {
//       setSelectedResponses([...selectedResponses, response]);
//     }
//   };
//   // END: Checkbox logic

//   // Calculate the range of displayed rows
//   const startIndex = indexOfFirstResponse + 1;
//   const endIndex = Math.min(indexOfLastResponse, formDetails.length);
//   const totalResponses = formDetails.length;

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleBackToResponses}
//               >
//                 Back to Responses
//               </button>
//             </div>
//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: "40px" }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <strong style={{ width: "200px" }}>{key}:</strong>{" "}
//                     {isValidUrl(selectedResponse.formData[key]) ? (
//                       <a
//                         href={formatUrl(selectedResponse.formData[key])}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="link-response-generalformallresponses"
//                       >
//                         {selectedResponse.formData[key]}
//                       </a>
//                     ) : (
//                       <span>{selectedResponse.formData[key]}</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <h4 className="documents-generalformallresponses">
//                     Documents
//                   </h4>
//                   {selectedResponse.files.map((file, index) => {
//                     const fileKey = Object.keys(selectedResponse.formData).find(
//                       (key) =>
//                         selectedResponse.formData[key].includes(
//                           file.originalName
//                         )
//                     );
//                     return (
//                       <div key={index} style={{ display: "flex", gap: "10px" }}>
//                         <strong style={{ width: "315px" }}>{fileKey}:</strong>
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-response-generalformallresponses"
//                         >
//                           {file.originalName}
//                         </a>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleExportToCSV}
//               >
//                 Export to CSV
//               </button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {/* START: Adding headings for Name and Individual */}
//                 <li
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                     fontWeight: "bold",
//                     alignItems: "center", // Align items to center for checkbox alignment
//                   }}
//                 >
//                   <input
//                     type="checkbox"
//                     onChange={handleSelectAll}
//                     checked={allSelected}
//                   />
//                   <span>Name</span>
//                   <span>Individual</span>
//                 </li>
//                 {/* END: Adding headings for Name and Individual */}
//                 {currentResponses.map((response, index) => (
//                   <li
//                     key={index}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     {/* START: Checkbox for each row */}
//                     <input
//                       type="checkbox"
//                       onChange={() => handleSelect(response)}
//                       checked={selectedResponses.includes(response)}
//                     />
//                     {/* END: Checkbox for each row */}
//                     {response.formData["Name"] ? (
//                       <span>{response.formData["Name"]}</span>
//                     ) : (
//                       <span>{`Response ${index + 1}`}</span>
//                     )}
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}

//             {/* START: Pagination and Rows per page controls */}
//             <div className="pagination-container">
//               <div className="pagination">
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   style={{
//                     backgroundColor: currentPage === 1 ? "inherit" : "", // Default background color for disabled button
//                     cursor: currentPage === 1 ? "not-allowed" : "pointer", // Change cursor to indicate non-clickable
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "transparent"; // Set hover background color to transparent
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = ""; // Reset background color on mouse leave
//                     }
//                   }}
//                 >
//                   &lt;
//                 </button>
//                 <span className="page-number">
//                   <span className="current-page">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   style={{
//                     backgroundColor:
//                       currentPage === totalPages ? "inherit" : "", // Default background color for disabled button
//                     cursor:
//                       currentPage === totalPages ? "not-allowed" : "pointer", // Change cursor to indicate non-clickable
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "transparent"; // Set hover background color to transparent
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = ""; // Reset background color on mouse leave
//                     }
//                   }}
//                 >
//                   &gt;
//                 </button>
//               </div>
//               {/* START: Display current range of rows and total number of rows */}
//               <div className="rows-info-generalformallresponses">
//                 <span>
//                   Showing {startIndex} - {endIndex} of {totalResponses} Results
//                 </span>
//               </div>
//               {/* END: Display current range of rows and total number of rows */}
//               <div className="rows-per-page">
//                 <label>Rows per page</label>
//                 <select
//                   value={responsesPerPage}
//                   onChange={handleRowsPerPageChange}
//                 >
//                   {[2, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             {/* END: Pagination and Rows per page controls */}
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//         {/* START: ToastContainer for notifications */}
//         <ToastContainer position="bottom-right" />
//         {/* END: ToastContainer for notifications */}
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

/////without total number of page
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./GeneralFormAllResponses.css"; // Ensure this file has the necessary styles

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
//   const [responsesPerPage, setResponsesPerPage] = useState(10); // Rows per page
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();
//         setFormDetails(data);

//         // Debugging statement to check fetched data
//         // console.log("Fetched Form Details:", data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     const csvContent = convertToCSV(formDetails);
//     downloadCSV(csvContent, "form_responses.csv");
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(",")).join("\n");
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", fileName);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   // START: Function to check if a string is a valid URL
//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };
//   // END: Function to check if a string is a valid URL

//   // START: Function to ensure URL starts with a valid protocol
//   const formatUrl = (url) => {
//     if (!/^https?:\/\//i.test(url)) {
//       return `https://${url}`;
//     }
//     return url;
//   };
//   // END: Function to ensure URL starts with a valid protocol

//   // Pagination logic
//   const indexOfLastResponse = currentPage * responsesPerPage;
//   const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
//   const currentResponses = formDetails.slice(
//     indexOfFirstResponse,
//     indexOfLastResponse
//   );
//   const totalPages = Math.ceil(formDetails.length / responsesPerPage);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRowsPerPageChange = (e) => {
//     setResponsesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleBackToResponses}
//               >
//                 Back to Responses
//               </button>
//             </div>
//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: "40px" }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <strong style={{ width: "200px" }}>{key}:</strong>{" "}
//                     {isValidUrl(selectedResponse.formData[key]) ? (
//                       <a
//                         href={formatUrl(selectedResponse.formData[key])}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="link-response-generalformallresponses"
//                       >
//                         {selectedResponse.formData[key]}
//                       </a>
//                     ) : (
//                       <span>{selectedResponse.formData[key]}</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <h4 className="documents-generalformallresponses">
//                     Documents
//                   </h4>
//                   {selectedResponse.files.map((file, index) => {
//                     const fileKey = Object.keys(selectedResponse.formData).find(
//                       (key) =>
//                         selectedResponse.formData[key].includes(
//                           file.originalName
//                         )
//                     );
//                     return (
//                       <div key={index} style={{ display: "flex", gap: "10px" }}>
//                         <strong style={{ width: "315px" }}>{fileKey}:</strong>
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-response-generalformallresponses"
//                         >
//                           {file.originalName}
//                         </a>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleExportToCSV}
//               >
//                 Export to CSV
//               </button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {/* START: Adding headings for Name and Individual */}
//                 <li
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   <span>Name</span>
//                   <span>Individual</span>
//                 </li>
//                 {/* END: Adding headings for Name and Individual */}
//                 {currentResponses.map((response, index) => (
//                   <li
//                     key={index}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     {response.formData["Name"] ? (
//                       <span>{response.formData["Name"]}</span>
//                     ) : (
//                       <span>{`Response ${index + 1}`}</span>
//                     )}
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}

//             {/* START: Pagination and Rows per page controls */}
//             <div className="pagination-container">
//               <div className="pagination">
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === 1 && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   style={{
//                     backgroundColor: currentPage === 1 ? "inherit" : "", // Default background color for disabled button
//                     cursor: currentPage === 1 ? "not-allowed" : "pointer", // Change cursor to indicate non-clickable
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = "transparent"; // Set hover background color to transparent
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== 1) {
//                       e.target.style.backgroundColor = ""; // Reset background color on mouse leave
//                     }
//                   }}
//                 >
//                   &lt;
//                 </button>
//                 <span className="page-number">
//                   <span className="current-page">{currentPage}</span> /{" "}
//                   {totalPages}
//                 </span>
//                 <button
//                   className={`pagination-arrow-generalformallresponses ${
//                     currentPage === totalPages && "disabled"
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   style={{
//                     backgroundColor:
//                       currentPage === totalPages ? "inherit" : "", // Default background color for disabled button
//                     cursor:
//                       currentPage === totalPages ? "not-allowed" : "pointer", // Change cursor to indicate non-clickable
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = "transparent"; // Set hover background color to transparent
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentPage !== totalPages) {
//                       e.target.style.backgroundColor = ""; // Reset background color on mouse leave
//                     }
//                   }}
//                 >
//                   &gt;
//                 </button>
//               </div>
//               <div className="rows-per-page">
//                 <label>Rows per page</label>
//                 <select
//                   value={responsesPerPage}
//                   onChange={handleRowsPerPageChange}
//                 >
//                   {[2, 10, 15, 20].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             {/* END: Pagination and Rows per page controls */}
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

//////////////Before Delete one and all response

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom'; // Removed Link import for external URLs
// import './GeneralFormAllResponses.css';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
//   const [showDeleteResponseModal, setShowDeleteResponseModal] = useState(false);
//   const [responseToDelete, setResponseToDelete] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();
//         setFormDetails(data);

//         // Debugging statement to check fetched data
//         // console.log("Fetched Form Details:", data);
//       } catch (error) {
//         console.error('Error fetching form details:', error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     const csvContent = convertToCSV(formDetails);
//     downloadCSV(csvContent, 'form_responses.csv');
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(',')).join('\n');
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', fileName);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handleDeleteAllResponses = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/form-submissions/${formId}`,
//         {
//           method: 'DELETE',
//         }
//       );
//       const data = await response.json();
//       setFormDetails([]);
//     } catch (error) {
//       console.error('Error deleting all responses:', error);
//     }
//     setShowDeleteAllModal(false);
//   };

//   const handleDeleteResponse = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/form-submission/${responseToDelete}`,
//         {
//           method: 'DELETE',
//         }
//       );
//       const data = await response.json();
//       setFormDetails((prevDetails) =>
//         prevDetails.filter((response) => response._id !== responseToDelete)
//       );
//     } catch (error) {
//       console.error('Error deleting response:', error);
//     }
//     setShowDeleteResponseModal(false);
//   };

//   const openDeleteAllModal = () => {
//     setShowDeleteAllModal(true);
//   };

//   const openDeleteResponseModal = (responseId) => {
//     setResponseToDelete(responseId);
//     setShowDeleteResponseModal(true);
//   };

//   const closeDeleteAllModal = () => {
//     setShowDeleteAllModal(false);
//   };

//   const closeDeleteResponseModal = () => {
//     setShowDeleteResponseModal(false);
//   };

//   // START: Function to check if a string is a valid URL
//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };
//   // END: Function to check if a string is a valid URL

//   // START: Function to ensure URL starts with a valid protocol
//   const formatUrl = (url) => {
//     if (!/^https?:\/\//i.test(url)) {
//       return `https://${url}`;
//     }
//     return url;
//   };
//   // END: Function to ensure URL starts with a valid protocol

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleBackToResponses}
//               >
//                 Back to Responses
//               </button>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={() =>
//                   openDeleteResponseModal(selectedResponse._id)
//                 }
//               >
//                 Delete This Response
//               </button>
//             </div>
//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: '40px' }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <strong style={{ width: '200px' }}>{key}:</strong>{' '}
//                     {/* START: Update to show URL as a link */}
//                     {isValidUrl(selectedResponse.formData[key]) ? (
//                       <a
//                         href={formatUrl(selectedResponse.formData[key])} // Use the `a` tag for external links
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="link-response-generalformallresponses"
//                       >
//                         {selectedResponse.formData[key]}
//                       </a>
//                     ) : (
//                       <span>{selectedResponse.formData[key]}</span>
//                     )}
//                     {/* END: Update to show URL as a link */}
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {/* START: Display files below the horizontal line */}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <h4 className='documents-generalformallresponses'>Documents</h4>
//                   {selectedResponse.files.map((file, index) => {
//                     // Find the corresponding key in formData that matches the file name
//                     const fileKey = Object.keys(selectedResponse.formData).find(
//                       (key) =>
//                         selectedResponse.formData[key].includes(
//                           file.originalName
//                         )
//                     );
//                     return (
//                       <div key={index} style={{ display: 'flex', gap: '10px' }}>
//                         {/* Use fileKey to display the label */}
//                         <strong style={{ width: '315px' }}>{fileKey}:</strong>
//                         {/* START: Update to show file name with Link */}
//                         <a
//                           href={`http://localhost:5000/${file.path}`} // Use the `a` tag for file links as well
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-response-generalformallresponses"
//                         >
//                           {file.originalName}
//                         </a>
//                         {/* END: Update to show file name with Link */}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//               {/* END: Display files below the horizontal line */}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleExportToCSV}
//               >
//                 Export to CSV
//               </button>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={openDeleteAllModal}
//               >
//                 Delete All Responses
//               </button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     {/* START: Update to display user name */}
//                     {response.formData['Name'] ? (
//                       <span>{response.formData['Name']}</span>
//                     ) : (
//                       <span>{`Response ${index + 1}`}</span>
//                     )}
//                     {/* END: Update to display user name */}
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//       </div>

//       {/* START: Delete All Responses Modal */}
//       {showDeleteAllModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4
//               style={{
//                 fontSize: '24px',
//                 textAlign: 'center',
//                 marginBottom: '15PX',
//               }}
//             >
//               Delete responses
//             </h4>
//             <p style={{ textAlign: 'center', marginBottom: '15PX' }}>
//               Are you sure you want to delete all form responses? This action
//               cannot be undone.
//             </p>
//             <div className="modal-buttons-generalformallresponses">
//               <button
//                 className="modal-button-generalformallresponses"
//                 onClick={handleDeleteAllResponses}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 className="modal-button-cancel-generalformallresponses"
//                 onClick={closeDeleteAllModal}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete All Responses Modal */}

//       {/* START: Delete Single Response Modal */}
//       {showDeleteResponseModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4
//               style={{
//                 fontSize: '24px',
//                 textAlign: 'center',
//                 marginBottom: '15PX',
//               }}
//             >
//               Delete response
//             </h4>
//             <p style={{ textAlign: 'center', marginBottom: '15PX' }}>
//               Are you sure you want to delete this response? This action cannot
//               be undone.
//             </p>
//             <div className="modal-buttons-generalformallresponses">
//               <button
//                 className="modal-button-generalformallresponses"
//                 onClick={handleDeleteResponse}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 className="modal-button-cancel-generalformallresponses"
//                 onClick={closeDeleteResponseModal}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete Single Response Modal */}
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

/////bef link on social media
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link import
// import './GeneralFormAllResponses.css';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
//   const [showDeleteResponseModal, setShowDeleteResponseModal] = useState(false);
//   const [responseToDelete, setResponseToDelete] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();
//         setFormDetails(data);

//         // Debugging statement to check fetched data
//         // console.log("Fetched Form Details:", data);
//       } catch (error) {
//         console.error('Error fetching form details:', error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     const csvContent = convertToCSV(formDetails);
//     downloadCSV(csvContent, 'form_responses.csv');
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(',')).join('\n');
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', fileName);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handleDeleteAllResponses = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/form-submissions/${formId}`,
//         {
//           method: 'DELETE',
//         }
//       );
//       const data = await response.json();
//       setFormDetails([]);
//     } catch (error) {
//       console.error('Error deleting all responses:', error);
//     }
//     setShowDeleteAllModal(false);
//   };

//   const handleDeleteResponse = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/form-submission/${responseToDelete}`,
//         {
//           method: 'DELETE',
//         }
//       );
//       const data = await response.json();
//       setFormDetails((prevDetails) =>
//         prevDetails.filter((response) => response._id !== responseToDelete)
//       );
//     } catch (error) {
//       console.error('Error deleting response:', error);
//     }
//     setShowDeleteResponseModal(false);
//   };

//   const openDeleteAllModal = () => {
//     setShowDeleteAllModal(true);
//   };

//   const openDeleteResponseModal = (responseId) => {
//     setResponseToDelete(responseId);
//     setShowDeleteResponseModal(true);
//   };

//   const closeDeleteAllModal = () => {
//     setShowDeleteAllModal(false);
//   };

//   const closeDeleteResponseModal = () => {
//     setShowDeleteResponseModal(false);
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleBackToResponses}
//               >
//                 Back to Responses
//               </button>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={() =>
//                   openDeleteResponseModal(selectedResponse._id)
//                 }
//               >
//                 Delete This Response
//               </button>
//             </div>
//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: '40px' }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <strong style={{ width: '200px' }}>{key}:</strong>{' '}
//                     <span>{selectedResponse.formData[key]}</span>
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {/* START: Display files below the horizontal line */}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                    <h4 className='documents-generalformallresponses'>Documents</h4>
//                   {selectedResponse.files.map((file, index) => {
//                     // Find the corresponding key in formData that matches the file name
//                     const fileKey = Object.keys(selectedResponse.formData).find(
//                       (key) =>
//                         selectedResponse.formData[key].includes(
//                           file.originalName
//                         )
//                     );
//                     return (
//                       <div key={index} style={{ display: 'flex', gap: '10px' }}>
//                         {/* Use fileKey to display the label */}
//                         <strong style={{ width: '315px' }}>{fileKey}:</strong>
//                         {/* START: Update to show file name with Link */}
//                         <Link
//                           to={`http://localhost:5000/${file.path}`} // Link to route if needed
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-response-generalformallresponses"
//                         >
//                           {file.originalName}
//                         </Link>
//                         {/* END: Update to show file name with Link */}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//               {/* END: Display files below the horizontal line */}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleExportToCSV}
//               >
//                 Export to CSV
//               </button>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={openDeleteAllModal}
//               >
//                 Delete All Responses
//               </button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     {/* START: Update to display user name */}
//                     {response.formData['Name'] ? (
//                       <span>{response.formData['Name']}</span>
//                     ) : (
//                       <span>{`Response ${index + 1}`}</span>
//                     )}
//                     {/* END: Update to display user name */}
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//       </div>

//       {/* START: Delete All Responses Modal */}
//       {showDeleteAllModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4
//               style={{
//                 fontSize: '24px',
//                 textAlign: 'center',
//                 marginBottom: '15PX',
//               }}
//             >
//               Delete responses
//             </h4>
//             <p style={{ textAlign: 'center', marginBottom: '15PX' }}>
//               Are you sure you want to delete all form responses? This action
//               cannot be undone.
//             </p>
//             <div className="modal-buttons-generalformallresponses">
//               <button
//                 className="modal-button-generalformallresponses"
//                 onClick={handleDeleteAllResponses}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 className="modal-button-cancel-generalformallresponses"
//                 onClick={closeDeleteAllModal}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete All Responses Modal */}

//       {/* START: Delete Single Response Modal */}
//       {showDeleteResponseModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4
//               style={{
//                 fontSize: '24px',
//                 textAlign: 'center',
//                 marginBottom: '15PX',
//               }}
//             >
//               Delete response
//             </h4>
//             <p style={{ textAlign: 'center', marginBottom: '15PX' }}>
//               Are you sure you want to delete this response? This action cannot
//               be undone.
//             </p>
//             <div className="modal-buttons-generalformallresponses">
//               <button
//                 className="modal-button-generalformallresponses"
//                 onClick={handleDeleteResponse}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 className="modal-button-cancel-generalformallresponses"
//                 onClick={closeDeleteResponseModal}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete Single Response Modal */}
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

/////////////with <a> tag
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
//   const [showDeleteResponseModal, setShowDeleteResponseModal] = useState(false);
//   const [responseToDelete, setResponseToDelete] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();
//         setFormDetails(data);

//         // Debugging statement to check fetched data
//         // console.log("Fetched Form Details:", data);
//       } catch (error) {
//         console.error('Error fetching form details:', error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     const csvContent = convertToCSV(formDetails);
//     downloadCSV(csvContent, 'form_responses.csv');
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(',')).join('\n');
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', fileName);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handleDeleteAllResponses = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/form-submissions/${formId}`,
//         {
//           method: 'DELETE',
//         }
//       );
//       const data = await response.json();
//       setFormDetails([]);
//     } catch (error) {
//       console.error('Error deleting all responses:', error);
//     }
//     setShowDeleteAllModal(false);
//   };

//   const handleDeleteResponse = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/form-submission/${responseToDelete}`,
//         {
//           method: 'DELETE',
//         }
//       );
//       const data = await response.json();
//       setFormDetails((prevDetails) =>
//         prevDetails.filter((response) => response._id !== responseToDelete)
//       );
//     } catch (error) {
//       console.error('Error deleting response:', error);
//     }
//     setShowDeleteResponseModal(false);
//   };

//   const openDeleteAllModal = () => {
//     setShowDeleteAllModal(true);
//   };

//   const openDeleteResponseModal = (responseId) => {
//     setResponseToDelete(responseId);
//     setShowDeleteResponseModal(true);
//   };

//   const closeDeleteAllModal = () => {
//     setShowDeleteAllModal(false);
//   };

//   const closeDeleteResponseModal = () => {
//     setShowDeleteResponseModal(false);
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h2>Response Details</h2>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleBackToResponses}
//               >
//                 Back to Responses
//               </button>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={() =>
//                   openDeleteResponseModal(selectedResponse._id)
//                 }
//               >
//                 Delete This Response
//               </button>
//             </div>
//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: '40px' }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <strong style={{ width: '200px' }}>{key}:</strong>{' '}
//                     <span>{selectedResponse.formData[key]}</span>
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {/* START: Display files below the horizontal line */}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <h4 className='documents-generalformallresponses'>Documents</h4>
//                   {selectedResponse.files.map((file, index) => {
//                     // Find the corresponding key in formData that matches the file name
//                     const fileKey = Object.keys(selectedResponse.formData).find(
//                       (key) =>
//                         selectedResponse.formData[key].includes(
//                           file.originalName
//                         )
//                     );
//                     return (
//                       <div key={index} style={{ display: 'flex', gap: '50px' }}>
//                         {/* Use fileKey to display the label */}
//                         <strong style={{ width: '400px' }}>{fileKey}:</strong>
//                         {/* START: Update to show file name with link */}
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-response-generalformallresponses"
//                         >
//                           {file.originalName}
//                         </a>
//                         {/* END: Update to show file name with link */}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//               {/* END: Display files below the horizontal line */}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleExportToCSV}
//               >
//                 Export to CSV
//               </button>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={openDeleteAllModal}
//               >
//                 Delete All Responses
//               </button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     {/* START: Update to display user name */}
//                     {response.formData['Name'] ? (
//                       <span>{response.formData['Name']}</span>
//                     ) : (
//                       <span>{`Response ${index + 1}`}</span>
//                     )}
//                     {/* END: Update to display user name */}
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//       </div>

//       {/* START: Delete All Responses Modal */}
//       {showDeleteAllModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4
//               style={{
//                 fontSize: '24px',
//                 textAlign: 'center',
//                 marginBottom: '15PX',
//               }}
//             >
//               Delete responses
//             </h4>
//             <p style={{ textAlign: 'center', marginBottom: '15PX' }}>
//               Are you sure you want to delete all form responses? This action
//               cannot be undone.
//             </p>
//             <div className="modal-buttons-generalformallresponses">
//               <button
//                 className="modal-button-generalformallresponses"
//                 onClick={handleDeleteAllResponses}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 className="modal-button-cancel-generalformallresponses"
//                 onClick={closeDeleteAllModal}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete All Responses Modal */}

//       {/* START: Delete Single Response Modal */}
//       {showDeleteResponseModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4
//               style={{
//                 fontSize: '24px',
//                 textAlign: 'center',
//                 marginBottom: '15PX',
//               }}
//             >
//               Delete response
//             </h4>
//             <p style={{ textAlign: 'center', marginBottom: '15PX' }}>
//               Are you sure you want to delete this response? This action cannot
//               be undone.
//             </p>
//             <div className="modal-buttons-generalformallresponses">
//               <button
//                 className="modal-button-generalformallresponses"
//                 onClick={handleDeleteResponse}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 className="modal-button-cancel-generalformallresponses"
//                 onClick={closeDeleteResponseModal}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete Single Response Modal */}
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

///////////////( 'View PDF'and 'View Image')  aa raha hain and label is good

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
//   const [showDeleteResponseModal, setShowDeleteResponseModal] = useState(false);
//   const [responseToDelete, setResponseToDelete] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/forms/form-submissions/${formId}`
//         );
//         const data = await response.json();
//         setFormDetails(data);

//         // Debugging statement to check fetched data
//         // console.log("Fetched Form Details:", data);
//       } catch (error) {
//         console.error('Error fetching form details:', error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     const csvContent = convertToCSV(formDetails);
//     downloadCSV(csvContent, 'form_responses.csv');
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(
//       data.map((item) => Object.values(item.formData))
//     );
//     return array.map((row) => row.join(',')).join('\n');
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', fileName);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handleDeleteAllResponses = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/form-submissions/${formId}`,
//         {
//           method: 'DELETE',
//         }
//       );
//       const data = await response.json();
//       setFormDetails([]);
//     } catch (error) {
//       console.error('Error deleting all responses:', error);
//     }
//     setShowDeleteAllModal(false);
//   };

//   const handleDeleteResponse = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/forms/form-submission/${responseToDelete}`,
//         {
//           method: 'DELETE',
//         }
//       );
//       const data = await response.json();
//       setFormDetails((prevDetails) =>
//         prevDetails.filter((response) => response._id !== responseToDelete)
//       );
//     } catch (error) {
//       console.error('Error deleting response:', error);
//     }
//     setShowDeleteResponseModal(false);
//   };

//   const openDeleteAllModal = () => {
//     setShowDeleteAllModal(true);
//   };

//   const openDeleteResponseModal = (responseId) => {
//     setResponseToDelete(responseId);
//     setShowDeleteResponseModal(true);
//   };

//   const closeDeleteAllModal = () => {
//     setShowDeleteAllModal(false);
//   };

//   const closeDeleteResponseModal = () => {
//     setShowDeleteResponseModal(false);
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleBackToResponses}
//               >
//                 Back to Responses
//               </button>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={() =>
//                   openDeleteResponseModal(selectedResponse._id)
//                 }
//               >
//                 Delete This Response
//               </button>
//             </div>
//             <hr />
//             <div
//               className="custom-response-details-generalformallresponses"
//               style={{ marginTop: '40px' }}
//             >
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div
//                   key={key}
//                   className="custom-response-item-generalformallresponses"
//                 >
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <strong style={{ width: '200px' }}>{key}:</strong>{' '}
//                     <span>{selectedResponse.formData[key]}</span>
//                   </div>
//                 </div>
//               ))}
//               <hr />
//               {/* START: Display files below the horizontal line */}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   {selectedResponse.files.map((file, index) => {
//                     // Find the corresponding key in formData that matches the file name
//                     const fileKey = Object.keys(selectedResponse.formData).find(
//                       (key) =>
//                         selectedResponse.formData[key].includes(
//                           file.originalName
//                         )
//                     );
//                     return (
//                       <div key={index} style={{ display: 'flex', gap: '50px' }}>
//                         {/* Use fileKey to display the label */}
//                         <strong style={{ width: '160px' }}>{fileKey}:</strong>
//                         {file.mimeType.startsWith('image/') ? (
//                           <>
//                             <a
//                               href={`http://localhost:5000/${file.path}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="file-response-generalformallresponses"
//                             >
//                               View Image
//                             </a>
//                           </>
//                         ) : file.mimeType === 'application/pdf' ? (
//                           <a
//                             href={`http://localhost:5000/${file.path}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="file-response-generalformallresponses"
//                           >
//                             View PDF
//                           </a>
//                         ) : (
//                           <span>Unsupported file type</span>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//               {/* END: Display files below the horizontal line */}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={handleExportToCSV}
//               >
//                 Export to CSV
//               </button>
//               <button
//                 className="custom-button-export-delete-backtoresponses-generalformallresponses"
//                 onClick={openDeleteAllModal}
//               >
//                 Delete All Responses
//               </button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     {/* START: Update to display user name */}
//                     {response.formData['Name'] ? (
//                       <span>{response.formData['Name']}</span>
//                     ) : (
//                       <span>{`Response ${index + 1}`}</span>
//                     )}
//                     {/* END: Update to display user name */}
//                     <button
//                       className="custom-button-view-details-generalformallresponses"
//                       onClick={() => handleViewDetails(response)}
//                     >
//                       View Details
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button
//           className="custom-button-close-modal-generalformallresponses"
//           onClick={() => navigate(-1)}
//         >
//           Close
//         </button>
//       </div>

//       {/* START: Delete All Responses Modal */}
//       {showDeleteAllModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4
//               style={{
//                 fontSize: '24px',
//                 textAlign: 'center',
//                 marginBottom: '15PX',
//               }}
//             >
//               Delete responses
//             </h4>
//             <p style={{ textAlign: 'center', marginBottom: '15PX' }}>
//               Are you sure you want to delete all form responses? This action
//               cannot be undone.
//             </p>
//             <div className="modal-buttons-generalformallresponses">
//               <button
//                 className="modal-button-generalformallresponses"
//                 onClick={handleDeleteAllResponses}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 className="modal-button-cancel-generalformallresponses"
//                 onClick={closeDeleteAllModal}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete All Responses Modal */}

//       {/* START: Delete Single Response Modal */}
//       {showDeleteResponseModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4
//               style={{
//                 fontSize: '24px',
//                 textAlign: 'center',
//                 marginBottom: '15PX',
//               }}
//             >
//               Delete response
//             </h4>
//             <p style={{ textAlign: 'center', marginBottom: '15PX' }}>
//               Are you sure you want to delete this response? This action cannot
//               be undone.
//             </p>
//             <div className="modal-buttons-generalformallresponses">
//               <button
//                 className="modal-button-generalformallresponses"
//                 onClick={handleDeleteResponse}
//               >
//                 Yes, Delete it!
//               </button>
//               <button
//                 className="modal-button-cancel-generalformallresponses"
//                 onClick={closeDeleteResponseModal}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete Single Response Modal */}
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

////////////file not show actual label

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
//   const [showDeleteResponseModal, setShowDeleteResponseModal] = useState(false);
//   const [responseToDelete, setResponseToDelete] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);

//         // START: Debugging statement to check fetched data
//         // console.log("Fetched Form Details:", data);
//         // END: Debugging statement

//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     const csvContent = convertToCSV(formDetails);
//     downloadCSV(csvContent, 'form_responses.csv');
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(data.map(item => Object.values(item.formData)));
//     return array.map(row => row.join(',')).join('\n');
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', fileName);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handleDeleteAllResponses = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`, {
//         method: 'DELETE',
//       });
//       const data = await response.json();
//       setFormDetails([]);
//     } catch (error) {
//       console.error("Error deleting all responses:", error);
//     }
//     setShowDeleteAllModal(false);
//   };

//   const handleDeleteResponse = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/form-submission/${responseToDelete}`, {
//         method: 'DELETE',
//       });
//       const data = await response.json();
//       setFormDetails((prevDetails) => prevDetails.filter((response) => response._id !== responseToDelete));
//     } catch (error) {
//       console.error("Error deleting response:", error);
//     }
//     setShowDeleteResponseModal(false);
//   };

//   const openDeleteAllModal = () => {
//     setShowDeleteAllModal(true);
//   };

//   const openDeleteResponseModal = (responseId) => {
//     setResponseToDelete(responseId);
//     setShowDeleteResponseModal(true);
//   };

//   const closeDeleteAllModal = () => {
//     setShowDeleteAllModal(false);
//   };

//   const closeDeleteResponseModal = () => {
//     setShowDeleteResponseModal(false);
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-export-delete-backtoresponses-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//               <button className="custom-button-export-delete-backtoresponses-generalformallresponses" onClick={() => openDeleteResponseModal(selectedResponse._id)}>Delete This Response</button>
//             </div>
//             <hr />
//             <div className="custom-response-details-generalformallresponses" style={{ marginTop: '40px' }}>
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <strong style={{ width: '200px' }}>{key}:</strong> <span>{selectedResponse.formData[key]}</span>
//                   </div>
//                 </div>
//               ))}
//             <hr />
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   {selectedResponse.files.map((file, index) => (
//                     <div key={index} style={{ display: 'flex', gap: '50px' }}>
//                       <strong style={{ width: '160px' }}>{file.originalName}:</strong>
//                       {file.mimeType.startsWith('image/') ? (
//                         <>
//                           <a
//                             href={`http://localhost:5000/${file.path}`}
//                             target="_blank"
//                             rel="noopener noreferrer" className='file-response-generalformallresponses'
//                           >
//                             View Image
//                           </a>
//                         </>
//                       ) : file.mimeType === 'application/pdf' ? (
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer" className='file-response-generalformallresponses'
//                         >
//                           View PDF
//                         </a>
//                       ) : (
//                         <span>Unsupported file type</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button className="custom-button-export-delete-backtoresponses-generalformallresponses" onClick={handleExportToCSV}>Export to CSV</button>
//               <button className="custom-button-export-delete-backtoresponses-generalformallresponses" onClick={openDeleteAllModal}>Delete All Responses</button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     {/* START: Update to display user name */}
//                     {response.formData["Name"] ? (
//                       <span>{response.formData["Name"]}</span>
//                     ) : (
//                       <span>{`Response ${index + 1}`}</span>
//                     )}
//                     {/* Debugging statement
//                     <small style={{ color: 'red' }}>
//                       {`Name: ${response.formData["Name"] || 'Not Found'}`}
//                     </small> */}
//                     {/* END: Update to display user name */}
//                     <button className="custom-button-view-details-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-close-modal-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>

//       {/* START: Delete All Responses Modal */}
//       {showDeleteAllModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4 style={{ fontSize: "24px", textAlign: "center", marginBottom:'15PX' }}>Delete responses</h4>
//             <p  style={{ textAlign: "center", marginBottom:'15PX'  }}>Are you sure you want to delete all form responses? This action cannot be undone.</p>
//             <div className="modal-buttons-generalformallresponses">
//               <button className="modal-button-generalformallresponses" onClick={handleDeleteAllResponses}>Yes, Delete it!</button>
//               <button className="modal-button-cancel-generalformallresponses" onClick={closeDeleteAllModal}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete All Responses Modal */}

//       {/* START: Delete Single Response Modal */}
//       {showDeleteResponseModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4 style={{ fontSize: "24px", textAlign: "center", marginBottom:'15PX' }}>Delete response</h4>
//             <p style={{ textAlign: "center", marginBottom:'15PX'  }}>Are you sure you want to delete this response? This action cannot be undone.</p>
//             <div className="modal-buttons-generalformallresponses">
//               <button className="modal-button-generalformallresponses" onClick={handleDeleteResponse}>Yes, Delete it!</button>
//               <button className="modal-button-cancel-generalformallresponses" onClick={closeDeleteResponseModal}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete Single Response Modal */}
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   // console.log(selectedResponse,"selectedResponse")
//   const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
//   const [showDeleteResponseModal, setShowDeleteResponseModal] = useState(false);
//   const [responseToDelete, setResponseToDelete] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     const csvContent = convertToCSV(formDetails);
//     downloadCSV(csvContent, 'form_responses.csv');
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(data.map(item => Object.values(item.formData)));
//     return array.map(row => row.join(',')).join('\n');
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', fileName);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handleDeleteAllResponses = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`, {
//         method: 'DELETE',
//       });
//       const data = await response.json();
//       setFormDetails([]);
//     } catch (error) {
//       console.error("Error deleting all responses:", error);
//     }
//     setShowDeleteAllModal(false);
//   };

//   const handleDeleteResponse = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/form-submission/${responseToDelete}`, {
//         method: 'DELETE',
//       });
//       const data = await response.json();
//       setFormDetails((prevDetails) => prevDetails.filter((response) => response._id !== responseToDelete));
//     } catch (error) {
//       console.error("Error deleting response:", error);
//     }
//     setShowDeleteResponseModal(false);
//   };

//   const openDeleteAllModal = () => {
//     setShowDeleteAllModal(true);
//   };

//   const openDeleteResponseModal = (responseId) => {
//     setResponseToDelete(responseId);
//     setShowDeleteResponseModal(true);
//   };

//   const closeDeleteAllModal = () => {
//     setShowDeleteAllModal(false);
//   };

//   const closeDeleteResponseModal = () => {
//     setShowDeleteResponseModal(false);
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-export-delete-backtoresponses-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//               <button className="custom-button-export-delete-backtoresponses-generalformallresponses" onClick={() => openDeleteResponseModal(selectedResponse._id)}>Delete This Response</button>
//             </div>
//             <hr />
//             <div className="custom-response-details-generalformallresponses" style={{ marginTop: '40px' }}>
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <strong style={{ width: '200px' }}>{key}:</strong> <span>{selectedResponse.formData[key]}</span>
//                   </div>
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   {selectedResponse.files.map((file, index) => (
//                     <div key={index} style={{ display: 'flex', gap: '50px' }}>
//                       <strong style={{ width: '160px' }}>{file.originalName}:</strong>
//                       {file.mimeType.startsWith('image/') ? (
//                         <>
//                           <a
//                             href={`http://localhost:5000/${file.path}`}
//                             target="_blank"
//                             rel="noopener noreferrer" className='file-response-generalformallresponses'
//                           >
//                             View Image
//                           </a>
//                         </>
//                       ) : file.mimeType === 'application/pdf' ? (
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer" className='file-response-generalformallresponses'
//                         >
//                           View PDF
//                         </a>
//                       ) : (
//                         <span>Unsupported file type</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button className="custom-button-export-delete-backtoresponses-generalformallresponses" onClick={handleExportToCSV}>Export to CSV</button>
//               <button className="custom-button-export-delete-backtoresponses-generalformallresponses" onClick={openDeleteAllModal}>Delete All Responses</button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.userName || `Response ${index + 1}`}</span>
//                     <button className="custom-button-view-details-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-close-modal-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>

//       {/* START: Delete All Responses Modal */}
//       {showDeleteAllModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4 style={{ fontSize: "24px", textAlign: "center", marginBottom:'15PX' }}>Delete responses</h4>
//             <p  style={{ textAlign: "center", marginBottom:'15PX'  }}>Are you sure you want to delete all form responses? This action cannot be undone.</p>
//             <div className="modal-buttons-generalformallresponses">
//               <button className="modal-button-generalformallresponses" onClick={handleDeleteAllResponses}>Yes, Delete it!</button>
//               <button className="modal-button-cancel-generalformallresponses" onClick={closeDeleteAllModal}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete All Responses Modal */}

//       {/* START: Delete Single Response Modal */}
//       {showDeleteResponseModal && (
//         <div className="modal-background-generalformallresponses">
//           <div className="modal-container-generalformallresponses">
//             <h4 style={{ fontSize: "24px", textAlign: "center", marginBottom:'15PX' }}>Delete response</h4>
//             <p style={{ textAlign: "center", marginBottom:'15PX'  }}>Are you sure you want to delete this response? This action cannot be undone.</p>
//             <div className="modal-buttons-generalformallresponses">
//               <button className="modal-button-generalformallresponses" onClick={handleDeleteResponse}>Yes, Delete it!</button>
//               <button className="modal-button-cancel-generalformallresponses" onClick={closeDeleteResponseModal}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* END: Delete Single Response Modal */}
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

//////bf delete modal b 1 / 8
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     const csvContent = convertToCSV(formDetails);
//     downloadCSV(csvContent, 'form_responses.csv');
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(data.map(item => Object.values(item.formData)));
//     return array.map(row => row.join(',')).join('\n');
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', fileName);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handleDeleteAllResponses = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`, {
//         method: 'DELETE',
//       });
//       const data = await response.json();
//       alert(data.message);
//       setFormDetails([]);
//     } catch (error) {
//       console.error("Error deleting all responses:", error);
//     }
//   };

//   const handleDeleteResponse = async (responseId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/form-submission/${responseId}`, {
//         method: 'DELETE',
//       });
//       const data = await response.json();
//       alert(data.message);
//       setFormDetails((prevDetails) => prevDetails.filter((response) => response._id !== responseId));
//     } catch (error) {
//       console.error("Error deleting response:", error);
//     }
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//               <button className="custom-button-generalformallresponses" onClick={() => handleDeleteResponse(selectedResponse._id)}>Delete This Response</button>
//             </div>
//             <hr />
//             <div className="custom-response-details-generalformallresponses" style={{marginTop:'40px'}}>
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <div style={{ display: 'flex',gap: '10px' }}>
//                     <strong style={{width:'200px'}}>{key}:</strong> <span>{selectedResponse.formData[key]}</span>
//                   </div>
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   {selectedResponse.files.map((file, index) => (
//                     <div key={index} style={{ display: 'flex',gap: '50px'}}>
//                       <strong>{file.originalName}:</strong>
//                       {file.mimeType.startsWith('image/') ? (
//                         <>
//                           <a
//                             href={`http://localhost:5000/${file.path}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             View Image
//                           </a>
//                           {/* <img
//                             src={`http://localhost:5000/${file.path}`}
//                             alt={file.originalName}
//                             style={{ width: '100px', height: 'auto', display: 'block', marginTop: '5px' }}
//                           /> */}
//                         </>
//                       ) : file.mimeType === 'application/pdf' ? (
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           View PDF
//                         </a>
//                       ) : (
//                         <span>Unsupported file type</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleExportToCSV}>Export to CSV</button>
//               <button className="custom-button-generalformallresponses" onClick={handleDeleteAllResponses}>Delete All Responses</button>
//             </div>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.userName || `Response ${index + 1}`}</span>
//                     <button className="custom-button-link-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

////////image  and pdf file come in next page

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     const csvContent = convertToCSV(formDetails);
//     downloadCSV(csvContent, 'form_responses.csv');
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(data.map(item => Object.values(item.formData)));
//     return array.map(row => row.join(',')).join('\n');
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', fileName);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//             </div>
//             <div className="custom-response-details-generalformallresponses">
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <strong>{key}:</strong> {selectedResponse.formData[key]}
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   {selectedResponse.files.map((file, index) => (
//                     <div key={index}>
//                       <strong>{file.originalName}:</strong>
//                       {file.mimeType.startsWith('image/') ? (
//                         <>
//                           <a
//                             href={`http://localhost:5000/${file.path}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             View Image
//                           </a>
//                           <img
//                             src={`http://localhost:5000/${file.path}`}
//                             alt={file.originalName}
//                             style={{ width: '100px', height: 'auto', display: 'block', marginTop: '5px' }}
//                           />
//                         </>
//                       ) : file.mimeType === 'application/pdf' ? (
//                         <a
//                           href={`http://localhost:5000/${file.path}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           View PDF
//                         </a>
//                       ) : (
//                         <span>Unsupported file type</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleExportToCSV}>Export to CSV</button>
//             </div>
//             <h4>Individual</h4>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.userName || `Response ${index + 1}`}</span>
//                     <button className="custom-button-link-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

//////ragular 31/07/2024 before read pdf / jpg file

// // ///////////29/7  all formdata is come in normal form in "csv "  file   but email and name backend wala se validation ho raha hai

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     const csvContent = convertToCSV(formDetails);
//     downloadCSV(csvContent, 'form_responses.csv');
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(data.map(item => Object.values(item.formData)));
//     return array.map(row => row.join(',')).join('\n');
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', fileName);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//             </div>
//             <div className="custom-response-details-generalformallresponses">
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <strong>{key}:</strong> {selectedResponse.formData[key]}
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <strong>File Name:</strong> {selectedResponse.files[0].originalName}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleExportToCSV}>Export to CSV</button>
//             </div>
//             <h4>Individual</h4>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.userName || `Response ${index + 1}`}</span>
//                     <button className="custom-button-link-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleExportToCSV = () => {
//     const csvContent = convertToCSV(formDetails);
//     downloadCSV(csvContent, 'form_responses.csv');
//   };

//   const convertToCSV = (data) => {
//     const array = [Object.keys(data[0].formData)].concat(data.map(item => Object.values(item.formData)));
//     return array.map(row => row.join(',')).join('\n');
//   };

//   const downloadCSV = (csvContent, fileName) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', fileName);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//             </div>
//             <div className="custom-response-details-generalformallresponses">
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <strong>{key}:</strong> {selectedResponse.formData[key]}
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <strong>File Name:</strong> {selectedResponse.files[0].originalName}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>All Responses</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleExportToCSV}>Export to CSV</button>
//             </div>
//             <h4>Individual</h4>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.formData.Name || `Response ${index + 1}`}</span>
//                     <button className="custom-button-link-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

// /////////b27/7
// ///////////////// time ,name, file come but 'not formdata ' in   "xls" file

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';
// import { FaFileExcel, FaEllipsisV } from 'react-icons/fa';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleDownloadExcel = () => {
//     window.open(`http://localhost:5000/api/forms/form-submissions/${formId}/download-excel`, '_blank');
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//             </div>
//             <div className="custom-response-details-generalformallresponses">
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <strong>{key}:</strong> {selectedResponse.formData[key]}
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <strong>File Name:</strong> {selectedResponse.files[0].originalName}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="header-options">
//               <h4>All Responses</h4>
//               <div className="options">
//                 <FaFileExcel onClick={handleDownloadExcel} title="Download Excel" style={{ cursor: 'pointer', marginRight: '10px' }} />
//                 <FaEllipsisV title="Options" style={{ cursor: 'pointer' }} />
//               </div>
//             </div>
//             <h5>Individual</h5>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.userName || `Response ${index + 1}`}</span>
//                     <button className="custom-button-link-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

// not all json

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';
// import { FaFileExcel, FaEllipsisV } from 'react-icons/fa';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleDownloadExcel = () => {
//     window.open(`http://localhost:5000/api/forms/form-submissions/${formId}/download-excel`, '_blank');
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//             </div>
//             <div className="custom-response-details-generalformallresponses">
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <strong>{key}:</strong> {selectedResponse.formData[key]}
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <strong>File Name:</strong> {selectedResponse.files[0].originalName}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="header-options">
//               <h4>All Responses</h4>
//               <div className="options">
//                 <FaFileExcel onClick={handleDownloadExcel} title="Download Excel" style={{ cursor: 'pointer', marginRight: '10px' }} />
//                 <FaEllipsisV title="Options" style={{ cursor: 'pointer' }} />
//               </div>
//             </div>
//             <h5>Individual</h5>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.userName || `Response ${index + 1}`}</span>
//                     <button className="custom-button-link-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

//////////name and date work

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';
// import { FaFileExcel, FaEllipsisV } from 'react-icons/fa';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleDownloadExcel = () => {
//     window.open(`http://localhost:5000/api/forms/form-submissions/${formId}/download-excel`, '_blank');
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//             </div>
//             <div className="custom-response-details-generalformallresponses">
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <strong>{key}:</strong> {selectedResponse.formData[key]}
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <strong>File Name:</strong> {selectedResponse.files[0].originalName}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="header-options">
//               <h4>All Responses</h4>
//               <div className="options">
//                 <FaFileExcel onClick={handleDownloadExcel} title="Download Excel" style={{ cursor: 'pointer', marginRight: '10px' }} />
//                 <FaEllipsisV title="Options" style={{ cursor: 'pointer' }} />
//               </div>
//             </div>
//             <h5>Individual</h5>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.userName || `Response ${index + 1}`}</span>
//                     <button className="custom-button-link-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

// j s o n me

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';
// import { FaFileExcel, FaEllipsisV } from 'react-icons/fa'; // Added for icons

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   // Function to handle Excel download
//   const handleDownloadExcel = () => {
//     window.open(`http://localhost:5000/api/forms/form-submissions/${formId}/download-excel`, '_blank');
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//             </div>
//             <div className="custom-response-details-generalformallresponses">
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <strong>{key}:</strong> {selectedResponse.formData[key]}
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <strong>File Name:</strong> {selectedResponse.files[0].originalName}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="header-options">
//               <h4>All Responses</h4>
//               <div className="options">
//                 <FaFileExcel onClick={handleDownloadExcel} title="Download Excel" style={{ cursor: 'pointer', marginRight: '10px' }} />
//                 <FaEllipsisV title="Options" style={{ cursor: 'pointer' }} />
//               </div>
//             </div>
//             <h5>Individual</h5>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.userName || `Response ${index + 1}`}</span>
//                     <button className="custom-button-link-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

///////json

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';
// import { FaFileExcel, FaEllipsisV } from 'react-icons/fa'; // Added for icons

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   // Function to handle Excel download
//   const handleDownloadExcel = () => {
//     window.open(`http://localhost:5000/api/forms/form-submissions/${formId}/download-excel`, '_blank');
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//             </div>
//             <div className="custom-response-details-generalformallresponses">
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <strong>{key}:</strong> {selectedResponse.formData[key]}
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <strong>File Name:</strong> {selectedResponse.files[0].originalName}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="header-options">
//               <h4>All Responses</h4>
//               <div className="options">
//                 <FaFileExcel onClick={handleDownloadExcel} title="Download Excel" style={{ cursor: 'pointer', marginRight: '10px' }} />
//                 <FaEllipsisV title="Options" style={{ cursor: 'pointer' }} />
//               </div>
//             </div>
//             <h5>Individual</h5>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.userName || `Response ${index + 1}`}</span>
//                     <button className="custom-button-link-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

////////////////// sheet option show

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';
// import { FaEllipsisV } from 'react-icons/fa';
// import { FaFileExcel } from 'react-icons/fa';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleViewInSheets = () => {
//     // Implement logic to open the sheet view with all responses
//     // This could be a new page or a link to Google Sheets
//     window.open(`https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE`, '_blank');
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         <div className="custom-header-generalformallresponses">
//           <h4>All Responses</h4>
//           <div className="custom-header-actions-generalformallresponses">
//             <span onClick={handleViewInSheets} className="custom-view-sheets-link">
//               <FaFileExcel /> View in Sheets
//             </span>
//             <FaEllipsisV className="custom-ellipsis-icon" />
//           </div>
//         </div>
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//             </div>
//             <div className="custom-response-details-generalformallresponses">
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <strong>{key}:</strong> {selectedResponse.formData[key]}
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <strong>File Name:</strong> {selectedResponse.files[0].originalName}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <h4>All Responses</h4>
//             <h5>Individual</h5>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.userName || `Response ${index + 1}`}</span>
//                     <button className="custom-button-link-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GeneralFormAllResponses.css';

// const GeneralFormAllResponses = () => {
//   const { formId } = useParams();
//   const [formDetails, setFormDetails] = useState([]);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//         const data = await response.json();
//         setFormDetails(data);
//       } catch (error) {
//         console.error("Error fetching form details:", error);
//       }
//     };

//     fetchFormDetails();
//   }, [formId]);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   return (
//     <div className="custom-background-generalformallresponses">
//       <div className="custom-container-generalformallresponses">
//         {selectedResponse ? (
//           <div>
//             <div className="custom-response-header-generalformallresponses">
//               <h4>Response Details</h4>
//               <button className="custom-button-generalformallresponses" onClick={handleBackToResponses}>Back to Responses</button>
//             </div>
//             <div className="custom-response-details-generalformallresponses">
//               {Object.keys(selectedResponse.formData).map((key) => (
//                 <div key={key} className="custom-response-item-generalformallresponses">
//                   <strong>{key}:</strong> {selectedResponse.formData[key]}
//                 </div>
//               ))}
//               {selectedResponse.files && selectedResponse.files.length > 0 && (
//                 <div className="custom-response-item-generalformallresponses">
//                   <strong>File Name:</strong> {selectedResponse.files[0].originalName}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <h4>All Responses</h4>
//             {formDetails && formDetails.length > 0 ? (
//               <ul className="custom-response-list-generalformallresponses">
//                 {formDetails.map((response, index) => (
//                   <li key={index}>
//                     <span>{response.userName || `Response ${index + 1}`}</span>
//                     <button className="custom-button-link-generalformallresponses" onClick={() => handleViewDetails(response)}>View Details</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No responses yet.</p>
//             )}
//           </div>
//         )}
//         <button className="custom-button-generalformallresponses" onClick={() => navigate(-1)}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default GeneralFormAllResponses;
