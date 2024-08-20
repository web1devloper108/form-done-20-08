import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EvaluatorFormPreview.css';

const RatingComponent = ({ rating, onRatingChange }) => (
  <div className="rating-scaleevaluatorformpreview">
    {rating.map((rate, index) => (
      <span
        key={index}
        className={`rating-itemevaluatorformpreview rating-${rate.value}evaluatorformpreview`}
        onClick={() => onRatingChange(index)}
        style={{ backgroundColor: rate.selected ? '#000' : '' }}
      >
        {rate.value}
      </span>
    ))}
  </div>
);

const EvaluatorFormPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formElements = [], formTitle, formId } = location.state || {};
  const [formValues, setFormValues] = useState(() => {
    const values = {};
    formElements.forEach((element) => {
      values[element.label] = element.type === 'question' ? element.rating : element.value || '';
    });
    return values;
  });

  const handleRatingChange = (label, ratingIndex) => {
    const updatedRatings = formValues[label].map((rate, index) => ({
      ...rate,
      selected: index === ratingIndex,
    }));
    setFormValues({
      ...formValues,
      [label]: updatedRatings,
    });
  };

  const handleInputChange = (label, value) => {
    const element = formElements.find(e => e.label === label);
    // Highlighted: Removed character limit check for 'Question' field
    if (element && (element.type !== 'question' && value.length <= element.maxCharacters)) {
      setFormValues({
        ...formValues,
        [label]: value,
      });
    }
  };

  const handleSave = async () => {
    const formData = {
      id: formId || new Date().getTime().toString(),
      title: formTitle,
      fields: formElements.map((element) => ({
        ...element,
        rating: formValues[element.label],
      })),
      lastModified: new Date().toISOString(),
    };

    try {
      const checkResponse = await fetch(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
      let method;
      let url;

      if (checkResponse.ok) {
        method = 'PUT';
        url = `http://localhost:5000/api/evaluationForms/form-structure/${formId}`;
      } else if (checkResponse.status === 404) {
        method = 'POST';
        url = 'http://localhost:5000/api/evaluationForms/form-structure';
      } else {
        throw new Error('Error checking form existence');
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      toast.success("Form saved successfully");
      setTimeout(() => {
        navigate('/evaluator-dashboard');
      }, 2000);
    } catch (error) {
      toast.error(`Error saving form structure: ${error.message}`);
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-preview-containerevaluatorformpreview">
      <ToastContainer position="bottom-right" />
      <div className="form-preview-headerevaluatorformpreview">
        <h2>{formTitle}</h2>
        <div className="form-preview-buttonsevaluatorformpreview">
          <button className="form-preview-save-buttonevaluatorformpreview" onClick={handleSave}>
            Save
          </button>
          <button className="form-preview-edit-buttonevaluatorformpreview" onClick={() => navigate('/evaluator-form', { state: { formElements, formTitle, formId } })}>
            Edit
          </button>
          <button className="form-preview-close-buttonevaluatorformpreview" onClick={() => navigate('/evaluator-dashboard')}>
            Close
          </button>
        </div>
      </div>
      <div className="form-preview-boxevaluatorformpreview">
        <form>
          {formElements.map((element, index) => (
            <div key={index} className="form-groupevaluatorformpreview">
              <div className="label-containerevaluatorformpreview">
                <label className="form-preview-label-numberevaluatorformpreview">{index + 1}</label>
                <label>
                  {element.label}
                  {element.required && <span className="requiredevaluatorformpreview">*</span>}
                </label>
              </div>
              {element.type === 'question' ? (
                <RatingComponent 
                  rating={formValues[element.label]} 
                  onRatingChange={(ratingIndex) => handleRatingChange(element.label, ratingIndex)} 
                />
              ) : (
                <>
                  <input
                    type="text"
                    placeholder={element.placeholder}
                    value={formValues[element.label] || ''}
                    onChange={(e) => handleInputChange(element.label, e.target.value)}
                  />
                  {(element.maxCharacters || element.minCharacters) && element.type !== 'question' && ( // Highlighted: Exclude 'Question' field from displaying character limits
                    <div className="character-limit-evaluatorformpreview">
                      {element.maxCharacters && `${element.maxCharacters - (formValues[element.label]?.length || 0)} characters remaining`}
                      {element.minCharacters && (formValues[element.label]?.length || 0) < element.minCharacters && ` (Min: ${element.minCharacters} characters)`}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default EvaluatorFormPreview;












///////////char aa raha hai rate me 

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './EvaluatorFormPreview.css';

// const RatingComponent = ({ rating, onRatingChange }) => (
//   <div className="rating-scaleevaluatorformpreview">
//     {rating.map((rate, index) => (
//       <span
//         key={index}
//         className={`rating-itemevaluatorformpreview rating-${rate.value}evaluatorformpreview`}
//         onClick={() => onRatingChange(index)}
//         style={{ backgroundColor: rate.selected ? '#000' : '' }}
//       >
//         {rate.value}
//       </span>
//     ))}
//   </div>
// );

// const EvaluatorFormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements = [], formTitle, formId } = location.state || {};
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach((element) => {
//       values[element.label] = element.type === 'question' ? element.rating : element.value || '';
//     });
//     return values;
//   });

//   const handleRatingChange = (label, ratingIndex) => {
//     const updatedRatings = formValues[label].map((rate, index) => ({
//       ...rate,
//       selected: index === ratingIndex,
//     }));
//     setFormValues({
//       ...formValues,
//       [label]: updatedRatings,
//     });
//   };

//   const handleInputChange = (label, value) => {
//     const element = formElements.find(e => e.label === label);
//     if (element && value.length <= element.maxCharacters) {
//       setFormValues({
//         ...formValues,
//         [label]: value,
//       });
//     }
//   };

//   const handleSave = async () => {
//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements.map((element) => ({
//         ...element,
//         rating: formValues[element.label],
//       })),
//       lastModified: new Date().toISOString(),
//     };

//     try {
//       // Check if the form exists first
//       const checkResponse = await fetch(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
      
//       let method;
//       let url;

//       if (checkResponse.ok) {
//         // Form exists, use PUT to update
//         method = 'PUT';
//         url = `http://localhost:5000/api/evaluationForms/form-structure/${formId}`;
//       } else if (checkResponse.status === 404) {
//         // Form does not exist, use POST to create
//         method = 'POST';
//         url = 'http://localhost:5000/api/evaluationForms/form-structure';
//       } else {
//         throw new Error('Error checking form existence');
//       }

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorText = await response.text(); // read error response as text
//         throw new Error(errorText);
//       }

//       const result = await response.json();
//       toast.success("Form saved successfully");
//       setTimeout(() => {
//         navigate('/evaluator-dashboard');
//       }, 2000);
//     } catch (error) {
//       toast.error(`Error saving form structure: ${error.message}`);
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerevaluatorformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerevaluatorformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsevaluatorformpreview">
//           <button className="form-preview-save-buttonevaluatorformpreview" onClick={handleSave}>
//             Save
//           </button>
//           <button className="form-preview-edit-buttonevaluatorformpreview" onClick={() => navigate('/evaluator-form', { state: { formElements, formTitle, formId } })}>
//             Edit
//           </button>
//           <button className="form-preview-close-buttonevaluatorformpreview" onClick={() => navigate('/evaluator-dashboard')}>
//             Close
//           </button>
//         </div>
//       </div>
//       <div className="form-preview-boxevaluatorformpreview">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-groupevaluatorformpreview">
//               <div className="label-containerevaluatorformpreview">
//                 <label className="form-preview-label-numberevaluatorformpreview">{index + 1}</label>
//                 <label>
//                   {element.label}
//                   {element.required && <span className="requiredevaluatorformpreview">*</span>}
//                 </label>
//               </div>
//               {element.type === 'question' ? (
//                 <RatingComponent 
//                   rating={formValues[element.label]} 
//                   onRatingChange={(ratingIndex) => handleRatingChange(element.label, ratingIndex)} 
//                 />
//               ) : (
//                 <>
//                   <input
//                     type="text"
//                     placeholder={element.placeholder}
//                     value={formValues[element.label] || ''}
//                     onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   />
//                   {(element.maxCharacters || element.minCharacters) && (
//                     <div className="character-limit-evaluatorformpreview"> 
//                       {element.maxCharacters && `${element.maxCharacters - (formValues[element.label]?.length || 0)} characters remaining`}
//                       {element.minCharacters && (formValues[element.label]?.length || 0) < element.minCharacters && ` (Min: ${element.minCharacters} characters)`}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           ))}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EvaluatorFormPreview;










///max ok

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './EvaluatorFormPreview.css';

// const RatingComponent = ({ rating, onRatingChange }) => (
//   <div className="rating-scaleevaluatorformpreview">
//     {rating.map((rate, index) => (
//       <span
//         key={index}
//         className={`rating-itemevaluatorformpreview rating-${rate.value}evaluatorformpreview`}
//         onClick={() => onRatingChange(index)}
//         style={{ backgroundColor: rate.selected ? '#000' : '' }}
//       >
//         {rate.value}
//       </span>
//     ))}
//   </div>
// );

// const EvaluatorFormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements = [], formTitle, formId } = location.state || {};
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach((element) => {
//       values[element.label] = element.type === 'question' ? element.rating : element.value || '';
//     });
//     return values;
//   });

//   const handleRatingChange = (label, ratingIndex) => {
//     const updatedRatings = formValues[label].map((rate, index) => ({
//       ...rate,
//       selected: index === ratingIndex,
//     }));
//     setFormValues({
//       ...formValues,
//       [label]: updatedRatings,
//     });
//   };

//   const handleInputChange = (label, value) => {
//     if (value.length <= formElements.find(element => element.label === label).maxCharacters) {
//       setFormValues({
//         ...formValues,
//         [label]: value,
//       });
//     }
//   };

//   const handleSave = async () => {
//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements.map((element) => ({
//         ...element,
//         rating: formValues[element.label],
//       })),
//       lastModified: new Date().toISOString(),
//     };

//     try {
//       // Check if the form exists first
//       const checkResponse = await fetch(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
      
//       let method;
//       let url;

//       if (checkResponse.ok) {
//         // Form exists, use PUT to update
//         method = 'PUT';
//         url = `http://localhost:5000/api/evaluationForms/form-structure/${formId}`;
//       } else if (checkResponse.status === 404) {
//         // Form does not exist, use POST to create
//         method = 'POST';
//         url = 'http://localhost:5000/api/evaluationForms/form-structure';
//       } else {
//         throw new Error('Error checking form existence');
//       }

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorText = await response.text(); // read error response as text
//         throw new Error(errorText);
//       }

//       const result = await response.json();
//       toast.success("Form saved successfully");
//       setTimeout(() => {
//         navigate('/evaluator-dashboard');
//       }, 2000);
//     } catch (error) {
//       toast.error(`Error saving form structure: ${error.message}`);
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerevaluatorformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerevaluatorformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsevaluatorformpreview">
//           <button className="form-preview-save-buttonevaluatorformpreview" onClick={handleSave}>
//             Save
//           </button>
//           <button className="form-preview-edit-buttonevaluatorformpreview" onClick={() => navigate('/evaluator-form', { state: { formElements, formTitle, formId } })}>
//             Edit
//           </button>
//           <button className="form-preview-close-buttonevaluatorformpreview" onClick={() => navigate('/evaluator-dashboard')}>
//             Close
//           </button>
//         </div>
//       </div>
//       <div className="form-preview-boxevaluatorformpreview">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-groupevaluatorformpreview">
//               <div className="label-containerevaluatorformpreview">
//                 <label className="form-preview-label-numberevaluatorformpreview">{index + 1}</label>
//                 <label>
//                   {element.label}
//                   {element.required && <span className="requiredevaluatorformpreview">*</span>}
//                 </label>
//               </div>
//               {element.type === 'question' ? (
//                 <RatingComponent 
//                   rating={formValues[element.label]} 
//                   onRatingChange={(ratingIndex) => handleRatingChange(element.label, ratingIndex)} 
//                 />
//               ) : (
//                 <>
//                   <input
//                     type="text"
//                     placeholder={element.placeholder}
//                     value={formValues[element.label] || ''}
//                     onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   />
//                   {(element.maxCharacters || element.minCharacters) && (
//                     <div className="character-limit-evaluatorformpreview">
//                       {element.maxCharacters && `${element.maxCharacters - (formValues[element.label]?.length || 0)} characters remaining`}
//                       {element.minCharacters && ` (Min: ${element.minCharacters} characters)`}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           ))}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EvaluatorFormPreview;





// b 0 to 50 


// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './EvaluatorFormPreview.css';

// const RatingComponent = ({ rating, onRatingChange }) => (
//   <div className="rating-scaleevaluatorformpreview">
//     {rating.map((rate, index) => (
//       <span
//         key={index}
//         className={`rating-itemevaluatorformpreview rating-${rate.value}evaluatorformpreview`}
//         onClick={() => onRatingChange(index)}
//         style={{ backgroundColor: rate.selected ? '#000' : '' }}
//       >
//         {rate.value}
//       </span>
//     ))}
//   </div>
// );

// const EvaluatorFormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements = [], formTitle, formId } = location.state || {};
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach((element) => {
//       values[element.label] = element.type === 'question' ? element.rating : element.value || '';
//     });
//     return values;
//   });

//   const handleRatingChange = (label, ratingIndex) => {
//     const updatedRatings = formValues[label].map((rate, index) => ({
//       ...rate,
//       selected: index === ratingIndex,
//     }));
//     setFormValues({
//       ...formValues,
//       [label]: updatedRatings,
//     });
//   };

//   const handleInputChange = (label, value) => {
//     setFormValues({
//       ...formValues,
//       [label]: value,
//     });
//   };

//   const handleSave = async () => {
//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements.map((element) => ({
//         ...element,
//         rating: formValues[element.label],
//       })),
//       lastModified: new Date().toISOString(),
//     };

//     try {
//       // Check if the form exists first
//       const checkResponse = await fetch(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
      
//       let method;
//       let url;

//       if (checkResponse.ok) {
//         // Form exists, use PUT to update
//         method = 'PUT';
//         url = `http://localhost:5000/api/evaluationForms/form-structure/${formId}`;
//       } else if (checkResponse.status === 404) {
//         // Form does not exist, use POST to create
//         method = 'POST';
//         url = 'http://localhost:5000/api/evaluationForms/form-structure';
//       } else {
//         throw new Error('Error checking form existence');
//       }

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorText = await response.text(); // read error response as text
//         throw new Error(errorText);
//       }

//       const result = await response.json();
//       toast.success("Form saved successfully");
//       setTimeout(() => {
//         navigate('/evaluator-dashboard');
//       }, 2000);
//     } catch (error) {
//       toast.error(`Error saving form structure: ${error.message}`);
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerevaluatorformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerevaluatorformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsevaluatorformpreview">
//           <button className="form-preview-save-buttonevaluatorformpreview" onClick={handleSave}>
//             Save
//           </button>
//           <button className="form-preview-edit-buttonevaluatorformpreview" onClick={() => navigate('/evaluator-form', { state: { formElements, formTitle, formId } })}>
//             Edit
//           </button>
//           <button className="form-preview-close-buttonevaluatorformpreview" onClick={() => navigate('/evaluator-dashboard')}>
//             Close
//           </button>
//         </div>
//       </div>
//       <div className="form-preview-boxevaluatorformpreview">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-groupevaluatorformpreview">
//               <div className="label-containerevaluatorformpreview">
//                 <label className="form-preview-label-numberevaluatorformpreview">{index + 1}</label>
//                 <label>
//                   {element.label}
//                   {element.required && <span className="requiredevaluatorformpreview">*</span>}
//                 </label>
//               </div>
//               {element.type === 'question' ? (
//                 <RatingComponent 
//                   rating={formValues[element.label]} 
//                   onRatingChange={(ratingIndex) => handleRatingChange(element.label, ratingIndex)} 
//                 />
//               ) : (
//                 <input
//                   type="text"
//                   placeholder={element.placeholder}
//                   value={formValues[element.label] || ''}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                 />
//               )}
//             </div>
//           ))}
//           {/* <button type="submit" className="form-preview-submit-buttonevaluatorformpreview">
//             Submit
//           </button> */}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EvaluatorFormPreview;



















/* // /////before css class selector  */



// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './EvaluatorFormPreview.css';

// const RatingComponent = ({ rating, onRatingChange }) => (
//   <div className="rating-scale">
//     {rating.map((rate, index) => (
//       <span
//         key={index}
//         className={`rating-item rating-${rate.value}`}
//         onClick={() => onRatingChange(index)}
//         style={{ backgroundColor: rate.selected ? '#000' : '' }}
//       >
//         {rate.value}
//       </span>
//     ))}
//   </div>
// );

// const EvaluatorFormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements = [], formTitle, formId } = location.state || {};
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach((element) => {
//       values[element.label] = element.type === 'question' ? element.rating : element.value || '';
//     });
//     return values;
//   });

//   const handleRatingChange = (label, ratingIndex) => {
//     const updatedRatings = formValues[label].map((rate, index) => ({
//       ...rate,
//       selected: index === ratingIndex,
//     }));
//     setFormValues({
//       ...formValues,
//       [label]: updatedRatings,
//     });
//   };

//   const handleInputChange = (label, value) => {
//     setFormValues({
//       ...formValues,
//       [label]: value,
//     });
//   };

//   const handleSave = async () => {
//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements.map((element) => ({
//         ...element,
//         rating: formValues[element.label],
//       })),
//       lastModified: new Date().toISOString(),
//     };

//     try {
//       // Check if the form exists first
//       const checkResponse = await fetch(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
      
//       let method;
//       let url;

//       if (checkResponse.ok) {
//         // Form exists, use PUT to update
//         method = 'PUT';
//         url = `http://localhost:5000/api/evaluationForms/form-structure/${formId}`;
//       } else if (checkResponse.status === 404) {
//         // Form does not exist, use POST to create
//         method = 'POST';
//         url = 'http://localhost:5000/api/evaluationForms/form-structure';
//       } else {
//         throw new Error('Error checking form existence');
//       }

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorText = await response.text(); // read error response as text
//         throw new Error(errorText);
//       }

//       const result = await response.json();
//       toast.success("Form saved successfully");
//       setTimeout(() => {
//         navigate('/evaluator-dashboard');
//       }, 2000);
//     } catch (error) {
//       toast.error(`Error saving form structure: ${error.message}`);
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>
//             Save
//           </button>
//           <button className="form-preview-edit-button" onClick={() => navigate('/evaluator-form', { state: { formElements, formTitle, formId } })}>
//             Edit
//           </button>
//           <button className="form-preview-close-button" onClick={() => navigate('/evaluator-dashboard')}>
//             Close
//           </button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <div className="label-container">
//                 <label className="form-preview-label-number">{index + 1}</label>
//                 <label>
//                   {element.label}
//                   {element.required && <span className="required">*</span>}
//                 </label>
//               </div>
//               {element.type === 'question' ? (
//                 <RatingComponent 
//                   rating={formValues[element.label]} 
//                   onRatingChange={(ratingIndex) => handleRatingChange(element.label, ratingIndex)} 
//                 />
//               ) : (
//                 <input
//                   type="text"
//                   placeholder={element.placeholder}
//                   value={formValues[element.label] || ''}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                 />
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EvaluatorFormPreview;










