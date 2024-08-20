import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SharedFormPreview.css';
import { FaInfoCircle } from 'react-icons/fa';
 
const SharedFormPreview = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        console.log(`Fetching form data for formId: ${formId}`);
        const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
        console.log('Form data fetched successfully:', response.data);
        setForm(response.data);
        setFormData(
          response.data.fields.reduce((acc, field) => {
            acc[field.label] = '';
            return acc;
          }, {})
        );
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchForm();
  }, [formId]);

  const handleChange = (label, value) => {
    const field = form.fields.find(f => f.label === label);
    // Highlighted: Removed character limit check for 'Question' field
    if (field && (field.type !== 'question' && value.length <= field.maxCharacters)) {
      setFormData((prevValues) => ({
        ...prevValues,
        [label]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [label]: value.length < field.minCharacters,
      }));
    }
  };

  const handleRatingChange = (label, value) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [label]: Number(value),
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [label]: false,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    let hasError = false;

    for (const field of form.fields) {
      if (!formData[field.label] || formData[field.label].length < field.minCharacters) {
        newErrors[field.label] = true;
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      toast.error('Please fill all required fields and meet minimum character requirements');
      return;
    }

    const submissionData = {
      title: form.title,
      fields: form.fields.map((field) => {
        const value = formData[field.label] || '';
        if (field.type === 'question') {
          return { ...field, rating: Number(value) };
        }
        return { ...field, value };
      }),
    };

    console.log('Submitting data:', submissionData);

    try {
      const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
      console.log('Response from server:', response.data);
      toast.success('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error.response.data);
      toast.error('Failed to submit form');
    }
  };

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div className="custom-backgroundformsharedformpreview">
      <div className="custom-shared-form-preview-containerformsharedformpreview">
        <ToastContainer position="bottom-right" />
        <h2 className="custom-form-titleformsharedformpreview">{form.title}</h2>
        <form onSubmit={handleSubmit} className="custom-formformsharedformpreview">
          <div className="custom-form-rowformsharedformpreview">
            {form.fields.map((field, index) => (
              <div key={index} className="custom-form-groupformsharedformpreview">
                <label className="custom-form-labelformsharedformpreview">
                  {field.label}
                  {field.required && <span className="custom-requiredformsharedformpreview">*</span>}
                </label>
                {field.type === 'text' ? (
                  <>
                    <input
                      className={`custom-form-inputformsharedformpreview ${errors[field.label] ? 'errorformsharedformpreview' : ''}`}
                      type="text"
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formData[field.label] || ''}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                    />
                    {(field.maxCharacters || field.minCharacters) && field.type !== 'question' && ( // Highlighted: Exclude 'Question' field from displaying character limits
                      <div className="character-limit-sharedformpreview">
                        {field.maxCharacters && `${field.maxCharacters - (formData[field.label]?.length || 0)} characters remaining`}
                        {field.minCharacters && (formData[field.label]?.length || 0) < field.minCharacters && ` (Min: ${field.minCharacters} characters)`}
                      </div>
                    )}
                  </>
                ) : field.type === 'question' ? (
                  <div className="custom-rating-scaleformsharedformpreview">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((rate) => (
                      <label key={rate} className="custom-rating-itemformsharedformpreview">
                        <input
                          type="radio"
                          name={`rating-${index}`}
                          value={rate}
                          checked={formData[field.label] === rate}
                          onChange={() => handleRatingChange(field.label, rate)}
                        />
                        <span className="custom-rating-labelformsharedformpreview">{rate}</span>
                      </label>
                    ))}
                  </div>
                ) : null}
                {errors[field.label] && (
                  <div className="error-messageformsharedformpreview">
                    <FaInfoCircle className="error-iconformsharedformpreview" /> This field is required
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="form-buttonssharedformpreview">
            <button type="submit" className="custom-form-submit-buttonformsharedformpreview">Save</button>
            <button type="button" className="custom-form-cancel-buttonformsharedformpreview">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SharedFormPreview;













///////////char aa raha hai rate me 




// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; // Using FaInfoCircle for the new icon

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//         setFormData(
//           response.data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = form.fields.find(f => f.label === label);
//     if (field && value.length <= field.maxCharacters) {
//       setFormData((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: value.length < field.minCharacters,
//       }));
//     }
//   };

//   const handleRatingChange = (label, value) => {
//     setFormData((prevValues) => ({
//       ...prevValues,
//       [label]: Number(value),
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: false,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of form.fields) {
//       if (!formData[field.label] || formData[field.label].length < field.minCharacters) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field) => {
//         const value = formData[field.label] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-backgroundformsharedformpreview">
//       <div className="custom-shared-form-preview-containerformsharedformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-titleformsharedformpreview">{form.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-formformsharedformpreview">
//           <div className="custom-form-rowformsharedformpreview">
//             {form.fields.map((field, index) => (
//               <div key={index} className="custom-form-groupformsharedformpreview">
//                 <label className="custom-form-labelformsharedformpreview">
//                   {field.label}
//                   {field.required && <span className="custom-requiredformsharedformpreview">*</span>}
//                 </label>
//                 {field.type === 'text' ? (
//                   <>
//                     <input
//                       className={`custom-form-inputformsharedformpreview ${errors[field.label] ? 'errorformsharedformpreview' : ''}`}
//                       type="text"
//                       placeholder={field.placeholder}
//                       required={field.required}
//                       value={formData[field.label] || ''}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                     />
//                     {(field.maxCharacters || field.minCharacters) && (
//                       <div className="character-limit-sharedformpreview">
//                         {field.maxCharacters && `${field.maxCharacters - (formData[field.label]?.length || 0)} characters remaining`}
//                         {field.minCharacters && (formData[field.label]?.length || 0) < field.minCharacters && ` (Min: ${field.minCharacters} characters)`}
//                       </div>
//                     )}
//                   </>
//                 ) : field.type === 'question' ? (
//                   <div className="custom-rating-scaleformsharedformpreview">
//                     {Array.from({ length: 10 }, (_, i) => i + 1).map((rate) => (
//                       <label key={rate} className="custom-rating-itemformsharedformpreview">
//                         <input
//                           type="radio"
//                           name={`rating-${index}`}
//                           value={rate}
//                           checked={formData[field.label] === rate}
//                           onChange={() => handleRatingChange(field.label, rate)}
//                         />
//                         <span className="custom-rating-labelformsharedformpreview">{rate}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : null}
//                 {errors[field.label] && (
//                   <div className="error-messageformsharedformpreview">
//                     <FaInfoCircle className="error-iconformsharedformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className="form-buttons">
//             <button type="submit" className="custom-form-submit-buttonformsharedformpreview">Save</button>
//             <button type="button" className="custom-form-cancel-buttonformsharedformpreview">Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SharedFormPreview;














///////////b template 



// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; // Using FaInfoCircle for the new icon

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//         setFormData(
//           response.data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = form.fields.find(f => f.label === label);
//     if (field && value.length <= field.maxCharacters) {
//       setFormData((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: value.length < field.minCharacters,
//       }));
//     }
//   };

//   const handleRatingChange = (label, value) => {
//     setFormData((prevValues) => ({
//       ...prevValues,
//       [label]: Number(value),
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: false,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of form.fields) {
//       if (!formData[field.label] || formData[field.label].length < field.minCharacters) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field) => {
//         const value = formData[field.label] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-backgroundformsharedformpreview">
//       <div className="custom-shared-form-preview-containerformsharedformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-titleformsharedformpreview">{form.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-formformsharedformpreview">
//           <div className="custom-form-rowformsharedformpreview">
//             {form.fields.map((field, index) => (
//               <div key={index} className="custom-form-groupformsharedformpreview">
//                 <label className="custom-form-labelformsharedformpreview">
//                   {field.label}
//                   {field.required && <span className="custom-requiredformsharedformpreview">*</span>}
//                 </label>
//                 {field.type === 'text' ? (
//                   <>
//                     <input
//                       className={`custom-form-inputformsharedformpreview ${errors[field.label] ? 'errorformsharedformpreview' : ''}`}
//                       type="text"
//                       placeholder={field.placeholder}
//                       required={field.required}
//                       value={formData[field.label] || ''}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                     />
//                     {(field.maxCharacters || field.minCharacters) && (
//                       <div className="character-limit-sharedformpreview">
//                         {field.maxCharacters && `${field.maxCharacters - (formData[field.label]?.length || 0)} characters remaining`}
//                         {field.minCharacters && (formData[field.label]?.length || 0) < field.minCharacters && ` (Min: ${field.minCharacters} characters)`}
//                       </div>
//                     )}
//                   </>
//                 ) : field.type === 'question' ? (
//                   <div className="custom-rating-scaleformsharedformpreview">
//                     {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                       <label key={rate} className="custom-rating-itemformsharedformpreview">
//                         <input
//                           type="radio"
//                           name={`rating-${index}`}
//                           value={rate}
//                           checked={formData[field.label] === rate}
//                           onChange={() => handleRatingChange(field.label, rate)}
//                         />
//                         <span className="custom-rating-labelformsharedformpreview">{rate}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : null}
//                 {errors[field.label] && (
//                   <div className="error-messageformsharedformpreview">
//                     <FaInfoCircle className="error-iconformsharedformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-buttonformsharedformpreview">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SharedFormPreview;






///max ok

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; // Using FaInfoCircle for the new icon

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//         setFormData(
//           response.data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = form.fields.find(f => f.label === label);
//     if (field && value.length <= field.maxCharacters) {
//       setFormData((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: !value,
//       }));
//     }
//   };

//   const handleRatingChange = (label, value) => {
//     setFormData((prevValues) => ({
//       ...prevValues,
//       [label]: Number(value),
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: false,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of form.fields) {
//       if (!formData[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field) => {
//         const value = formData[field.label] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-backgroundformsharedformpreview">
//       <div className="custom-shared-form-preview-containerformsharedformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-titleformsharedformpreview">{form.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-formformsharedformpreview">
//           <div className="custom-form-rowformsharedformpreview">
//             {form.fields.map((field, index) => (
//               <div key={index} className="custom-form-groupformsharedformpreview">
//                 <label className="custom-form-labelformsharedformpreview">
//                   {field.label}
//                   {field.required && <span className="custom-requiredformsharedformpreview">*</span>}
//                 </label>
//                 {field.type === 'text' ? (
//                   <>
//                     <input
//                       className={`custom-form-inputformsharedformpreview ${errors[field.label] ? 'errorformsharedformpreview' : ''}`}
//                       type="text"
//                       placeholder={field.placeholder}
//                       required={field.required}
//                       value={formData[field.label] || ''}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                     />
//                     {(field.maxCharacters || field.minCharacters) && (
//                       <div className="character-limit-sharedformpreview">
//                         {field.maxCharacters && `${field.maxCharacters - (formData[field.label]?.length || 0)} characters remaining`}
//                         {field.minCharacters && ` (Min: ${field.minCharacters} characters)`}
//                       </div>
//                     )}
//                   </>
//                 ) : field.type === 'question' ? (
//                   <div className="custom-rating-scaleformsharedformpreview">
//                     {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                       <label key={rate} className="custom-rating-itemformsharedformpreview">
//                         <input
//                           type="radio"
//                           name={`rating-${index}`}
//                           value={rate}
//                           checked={formData[field.label] === rate}
//                           onChange={() => handleRatingChange(field.label, rate)}
//                         />
//                         <span className="custom-rating-labelformsharedformpreview">{rate}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : null}
//                 {errors[field.label] && (
//                   <div className="error-messageformsharedformpreview">
//                     <FaInfoCircle className="error-iconformsharedformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-buttonformsharedformpreview">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SharedFormPreview;










// b 0 to 50 



// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; // Using FaInfoCircle for the new icon

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//         setFormData(
//           response.data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormData((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: !value,
//     }));
//   };

//   const handleRatingChange = (label, value) => {
//     setFormData((prevValues) => ({
//       ...prevValues,
//       [label]: Number(value),
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: false,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of form.fields) {
//       if (!formData[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field) => {
//         const value = formData[field.label] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-backgroundformsharedformpreview">
//       <div className="custom-shared-form-preview-containerformsharedformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-titleformsharedformpreview">{form.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-formformsharedformpreview">
//           <div className="custom-form-rowformsharedformpreview">
//             {form.fields.map((field, index) => (
//               <div key={index} className="custom-form-groupformsharedformpreview">
//                 <label className="custom-form-labelformsharedformpreview">
//                   {field.label}
//                   {field.required && <span className="custom-requiredformsharedformpreview">*</span>}
//                 </label>
//                 {field.type === 'text' ? (
//                   <input
//                     className={`custom-form-inputformsharedformpreview ${errors[field.label] ? 'errorformsharedformpreview' : ''}`}
//                     type="text"
//                     placeholder={field.placeholder}
//                     required={field.required}
//                     value={formData[field.label] || ''}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                   />
//                 ) : field.type === 'question' ? (
//                   <div className="custom-rating-scaleformsharedformpreview">
//                     {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                       <label key={rate} className="custom-rating-itemformsharedformpreview">
//                         <input
//                           type="radio"
//                           name={`rating-${index}`}
//                           value={rate}
//                           checked={formData[field.label] === rate}
//                           onChange={() => handleRatingChange(field.label, rate)}
//                         />
//                         <span className="custom-rating-labelformsharedformpreview">{rate}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : null}
//                 {errors[field.label] && (
//                   <div className="error-messageformsharedformpreview">
//                     <FaInfoCircle className="error-iconformsharedformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-buttonformsharedformpreview">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SharedFormPreview;













/* // /////before css class selector  */




// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; // Using FaInfoCircle for the new icon

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//         setFormData(
//           response.data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormData((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: !value,
//     }));
//   };

//   const handleRatingChange = (label, value) => {
//     setFormData((prevValues) => ({
//       ...prevValues,
//       [label]: Number(value),
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: false,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of form.fields) {
//       if (!formData[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field) => {
//         const value = formData[field.label] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-backgroundform">
//       <div className="custom-shared-form-preview-containerform">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-titleform">{form.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-formform">
//           <div className="custom-form-rowform">
//             {form.fields.map((field, index) => (
//               <div key={index} className="custom-form-groupform">
//                 <label className="custom-form-labelform">
//                   {field.label}
//                   {field.required && <span className="custom-requiredform">*</span>}
//                 </label>
//                 {field.type === 'text' ? (
//                   <input
//                     className={`custom-form-inputform ${errors[field.label] ? 'errorform' : ''}`}
//                     type="text"
//                     placeholder={field.placeholder}
//                     required={field.required}
//                     value={formData[field.label] || ''}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                   />
//                 ) : field.type === 'question' ? (
//                   <div className="custom-rating-scaleform">
//                     {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                       <label key={rate} className="custom-rating-itemform">
//                         <input
//                           type="radio"
//                           name={`rating-${index}`}
//                           value={rate}
//                           checked={formData[field.label] === rate}
//                           onChange={() => handleRatingChange(field.label, rate)}
//                         />
//                         <span className="custom-rating-labelform">{rate}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : null}
//                 {errors[field.label] && (
//                   <div className="error-messageform">
//                     <FaInfoCircle className="error-iconform" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-buttonform">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SharedFormPreview;















/////before css class selector form

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; // Using FaInfoCircle for the new icon

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//         setFormData(
//           response.data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormData((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: !value,
//     }));
//   };

//   const handleRatingChange = (label, value) => {
//     setFormData((prevValues) => ({
//       ...prevValues,
//       [label]: Number(value),
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: false,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of form.fields) {
//       if (!formData[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field) => {
//         const value = formData[field.label] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-background">
//       <div className="custom-shared-form-preview-container">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title">{form.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form">
//           <div className="custom-form-row">
//             {form.fields.map((field, index) => (
//               <div key={index} className="custom-form-group">
//                 <label className="custom-form-label">
//                   {field.label}
//                   {field.required && <span className="custom-required">*</span>}
//                 </label>
//                 {field.type === 'text' ? (
//                   <input
//                     className={`custom-form-input ${errors[field.label] ? 'error' : ''}`}
//                     type="text"
//                     placeholder={field.placeholder}
//                     required={field.required}
//                     value={formData[field.label] || ''}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                   />
//                 ) : field.type === 'question' ? (
//                   <div className="custom-rating-scale">
//                     {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                       <label key={rate} className="custom-rating-item">
//                         <input
//                           type="radio"
//                           name={`rating-${index}`}
//                           value={rate}
//                           checked={formData[field.label] === rate}
//                           onChange={() => handleRatingChange(field.label, rate)}
//                         />
//                         <span className="custom-rating-label">{rate}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : null}
//                 {errors[field.label] && (
//                   <div className="error-message">
//                     <FaInfoCircle className="error-icon" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SharedFormPreview;








































//////////val work
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; // Using FaInfoCircle for the new icon

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//         setFormData(
//           response.data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormData((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: !value,
//     }));
//   };

//   const handleRatingChange = (index, value) => {
//     const newFormData = { ...formData };
//     newFormData[index] = Number(value); // the rating is a number
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of form.fields) {
//       if (!formData[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field, index) => {
//         const value = formData[field.label] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-background">
//       <div className="custom-shared-form-preview-container">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title">{form.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form">
//           <div className="custom-form-row">
//             {form.fields.map((field, index) => (
//               <div key={index} className="custom-form-group">
//                 <label className="custom-form-label">
//                   {field.label}
//                   {field.required && <span className="custom-required">*</span>}
//                 </label>
//                 {field.type === 'text' ? (
//                   <input
//                     className={`custom-form-input ${errors[field.label] ? 'error' : ''}`}
//                     type="text"
//                     placeholder={field.placeholder}
//                     required={field.required}
//                     value={formData[field.label] || ''}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                   />
//                 ) : field.type === 'question' ? (
//                   <div className="custom-rating-scale">
//                     {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                       <label key={rate} className="custom-rating-item">
//                         <input
//                           type="radio"
//                           name={`rating-${index}`}
//                           value={rate}
//                           checked={formData[field.label] === rate}
//                           onChange={() => handleRatingChange(field.label, rate)}
//                         />
//                         <span className="custom-rating-label">{rate}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : null}
//                 {errors[field.label] && (
//                   <div className="error-message">
//                     <FaInfoCircle className="error-icon" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SharedFormPreview;












/////before validation 

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   const { title, fields } = form;

//   const handleChange = (index, event) => {
//     const newFormData = { ...formData };
//     newFormData[index] = event.target.value;
//     setFormData(newFormData);
//   };

//   const handleRatingChange = (index, value) => {
//     const newFormData = { ...formData };
//     newFormData[index] = Number(value); // the rating is a number
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     let hasEmptyFields = false;

//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field, index) => {
//         const value = formData[index] || '';
//         if (field.required && !value) {
//           hasEmptyFields = true;
//         }
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     if (hasEmptyFields) {
//       toast.error('Please fill out all required fields');
//       return;
//     }

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   return (
//     <div className="custom-shared-form-preview-wrapper">
//       <div className="custom-form-background"></div>
//       <div className="custom-shared-form-preview-container">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title">{title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form">
//           <div className="custom-form-row">
//             {fields.map((field, index) => (
//               <div key={index} className="custom-form-group">
//                 <label className="custom-form-label">
//                   {field.label}
//                   {field.required && <span className="custom-required">*</span>}
//                 </label>
//                 {field.type === 'text' ? (
//                   <input
//                     className="custom-form-input"
//                     type="text"
//                     placeholder={field.placeholder}
//                     required={field.required}
//                     value={formData[index] || ''}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 ) : field.type === 'question' ? (
//                   <div className="custom-rating-scale">
//                     {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                       <label key={rate} className="custom-rating-item">
//                         <input
//                           type="radio"
//                           name={`rating-${index}`}
//                           value={rate}
//                           checked={formData[index] === rate}
//                           onChange={() => handleRatingChange(index, rate)}
//                         />
//                         <span className="custom-rating-label">{rate}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : null}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button">
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SharedFormPreview;















/////without validation 


// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   const { title, fields } = form;

//   const handleChange = (index, event) => {
//     const newFormData = { ...formData };
//     newFormData[index] = event.target.value;
//     setFormData(newFormData);
//   };

//   const handleRatingChange = (index, value) => {
//     const newFormData = { ...formData };
//     newFormData[index] = Number(value); // the rating is a number
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field, index) => {
//         const value = formData[index] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   return (
//     <div className="custom-shared-form-preview-wrapper">
//       <div className="custom-form-background"></div>
//       <div className="custom-shared-form-preview-container">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title">{title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form">
//           <div className="custom-form-row">
//             {fields.map((field, index) => (
//               <div key={index} className="custom-form-group">
//                 <label className="custom-form-label">
//                   {field.label}
//                   {field.required && <span className="custom-required">*</span>}
//                 </label>
//                 {field.type === 'text' ? (
//                   <input
//                     className="custom-form-input"
//                     type="text"
//                     placeholder={field.placeholder}
//                     required={field.required}
//                     value={formData[index] || ''}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 ) : field.type === 'question' ? (
//                   <div className="custom-rating-scale">
//                     {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                       <label key={rate} className="custom-rating-item">
//                         <input
//                           type="radio"
//                           name={`rating-${index}`}
//                           value={rate}
//                           checked={formData[index] === rate}
//                           onChange={() => handleRatingChange(index, rate)}
//                         />
//                         <span className="custom-rating-label">{rate}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : null}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button">
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SharedFormPreview;








// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   const { title, fields } = form;

//   const handleChange = (index, event) => {
//     const newFormData = { ...formData };
//     newFormData[index] = event.target.value;
//     setFormData(newFormData);
//   };

//   const handleRatingChange = (index, value) => {
//     const newFormData = { ...formData };
//     newFormData[index] = Number(value); // the rating is a number
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field, index) => {
//         const value = formData[index] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   return (
//     <div className="custom-shared-form-preview-wrapper">
//       <div className="custom-form-background"></div>
//       <div className="custom-shared-form-preview-container">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title">{title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form">
//           <div className="custom-form-row">
//             {fields.map((field, index) => (
//               <div key={index} className="custom-form-group">
//                 <label className="custom-form-label">
//                   {field.label}
//                   {field.required && <span className="custom-required">*</span>}
//                 </label>
//                 {field.type === 'text' ? (
//                   <input
//                     className="custom-form-input"
//                     type="text"
//                     placeholder={field.placeholder}
//                     required={field.required}
//                     value={formData[index] || ''}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 ) : field.type === 'question' ? (
//                   <div className="custom-rating-scale">
//                     {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                       <label key={rate} className="custom-rating-item">
//                         <input
//                           type="radio"
//                           name={`rating-${index}`}
//                           value={rate}
//                           checked={formData[index] === rate}
//                           onChange={() => handleRatingChange(index, rate)}
//                         />
//                         <span className="custom-rating-label">{rate}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : null}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button">
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SharedFormPreview;












// ///////my tamplate 

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   const { title, fields } = form;

//   const handleChange = (index, event) => {
//     const newFormData = { ...formData };
//     newFormData[index] = event.target.value;
//     setFormData(newFormData);
//   };

//   const handleRatingChange = (index, value) => {
//     const newFormData = { ...formData };
//     newFormData[index] = Number(value); //  the rating is a number
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field, index) => {
//         const value = formData[index] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   return (
//     <div className="custom-shared-form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <h2 className="custom-form-title">{title}</h2>
//       <form onSubmit={handleSubmit} className="custom-form">
//         <div className="custom-form-row">
//           {fields.map((field, index) => (
//             <div key={index} className="custom-form-group">
//               <label className="custom-form-label">
//                 {field.label}
//                 {field.required && <span className="custom-required">*</span>}
//               </label>
//               {field.type === 'text' ? (
//                 <input
//                   className="custom-form-input"
//                   type="text"
//                   placeholder={field.placeholder}
//                   required={field.required}
//                   value={formData[index] || ''}
//                   onChange={(e) => handleChange(index, e)}
//                 />
//               ) : field.type === 'question' ? (
//                 <div className="custom-rating-scale">
//                   {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                     <label key={rate} className="custom-rating-item">
//                       <input
//                         type="radio"
//                         name={`rating-${index}`}
//                         value={rate}
//                         checked={formData[index] === rate}
//                         onChange={() => handleRatingChange(index, rate)}
//                       />
//                       {rate}
//                     </label>
//                   ))}
//                 </div>
//               ) : null}
//             </div>
//           ))}
//         </div>
//         <button type="submit" className="custom-form-submit-button">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SharedFormPreview;













///////////good without tamplate 




// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './SharedFormPreview.css';

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   const { title, fields } = form;

//   const handleChange = (index, event) => {
//     const newFormData = { ...formData };
//     newFormData[index] = event.target.value;
//     setFormData(newFormData);
//   };

//   const handleRatingChange = (index, value) => {
//     const newFormData = { ...formData };
//     newFormData[index] = Number(value); //  the rating is a number
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field, index) => {
//         const value = formData[index] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       toast.success('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       toast.error('Failed to submit form');
//     }
//   };

//   return (
//     <div className="shared-form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <h2>{title}</h2>
//       <form onSubmit={handleSubmit}>
//         {fields.map((field, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {field.label}
//               {field.required && <span className="required">*</span>}
//             </label>
//             {field.type === 'text' ? (
//               <input
//                 type="text"
//                 placeholder={field.placeholder}
//                 required={field.required}
//                 value={formData[index] || ''}
//                 onChange={(e) => handleChange(index, e)}
//               />
//             ) : field.type === 'question' ? (
//               <div className="rating-scale">
//                 {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                   <label key={rate}>
//                     <input
//                       type="radio"
//                       name={`rating-${index}`}
//                       value={rate}
//                       checked={formData[index] === rate}
//                       onChange={() => handleRatingChange(index, rate)}
//                     />
//                     {rate}
//                   </label>
//                 ))}
//               </div>
//             ) : null}
//           </div>
//         ))}
//         <button type="submit" className="form-preview-submit-button">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SharedFormPreview;








///////send to backend good


// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './SharedFormPreview.css';

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data);
//         setForm(response.data);
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   const { title, fields } = form;

//   const handleChange = (index, event) => {
//     const newFormData = { ...formData };
//     newFormData[index] = event.target.value;
//     setFormData(newFormData);
//   };

//   const handleRatingChange = (index, value) => {
//     const newFormData = { ...formData };
//     newFormData[index] = Number(value); // Ensure the rating is a number
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field, index) => {
//         const value = formData[index] || '';
//         if (field.type === 'question') {
//           return { ...field, rating: Number(value) }; // Convert rating to a number
//         }
//         return { ...field, value };
//       }),
//     };

//     console.log('Submitting data:', submissionData);

//     try {
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data);
//       alert('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//       alert('Failed to submit form');
//     }
//   };

//   return (
//     <div className="shared-form-preview-container">
//       <h2>{title}</h2>
//       <form onSubmit={handleSubmit}>
//         {fields.map((field, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {field.label}
//               {field.required && <span className="required">*</span>}
//             </label>
//             {field.type === 'text' ? (
//               <input
//                 type="text"
//                 placeholder={field.placeholder}
//                 required={field.required}
//                 value={formData[index] || ''}
//                 onChange={(e) => handleChange(index, e)}
//               />
//             ) : field.type === 'question' ? (
//               <div className="rating-scale">
//                 {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                   <label key={rate}>
//                     <input
//                       type="radio"
//                       name={`rating-${index}`}
//                       value={rate}
//                       checked={formData[index] === rate}
//                       onChange={() => handleRatingChange(index, rate)}
//                     />
//                     {rate}
//                   </label>
//                 ))}
//               </div>
//             ) : null}
//           </div>
//         ))}
//         <button type="submit" className="form-preview-submit-button">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SharedFormPreview;








///////sund shear but not post 

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './SharedFormPreview.css';

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         console.log(`Fetching form data for formId: ${formId}`); // Debug log
//         // const response = await axios.get(`http://localhost:5000/api/form-structure/${formId}`);
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/form-structure/${formId}`);
//         console.log('Form data fetched successfully:', response.data); // Debug log
//         setForm(response.data);
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   if (!form) { 
//     return <div>Loading...</div>;
//   }

//   const { title, fields } = form;

//   const handleChange = (index, event) => {
//     const newFormData = { ...formData };
//     newFormData[index] = event.target.value;
//     setFormData(newFormData);
//   };

//   const handleRatingChange = (index, value) => {
//     const newFormData = { ...formData };
//     newFormData[index] = Number(value); // Ensure the rating is a number
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field, index) => ({
//         ...field,
//         value: formData[index] || '',
//       })),
//     };
//     console.log('Submitting data:', submissionData); // Add this line to log the data

//     try {
//       // const response = await axios.post('http://localhost:5000/api/saveSharedEvaluatorForm', submissionData);
//       const response = await axios.post('http://localhost:5000/api/evaluationForms/shared-evaluator-form', submissionData);
//       console.log('Response from server:', response.data); // Add this line to log the server response
//       alert('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data); // Add this line to log the server error response
//       alert('Failed to submit form');
//     }
//   };

//   return (
//     <div className="shared-form-preview-container"> 
//       <h2>{title}</h2>
//       <form onSubmit={handleSubmit}>
//         {fields.map((field, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {field.label}
//               {field.required && <span className="required">*</span>}
//             </label>
//             {field.type === 'text' ? (
//               <input
//                 type="text"
//                 placeholder={field.placeholder}
//                 required={field.required}
//                 value={formData[index] || ''}
//                 onChange={(e) => handleChange(index, e)}
//               />
//             ) : field.type === 'question' ? (
//               <div className="rating-scale">
//                 {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                   <label key={rate}>
//                     <input
//                       type="radio"
//                       name={`rating-${index}`}
//                       value={rate}
//                       checked={formData[index] === rate}
//                       onChange={() => handleRatingChange(index, rate)}
//                     />
//                     {rate}
//                   </label>
//                 ))}
//               </div>
//             ) : null}
//           </div>
//         ))}
//         <button type="submit" className="form-preview-submit-button">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SharedFormPreview;














// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './SharedFormPreview.css';

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/form-structure/${formId}`);
//         setForm(response.data);
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   const { title, fields } = form;

//   const handleChange = (index, event) => {
//     const newFormData = { ...formData };
//     newFormData[index] = event.target.value;
//     setFormData(newFormData);
//   };

//   const handleRatingChange = (index, value) => {
//     const newFormData = { ...formData };
//     newFormData[index] = Number(value); // Ensure the rating is a number
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field, index) => ({
//         ...field,
//         value: formData[index] || '',
//       })),
//     };
//     console.log('Submitting data:', submissionData); // Add this line to log the data

//     try {
//       const response = await axios.post('http://localhost:5000/api/saveSharedEvaluatorForm', submissionData);
//       console.log('Response from server:', response.data); // Add this line to log the server response
//       alert('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data); // Add this line to log the server error response
//       alert('Failed to submit form');
//     }
//   };

//   return (
//     <div className="shared-form-preview-container"> 
//       <h2>{title}</h2>
//       <form onSubmit={handleSubmit}>
//         {fields.map((field, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {field.label}
//               {field.required && <span className="required">*</span>}
//             </label>
//             {field.type === 'text' ? (
//               <input
//                 type="text"
//                 placeholder={field.placeholder}
//                 required={field.required}
//                 value={formData[index] || ''}
//                 onChange={(e) => handleChange(index, e)}
//               />
//             ) : field.type === 'question' ? (
//               <div className="rating-scale">
//                 {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                   <label key={rate}>
//                     <input
//                       type="radio"
//                       name={`rating-${index}`}
//                       value={rate}
//                       checked={formData[index] === rate}
//                       onChange={() => handleRatingChange(index, rate)}
//                     />
//                     {rate}
//                   </label>
//                 ))}
//               </div>
//             ) : null}
//           </div>
//         ))}
//         <button type="submit" className="form-preview-submit-button">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SharedFormPreview;







/////////////////////bf 3 in 1 






// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './SharedFormPreview.css';

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/formStructures/${formId}`);
//         setForm(response.data);
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   const { title, fields } = form;

//   const handleChange = (index, event) => {
//     const newFormData = { ...formData };
//     newFormData[index] = event.target.value;
//     setFormData(newFormData);
//   };

//   const handleRatingChange = (index, value) => {
//     const newFormData = { ...formData };
//     newFormData[index] = Number(value); // Ensure the rating is a number
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const submissionData = {
//       title: form.title,
//       fields: form.fields.map((field, index) => ({
//         ...field,
//         value: formData[index] || '',
//       })),
//     };
//     console.log('Submitting data:', submissionData); // Add this line to log the data

//     try {
//       const response = await axios.post('http://localhost:5000/api/saveSharedEvaluatorForm', submissionData);
//       console.log('Response from server:', response.data); // Add this line to log the server response
//       alert('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data); // Add this line to log the server error response
//       alert('Failed to submit form');
//     }
//   };

//   return (
//     <div className="shared-form-preview-container"> 
//       <h2>{title}</h2>
//       <form onSubmit={handleSubmit}>
//         {fields.map((field, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {field.label}
//               {field.required && <span className="required">*</span>}
//             </label>
//             {field.type === 'text' ? (
//               <input
//                 type="text"
//                 placeholder={field.placeholder}
//                 required={field.required}
//                 value={formData[index] || ''}
//                 onChange={(e) => handleChange(index, e)}
//               />
//             ) : field.type === 'question' ? (
//               <div className="rating-scale">
//                 {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                   <label key={rate}>
//                     <input
//                       type="radio"
//                       name={`rating-${index}`}
//                       value={rate}
//                       checked={formData[index] === rate}
//                       onChange={() => handleRatingChange(index, rate)}
//                     />
//                     {rate}
//                   </label>
//                 ))}
//               </div>
//             ) : null}
//           </div>
//         ))}
//         <button type="submit" className="form-preview-submit-button">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SharedFormPreview;










// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './SharedFormPreview.css';

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/formStructures/${formId}`);
//         setForm(response.data);
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   const { title, fields } = form;

//   const handleChange = (index, event) => {
//     const newFormData = { ...formData };
//     newFormData[index] = event.target.value;
//     setFormData(newFormData);
//   };

//   const handleRatingChange = (index, value) => {
//     const newFormData = { ...formData };
//     newFormData[index] = value;
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/saveSharedEvaluatorForm', {
//         title: form.title,
//         fields: form.fields.map((field, index) => ({
//           ...field,
//           value: formData[index] || '',
//         })),
//       });
//       alert('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('Failed to submit form');
//     }
//   };

//   return (
//     <div className="shared-form-preview-container">
//       <h2>{title}</h2>
//       <form onSubmit={handleSubmit}>
//         {fields.map((field, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {field.label}
//               {field.required && <span className="required">*</span>}
//             </label>
//             {field.type === 'text' ? (
//               <input
//                 type="text"
//                 placeholder={field.placeholder}
//                 required={field.required}
//                 value={formData[index] || ''}
//                 onChange={(e) => handleChange(index, e)}
//               />
//             ) : field.type === 'question' ? (
//               <div className="rating-scale">
//                 {Array.from({ length: 10 }, (_, i) => i + 1).reverse().map((rate) => (
//                   <label key={rate}>
//                     <input
//                       type="radio"
//                       name={`rating-${index}`}
//                       value={rate}
//                       checked={formData[index] === rate}
//                       onChange={() => handleRatingChange(index, rate)}
//                     />
//                     {rate}
//                   </label>
//                 ))}
//               </div>
//             ) : null}
//           </div>
//         ))}
//         <button type="submit" className="form-preview-submit-button">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SharedFormPreview;














///////////////shear work but not send data bin backend 



// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './SharedFormPreview.css';

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/formStructures/${formId}`);
//         setForm(response.data);
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchForm();
//   }, [formId]);

//   if (!form) {
//     return <div>Loading...</div>;
//   }

//   const { title, fields } = form;

//   return (
//     <div className="shared-form-preview-container">
//       <h2>{title}</h2>
//       <form>
//         {fields.map((field, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {field.label}
//               {field.required && <span className="required">*</span>}
//             </label>
//             {field.type === 'text' ? (
//               <input
//                 type="text"
//                 placeholder={field.placeholder}
//                 required={field.required}
//               />
//             ) : field.type === 'question' ? (
//               <div className="rating-scale">
//                 {field.rating.map((rate, rateIndex) => (
//                   <span
//                     key={rateIndex}
//                     className={`rating-item rating-${rate.value}`}
//                   >
//                     {rate.value}
//                   </span>
//                 ))}
//               </div>
//             ) : null}
//           </div>
//         ))}
//         <button type="submit" className="form-preview-submit-button">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SharedFormPreview;













// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './EvaluatorFormPreview.css';
// import axios from 'axios';

// const RatingComponent = ({ rating, onRatingChange }) => (
//   <div className="rating-scale">
//     {Array.isArray(rating) && rating.map((rate, index) => (
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

// const SharedFormPreview = () => {
//   const { formId } = useParams();
//   const navigate = useNavigate();
//   const [formElements, setFormElements] = useState([]);
//   const [formTitle, setFormTitle] = useState('');

//   useEffect(() => {
//     const fetchFormData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/evaluationForms/${formId}`);
//         const form = response.data;
//         setFormElements(form.fields);
//         setFormTitle(form.title);
//       } catch (error) {
//         toast.error('Error fetching form data');
//         navigate('/evaluator-dashboard');
//       }
//     };

//     fetchFormData();
//   }, [formId, navigate]);

//   const handleInputChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//   };

//   const handleRatingChange = (label, ratingIndex) => {
//     const updatedRatings = formValues[label].map((rate, index) => ({
//       ...rate,
//       selected: index === ratingIndex,
//     }));
//     handleInputChange(label, updatedRatings);
//   };

//   if (!formElements.length) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
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
//               {element.staticName === 'Name of the startup' ? (
//                 <input
//                   type="text"
//                   placeholder={element.placeholder}
//                   required={element.required}
//                   style={{ width: '100%' }}
//                 />
//               ) : element.type === 'text' ? (
//                 <input
//                   type="text"
//                   placeholder={element.placeholder}
//                   required={element.required}
//                 />
//               ) : element.type === 'question' ? (
//                 <RatingComponent
//                   rating={element.rating}
//                   onRatingChange={(ratingIndex) =>
//                     handleRatingChange(element.label, ratingIndex)
//                   }
//                 />
//               ) : null}
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

// export default SharedFormPreview;
