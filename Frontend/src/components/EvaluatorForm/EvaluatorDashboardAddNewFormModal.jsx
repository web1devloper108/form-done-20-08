import React, { useState, useEffect } from 'react';
import './EvaluatorDashboardAddNewFormModal.css';

const EvaluatorDashboardAddNewFormModal = ({ closeModal, addForm, formToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
  });
 
  useEffect(() => {
    if (formToEdit) {
      setFormData(formToEdit);
    }
  }, [formToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newForm = { ...formData, lastModified: new Date().toLocaleDateString() };

    try {
      let response;
      if (formToEdit) {
        response = await fetch(`http://localhost:5000/api/evaluationForms/${formToEdit._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newForm),
        });
      } else {
        response = await fetch('http://localhost:5000/api/evaluationForms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newForm),
        });
      }

      if (response.ok) {
        const form = await response.json();
        if (formToEdit) {
          addForm(form, 'edit');
        } else {
          addForm(form, 'add');
        }
        closeModal();
      } else {
        console.error('Failed to save form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="modal-overlayevaluatordashboardaddnewformmodal">
      <div className="modal-contentevaluatordashboardaddnewformmodal">
        <div className="modal-headerevaluatordashboardaddnewformmodal">
          <h3>{formToEdit ? 'Edit Evaluator Form' : 'Add New Evaluator Form'}</h3>
          <button className="close-buttonevaluatordashboardaddnewformmodal" onClick={closeModal}>×</button>
        </div>
        <form className="modal-formevaluatordashboardaddnewformmodal" onSubmit={handleSubmit}>
          <div className="form-groupevaluatordashboardaddnewformmodal">
            <label htmlFor="title" className="modal-labelevaluatordashboardaddnewformmodal">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-footerevaluatordashboardaddnewformmodal">
            <button type="submit" className="submit-buttonevaluatordashboardaddnewformmodal">
              {formToEdit ? 'Save Changes' : 'Submit'}
            </button>
            <button type="button" className="cancel-buttonevaluatordashboardaddnewformmodal" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluatorDashboardAddNewFormModal;


















/* // /////before css class selector  */


// import React, { useState, useEffect } from 'react';
// import './EvaluatorDashboardAddNewFormModal.css';

// const EvaluatorDashboardAddNewFormModal = ({ closeModal, addForm, formToEdit }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//   });

//   useEffect(() => {
//     if (formToEdit) {
//       setFormData(formToEdit);
//     }
//   }, [formToEdit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newForm = { ...formData, lastModified: new Date().toLocaleDateString() };

//     try {
//       let response;
//       if (formToEdit) {
//         response = await fetch(`http://localhost:5000/api/evaluationForms/${formToEdit._id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(newForm),
//         });
//       } else {
//         response = await fetch('http://localhost:5000/api/evaluationForms', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(newForm),
//         });
//       }

//       if (response.ok) {
//         const form = await response.json();
//         if (formToEdit) {
//           addForm(form, 'edit');
//         } else {
//           addForm(form, 'add');
//         }
//         closeModal();
//       } else {
//         console.error('Failed to save form');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>{formToEdit ? 'Edit Evaluator Form' : 'Add New Evaluator Form'}</h2>
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
//               {formToEdit ? 'Save Changes' : 'Submit'}
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

// export default EvaluatorDashboardAddNewFormModal;







////////b backnd 
// import React, { useState, useEffect } from 'react';
// import './EvaluatorDashboardAddNewFormModal.css';

// const EvaluatorDashboardAddNewFormModal = ({ closeModal, addForm, editForm, formToEdit }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//   });

//   useEffect(() => {
//     if (formToEdit) {
//       setFormData(formToEdit);
//     }
//   }, [formToEdit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newForm = { ...formData, lastModified: new Date().toLocaleDateString() };

//     try {
//       let response;
//       if (formToEdit) {
//         response = await fetch(`http://localhost:5000/api/forms/${formToEdit._id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(newForm),
//         });
//       } else {
//         response = await fetch('http://localhost:5000/api/forms', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(newForm),
//         });
//       }

//       if (response.ok) {
//         const form = await response.json();
//         if (formToEdit) {
//           editForm(form);
//         } else {
//           addForm(form);
//         }
//         closeModal();
//       } else {
//         console.error('Failed to save form');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>{formToEdit ? 'Edit Evaluator Form' : 'Add New Evaluator Form'}</h2>
//           <button className="close-button" onClick={closeModal}>×</button>
//         </div>
//         <form className="modal-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="title" className="modal-label">Title *</label>
//             <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
//           </div>
//           <div className="modal-footer">
//             <button type="submit" className="submit-button">{formToEdit ? 'Save Changes' : 'Submit'}</button>
//             <button type="button" className="cancel-button-normal-formdnd" onClick={closeModal}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default EvaluatorDashboardAddNewFormModal;















////////before make evaluator table on dashboard 

// import React, { useState, useEffect } from 'react';
// import './EvaluatorDashboardAddNewFormModal.css';

// const EvaluatorDashboardAddNewFormModal = ({ closeModal, addForm, editForm, formToEdit }) => {
//     const [formData, setFormData] = useState({
//         title: '',
//         category: 'Application',
//         label: 'REGULAR',
//         status: 'Published',
//       });
    
//       useEffect(() => {
//         if (formToEdit) {
//           setFormData(formToEdit);
//         }
//       }, [formToEdit]);
    
//       const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//       };
    
//       const handleSubmit = async (e) => {
//         e.preventDefault();
//         const newForm = { ...formData, lastModified: new Date().toLocaleDateString() };
    
//         try {
//           let response;
//           if (formToEdit) {
//             response = await fetch(`http://localhost:5000/api/forms/${formToEdit._id}`, {
//               method: 'PUT',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify(newForm),
//             });
//           } else {
//             response = await fetch('http://localhost:5000/api/forms', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify(newForm),
//             });
//           }
    
//           if (response.ok) {
//             const form = await response.json();
//             if (formToEdit) {
//               editForm(form);
//             } else {
//               addForm(form);
//             }
//             closeModal();
//           } else {
//             console.error('Failed to save form');
//           }
//         } catch (error) {
//           console.error('Error:', error);
//         }
//       };
    
//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>{formToEdit ? 'Edit Evaluator Form' : 'Add New Evaluator Form'}</h2>
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
//             <button type="submit" className="submit-button">{formToEdit ? 'Save Changes' : 'Submit'}</button>
//             <button type="button" className="cancel-button-normal-formdnd" onClick={closeModal}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>

// )
// }

// export default EvaluatorDashboardAddNewFormModal
