
 
// import React, { useState, useEffect } from 'react';
// import './ViewResponseModal.css';

// const ViewResponseModal = ({ formDetails, closeModal }) => {
//   const [selectedResponse, setSelectedResponse] = useState(null);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleClickOutside = (event) => {
//     if (event.target.className === 'custom-unique-modal-overlayviewresponsemodal') {
//       closeModal();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="custom-unique-modal-overlayviewresponsemodal">
//       <div className="custom-unique-modal-contentviewresponsemodal">
//         <div className="custom-unique-modal-headerviewresponsemodal">
//           <h2>Form Responses</h2>
//           <button className="custom-unique-close-buttonviewresponsemodal" onClick={closeModal}>&times;</button>
//         </div>
//         <div className="custom-unique-modal-bodyviewresponsemodal">
//           {selectedResponse ? (
//             <div>
//               <div className="custom-response-headerviewresponsemodal">
//                 <h4>Response Details</h4>
//                 <button className="custom-unique-buttonviewresponsemodal" onClick={handleBackToResponses}>Back to Responses</button>
//               </div>
//               <div className="custom-unique-response-detailsviewresponsemodal">
//                 {Object.keys(selectedResponse.formData).map((key) => (
//                   <div key={key} className="custom-unique-response-itemviewresponsemodal">
//                     <strong>{key}:</strong> {selectedResponse.formData[key]}
//                   </div>
//                 ))}
//                 {selectedResponse.files && selectedResponse.files.length > 0 && (
//                   <div className="custom-unique-response-itemviewresponsemodal">
//                     {/* <strong>File Name:</strong> {selectedResponse.files[0].originalName} */}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div>
//               <h4>All Responses</h4>
//               {formDetails && formDetails.length > 0 ? (
//                 <ul className="custom-unique-response-listviewresponsemodal">
//                   {formDetails.map((response, index) => (
//                     <li key={index}>
//                       <span>{response.userName || `Response ${index + 1}`}</span> {/* Display user name */}
//                       <button className="custom-unique-button-linkviewresponsemodal" onClick={() => handleViewDetails(response)}>View Details</button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No responses yet.</p>
//               )}
//             </div>
//           )}
//         </div>
//         <div className="custom-unique-modal-footerviewresponsemodal">
//           <button className="custom-unique-buttonviewresponsemodal" onClick={closeModal}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewResponseModal;























































//24
// import React, { useState, useEffect } from 'react';
// import './ViewResponseModal.css';

// const ViewResponseModal = ({ formDetails, closeModal }) => {
//   const [selectedResponse, setSelectedResponse] = useState(null);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleClickOutside = (event) => {
//     if (event.target.className === 'custom-unique-modal-overlayviewresponsemodal') {
//       closeModal();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="custom-unique-modal-overlayviewresponsemodal">
//       <div className="custom-unique-modal-contentviewresponsemodal">
//         <div className="custom-unique-modal-headerviewresponsemodal">
//           <h2>Form Responses</h2>
//           <button className="custom-unique-close-buttonviewresponsemodal" onClick={closeModal}>&times;</button>
//         </div>
//         <div className="custom-unique-modal-bodyviewresponsemodal">
//           {selectedResponse ? (
//             <div>
//               <div className="custom-response-headerviewresponsemodal">
//                 <h4>Response Details</h4>
//                 <button className="custom-unique-buttonviewresponsemodal" onClick={handleBackToResponses}>Back to Responses</button>
//               </div>
//               <div className="custom-unique-response-detailsviewresponsemodal">
//                 {Object.keys(selectedResponse.formData).map((key) => (
//                   <div key={key} className="custom-unique-response-itemviewresponsemodal">
//                     <strong>{key}:</strong> {selectedResponse.formData[key]}
//                   </div>
//                 ))}
//                 {selectedResponse.files && selectedResponse.files.length > 0 && (
//                   <div className="custom-unique-response-itemviewresponsemodal">
//                     {/* <strong>File Name:</strong> {selectedResponse.files[0].originalName} */}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div>
//               <h4>All Responses</h4>
//               {formDetails && formDetails.length > 0 ? (
//                 <ul className="custom-unique-response-listviewresponsemodal">
//                   {formDetails.map((response, index) => (
//                     <li key={index}>
//                       <span>{`Response ${index + 1}`}</span>
//                       <button className="custom-unique-button-linkviewresponsemodal" onClick={() => handleViewDetails(response)}>View Details</button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No responses yet.</p>
//               )}
//             </div>
//           )}
//         </div>
//         <div className="custom-unique-modal-footerviewresponsemodal">
//           <button className="custom-unique-buttonviewresponsemodal" onClick={closeModal}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewResponseModal;




















