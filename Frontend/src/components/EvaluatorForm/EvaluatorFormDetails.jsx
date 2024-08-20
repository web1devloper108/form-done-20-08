import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EvaluatorFormDetails.css'; 

const EvaluatorFormDetails = () => {
  const location = useLocation();
  const { form } = location.state || {};
  const [formData, setFormData] = useState(form || {});
  const [formValues, setFormValues] = useState(() => {
    const values = {};
    form?.formElements?.forEach(element => {
      values[element.label] = '';
    });
    return values;
  }); 
  const [ratings, setRatings] = useState(() => {
    const initialRatings = {};
    form?.formElements?.forEach(element => {
      initialRatings[element.label] = 10; // Default to 10
    });
    return initialRatings;
  });
  const navigate = useNavigate();

  if (!form) {
    return <p>No form data available.</p>;
  }

  const handleInputChange = (label, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [label]: value
    }));
  };

  const handleRatingChange = (label, value) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [label]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = {
      ratings,
      comments: formValues
    };

    const updatedFormData = {
      ...formData,
      responses: response
    };

    try {
      await axios.post('YOUR_BACKEND_API_URL', updatedFormData);
      navigate('/form');
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const handleEdit = () => {
    const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
    navigate('/evaluator-form', { state: { formElements, formTitle: formData.title } });
  };

  const handleClose = () => {
    navigate('/form');
  };

  const getRatingButtonClass = (index, rating) => {
    const isSelected = index <= rating;
    return `rating-buttonevaluatorformdetails rating-buttonevaluatorformdetails-${index} ${isSelected ? 'selectedevaluatorformdetails' : ''}`;
  };

  return (
    <div className="form-details-containerevaluatorformdetails">
      <div className="header-containerevaluatorformdetails">
        <h2>{formData.title}</h2> {/* Display the title from formData */}
        <div className="form-details-buttonsevaluatorformdetails">
          <button className="edit-buttonevaluatorformdetails" onClick={handleEdit}>Edit</button>
          <button className="close-buttonevaluatorformdetails" onClick={handleClose}>Close</button>
        </div>
      </div>
      <div className="form-content-containerevaluatorformdetails">
        <form className="form-details-formevaluatorformdetails" onSubmit={handleSubmit}>
          {formData.formElements && formData.formElements.map((element, index) => (
            <div key={index} className="form-groupevaluatorformdetails">
              <label>
                <span className="number-boxevaluatorformdetails">{index + 1}</span> {element.name} {element.required && <span className="requiredevaluatorformdetails">*</span>}
              </label>
              <div className="form-groupevaluatorformdetails">
                <label>Rating</label>
                <div className="rating-containerevaluatorformdetails">
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={getRatingButtonClass(num, ratings[element.label])}
                      onClick={() => handleRatingChange(element.label, num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <label>
                {element.label}
                {element.required && <span className="requiredevaluatorformdetails">*</span>}
              </label>
              <input
                type="text"
                placeholder={element.placeholder}
                value={formValues[element.label]}
                onChange={(e) => handleInputChange(element.label, e.target.value)}
                required={element.required}
              />
            </div>
          ))}
          <div className="form-buttonsevaluatorformdetails">
            <button type="submit" className="submit-buttonevaluatorformdetails">Submit</button> 
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluatorFormDetails;



















/* // /////before css class selector  */



// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './EvaluatorFormDetails.css';

// const EvaluatorFormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     form?.formElements?.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });
//   const [ratings, setRatings] = useState(() => {
//     const initialRatings = {};
//     form?.formElements?.forEach(element => {
//       initialRatings[element.label] = 10; // Default to 10
//     });
//     return initialRatings;
//   });
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleRatingChange = (label, value) => {
//     setRatings(prevRatings => ({
//       ...prevRatings,
//       [label]: value
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const response = {
//       ratings,
//       comments: formValues
//     };

//     const updatedFormData = {
//       ...formData,
//       responses: response
//     };

//     try {
//       await axios.post('YOUR_BACKEND_API_URL', updatedFormData);
//       navigate('/form');
//     } catch (error) {
//       console.error('Error saving form data:', error);
//     }
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/evaluator-form', { state: { formElements, formTitle: formData.title } });
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   const getRatingButtonClass = (index, rating) => {
//     const isSelected = index <= rating;
//     return `rating-button rating-button-${index} ${isSelected ? 'selected' : ''}`;
//   };

//   return (
//     <div className="form-details-container">
//       <div className="header-container">
//         <h2>{formData.title}</h2> {/* Display the title from formData */}
//         <div className="form-details-buttons">
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <div className="form-content-container">
//         <form className="form-details-form" onSubmit={handleSubmit}>
//           {formData.formElements && formData.formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="number-box">{index + 1}</span> {element.name} {element.required && <span className="required">*</span>}
//               </label>
//               <div className="form-group">
//                 <label>Rating</label>
//                 <div className="rating-container">
//                   {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
//                     <button
//                       key={num}
//                       type="button"
//                       className={getRatingButtonClass(num, ratings[element.label])}
//                       onClick={() => handleRatingChange(element.label, num)}
//                     >
//                       {num}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <label>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type="text"
//                 placeholder={element.placeholder}
//                 value={formValues[element.label]}
//                 onChange={(e) => handleInputChange(element.label, e.target.value)}
//                 required={element.required}
//               />
//             </div>
//           ))}
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">Submit</button> 
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EvaluatorFormDetails;










// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './EvaluatorFormDetails.css';

// const EvaluatorFormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     form?.formElements?.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });
//   const [ratings, setRatings] = useState(() => {
//     const initialRatings = {};
//     form?.formElements?.forEach(element => {
//       initialRatings[element.label] = 10; // Default to 10
//     });
//     return initialRatings;
//   });
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleRatingChange = (label, value) => {
//     setRatings(prevRatings => ({
//       ...prevRatings,
//       [label]: value
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const response = {
//       ratings,
//       comments: formValues
//     };

//     const updatedFormData = {
//       ...formData,
//       responses: response
//     };

//     try {
//       await axios.post('YOUR_BACKEND_API_URL', updatedFormData);
//       navigate('/form');
//     } catch (error) {
//       console.error('Error saving form data:', error);
//     }
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/evaluator-form', { state: { formElements, formTitle: formData.title } });
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   const getRatingButtonClass = (index, rating) => {
//     const isSelected = index <= rating;
//     return `rating-button rating-button-${index} ${isSelected ? 'selected' : ''}`;
//   };

//   return (
//     <div className="form-details-container">
//       <div className="header-container">
//         <h2>{formData.title}</h2> {/* Display the title from formData */}
//         <div className="form-details-buttons">
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <div className="form-content-container">
//         <form className="form-details-form" onSubmit={handleSubmit}>
//           {formData.formElements && formData.formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="number-box">{index + 1}</span> {element.name} {element.required && <span className="required">*</span>}
//               </label>
//               <div className="form-group">
//                 <label>Rating</label>
//                 <div className="rating-container">
//                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
//                     <button
//                       key={num}
//                       type="button"
//                       className={getRatingButtonClass(num, ratings[element.label])}
//                       onClick={() => handleRatingChange(element.label, num)}
//                     >
//                       {num}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <label>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type="text"
//                 placeholder={element.placeholder}
//                 value={formValues[element.label]}
//                 onChange={(e) => handleInputChange(element.label, e.target.value)}
//                 required={element.required}
//               />
//             </div>
//           ))}
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">Submit</button> {/* The "Submit" button triggers the handleSubmit function */}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EvaluatorFormDetails;





















//////////bfe star colour 
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './EvaluatorFormDetails.css';

// const EvaluatorFormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     form?.formElements?.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });
//   const [ratings, setRatings] = useState(() => {
//     const initialRatings = {};
//     form?.formElements?.forEach(element => {
//       initialRatings[element.label] = 10; // Default to 10
//     });
//     return initialRatings;
//   });
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleRatingChange = (label, value) => {
//     setRatings(prevRatings => ({
//       ...prevRatings,
//       [label]: value
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const response = {
//       ratings,
//       comments: formValues
//     };

//     const updatedFormData = {
//       ...formData,
//       responses: response
//     };

//     try {
//       await axios.post('YOUR_BACKEND_API_URL', updatedFormData);
//       navigate('/form');
//     } catch (error) {
//       console.error('Error saving form data:', error);
//     }
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/evaluator-form', { state: { formElements, formTitle: formData.title } });
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-details-container">
//       <div className="header-container">
//         <h2>{formData.title}</h2> {/* Display the title from formData */}
//         <div className="form-details-buttons">
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <div className="form-content-container">
//         <form className="form-details-form" onSubmit={handleSubmit}>
//           {formData.formElements && formData.formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="number-box">{index + 1}</span> {element.name} {element.required && <span className="required">*</span>}
//               </label>
//               <div className="form-group">
//                 <label>Rating</label>
//                 <div className="rating-container">
//                   {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
//                     <button
//                       key={num}
//                       type="button"
//                       className={`rating-button ${ratings[element.label] === num ? 'selected' : ''}`}
//                       onClick={() => handleRatingChange(element.label, num)}
//                     >
//                       {num}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <label>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type="text"
//                 placeholder={element.placeholder}
//                 value={formValues[element.label]}
//                 onChange={(e) => handleInputChange(element.label, e.target.value)}
//                 required={element.required}
//               />
//             </div>
//           ))}
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">Submit</button> {/* The "Submit" button triggers the handleSubmit function */}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EvaluatorFormDetails;








////////bef axios 

// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './EvaluatorFormDetails.css';

// const EvaluatorFormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     form?.formElements?.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });
//   const [ratings, setRatings] = useState(() => {
//     const initialRatings = {};
//     form?.formElements?.forEach(element => {
//       initialRatings[element.label] = 10; // Default to 10
//     });
//     return initialRatings;
//   });
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleRatingChange = (label, value) => {
//     setRatings(prevRatings => ({
//       ...prevRatings,
//       [label]: value
//     }));
//   };

//   const handleSave = () => {
//     const updatedFormElements = formData.formElements.map(element => ({
//       ...element,
//       placeholder: formValues[element.label]
//     }));

//     const updatedFormData = {
//       ...formData,
//       formElements: updatedFormElements
//     };

//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(savedForm => savedForm.title === updatedFormData.title);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = updatedFormData;
//     } else {
//       savedForms.push(updatedFormData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     navigate(`/form/${form.title}`, { state: { form: updatedFormData } });
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/evaluator-form', { state: { formElements, formTitle: formData.title } });
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-details-container">
//       <div className="header-container">
//         <h2>{formData.title}</h2> {/* Display the title from formData */}
//         <div className="form-details-buttons">
//           <button className="save-button" onClick={handleSave}>Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <div className="form-content-container">
//         <form className="form-details-form">
//           {formData.formElements && formData.formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="number-box">{index + 1}</span> {element.name} {element.required && <span className="required">*</span>}
//               </label>
//               <div className="form-group">
//                 <label>Rating</label>
//                 <div className="rating-container">
//                   {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
//                     <button
//                       key={num}
//                       type="button"
//                       className={`rating-button ${ratings[element.label] === num ? 'selected' : ''}`}
//                       onClick={() => handleRatingChange(element.label, num)}
//                     >
//                       {num}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <label>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type="text"
//                 placeholder={element.placeholder}
//                 value={formValues[element.label]}
//                 onChange={(e) => handleInputChange(element.label, e.target.value)}
//                 required={element.required}
//               />
//             </div>
//           ))}
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">Submit</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EvaluatorFormDetails;














// //////////bef num rating ok 
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ReactStars from 'react-rating-stars-component';
// import './EvaluatorFormDetails.css';

// const EvaluatorFormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     form?.formElements?.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });
//   const [ratings, setRatings] = useState(() => {
//     const initialRatings = {};
//     form?.formElements?.forEach(element => {
//       initialRatings[element.label] = 0;
//     });
//     return initialRatings;
//   });
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleRatingChange = (label, value) => {
//     setRatings(prevRatings => ({
//       ...prevRatings,
//       [label]: value
//     }));
//   };

//   const handleSave = () => {
//     const updatedFormElements = formData.formElements.map(element => ({
//       ...element,
//       placeholder: formValues[element.label]
//     }));

//     const updatedFormData = {
//       ...formData,
//       formElements: updatedFormElements
//     };

//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(savedForm => savedForm.title === updatedFormData.title);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = updatedFormData;
//     } else {
//       savedForms.push(updatedFormData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     navigate(`/form/${form.title}`, { state: { form: updatedFormData } });
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/evaluator-form', { state: { formElements, formTitle: formData.title } });
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-details-container">
//       <div className="header-container">
//         <h2>{formData.title}</h2> {/* Display the title from formData */}
//         <div className="form-details-buttons">
//           <button className="save-button" onClick={handleSave}>Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <div className="form-content-container">
//         <form className="form-details-form">
//           {formData.formElements && formData.formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="number-box">{index + 1}</span> {element.name} {element.required && <span className="required">*</span>}
//               </label>
//               <div className="form-group">
//                 <label>Rating</label>
//                 <ReactStars
//                   count={10}
//                   value={ratings[element.label]}
//                   onChange={(newRating) => handleRatingChange(element.label, newRating)}
//                   size={24}
//                   activeColor="#ffd700"
//                 />
//               </div>
//               <label>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type="text"
//                 placeholder={element.placeholder}
//                 value={formValues[element.label]}
//                 onChange={(e) => handleInputChange(element.label, e.target.value)}
//                 required={element.required}
//               />
//             </div>
//           ))}
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">Submit</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EvaluatorFormDetails;








////////////bf star
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ReactStars from 'react-rating-stars-component';
// import './EvaluatorFormDetails.css';

// const EvaluatorFormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     form?.formElements?.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleRatingChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleSave = () => {
//     const updatedFormElements = formData.formElements.map(element => ({
//       ...element,
//       placeholder: formValues[element.label]
//     }));

//     const updatedFormData = {
//       ...formData,
//       formElements: updatedFormElements
//     };

//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(savedForm => savedForm.title === updatedFormData.title);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = updatedFormData;
//     } else {
//       savedForms.push(updatedFormData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     navigate(`/form/${form.title}`, { state: { form: updatedFormData } });
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/evaluator-form', { state: { formElements, formTitle: formData.title } });
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-details-container">
//       <div className="header-container">
//         <h2>{formData.title}</h2> {/* Display the title from formData */}
//         <div className="form-details-buttons">
//           <button className="save-button" onClick={handleSave}>Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <div className="form-content-container">
//         <form className="form-details-form">
//           {formData.formElements && formData.formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="number-box">{index + 1}</span> {element.name} {element.required && <span className="required">*</span>}
//               </label>
//               <div className="form-group">
//                 <label>Rating</label>
//                 <ReactStars
//                   count={10}
//                   value={formValues[element.label]}
//                   edit={false}
//                   size={24}
//                   activeColor="#ffd700"
//                 />
//               </div>
//               <label>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type="text"
//                 placeholder={element.placeholder}
//                 value={formValues[element.label]}
//                 onChange={(e) => handleInputChange(element.label, e.target.value)}
//                 required={element.required}
//               />
//             </div>
//           ))}
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">Submit</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EvaluatorFormDetails;
