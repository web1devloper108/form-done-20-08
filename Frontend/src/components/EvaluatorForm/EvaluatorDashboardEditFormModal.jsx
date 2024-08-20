import React, { useState, useEffect } from 'react';
import './EvaluatorDashboardEditFormModal.css';

const EvaluatorDashboardEditFormModal = ({ closeModal, form, updateForm }) => {
  const [formData, setFormData] = useState({
    title: '',
  });
 
  useEffect(() => {
    if (form) {
      setFormData(form);
    }
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form || !form._id) {
      console.error('Form to edit is not defined or does not have an _id');
      return;
    }

    const updatedForm = { ...formData, lastModified: new Date().toLocaleDateString() };

    try {
      const response = await fetch(`http://localhost:5000/api/evaluationForms/${form._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedForm),
      });

      if (response.ok) {
        const updatedForm = await response.json();
        updateForm(updatedForm);
        closeModal();
      } else {
        console.error('Failed to update form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="modal-overlayevaluatordashboardeditformmodal">
      <div className="modal-contentevaluatordashboardeditformmodal">
        <div className="modal-headerevaluatordashboardeditformmodal">
          <h2>Edit the Evaluator Form</h2>
          <button className="close-buttonevaluatordashboardeditformmodal" onClick={closeModal}>×</button>
        </div>
        <form className="modal-formevaluatordashboardeditformmodal" onSubmit={handleSubmit}>
          <div className="form-groupevaluatordashboardeditformmodal">
            <label htmlFor="title" className="modal-labelevaluatordashboardeditformmodal">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-footerevaluatordashboardeditformmodal">
            <button type="submit" className="submit-buttonevaluatordashboardeditformmodal">
              Update
            </button>
            <button type="button" className="cancel-buttonevaluatordashboardeditformmodal" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluatorDashboardEditFormModal;




















/* // /////before css class selector  */



// import React, { useState, useEffect } from 'react';
// import './EvaluatorDashboardEditFormModal.css';

// const EvaluatorDashboardEditFormModal = ({ closeModal, form, updateForm }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//   });

//   useEffect(() => {
//     if (form) {
//       setFormData(form);
//     }
//   }, [form]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form || !form._id) {
//       console.error('Form to edit is not defined or does not have an _id');
//       return;
//     }

//     const updatedForm = { ...formData, lastModified: new Date().toLocaleDateString() };

//     try {
//       const response = await fetch(`http://localhost:5000/api/evaluationForms/${form._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedForm),
//       });

//       if (response.ok) {
//         const updatedForm = await response.json();
//         updateForm(updatedForm);
//         closeModal();
//       } else {
//         console.error('Failed to update form');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Edit the Evaluator Form</h2>
//           <button className="close-button" onClick={closeModal}>×</button>
//         </div>
//         <form className="modal-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="title" className="modal-label">Title *</label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="modal-footer">
//             <button type="submit" className="submit-button">
//               Update
//             </button>
//             <button type="button" className="cancel-button-normal-formdnd" onClick={closeModal}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EvaluatorDashboardEditFormModal;









///////////b edit 
// import React, { useState } from 'react';
// import './EvaluatorDashboardAddNewFormModal.css';

// const EvaluatorDashboardEditFormModal = ({ closeModal, form, updateForm }) => {
//     const [formData, setFormData] = useState(form);

//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData({ ...formData, [name]: value });
//     };
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       const updatedForm = { ...formData, lastModified: new Date().toLocaleDateString() };
  
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/${formData._id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(updatedForm),
//         });
  
//         if (response.ok) {
//           const form = await response.json();
//           updateForm(form);
//           closeModal();
//         } else {
//           console.error('Failed to update form');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Edit the Evaluator Form</h2>
//           <button className="close-button" onClick={closeModal}>×</button>
//         </div>
//         <form className="modal-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="title" className="modal-label">Title *</label>
//             <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
//           </div>
//           <div className="modal-footer">
//             <button type="submit" className="submit-button">Update</button>
//             <button type="button" className="cancel-button-normal-formdnd" onClick={closeModal}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default EvaluatorDashboardEditFormModal;











// ////////before make evaluator table on dashboard 



// import React, { useState } from 'react';
// import './EvaluatorDashboardAddNewFormModal.css';

// const EvaluatorDashboardEditFormModal = ({ closeModal, form, updateForm }) => {
//     const [formData, setFormData] = useState(form);

//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData({ ...formData, [name]: value });
//     };
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       const updatedForm = { ...formData, lastModified: new Date().toLocaleDateString() };
  
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/${formData._id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(updatedForm),
//         });
  
//         if (response.ok) {
//           const form = await response.json();
//           updateForm(form);
//           closeModal();
//         } else {
//           console.error('Failed to update form');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };
//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Edit the Evaluator Form</h2>
//           <button className="close-button" onClick={closeModal}>×</button>
//         </div>
//         <form className="modal-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="title" className="modal-label">Title *</label>
//             <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label htmlFor="category" className="modal-label">Category *</label>
//             <select id="category" name="category" value={formData.category} onChange={handleChange} required>
//               <option value="Application">Application</option>
//               <option value="Evaluation">Evaluation</option>
//               <option value="Mentoring">Mentoring</option>
//               <option value="Startup">Startup</option>
//               <option value="Fellowship">Fellowship</option>
//               <option value="Survey">Survey</option>
//               <option value="Learning">Learning</option>
//               <option value="Funding">Funding</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="label" className="modal-label">Label *</label>
//             <select id="label" name="label" value={formData.label} onChange={handleChange} required>
//               <option value="REGULAR">REGULAR</option>
//               <option value="URGENT">URGENT</option>
//               <option value="IMPORTANT">IMPORTANT</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label className="modal-label">Status *</label>
//             <div className="status-options">
//               <label className="modal-label">
//                 <input type="radio" name="status" value="Draft" checked={formData.status === 'Draft'} onChange={handleChange} /> Save as Draft
//               </label>
//               <label className="modal-label">
//                 <input type="radio" name="status" value="Published" checked={formData.status === 'Published'} onChange={handleChange} /> Published
//               </label>
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button type="submit" className="submit-button">Update</button>
//             <button type="button" className="cancel-button-normal-formdnd" onClick={closeModal}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>

// )
// }

// export default EvaluatorDashboardEditFormModal