////////////////ragular work b multi select vali ok, 


// import React, { useState, useEffect } from 'react';
// import './ViewResponseModal.css';

// const ViewResponseModal = ({ formDetails, closeModal }) => {
//   const [selectedResponse, setSelectedResponse] = useState(null);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleClickOutside = (event) => {
//     if (event.target.className === 'custom-unique-modal-overlayviewresponsemodal') {
//       closeModal();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="custom-unique-modal-overlayviewresponsemodal">
//       <div className="custom-unique-modal-contentviewresponsemodal">
//         <div className="custom-unique-modal-headerviewresponsemodal">
//           <h2>Form Responses</h2>
//           <button className="custom-unique-close-buttonviewresponsemodal" onClick={closeModal}>&times;</button>
//         </div>
//         <div className="custom-unique-modal-bodyviewresponsemodal">
//           {selectedResponse ? (
//             <div>
//               <div className="custom-response-headerviewresponsemodal">
//                 <h4>Response Details</h4>
//                 <button className="custom-unique-buttonviewresponsemodal" onClick={handleBackToResponses}>Back to Responses</button>
//               </div>
//               <div className="custom-unique-response-detailsviewresponsemodal">
//                 {Object.keys(selectedResponse.formData).map((key) => (
//                   <div key={key} className="custom-unique-response-itemviewresponsemodal">
//                     <strong>{key}:</strong> {selectedResponse.formData[key]}
//                   </div>
//                 ))}
//                 {selectedResponse.files && selectedResponse.files.length > 0 && (
//                   <div className="custom-unique-response-itemviewresponsemodal">
//                     {/* <strong>File Name:</strong> {selectedResponse.files[0].originalName} */}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div>
//               <h4>All Responses</h4>
//               {formDetails && formDetails.length > 0 ? (
//                 <ul className="custom-unique-response-listviewresponsemodal">
//                   {formDetails.map((response, index) => (
//                     <li key={index}>
//                       <span>{`Response ${index + 1}`}</span>
//                       <button className="custom-unique-button-linkviewresponsemodal" onClick={() => handleViewDetails(response)}>View Details</button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No responses yet.</p>
//               )}
//             </div>
//           )}
//         </div>
//         <div className="custom-unique-modal-footerviewresponsemodal">
//           <button className="custom-unique-buttonviewresponsemodal" onClick={closeModal}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewResponseModal;







/* // /////before css class selector  */




// import React, { useState, useEffect } from 'react';
// import './ViewResponseModal.css';

// const ViewResponseModal = ({ formDetails, closeModal }) => {
//   const [selectedResponse, setSelectedResponse] = useState(null);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   const handleClickOutside = (event) => {
//     if (event.target.className === 'custom-unique-modal-overlay') {
//       closeModal();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="custom-unique-modal-overlay">
//       <div className="custom-unique-modal-content">
//         <div className="custom-unique-modal-header">
//           <h2>Form Responses</h2>
//           <button className="custom-unique-close-button" onClick={closeModal}>&times;</button>
//         </div>
//         <div className="custom-unique-modal-body">
//           {selectedResponse ? (
//             <div>
//               <div className="custom-response-header">
//                 <h4>Response Details</h4>
//                 <button className="custom-unique-button" onClick={handleBackToResponses}>Back to Responses</button>
//               </div>
//               <div className="custom-unique-response-details">
//                 {Object.keys(selectedResponse.formData).map((key) => (
//                   <div key={key} className="custom-unique-response-item">
//                     <strong>{key}:</strong> {selectedResponse.formData[key]}
//                   </div>
//                 ))}
//                 {selectedResponse.files && selectedResponse.files.length > 0 && (
//                   <div className="custom-unique-response-item">
//                     {/* <strong>File Name:</strong> {selectedResponse.files[0].originalName} */}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div>
//               <h4>All Responses</h4>
//               {formDetails && formDetails.length > 0 ? (
//                 <ul className="custom-unique-response-list">
//                   {formDetails.map((response, index) => (
//                     <li key={index}>
//                       <span>{`Response ${index + 1}`}</span>
//                       <button className="custom-unique-button-link" onClick={() => handleViewDetails(response)}>View Details</button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No responses yet.</p>
//               )}
//             </div>
//           )}
//         </div>
//         <div className="custom-unique-modal-footer">
//           <button className="custom-unique-button" onClick={closeModal}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewResponseModal;





// import React, { useState } from 'react';
// import './ViewResponseModal.css';

// const ViewResponseModal = ({ formDetails, closeModal }) => {
//   const [selectedResponse, setSelectedResponse] = useState(null);

//   const handleViewDetails = (response) => {
//     setSelectedResponse(response);
//   };

//   const handleBackToResponses = () => {
//     setSelectedResponse(null);
//   };

//   return (
//     <div className="unique-modal-overlay">
//       <div className="unique-modal-content">
//         <div className="unique-modal-header">
//           <h2>Form Responses</h2>
//           <button className="unique-close-button" onClick={closeModal}>&times;</button>
//         </div>
//         <div className="unique-modal-body">
//           {selectedResponse ? (
//             <div>
//               <h4>Response Details</h4>
//               <div className="unique-response-details">
//                 {Object.keys(selectedResponse.formData).map((key) => (
//                   <div key={key} className="unique-response-item">
//                     <strong>{key}:</strong> {selectedResponse.formData[key]}
//                   </div>
//                 ))}
//                 {selectedResponse.files && selectedResponse.files.length > 0 && (
//                   <div className="unique-response-item">
//                     <strong>File Name:</strong> {selectedResponse.files[0].originalName}
//                   </div>
//                 )}
//               </div>
//               <button className="unique-button" onClick={handleBackToResponses}>Back to Responses</button>
//             </div>
//           ) : (
//             <div>
//               <h4>All Responses</h4>
//               {formDetails && formDetails.length > 0 ? (
//                 <ul className="unique-response-list">
//                   {formDetails.map((response, index) => (
//                     <li key={index}>
//                       <span>{`Response ${index + 1}`}</span>
//                       <button className="unique-button-link" onClick={() => handleViewDetails(response)}>View Details</button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No responses yet.</p>
//               )}
//             </div>
//           )}
//         </div>
//         <div className="unique-modal-footer">
//           <button className="unique-button" onClick={closeModal}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewResponseModal;



// /// bef unique class selector 


// // import React, { useState } from 'react';
// // import './ViewResponseModal.css';

// // const ViewResponseModal = ({ formDetails, closeModal }) => {
// //   const [selectedResponse, setSelectedResponse] = useState(null);

// //   const handleViewDetails = (response) => {
// //     setSelectedResponse(response);
// //   };

// //   const handleBackToResponses = () => {
// //     setSelectedResponse(null);
// //   };

// //   return (
// //     <div className="modal-overlay">
// //       <div className="modal-content">
// //         <div className="modal-header">
// //           <h2>Form Responses</h2>
// //           <button className="close-button" onClick={closeModal}>&times;</button>
// //         </div>
// //         <div className="modal-body">
// //           {selectedResponse ? (
// //             <div>
// //               <h4>Response Details</h4>
// //               <pre>{JSON.stringify(selectedResponse, null, 2)}</pre>
// //               <button className="button" onClick={handleBackToResponses}>Back to Responses</button>
// //             </div>
// //           ) : (
// //             <div>
// //               <h4>All Responses</h4>
// //               {formDetails && formDetails.length > 0 ? (
// //                 <ul>
// //                   {formDetails.map((response, index) => (
// //                     <li key={index}>
// //                       <span>{`Response ${index + 1}`}</span>
// //                       <button className="button-link" onClick={() => handleViewDetails(response)}>View Details</button>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               ) : (
// //                 <p>No responses yet.</p>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //         <div className="modal-footer">
// //           <button className="button" onClick={closeModal}>Close</button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ViewResponseModal;



















////////////////////ragular   15/7  firstb int abhi



// import React from 'react';
// import './ViewResponseModal.css';

// const ViewResponseModal = ({ formDetails, closeModal }) => {
//   return (
//     <div className="view-response-modal">
//       <div className="modal-content">
//         <span className="close" onClick={closeModal}>&times;</span> 
//         <h2>Form Details</h2>
//         {formDetails ? (
//           <div className="form-details">
//             <div className="form-detail-item">
//               {formDetails.formData && Object.entries(formDetails.formData).length > 0 ? (
//                 Object.entries(formDetails.formData).map(([key, value]) => (
//                   <p key={key}><strong>{key}:</strong> {value}</p>
//                 ))
//               ) : (
//                 <p>No form data available.</p>
//               )}
//             </div>
//             <div className="form-detail-item">
//               {formDetails.files && formDetails.files.length > 0 ? (
//                 formDetails.files.map((file, index) => (
//                   <div key={index}>
//                     <p><strong>File Name:</strong> {file.originalName}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p>No files attached.</p>
//               )}
//             </div>
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewResponseModal;









// import React from 'react';
// import './ViewResponseModal.css';

// const ViewResponseModal = ({ formDetails, closeModal }) => {
//   return (
//     <div className="view-response-modal">
//       <div className="modal-content">
//         <span className="close" onClick={closeModal}>&times;</span>
//         <h2>Form Details</h2>
//         {formDetails ? (
//           <div className="form-details">
//             {/* <div className="form-detail-item">
//               <strong>Form Title:</strong> {formDetails.formTitle}
//             </div> */}
//             <div className="form-detail-item">
//               {/* <strong>Form Data:</strong> */}
//               {formDetails.formData && Object.entries(formDetails.formData).length > 0 ? (
//                 Object.entries(formDetails.formData).map(([key, value]) => (
//                   <p key={key}><strong>{key}:</strong> {value}</p>
//                 ))
//               ) : (
//                 <p>No form data available.</p>
//               )}
//             </div>
//             <div className="form-detail-item">
//               {/* <strong>Files:</strong> */}
//               {formDetails.files && formDetails.files.length > 0 ? (
//                 formDetails.files.map((file, index) => (
//                   <div key={index}>
//                     <p><strong>File Name:</strong> {file.originalName}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p>No files attached.</p>
//               )}
//             </div>
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewResponseModal;










// import React from 'react';
// import './ViewResponseModal.css';

// const ViewResponseModal = ({ formDetails, closeModal }) => {
//   return (
//     <div className="view-response-modal">
//       <div className="modal-content">
//         <span className="close" onClick={closeModal}>&times;</span>
//         <h2>Form Details</h2>
//         {formDetails ? (
//           <div className="form-details">
//             <div className="form-detail-item">
//               <strong>Form Title:</strong> {formDetails.formTitle}
//             </div>
//             <div className="form-detail-item">
//               <strong>Form Data:</strong>
//               {formDetails.formData && Object.entries(formDetails.formData).length > 0 ? (
//                 Object.entries(formDetails.formData).map(([key, value]) => (
//                   <p key={key}><strong>{key}:</strong> {value}</p>
//                 ))
//               ) : (
//                 <p>No form data available.</p>
//               )}
//             </div>
//             <div className="form-detail-item">
//               <strong>Files:</strong>
//               {formDetails.files && formDetails.files.length > 0 ? (
//                 formDetails.files.map((file, index) => (
//                   <div key={index}>
//                     <p><strong>Original Name:</strong> {file.originalName}</p>
//                     <p><strong>Path:</strong> {file.path}</p>
//                     <p><strong>MimeType:</strong> {file.mimeType}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p>No files attached.</p>
//               )}
//             </div>
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewResponseModal;












/////b   12/7

// import React from 'react';
// import './ViewResponseModal.css';

// const ViewResponseModal = ({ formDetails, closeModal }) => {
//   return (
//     <div className="view-response-modal">
//       <div className="modal-content">
//         <span className="close" onClick={closeModal}>&times;</span>
//         <h2>Form Details</h2>
//         {formDetails ? (
//           <div className="form-details">
//             <div className="form-detail-item">
//               <strong>Form Title:</strong> {formDetails.formTitle}
//             </div>
//             <div className="form-detail-item">
//               <strong>Form Data:</strong>
//               {formDetails.formData && Object.entries(formDetails.formData).length > 0 ? (
//                 Object.entries(formDetails.formData).map(([key, value]) => (
//                   <p key={key}><strong>{key}:</strong> {value}</p>
//                 ))
//               ) : (
//                 <p>No form data available.</p>
//               )}
//             </div>
//             <div className="form-detail-item">
//               <strong>Files:</strong>
//               {formDetails.files && formDetails.files.length > 0 ? (
//                 formDetails.files.map((file, index) => (
//                   <div key={index}>
//                     <p><strong>Original Name:</strong> {file.originalName}</p>
//                     <p><strong>Path:</strong> {file.path}</p>
//                     <p><strong>MimeType:</strong> {file.mimeType}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p>No files attached.</p>
//               )}
//             </div>
//             <div className="form-detail-item">
//               <strong>Created At:</strong> {new Date(formDetails.createdAt).toLocaleString()}
//             </div>
//             <div className="form-detail-item">
//               <strong>Updated At:</strong> {new Date(formDetails.updatedAt).toLocaleString()}
//             </div>
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewResponseModal;
