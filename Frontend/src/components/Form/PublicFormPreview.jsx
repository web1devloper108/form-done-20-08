import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2'; // Import the PhoneInput component
import 'react-phone-input-2/lib/style.css'; // Import the CSS for react-phone-input-2
import './PublicFormPreview.css';
import { FaInfoCircle } from 'react-icons/fa';

const PublicFormPreview = () => {
  const { formId } = useParams();
  const [formStructure, setFormStructure] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDuplicateSubmission, setIsDuplicateSubmission] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchFormStructure = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
        const data = await response.json();
        setFormStructure(data);
        setFormValues(
          data.fields.reduce((acc, field) => {
            acc[field.label] = field.type === 'multiselect' ? [] : '';
            return acc;
          }, {})
        );
      } catch (error) {
        console.error('Error fetching shared form:', error);
      }
    };

    fetchFormStructure();
  }, [formId]);

  const handleChange = (label, value) => {
    const field = formStructure.fields.find(f => f.label === label);
    if (field && (!field.maxLength || value.length <= field.maxLength)) {
      setFormValues((prevValues) => ({
        ...prevValues,
        [label]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [label]: field.required && value.length < field.minLength,
      }));
    }
  };

  const handleCheckboxChange = (label, option) => {
    const field = formStructure.fields.find(f => f.label === label);
    const selectedOptions = formValues[label];
    let newSelectedOptions = [];

    if (selectedOptions.includes(option)) {
      newSelectedOptions = selectedOptions.filter((item) => item !== option);
    } else if (selectedOptions.length < field.maxSelect) {
      newSelectedOptions = [...selectedOptions, option];
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [label]: newSelectedOptions,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [label]: field.required && newSelectedOptions.length === 0,
    }));
  };

  const handleFileChange = (label, file) => {
    if (file) {
      if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
      } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
        alert('Please upload a PNG or JPG file.');
      } else {
        const currentDateTime = new Date().toLocaleString(); // Get the current date and time as a string

        setFiles((prevFiles) => {
          // Filter out any existing file with the same label
          const filteredFiles = prevFiles.filter(f => f.label !== label);
          // Add the new file with the current date and time
          return [
            ...filteredFiles,
            { label, file, uploadedAt: currentDateTime },
          ];
        });
        setFormValues((prevValues) => ({
          ...prevValues,
          [label]: `${file.name} (uploaded at ${currentDateTime})`, // Include the upload time in the form values
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          [label]: false,
        }));
      }
    }
  };

  const submitForm = async (formId, responses) => {
    const formData = new FormData();
    formData.append('formId', formId);
    formData.append('responses', JSON.stringify(responses));

    files.forEach((fileWrapper) => {
      formData.append('files', fileWrapper.file); // Corrected to append files
    });

    try {
      const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error submitting form:', errorData.error);
        if (errorData.error === 'Form is already submitted for this email.') {
          setIsDuplicateSubmission(true);
        } else {
          setIsError(true);
        }
        throw new Error(errorData.error);
      } else {
        console.log('Form submitted successfully');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsError(true); // Correct error handling
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasError = false;

    for (const field of formStructure.fields) {
      if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
        newErrors[field.label] = true;
        hasError = true;
      }

      if (field.type === 'multiselect' && formValues[field.label].length === 0) {
        newErrors[field.label] = true;
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await submitForm(formId, formValues);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClearForm = () => {
    setFormValues(
      formStructure.fields.reduce((acc, field) => {
        acc[field.label] = field.type === 'multiselect' ? [] : '';
        return acc;
      }, {})
    );
    setFiles([]);
    setErrors({});
  };

  if (!formStructure) {
    return <div>Loading form...</div>;
  }

  if (isDuplicateSubmission) {
    return (
      <div className="response-page-publicformpreview">
        <div className="response-message-container-publicformpreview">
          <h1 className="response-title-publicformpreview">You've already responded</h1>
          <p className="response-text-publicformpreview">Thanks for submitting your contact info!</p>
          <p className="response-text-publicformpreview">You can only fill in this form once.</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="response-page-publicformpreview">
        <div className="response-message-container-publicformpreview">
          <h1 className="response-title-publicformpreview">You've already responded</h1>
          <p className="response-text-publicformpreview">Thanks for submitting your information!</p>
          <p className="response-text-publicformpreview">You can only fill in this form once.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-background-publicformpreview">
      {isSubmitted ? (
        <div className="thank-you-message-publicformpreview">
          <div className="icon-container-publicformpreview">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fillRule="evenodd">
                <g transform="translate(1 1)" fillRule="nonzero">
                  <path
                    d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
                    fill="#EFF6FF"
                  />
                  <path
                    d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
                    fill="#EFF6FF"
                  />
                  <path
                    d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
                    fill="#1E88E5"
                  />
                </g>
              </g>
            </svg>
          </div>
          <h2>Thank you for your submission!</h2>
        </div>
      ) : (
        <div className="custom-public-form-preview-publicformpreview">
          <div className="header-publicformpreview">
            <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
            <div className="header-text-publicformpreview">
              <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
              <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
            </div>
          </div>
          <hr />
          <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
          <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
            <div className="custom-form-row-publicformpreview">
              {formStructure.fields.map((field, index) => (
                <div key={index} className="custom-form-group-publicformpreview">
                  <label className="custom-form-label-publicformpreview">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      className="custom-form-input-publicformpreview"
                      value={formValues[field.label]}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Select...</option>
                      {field.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'multiselect' ? (
                    field.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="checkbox-group-publicformpreview">
                        <input
                          type="checkbox"
                          id={`${field.label}-${optionIndex}`}
                          value={option}
                          checked={formValues[field.label].includes(option)}
                          onChange={() => handleCheckboxChange(field.label, option)}
                          disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
                        />
                        <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
                      </div>
                    ))
                  ) : field.type === 'radio' ? (
                    field.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="radio-group-publicformpreview">
                        <input
                          type="radio"
                          id={`${field.label}-${optionIndex}`}
                          name={field.label}
                          value={option}
                          checked={formValues[field.label] === option}
                          onChange={(e) => handleChange(field.label, e.target.value)}
                          required={field.required}
                        />
                        <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '14px' }}>{option}</label>
                      </div>
                    ))
                  ) : field.type === 'file' ? (
                    <input
                      className="custom-form-input-publicformpreview"
                      type="file"
                      onChange={(e) => handleFileChange(field.label, e.target.files[0])}
                      required={field.required}
                    />
                  ) : field.type === 'phone' ? ( 
                    // Change applied to set the default country to India (+91)
                    <PhoneInput
                      country={'in'} // <-- Default country changed to 'in' (India)
                      value={formValues[field.label]}
                      onChange={(value) => handleChange(field.label, value)}
                      inputClass="custom-form-input-publicformpreview" // Match the class name
                      required={field.required}
                    />
                  ) : (
                    <input
                      className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formValues[field.label]}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      required={field.required}
                      maxLength={field.maxLength || undefined}
                    />
                  )}
                  {errors[field.label] && (
                    <div className="error-message-publicformpreview">
                      <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
                    </div>
                  )}
                  {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
                    <div className="character-limit-publicformpreview">
                      {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
                      {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="form-buttons-publicformpreview">
              <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{ width: '22%', border: 'none', borderRadius: '4px', fontSize: '13px', padding: '10px' }}>Submit</button>
              <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PublicFormPreview;









////////contact number default usa +1

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import PhoneInput from 'react-phone-input-2'; // Import the PhoneInput component
// import 'react-phone-input-2/lib/style.css'; // Import the CSS for react-phone-input-2
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isDuplicateSubmission, setIsDuplicateSubmission] = useState(false);
//   const [isError, setIsError] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         const currentDateTime = new Date().toLocaleString(); // Get the current date and time as a string

//         setFiles((prevFiles) => {
//           // Filter out any existing file with the same label
//           const filteredFiles = prevFiles.filter(f => f.label !== label);
//           // Add the new file with the current date and time
//           return [
//             ...filteredFiles,
//             { label, file, uploadedAt: currentDateTime },
//           ];
//         });
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: `${file.name} (uploaded at ${currentDateTime})`, // Include the upload time in the form values
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append('files', fileWrapper.file); // Corrected to append files
//     });

//     try {
//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error submitting form:', errorData.error);
//         if (errorData.error === 'Form is already submitted for this email.') {
//           setIsDuplicateSubmission(true);
//         } else {
//           setIsError(true);
//         }
//         throw new Error(errorData.error);
//       } else {
//         console.log('Form submitted successfully');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setIsError(true); // Correct error handling
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       await submitForm(formId, formValues);
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   if (isDuplicateSubmission) {
//     return (
//       <div className="response-page-publicformpreview">
//         <div className="response-message-container-publicformpreview">
//           <h1 className="response-title-publicformpreview">You've already responded</h1>
//           <p className="response-text-publicformpreview">Thanks for submitting your contact info!</p>
//           <p className="response-text-publicformpreview">You can only fill in this form once.</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="response-page-publicformpreview">
//         <div className="response-message-container-publicformpreview">
//           <h1 className="response-title-publicformpreview">You've already responded</h1>
//           <p className="response-text-publicformpreview">Thanks for submitting your information!</p>
//           <p className="response-text-publicformpreview">You can only fill in this form once.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '14px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : field.type === 'phone' ? ( // Add phone number input
//                     <PhoneInput
//                       country={'us'}
//                       value={formValues[field.label]}
//                       onChange={(value) => handleChange(field.label, value)}
//                       inputClass="custom-form-input-publicformpreview" // Match the class name
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{ width: '22%', border: 'none', borderRadius: '4px', fontSize: '13px', padding: '10px' }}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Tested ok for reSubmit
///////b 5/ 8/ 24    back work and frontend both work on resubmit same  email se not entry different email se entry yet 
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isDuplicateSubmission, setIsDuplicateSubmission] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         const currentDateTime = new Date().toLocaleString(); // Get the current date and time as a string
  
//         setFiles((prevFiles) => {
//           // Filter out any existing file with the same label
//           const filteredFiles = prevFiles.filter(f => f.label !== label);
//           // Add the new file with the current date and time
//           return [
//             ...filteredFiles,
//             { label, file, uploadedAt: currentDateTime },
//           ];
//         });
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: `${file.name} (uploaded at ${currentDateTime})`, // Include the upload time in the form values
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };
  

//   // HIGHLIGHT START: Function to submit form data to backend
//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append('files', fileWrapper.file); // Corrected to append files
//     });

//     try {
//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error submitting form:', errorData.error);
//         if (errorData.error === 'Form is already submitted for this email.') {
//           setIsDuplicateSubmission(true);
//         }
//         throw new Error(errorData.error);
//       } else {
//         console.log('Form submitted successfully');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       throw new Error(error.message); // Correct error handling
//     }
//   };
//   // HIGHLIGHT END

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       // console.error('Error submitting form:', error);
//       toast.error(`Error submitting form: ${error.message}`);
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   // HIGHLIGHT START: Show full-page message for duplicate submission
//   if (isDuplicateSubmission) {
//     return (
//       <div className="response-page-publicformpreview">
//         <div className="response-message-container-publicformpreview">
//           <h1 className="response-title-publicformpreview">You've already responded</h1>
//           <p className="response-text-publicformpreview">Thanks for submitting your contact info!</p>
//           <p className="response-text-publicformpreview">You can only fill in this form once.</p>
//         </div>
//       </div>
//     );
//   }
//   // HIGHLIGHT END
// //   // HIGHLIGHT START: Show full-page message for duplicate submission
//   if (isDuplicateSubmission) {
//     return (
//       <div className="response-page-publicformpreview">
//         <div className="response-message-container-publicformpreview">
//           <h1 className="response-title-publicformpreview">You've already responded</h1>
//           <p className="response-text-publicformpreview">Thanks for submitting your contact info!</p>
//           <p className="response-text-publicformpreview">You can only fill in this form once.</p>
//         </div>
//       </div>
//     );
//   }
// //   // HIGHLIGHT END
//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '14px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;





















//////////all work re submit (alternate )
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isDuplicateSubmission, setIsDuplicateSubmission] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         const currentDateTime = new Date().toLocaleString(); // Get the current date and time as a string
  
//         setFiles((prevFiles) => {
//           // Filter out any existing file with the same label
//           const filteredFiles = prevFiles.filter(f => f.label !== label);
//           // Add the new file with the current date and time
//           return [
//             ...filteredFiles,
//             { label, file, uploadedAt: currentDateTime },
//           ];
//         });
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: `${file.name} (uploaded at ${currentDateTime})`, // Include the upload time in the form values
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   // HIGHLIGHT START: Function to submit form data to backend
//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append('files', fileWrapper.file); // Corrected to append files
//     });

//     try {
//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error submitting form:', errorData.error);
//         if (errorData.error === 'Form is already submitted for this email.') {
//           setIsDuplicateSubmission(true);
//         }
//         throw new Error(errorData.error);
//       } else {
//         console.log('Form submitted successfully');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       throw new Error(error.message); // Correct error handling
//     }
//   };
//   // HIGHLIGHT END

//   // HIGHLIGHT START: Corrected email uniqueness check
//   const checkEmailUniqueness = async (email) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/form-submissions/${formId}`);
//       if (response.ok) {
//         const submissions = await response.json();
//         return submissions.some(submission => submission.formData['Email'] === email); // Access object properties directly
//       } else {
//         console.error('Error fetching submissions:', response.statusText);
//         return false;
//       }
//     } catch (error) {
//       console.error('Error checking email uniqueness:', error);
//       return false;
//     }
//   };
//   // HIGHLIGHT END

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     // HIGHLIGHT START: Check email uniqueness before submission
//     const email = formValues['Email'];
//     if (await checkEmailUniqueness(email)) {
//       toast.error('This email has already been used to submit the form.');
//       return;
//     }
//     // HIGHLIGHT END

//     try {
//       await submitForm(formId, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       // console.error('Error submitting form:', error);
//       toast.error(`Error submitting form: ${error.message}`);
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   // HIGHLIGHT START: Show full-page message for duplicate submission
//   if (isDuplicateSubmission) {
//     return (
//       <div className="response-page-publicformpreview">
//         <div className="response-message-container-publicformpreview">
//           <h1 className="response-title-publicformpreview">You've already responded</h1>
//           <p className="response-text-publicformpreview">Thanks for submitting your contact info!</p>
//           <p className="response-text-publicformpreview">You can only fill in this form once.</p>
//         </div>
//       </div>
//     );
//   }
//   // HIGHLIGHT END

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '14px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;











//////////all good only error in file message not show in new page before 4/8/23


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isDuplicateSubmission, setIsDuplicateSubmission] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         const currentDateTime = new Date().toLocaleString(); // Get the current date and time as a string
  
//         setFiles((prevFiles) => {
//           // Filter out any existing file with the same label
//           const filteredFiles = prevFiles.filter(f => f.label !== label);
//           // Add the new file with the current date and time
//           return [
//             ...filteredFiles,
//             { label, file, uploadedAt: currentDateTime },
//           ];
//         });
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: `${file.name} (uploaded at ${currentDateTime})`, // Include the upload time in the form values
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };
  

//   // HIGHLIGHT START: Function to submit form data to backend
//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append('files', fileWrapper.file); // Corrected to append files
//     });

//     try {
//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error submitting form:', errorData.error);
//         if (errorData.error === 'Form is already submitted for this email.') {
//           setIsDuplicateSubmission(true);
//         }
//         throw new Error(errorData.error);
//       } else {
//         console.log('Form submitted successfully');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       throw new Error(error.message); // Correct error handling
//     }
//   };
//   // HIGHLIGHT END

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       // console.error('Error submitting form:', error);
//       toast.error(`Error submitting form: ${error.message}`);
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   // HIGHLIGHT START: Show full-page message for duplicate submission
//   if (isDuplicateSubmission) {
//     return (
//       <div className="response-page-publicformpreview">
//         <div className="response-message-container-publicformpreview">
//           <h1 className="response-title-publicformpreview">You've already responded</h1>
//           <p className="response-text-publicformpreview">Thanks for submitting your contact info!</p>
//           <p className="response-text-publicformpreview">You can only fill in this form once.</p>
//         </div>
//       </div>
//     );
//   }
//   // HIGHLIGHT END
// //   // HIGHLIGHT START: Show full-page message for duplicate submission
//   // if (isDuplicateSubmission) {
//   //   return (
//   //     <div className="response-page-publicformpreview">
//   //       <div className="response-message-container-publicformpreview">
//   //         <h1 className="response-title-publicformpreview">You've already responded</h1>
//   //         <p className="response-text-publicformpreview">Thanks for submitting your contact info!</p>
//   //         <p className="response-text-publicformpreview">You can only fill in this form once.</p>
//   //       </div>
//   //     </div>
//   //   );
//   // }
// //   // HIGHLIGHT END
//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '14px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;















///////bef test navi
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isDuplicateSubmission, setIsDuplicateSubmission] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   // HIGHLIGHT START: Function to submit form data to backend
//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append('files', fileWrapper.file); // Corrected to append files
//     });

//     try {
//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error submitting form:', errorData.error);
//         if (errorData.error === 'Form is already submitted for this email.') {
//           setIsDuplicateSubmission(true);
//         }
//         throw new Error(errorData.error);
//       } else {
//         console.log('Form submitted successfully');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       throw new Error(error.message); // Correct error handling
//     }
//   };
//   // HIGHLIGHT END

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error(`Error submitting form: ${error.message}`);
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   // HIGHLIGHT START: Show full-page message for duplicate submission
//   if (isDuplicateSubmission) {
//     return (
//       <div className="response-page-publicformpreview">
//         <div className="response-message-container-publicformpreview">
//           <h1 className="response-title-publicformpreview">You've already responded</h1>
//           <p className="response-text-publicformpreview">Thanks for submitting your contact info!</p>
//           <p className="response-text-publicformpreview">You can only fill in this form once.</p>
//         </div>
//       </div>
//     );
//   }
//   // HIGHLIGHT END

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '14px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;
























///////////////////b 3/8 
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isDuplicateSubmission, setIsDuplicateSubmission] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   // HIGHLIGHT START: Function to submit form data to backend
//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append('files', fileWrapper.file); // Corrected to append files
//     });

//     try {
//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error submitting form:', errorData.error);
//         if (errorData.error === 'Form is already submitted for this email.') {
//           setIsDuplicateSubmission(true);
//         }
//         throw new Error(errorData.error);
//       } else {
//         console.log('Form submitted successfully');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       throw new Error(error.message); // Correct error handling
//     }
//   };
//   // HIGHLIGHT END

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error(`Error submitting form: ${error.message}`);
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   // HIGHLIGHT START: Show full-page message for duplicate submission
//   if (isDuplicateSubmission) {
//     return (
//       <div className="response-page-publicformpreview">
//         <div className="response-message-container-publicformpreview">
//           <h1 className="response-title-publicformpreview">You've already responded</h1>
//           <p className="response-text-publicformpreview">Thanks for submitting your contact info!</p>
//           <p className="response-text-publicformpreview">You can only fill in this form once.</p>
//         </div>
//       </div>
//     );
//   }
//   // HIGHLIGHT END

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '14px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;







// //////good css on new page   already submit response 
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isDuplicateSubmission, setIsDuplicateSubmission] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Error submitting form:', errorData.error);
//       if (errorData.error === 'Form is already submitted for this email.') {
//         setIsDuplicateSubmission(true);
//       }
//       throw new Error(errorData.error);
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error(`Error submitting form: ${error.message}`);
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   // HIGHLIGHT START: Show full-page message for duplicate submission
//   if (isDuplicateSubmission) {
//     return (
//       <div className="response-page-publicformpreview">
//         <div className="response-message-container-publicformpreview">
//           <h1 className="response-title-publicformpreview">You've already responded</h1>
//           <p className="response-text-publicformpreview">Thanks for submitting your contact info!</p>
//           <p className="response-text-publicformpreview">You can only fill in this form once.</p>
//         </div>
//       </div>
//     );
//   }
//   // HIGHLIGHT END

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '14px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;














/////////////already submitted in new page 
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   // HIGHLIGHT START: New state for duplicate submission
//   const [isDuplicateSubmission, setIsDuplicateSubmission] = useState(false);
//   // HIGHLIGHT END

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Error submitting form:', errorData.error);
//       if (errorData.error === 'Form is already submitted for this email.') {
//         // HIGHLIGHT START: Set state for duplicate submission
//         setIsDuplicateSubmission(true);
//         // HIGHLIGHT END
//       }
//       throw new Error(errorData.error);
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error(`Error submitting form: ${error.message}`);
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   // HIGHLIGHT START: Show full-page message for duplicate submission
//   if (isDuplicateSubmission) {
//     return (
//       <div style={{ textAlign: 'center', marginTop: '20%', fontSize: '24px' }}>
//         <h1>You've already responded</h1>
//         <p>Thanks for submitting your contact info!</p>
//         <p>You can only fill in this form once.</p>
//       </div>
//     );
//   }
//   // HIGHLIGHT END

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;

















// ///////////before 02/ 07 /2024

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Error submitting form:', errorData.error);
//       throw new Error(errorData.error);
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error(`Error submitting form: ${error.message}`);
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;







/////npot all only some me work kar raha hai 31/07

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Error submitting form:', errorData.error);
//       throw new Error(errorData.error);
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error(`Error submitting form: ${error.message}`);
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;












// regular name and email only already work  but file me not save 


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Error submitting form:', errorData.error);
//       throw new Error(errorData.error);
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error(`Error submitting form: ${error.message}`);
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? ( // Added condition for radio type fields
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={() => handleClearForm()}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;





















////////////////no already save 

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('Error submitting form');
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? ( // Added condition for radio type fields
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={handleClearForm}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;













////////////before email must 29/7
/////////name came in frintend



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [userName, setUserName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, userName, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('userName', userName);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('Error submitting form');
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, userName, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setUserName('');
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               <div className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">User Name</label>
//                 <input
//                   type="text"
//                   className={`custom-form-input-publicformpreview ${errors.userName ? 'error-publicformpreview' : ''}`}
//                   placeholder="Enter your name"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   required
//                 />
//                 {errors.userName && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? ( // Added condition for radio type fields
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={handleClearForm}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;
















/////////already submitted work email came backend but not name came 



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [email, setEmail] = useState('');
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, email, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('email', email);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('Error submitting form');
//       throw new Error('Error submitting form');
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, email, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       if (error.message === 'Error submitting form') {
//         toast.error('You have already submitted this form.');
//       } else {
//         toast.error('Error submitting form');
//       }
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setEmail('');
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               <div className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">Email</label>
//                 <input
//                   type="email"
//                   className={`custom-form-input-publicformpreview ${errors.email ? 'error-publicformpreview' : ''}`}
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//                 {errors.email && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? ( // Added condition for radio type fields
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={handleClearForm}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;



















////////////before email must 29/7



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [userName, setUserName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, userName, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('userName', userName);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('Error submitting form');
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, userName, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setUserName('');
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               <div className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">User Name</label>
//                 <input
//                   type="text"
//                   className={`custom-form-input-publicformpreview ${errors.userName ? 'error-publicformpreview' : ''}`}
//                   placeholder="Enter your name"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   required
//                 />
//                 {errors.userName && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? ( // Added condition for radio type fields
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={handleClearForm}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;















// ///////mob validation but not flag


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [userName, setUserName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));

//       // Highlighted: Add validation for 'Contact Number'
//       if (label.toLowerCase().includes('contact number') || label.toLowerCase().includes('mobile')) {
//         const isValidContact = /^[0-9]{10}$/.test(value);
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: !isValidContact,
//         }));
//       } else {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: field.required && value.length < field.minLength,
//         }));
//       }
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, userName, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('userName', userName);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('Error submitting form');
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       // Highlighted: Check for contact number validation
//       if ((field.label.toLowerCase().includes('contact number') || field.label.toLowerCase().includes('mobile')) && !/^[0-9]{10}$/.test(formValues[field.label])) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields correctly and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, userName, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setUserName('');
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               <div className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">User Name</label>
//                 <input
//                   type="text"
//                   className={`custom-form-input-publicformpreview ${errors.userName ? 'error-publicformpreview' : ''}`}
//                   placeholder="Enter your name"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   required
//                 />
//                 {errors.userName && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? ( // Added condition for radio type fields
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> {field.label === 'Contact Number' ? 'Must be a valid 10-digit mobile number' : 'This field is required'}
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={handleClearForm}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;









//////b mobile validation 


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [userName, setUserName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, userName, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('userName', userName);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('Error submitting form');
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, userName, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setUserName('');
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               <div className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">User Name</label>
//                 <input
//                   type="text"
//                   className={`custom-form-input-publicformpreview ${errors.userName ? 'error-publicformpreview' : ''}`}
//                   placeholder="Enter your name"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   required
//                 />
//                 {errors.userName && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? ( // Added condition for radio type fields
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && field.label !== 'Contact Number' && field.label !== 'Startup team size' && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={handleClearForm}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;










////////////////before remove char limit on contact and team size 


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [userName, setUserName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, userName, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('userName', userName);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('Error submitting form');
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, userName, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setUserName('');
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               <div className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">User Name</label>
//                 <input
//                   type="text"
//                   className={`custom-form-input-publicformpreview ${errors.userName ? 'error-publicformpreview' : ''}`}
//                   placeholder="Enter your name"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   required
//                 />
//                 {errors.userName && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'radio' ? ( // Added condition for radio type fields
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="radio-group-publicformpreview">
//                         <input
//                           type="radio"
//                           id={`${field.label}-${optionIndex}`}
//                           name={field.label}
//                           value={option}
//                           checked={formValues[field.label] === option}
//                           onChange={(e) => handleChange(field.label, e.target.value)}
//                           required={field.required}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview-radio" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={handleClearForm}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;










// bef radio option 


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams(); 
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [userName, setUserName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, userName, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('userName', userName);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('Error submitting form');
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, userName, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setUserName('');
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       {isSubmitted ? (
//         <div className="thank-you-message-publicformpreview">
//           <div className="icon-container-publicformpreview">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 64 64"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g fill="none" fillRule="evenodd">
//                 <g transform="translate(1 1)" fillRule="nonzero">
//                   <path
//                     d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                     fill="#EFF6FF"
//                   />
//                   <path
//                     d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                     fill="#1E88E5"
//                   />
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <h2>Thank you for your submission!</h2>
//         </div>
//       ) : (
//         <div className="custom-public-form-preview-publicformpreview">
//           <div className="header-publicformpreview">
//             <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//             <div className="header-text-publicformpreview">
//               <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//               <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//             </div>
//           </div>
//           <hr />
//           <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//           <ToastContainer position="bottom-right" />
//           <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//             <div className="custom-form-row-publicformpreview">
//               <div className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">User Name</label>
//                 <input
//                   type="text"
//                   className={`custom-form-input-publicformpreview ${errors.userName ? 'error-publicformpreview' : ''}`}
//                   placeholder="Enter your name"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   required
//                 />
//                 {errors.userName && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//               {formStructure.fields.map((field, index) => (
//                 <div key={index} className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">{field.label}</label>
//                   {field.type === 'select' ? (
//                     <select
//                       className="custom-form-input-publicformpreview"
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                     >
//                       <option value="">Select...</option>
//                       {field.options.map((option, optionIndex) => (
//                         <option key={optionIndex} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : field.type === 'multiselect' ? (
//                     field.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="checkbox-group-publicformpreview">
//                         <input
//                           type="checkbox"
//                           id={`${field.label}-${optionIndex}`}
//                           value={option}
//                           checked={formValues[field.label].includes(option)}
//                           onChange={() => handleCheckboxChange(field.label, option)}
//                           disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                         />
//                         <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                       </div>
//                     ))
//                   ) : field.type === 'file' ? (
//                     <input
//                       className="custom-form-input-publicformpreview"
//                       type="file"
//                       onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                       required={field.required}
//                     />
//                   ) : (
//                     <input
//                       className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       value={formValues[field.label]}
//                       onChange={(e) => handleChange(field.label, e.target.value)}
//                       required={field.required}
//                       maxLength={field.maxLength || undefined}
//                     />
//                   )}
//                   {errors[field.label] && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                   {(field.maxLength || field.minLength) && (
//                     <div className="character-limit-publicformpreview">
//                       {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                       {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="form-buttons-publicformpreview">
//               <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//               <button type="button" className="custom-form-clear-button-publicformpreview" onClick={handleClearForm}>Clear Form</button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicFormPreview;















////ragular 25/07/2024 before  server


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [userName, setUserName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, userName, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('userName', userName);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('Error submitting form');
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, userName, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   const handleClearForm = () => {
//     setFormValues(
//       formStructure.fields.reduce((acc, field) => {
//         acc[field.label] = field.type === 'multiselect' ? [] : '';
//         return acc;
//       }, {})
//     );
//     setUserName('');
//     setFiles([]);
//     setErrors({});
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <div className="header-publicformpreview">
//           <img src="/navbar/drishtilogo.jpg" alt="Logo" className="logo-publicformpreview" />
//           <div className="header-text-publicformpreview">
//             <h1 className="company-title-publicformpreview">IITI DRISHTI CPS FOUNDATION</h1>
//             <h2 className="company-subtitle-publicformpreview">IIT INDORE</h2>
//           </div>
//         </div>
//         <hr />

//         <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//         <ToastContainer position="bottom-right" />
//         {isSubmitted ? (
//           <div className="thank-you-message-publicformpreview">
//             <div className="icon-container-publicformpreview">
//               <svg
//                 width="64"
//                 height="64"
//                 viewBox="0 0 64 64"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <g fill="none" fillRule="evenodd">
//                   <g transform="translate(1 1)" fillRule="nonzero">
//                     <path
//                       d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                       fill="#EFF6FF"
//                     />
//                     <path
//                       d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                       fill="#EFF6FF"
//                     />
//                     <path
//                       d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                       fill="#1E88E5"
//                     />
//                   </g>
//                 </g>
//               </svg>
//             </div>
//             <h2>Thank you for your submission!</h2>
//           </div>
//         ) : (
//           <>
//             <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//               <div className="custom-form-row-publicformpreview">


//               <div className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">User Name</label>
//                   <input
//                     type="text"
//                     className={`custom-form-input-publicformpreview ${errors.userName ? 'error-publicformpreview' : ''}`}
//                     placeholder="Enter your name"
//                     value={userName}
//                     onChange={(e) => setUserName(e.target.value)}
//                     required
//                   />
//                   {errors.userName && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                 </div>
               

//                 {formStructure.fields.map((field, index) => (
//                   <div key={index} className="custom-form-group-publicformpreview">
//                     <label className="custom-form-label-publicformpreview">{field.label}</label>
//                     {field.type === 'select' ? (
//                       <select
//                         className="custom-form-input-publicformpreview"
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                       >
//                         <option value="">Select...</option>
//                         {field.options.map((option, optionIndex) => (
//                           <option key={optionIndex} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                     ) : field.type === 'multiselect' ? (
//                       field.options.map((option, optionIndex) => (
//                         <div key={optionIndex} className="checkbox-group-publicformpreview">
//                           <input
//                             type="checkbox"
//                             id={`${field.label}-${optionIndex}`}
//                             value={option}
//                             checked={formValues[field.label].includes(option)}
//                             onChange={() => handleCheckboxChange(field.label, option)}
//                             disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                           />
//                           <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                         </div>
//                       ))
//                     ) : field.type === 'file' ? (
//                       <input
//                         className="custom-form-input-publicformpreview"
//                         type="file"
//                         onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                         required={field.required}
//                       />
//                     ) : (
//                       <input
//                         className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                         type={field.type}
//                         placeholder={field.placeholder}
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                         maxLength={field.maxLength || undefined}
//                       />
//                     )}
//                     {errors[field.label] && (
//                       <div className="error-message-publicformpreview">
//                         <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                       </div>
//                     )}
//                     {(field.maxLength || field.minLength) && (
//                       <div className="character-limit-publicformpreview">
//                         {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                         {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                 {/* <div className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">User Name</label>
//                   <input
//                     type="text"
//                     className={`custom-form-input-publicformpreview ${errors.userName ? 'error-publicformpreview' : ''}`}
//                     placeholder="Enter your name"
//                     value={userName}
//                     onChange={(e) => setUserName(e.target.value)}
//                     required
//                   />
//                   {errors.userName && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                 </div> */}
//               </div>
//               <div className="form-buttons-publicformpreview">
//                 <button type="submit" className="custom-form-submit-button-publicformpreviewfinalsave" style={{width:'22%', border:'none', borderRadius:'4px', fontSize:'13px',padding:'10px'}}>Submit</button>
//                 <button type="button" className="custom-form-clear-button-publicformpreview" onClick={handleClearForm}>Clear Form</button>
//               </div>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;
























/////b class selector 25 7

///////////2 name ok 24 7

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [userName, setUserName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, userName, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('userName', userName);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('Error submitting form');
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, userName, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         {isSubmitted ? (
//           <div className="thank-you-message">
//             <div className="icon-container">
//               <svg
//                 width="64"
//                 height="64"
//                 viewBox="0 0 64 64"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <g fill="none" fillRule="evenodd">
//                   <g transform="translate(1 1)" fillRule="nonzero">
//                     <path
//                       d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                       fill="#EFF6FF"
//                     />
//                     <path
//                       d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                       fill="#EFF6FF"
//                     />
//                     <path
//                       d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                       fill="#1E88E5"
//                     />
//                   </g>
//                 </g>
//               </svg>
//             </div>
//             <h2>Thank you for your submission!</h2>
//           </div>
//         ) : (
//           <>
//             <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//             <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//               <div className="custom-form-row-publicformpreview">
//                 {formStructure.fields.map((field, index) => (
//                   <div key={index} className="custom-form-group-publicformpreview">
//                     <label className="custom-form-label-publicformpreview">{field.label}</label>
//                     {field.type === 'select' ? (
//                       <select
//                         className="custom-form-input-publicformpreview"
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                       >
//                         <option value="">Select...</option>
//                         {field.options.map((option, optionIndex) => (
//                           <option key={optionIndex} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                     ) : field.type === 'multiselect' ? (
//                       field.options.map((option, optionIndex) => (
//                         <div key={optionIndex} className="checkbox-group-publicformpreview">
//                           <input
//                             type="checkbox"
//                             id={`${field.label}-${optionIndex}`}
//                             value={option}
//                             checked={formValues[field.label].includes(option)}
//                             onChange={() => handleCheckboxChange(field.label, option)}
//                             disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                           />
//                           <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                         </div>
//                       ))
//                     ) : field.type === 'file' ? (
//                       <input
//                         className="custom-form-input-publicformpreview"
//                         type="file"
//                         onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                         required={field.required}
//                       />
//                     ) : (
//                       <input
//                         className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                         type={field.type}
//                         placeholder={field.placeholder}
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                         maxLength={field.maxLength || undefined}
//                       />
//                     )}
//                     {errors[field.label] && (
//                       <div className="error-message-publicformpreview">
//                         <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                       </div>
//                     )}
//                     {(field.maxLength || field.minLength) && (
//                       <div className="character-limit-publicformpreview">
//                         {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                         {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                 <div className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">User Name</label>
//                   <input
//                     type="text"
//                     className={`custom-form-input-publicformpreview ${errors.userName ? 'error-publicformpreview' : ''}`}
//                     placeholder="Enter your name"
//                     value={userName}
//                     onChange={(e) => setUserName(e.target.value)}
//                     required
//                   />
//                   {errors.userName && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <button type="submit" className="custom-form-submit-button-publicformpreview">Submit</button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;











// working with user name o



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [userName, setUserName] = useState(''); // Add userName state
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const submitForm = async (formId, userName, responses) => {
//     const formData = new FormData();
//     formData.append('formId', formId);
//     formData.append('userName', userName);
//     formData.append('responses', JSON.stringify(responses));

//     files.forEach((fileWrapper) => {
//       formData.append(fileWrapper.label, fileWrapper.file);
//     });

//     const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('Error submitting form');
//     } else {
//       console.log('Form submitted successfully');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       await submitForm(formId, userName, formValues);
//       toast.success('Form submitted successfully!');
//       setIsSubmitted(true); // Set submission status to true
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         {isSubmitted ? (
//           <div className="thank-you-message">
//             <div className="icon-container">
//               <svg
//                 width="64"
//                 height="64"
//                 viewBox="0 0 64 64"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <g fill="none" fillRule="evenodd">
//                   <g transform="translate(1 1)" fillRule="nonzero">
//                     <path
//                       d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                       fill="#EFF6FF"
//                     />
//                     <path
//                       d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                       fill="#EFF6FF"
//                     />
//                     <path
//                       d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                       fill="#1E88E5"
//                     />
//                   </g>
//                 </g>
//               </svg>
//             </div>
//             <h2>Thank you for your submission!</h2>
//           </div>
//         ) : (
//           <>
//             <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//             <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//               <div className="custom-form-row-publicformpreview">
//                 {formStructure.fields.map((field, index) => (
//                   <div key={index} className="custom-form-group-publicformpreview">
//                     <label className="custom-form-label-publicformpreview">{field.label}</label>
//                     {field.type === 'select' ? (
//                       <select
//                         className="custom-form-input-publicformpreview"
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                       >
//                         <option value="">Select...</option>
//                         {field.options.map((option, optionIndex) => (
//                           <option key={optionIndex} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                     ) : field.type === 'multiselect' ? (
//                       field.options.map((option, optionIndex) => (
//                         <div key={optionIndex} className="checkbox-group-publicformpreview">
//                           <input
//                             type="checkbox"
//                             id={`${field.label}-${optionIndex}`}
//                             value={option}
//                             checked={formValues[field.label].includes(option)}
//                             onChange={() => handleCheckboxChange(field.label, option)}
//                             disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                           />
//                           <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                         </div>
//                       ))
//                     ) : field.type === 'file' ? (
//                       <input
//                         className="custom-form-input-publicformpreview"
//                         type="file"
//                         onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                         required={field.required}
//                       />
//                     ) : (
//                       <input
//                         className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                         type={field.type}
//                         placeholder={field.placeholder}
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                         maxLength={field.maxLength || undefined}
//                       />
//                     )}
//                     {errors[field.label] && (
//                       <div className="error-message-publicformpreview">
//                         <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                       </div>
//                     )}
//                     {(field.maxLength || field.minLength) && (
//                       <div className="character-limit-publicformpreview">
//                         {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                         {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                 <div className="custom-form-group-publicformpreview">
//                   <label className="custom-form-label-publicformpreview">User Name</label>
//                   <input
//                     type="text"
//                     className={`custom-form-input-publicformpreview ${errors.userName ? 'error-publicformpreview' : ''}`}
//                     placeholder="Enter your name"
//                     value={userName}
//                     onChange={(e) => setUserName(e.target.value)}
//                     required
//                   />
//                   {errors.userName && (
//                     <div className="error-message-publicformpreview">
//                       <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;




//24-7
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//         setIsSubmitted(true); // Set submission status to true
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         {isSubmitted ? (
//           <div className="thank-you-message">
//             <div className="icon-container">
//               <svg
//                 width="64"
//                 height="64"
//                 viewBox="0 0 64 64"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <g fill="none" fillRule="evenodd">
//                   <g transform="translate(1 1)" fillRule="nonzero">
//                     <path
//                       d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                       fill="#EFF6FF"
//                     />
//                     <path
//                       d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                       fill="#EFF6FF"
//                     />
//                     <path
//                       d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                       fill="#1E88E5"
//                     />
//                   </g>
//                 </g>
//               </svg>
//             </div>
//             <h2>Thank you for your submission!</h2>
//           </div>
//         ) : (
//           <>
//             <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//             <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//               <div className="custom-form-row-publicformpreview">
//                 {formStructure.fields.map((field, index) => (
//                   <div key={index} className="custom-form-group-publicformpreview">
//                     <label className="custom-form-label-publicformpreview">{field.label}</label>
//                     {field.type === 'select' ? (
//                       <select
//                         className="custom-form-input-publicformpreview"
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                       >
//                         <option value="">Select...</option>
//                         {field.options.map((option, optionIndex) => (
//                           <option key={optionIndex} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                     ) : field.type === 'multiselect' ? (
//                       field.options.map((option, optionIndex) => (
//                         <div key={optionIndex} className="checkbox-group-publicformpreview">
//                           <input
//                             type="checkbox"
//                             id={`${field.label}-${optionIndex}`}
//                             value={option}
//                             checked={formValues[field.label].includes(option)}
//                             onChange={() => handleCheckboxChange(field.label, option)}
//                             disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                           />
//                           <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                         </div>
//                       ))
//                     ) : field.type === 'file' ? (
//                       <input
//                         className="custom-form-input-publicformpreview"
//                         type="file"
//                         onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                         required={field.required}
//                       />
//                     ) : (
//                       <input
//                         className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                         type={field.type}
//                         placeholder={field.placeholder}
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                         maxLength={field.maxLength || undefined}
//                       />
//                     )}
//                     {errors[field.label] && (
//                       <div className="error-message-publicformpreview">
//                         <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                       </div>
//                     )}
//                     {(field.maxLength || field.minLength) && (
//                       <div className="character-limit-publicformpreview">
//                         {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                         {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;









// ok form multiselect ok thank you 





// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//         setIsSubmitted(true); // Set submission status to true
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         {isSubmitted ? (
//           <div className="thank-you-message">
//             <div className="icon-container">
//               <svg
//                 width="64"
//                 height="64"
//                 viewBox="0 0 64 64"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <g fill="none" fillRule="evenodd">
//                   <g transform="translate(1 1)" fillRule="nonzero">
//                     <path
//                       d="M48 6H16C11.589 6 8 9.589 8 14v32c0 4.411 3.589 8 8 8h32c4.411 0 8-3.589 8-8V14c0-4.411-3.589-8-8-8z"
//                       fill="#EFF6FF"
//                     />
//                     <path
//                       d="M56 0H8C3.589 0 0 3.589 0 8v48c0 4.411 3.589 8 8 8h48c4.411 0 8-3.589 8-8V8c0-4.411-3.589-8-8-8z"
//                       fill="#EFF6FF"
//                     />
//                     <path
//                       d="M44.293 20.293a1 1 0 00-1.414 0L24 39.172l-6.879-6.879a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l20-20a1 1 0 000-1.414z"
//                       fill="#1E88E5"
//                     />
//                   </g>
//                 </g>
//               </svg>
//             </div>
//             <h2>Thank you for your submission!</h2>
//           </div>
//         ) : (
//           <>
//             <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//             <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//               <div className="custom-form-row-publicformpreview">
//                 {formStructure.fields.map((field, index) => (
//                   <div key={index} className="custom-form-group-publicformpreview">
//                     <label className="custom-form-label-publicformpreview">{field.label}</label>
//                     {field.type === 'select' ? (
//                       <select
//                         className="custom-form-input-publicformpreview"
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                       >
//                         <option value="">Select...</option>
//                         {field.options.map((option, optionIndex) => (
//                           <option key={optionIndex} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                     ) : field.type === 'multiselect' ? (
//                       field.options.map((option, optionIndex) => (
//                         <div key={optionIndex} className="checkbox-group-publicformpreview">
//                           <input
//                             type="checkbox"
//                             id={`${field.label}-${optionIndex}`}
//                             value={option}
//                             checked={formValues[field.label].includes(option)}
//                             onChange={() => handleCheckboxChange(field.label, option)}
//                             disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                           />
//                           <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                         </div>
//                       ))
//                     ) : field.type === 'file' ? (
//                       <input
//                         className="custom-form-input-publicformpreview"
//                         type="file"
//                         onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                         required={field.required}
//                       />
//                     ) : (
//                       <input
//                         className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                         type={field.type}
//                         placeholder={field.placeholder}
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                         maxLength={field.maxLength || undefined}
//                       />
//                     )}
//                     {errors[field.label] && (
//                       <div className="error-message-publicformpreview">
//                         <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                       </div>
//                     )}
//                     {(field.maxLength || field.minLength) && (
//                       <div className="character-limit-publicformpreview">
//                         {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                         {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;


















///thank you working 24 7

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//         setIsSubmitted(true); // Set submission status to true
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         {isSubmitted ? (
//           <div className="thank-you-message">
//             <div style={{ textAlign: 'center', marginTop: '50px' }}>
//               <div style={{
//                 backgroundColor: '#f0f4f8',
//                 borderRadius: '50%',
//                 width: '100px',
//                 height: '100px',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 margin: '0 auto'
//               }}>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="48"
//                   height="48"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="feather feather-check"
//                   style={{ color: '#4CAF50' }}
//                 >
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//               </div>
//               <h2>Thank you for your submission!</h2>
//             </div>
//           </div>
//         ) : (
//           <>
//             <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//             <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//               <div className="custom-form-row-publicformpreview">
//                 {formStructure.fields.map((field, index) => (
//                   <div key={index} className="custom-form-group-publicformpreview">
//                     <label className="custom-form-label-publicformpreview">{field.label}</label>
//                     {field.type === 'select' ? (
//                       <select
//                         className="custom-form-input-publicformpreview"
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                       >
//                         <option value="">Select...</option>
//                         {field.options.map((option, optionIndex) => (
//                           <option key={optionIndex} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                     ) : field.type === 'multiselect' ? (
//                       field.options.map((option, optionIndex) => (
//                         <div key={optionIndex} className="checkbox-group-publicformpreview">
//                           <input
//                             type="checkbox"
//                             id={`${field.label}-${optionIndex}`}
//                             value={option}
//                             checked={formValues[field.label].includes(option)}
//                             onChange={() => handleCheckboxChange(field.label, option)}
//                             disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                           />
//                           <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                         </div>
//                       ))
//                     ) : field.type === 'file' ? (
//                       <input
//                         className="custom-form-input-publicformpreview"
//                         type="file"
//                         onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                         required={field.required}
//                       />
//                     ) : (
//                       <input
//                         className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                         type={field.type}
//                         placeholder={field.placeholder}
//                         value={formValues[field.label]}
//                         onChange={(e) => handleChange(field.label, e.target.value)}
//                         required={field.required}
//                         maxLength={field.maxLength || undefined}
//                       />
//                     )}
//                     {errors[field.label] && (
//                       <div className="error-message-publicformpreview">
//                         <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                       </div>
//                     )}
//                     {(field.maxLength || field.minLength) && (
//                       <div className="character-limit-publicformpreview">
//                         {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                         {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;






















///////////regular all ok multiple selector validation max min 

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//           <div className="custom-form-row-publicformpreview">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input-publicformpreview"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'multiselect' ? (
//                   field.options.map((option, optionIndex) => (
//                     <div key={optionIndex} className="checkbox-group-publicformpreview">
//                       <input
//                         type="checkbox"
//                         id={`${field.label}-${optionIndex}`}
//                         value={option}
//                         checked={formValues[field.label].includes(option)}
//                         onChange={() => handleCheckboxChange(field.label, option)}
//                         disabled={!formValues[field.label].includes(option) && formValues[field.label].length >= field.maxSelect}
//                       />
//                       <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '12px' }}>{option}</label>
//                     </div>
//                   ))
//                 ) : field.type === 'file' ? (
//                   <input
//                     className="custom-form-input-publicformpreview"
//                     type="file"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                     maxLength={field.maxLength || undefined}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//                 {(field.maxLength || field.minLength) && (
//                   <div className="character-limit-publicformpreview">
//                     {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                     {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;













////regular all ok but not max multiple 
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     let newSelectedOptions = [];

//     if (selectedOptions.includes(option)) {
//       newSelectedOptions = selectedOptions.filter((item) => item !== option);
//     } else if (selectedOptions.length < field.maxSelect) {
//       newSelectedOptions = [...selectedOptions, option];
//     }

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//           <div className="custom-form-row-publicformpreview">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input-publicformpreview"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'multiselect' ? (
//                   field.options.map((option, optionIndex) => (
//                     <div key={optionIndex} className="checkbox-group-publicformpreview">
//                       <input
//                         type="checkbox"
//                         id={`${field.label}-${optionIndex}`}
//                         value={option}
//                         checked={formValues[field.label].includes(option)}
//                         onChange={() => handleCheckboxChange(field.label, option)}
//                       />
//                       <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{ fontSize: '13px' }}>{option}</label>
//                     </div>
//                   ))
//                 ) : field.type === 'file' ? (
//                   <input
//                     className="custom-form-input-publicformpreview"
//                     type="file"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                     maxLength={field.maxLength || undefined}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//                 {(field.maxLength || field.minLength) && (
//                   <div className="character-limit-publicformpreview">
//                     {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                     {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;










///////////multiple all work ok , min limit /validation ok but maximum nao ok 


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     const newSelectedOptions = selectedOptions.includes(option)
//       ? selectedOptions.filter((item) => item !== option)
//       : [...selectedOptions, option];

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: newSelectedOptions,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: field.required && newSelectedOptions.length === 0,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }

//       if (field.type === 'multiselect' && formValues[field.label].length === 0) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//           <div className="custom-form-row-publicformpreview">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input-publicformpreview"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'multiselect' ? (
//                   field.options.map((option, optionIndex) => (
//                     <div key={optionIndex} className="checkbox-group-publicformpreview">
//                       <input
//                         type="checkbox"
//                         id={`${field.label}-${optionIndex}`}
//                         value={option}
//                         checked={formValues[field.label].includes(option)}
//                         onChange={() => handleCheckboxChange(field.label, option)}
//                       />
//                       <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{fontSize:'13px'}}>{option}</label>
//                     </div>
//                   ))
//                 ) : field.type === 'file' ? (
//                   <input
//                     className="custom-form-input-publicformpreview"
//                     type="file"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                     maxLength={field.maxLength || undefined}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//                 {(field.maxLength || field.minLength) && (
//                   <div className="character-limit-publicformpreview">
//                     {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                     {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;

















////////work multiselector ok but not validation


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     if (selectedOptions.includes(option)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: selectedOptions.filter((item) => item !== option),
//       }));
//     } else if (selectedOptions.length < field.maxSelect) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: [...selectedOptions, option],
//       }));
//     }
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//           <div className="custom-form-row-publicformpreview">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input-publicformpreview"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'multiselect' ? (
//                   field.options.map((option, optionIndex) => (
//                     <div key={optionIndex} className="checkbox-group-publicformpreview">
//                       <input
//                         type="checkbox"
//                         id={`${field.label}-${optionIndex}`}
//                         value={option}
//                         checked={formValues[field.label].includes(option)}
//                         onChange={() => handleCheckboxChange(field.label, option)}
//                       />
//                       <label htmlFor={`${field.label}-${optionIndex}`} className="option-label-publicformpreview" style={{fontSize:'13px'}}>{option}</label>
//                     </div>
//                   ))
//                 ) : field.type === 'file' ? (
//                   <input
//                     className="custom-form-input-publicformpreview"
//                     type="file"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                     maxLength={field.maxLength || undefined}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//                 {(field.maxLength || field.minLength) && (
//                   <div className="character-limit-publicformpreview">
//                     {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                     {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;













///////multi work ok but not style 

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = field.type === 'multiselect' ? [] : '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleCheckboxChange = (label, option) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     const selectedOptions = formValues[label];
//     if (selectedOptions.includes(option)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: selectedOptions.filter((item) => item !== option),
//       }));
//     } else if (selectedOptions.length < field.maxSelect) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: [...selectedOptions, option],
//       }));
//     }
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//           <div className="custom-form-row-publicformpreview">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input-publicformpreview"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'multiselect' ? (
//                   field.options.map((option, optionIndex) => (
//                     <div key={optionIndex} className="checkbox-group-publicformpreview">
//                       <input
//                         type="checkbox"
//                         id={`${field.label}-${optionIndex}`}
//                         value={option}
//                         checked={formValues[field.label].includes(option)}
//                         onChange={() => handleCheckboxChange(field.label, option)}
//                       />
//                       <label htmlFor={`${field.label}-${optionIndex}`}>{option}</label>
//                     </div>
//                   ))
//                 ) : field.type === 'file' ? (
//                   <input
//                     className="custom-form-input-publicformpreview"
//                     type="file"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                     maxLength={field.maxLength || undefined}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//                 {(field.maxLength || field.minLength) && (
//                   <div className="character-limit-publicformpreview">
//                     {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                     {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;













// /////////all Input work , max min ok

// // /////////all Input work , max min ok



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && (!field.maxLength || value.length <= field.maxLength)) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: field.required && value.length < field.minLength,
//       }));
//     }
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//           <div className="custom-form-row-publicformpreview">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input-publicformpreview"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'file' ? (
//                   <input
//                     className="custom-form-input-publicformpreview"
//                     type="file"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                     maxLength={field.maxLength || undefined}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//                 {(field.maxLength || field.minLength) && (
//                   <div className="character-limit-publicformpreview">
//                     {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                     {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button> 
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;



































// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     const field = formStructure.fields.find(f => f.label === label);
//     if (field && value.length <= field.maxLength) {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [label]: value.length < field.minLength,
//       }));
//     }
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label] || formValues[field.label].length < field.minLength) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields and meet minimum character requirements');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//           <div className="custom-form-row-publicformpreview">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input-publicformpreview"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'file' ? (
//                   <input
//                     className="custom-form-input-publicformpreview"
//                     type="file"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                     maxLength={field.maxLength || undefined}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//                 {(field.maxLength || field.minLength) && (
//                   <div className="character-limit-publicformpreview">
//                     {field.maxLength && `${field.maxLength - (formValues[field.label]?.length || 0)} characters remaining`}
//                     {field.minLength && (formValues[field.label]?.length || 0) < field.minLength && ` (Min: ${field.minLength} characters)`}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button> 
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;














////////max ok


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; 

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error); 
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: !value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//           <div className="custom-form-row-publicformpreview">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input-publicformpreview"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'file' ? (
//                   <input
//                     className="custom-form-input-publicformpreview"
//                     type="file"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                     maxLength={field.maxLength || undefined}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//                 {field.maxLength && (
//                   <div className="character-limit-publicformpreview">
//                     {field.maxLength - (formValues[field.label]?.length || 0)} characters remaining
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;










// /b 0 to 50 



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; 

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error); 
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: !value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       // console.log(`File selected for ${label}:`, file); 

//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         // console.log(`Appending file for ${fileWrapper.label}`); 
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading form...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//           <div className="custom-form-row-publicformpreview">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input-publicformpreview"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'file' ? (
//                   <input
//                     className="custom-form-input-publicformpreview"
//                     type="file"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;


/* bef both file save  */


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; // Using FaInfoCircle for the new icon

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: !value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-background-publicformpreview">
//       <div className="custom-public-form-preview-publicformpreview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title-publicformpreview">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form-publicformpreview">
//           <div className="custom-form-row-publicformpreview">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group-publicformpreview">
//                 <label className="custom-form-label-publicformpreview">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input-publicformpreview"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'file' && field.label === 'Resume (PDF Format Only)' ? (
//                   <input
//                     className="custom-form-input-publicformpreview"
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : field.type === 'file' && field.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                   <input
//                     className="custom-form-input-publicformpreview"
//                     type="file"
//                     accept="image/png, image/jpeg"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input-publicformpreview ${errors[field.label] ? 'error-publicformpreview' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message-publicformpreview">
//                     <FaInfoCircle className="error-icon-publicformpreview" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button-publicformpreview">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;








/* // /////before css class selector  */






// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; // Using FaInfoCircle for the new icon

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: !value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-backgroundform">
//       <div className="custom-public-form-previewform">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-titleform">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-formform">
//           <div className="custom-form-rowform">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-groupform">
//                 <label className="custom-form-labelform">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-inputform"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'file' && field.label === 'Resume (PDF Format Only)' ? (
//                   <input
//                     className="custom-form-inputform"
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : field.type === 'file' && field.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                   <input
//                     className="custom-form-inputform"
//                     type="file"
//                     accept="image/png, image/jpeg"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-inputform ${errors[field.label] ? 'errorform' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-messageform">
//                     <FaInfoCircle className="error-iconform" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-buttonform">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;
















/////before css class selector form


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaInfoCircle } from 'react-icons/fa'; // Using FaInfoCircle for the new icon

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: !value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-background">
//       <div className="custom-public-form-preview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form">
//           <div className="custom-form-row">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group">
//                 <label className="custom-form-label">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'file' && field.label === 'Resume (PDF Format Only)' ? (
//                   <input
//                     className="custom-form-input"
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : field.type === 'file' && field.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                   <input
//                     className="custom-form-input"
//                     type="file"
//                     accept="image/png, image/jpeg"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input ${errors[field.label] ? 'error' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message">
//                     <FaInfoCircle className="error-icon" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview; 
























// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';
// import { FaExclamationCircle } from 'react-icons/fa'; // Importing the icon

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: !value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-background">
//       <div className="custom-public-form-preview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form">
//           <div className="custom-form-row">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group">
//                 <label className="custom-form-label">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'file' && field.label === 'Resume (PDF Format Only)' ? (
//                   <input
//                     className="custom-form-input"
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : field.type === 'file' && field.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                   <input
//                     className="custom-form-input"
//                     type="file"
//                     accept="image/png, image/jpeg"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input ${errors[field.label] ? 'error' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   />
//                 )}
//                 {errors[field.label] && (
//                   <div className="error-message">
//                     <FaExclamationCircle className="error-icon" /> This field is required
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;











////////good vali

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [label]: !value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           [label]: false,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     let hasError = false;

//     for (const field of formStructure.fields) {
//       if (!formValues[field.label]) {
//         newErrors[field.label] = true;
//         hasError = true;
//       }
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-background">
//       <div className="custom-public-form-preview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form">
//           <div className="custom-form-row">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group">
//                 <label className="custom-form-label">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'file' && field.label === 'Resume (PDF Format Only)' ? (
//                   <input
//                     className="custom-form-input"
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : field.type === 'file' && field.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                   <input
//                     className="custom-form-input"
//                     type="file"
//                     accept="image/png, image/jpeg"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className={`custom-form-input ${errors[field.label] ? 'error' : ''}`}
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   />
//                 )}
//                 {errors[field.label] && <div className="error-message">This field is required</div>}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;










///////////not blank but error message b in tosty



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import './PublicFormPreview.css';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [initialValues, setInitialValues] = useState({});
//   const [validationSchema, setValidationSchema] = useState(Yup.object({}));

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         console.log('Fetched form structure:', data);
//         setFormStructure(data);

//         // Set initial values and validation schema
//         const initialValuesTemp = {};
//         const validationSchemaTemp = {};

//         data.fields.forEach(field => {
//           initialValuesTemp[field.label] = '';

//           if (field.required) {
//             validationSchemaTemp[field.label] = Yup.string().required('Required');
//           }
//         });

//         setInitialValues(initialValuesTemp);
//         setValidationSchema(Yup.object(validationSchemaTemp));
//         console.log('Initial values:', initialValuesTemp);
//         console.log('Validation schema:', validationSchemaTemp);
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleSubmit = async (values) => {
//     console.log('Form values on submit:', values);

//     // Check for empty values
//     let hasEmptyFields = false;
//     for (let key in values) {
//       if (values[key] === '') {
//         hasEmptyFields = true;
//         console.log(`Field ${key} is empty`);
//         toast.error(`Field ${key} is required`);
//       }
//     }

//     if (hasEmptyFields) {
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(values));

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-background">
//       <div className="custom-public-form-preview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title">{formStructure.title}</h2>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//           enableReinitialize
//         >
//           {({ setFieldValue }) => (
//             <Form className="custom-form">
//               <div className="custom-form-row">
//                 {formStructure.fields.map((field, index) => (
//                   <div key={index} className="custom-form-group">
//                     <label className="custom-form-label">{field.label}</label>
//                     {field.type === 'select' ? (
//                       <Field
//                         as="select"
//                         name={field.label}
//                         className="custom-form-input"
//                         required={field.required}
//                       >
//                         <option value="">Select...</option>
//                         {field.options.map((option, optionIndex) => (
//                           <option key={optionIndex} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </Field>
//                     ) : field.type === 'file' ? (
//                       <input
//                         className="custom-form-input"
//                         type="file"
//                         accept={
//                           field.label === 'Resume (PDF Format Only)'
//                             ? 'application/pdf'
//                             : 'image/png, image/jpeg'
//                         }
//                         onChange={(e) => setFieldValue(field.label, e.target.files[0])}
//                         required={field.required}
//                       />
//                     ) : (
//                       <Field
//                         type={field.type}
//                         name={field.label}
//                         placeholder={field.placeholder}
//                         className="custom-form-input"
//                         required={field.required}
//                       />
//                     )}
//                     <ErrorMessage
//                       name={field.label}
//                       component="div"
//                       className="error-message"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <button type="submit" className="custom-form-submit-button">
//                 Register
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;






////////////////16/7

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const validationSchema = Yup.object().shape(
//     formStructure?.fields.reduce((acc, field) => {
//       let validator = Yup.string();
//       if (field.required) {
//         validator = validator.required('This field is required');
//       }
//       if (field.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (field.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (field.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       acc[field.label] = validator;
//       return acc;
//     }, {}) || {}
//   );

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(values));

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-background">
//       <div className="custom-public-form-preview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title">{formStructure.title}</h2>
//         <Formik
//           initialValues={formStructure.fields.reduce((acc, field) => ({ ...acc, [field.label]: '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="custom-form">
//               <div className="custom-form-row">
//                 {formStructure.fields.map((field, index) => (
//                   <div key={index} className="custom-form-group">
//                     <label className="custom-form-label">{field.label}</label>
//                     {field.type === 'select' ? (
//                       <Field as="select" name={field.label} className="custom-form-input">
//                         <option value="">Select...</option>
//                         {field.options.map((option, optionIndex) => (
//                           <option key={optionIndex} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </Field>
//                     ) : field.type === 'file' && field.label === 'Resume (PDF Format Only)' ? (
//                       <Field
//                         name={field.label}
//                         type="file"
//                         accept="application/pdf"
//                         className="custom-form-input"
//                       />
//                     ) : field.type === 'file' && field.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                       <Field
//                         name={field.label}
//                         type="file"
//                         accept="image/png, image/jpeg"
//                         className="custom-form-input"
//                       />
//                     ) : (
//                       <Field
//                         name={field.label}
//                         type={field.type}
//                         placeholder={field.placeholder}
//                         className="custom-form-input"
//                       />
//                     )}
//                     <ErrorMessage name={field.label} component="div" className="error-message" />
//                   </div>
//                 ))}
//               </div>
//               <button type="submit" className="custom-form-submit-button" disabled={isSubmitting}>
//                 Register
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;


















///////before validation work ok




// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-background">
//       <div className="custom-public-form-preview">
//         <ToastContainer position="bottom-right" />
//         <h2 className="custom-form-title">{formStructure.title}</h2>
//         <form onSubmit={handleSubmit} className="custom-form">
//           <div className="custom-form-row">
//             {formStructure.fields.map((field, index) => (
//               <div key={index} className="custom-form-group">
//                 <label className="custom-form-label">{field.label}</label>
//                 {field.type === 'select' ? (
//                   <select
//                     className="custom-form-input"
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   >
//                     <option value="">Select...</option>
//                     {field.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 ) : field.type === 'file' && field.label === 'Resume (PDF Format Only)' ? (
//                   <input
//                     className="custom-form-input"
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : field.type === 'file' && field.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                   <input
//                     className="custom-form-input"
//                     type="file"
//                     accept="image/png, image/jpeg"
//                     onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                     required={field.required}
//                   />
//                 ) : (
//                   <input
//                     className="custom-form-input"
//                     type={field.type}
//                     placeholder={field.placeholder}
//                     value={formValues[field.label]}
//                     onChange={(e) => handleChange(field.label, e.target.value)}
//                     required={field.required}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//           <button type="submit" className="custom-form-submit-button">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPreview;











































/////good white background 
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './PublicFormPreview.css';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="custom-public-form-preview">
//       <ToastContainer position="bottom-right" />
//       <h2 className="custom-form-title">{formStructure.title}</h2>
//       <form onSubmit={handleSubmit} className="custom-form">
//         <div className="custom-form-row">
//           {formStructure.fields.map((field, index) => (
//             <div key={index} className="custom-form-group">
//               <label className="custom-form-label">{field.label}</label>
//               {field.type === 'select' ? (
//                 <select
//                   className="custom-form-input"
//                   value={formValues[field.label]}
//                   onChange={(e) => handleChange(field.label, e.target.value)}
//                   required={field.required}
//                 >
//                   <option value="">Select...</option>
//                   {field.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : field.type === 'file' && field.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   className="custom-form-input"
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                   required={field.required}
//                 />
//               ) : field.type === 'file' && field.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                 <input
//                   className="custom-form-input"
//                   type="file"
//                   accept="image/png, image/jpeg"
//                   onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                   required={field.required}
//                 />
//               ) : (
//                 <input
//                   className="custom-form-input"
//                   type={field.type}
//                   placeholder={field.placeholder}
//                   value={formValues[field.label]}
//                   onChange={(e) => handleChange(field.label, e.target.value)}
//                   required={field.required}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//         <button type="submit" className="custom-form-submit-button">Register</button>
//       </form>
//     </div>
//   );
// };

// export default PublicFormPreview;














////////////100 % work  css simple 

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFiles((prevFiles) => [
//           ...prevFiles,
//           { label, file },
//         ]);
//         setFormValues((prevValues) => ({
//           ...prevValues,
//           [label]: file.name,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="public-form-preview">
//       <ToastContainer position="bottom-right" />
//       <h2>{formStructure.title}</h2>
//       <form onSubmit={handleSubmit}>
//         {formStructure.fields.map((field, index) => (
//           <div key={index} className="form-group">
//             <label>{field.label}</label>
//             {field.type === 'select' ? (
//               <select
//                 value={formValues[field.label]}
//                 onChange={(e) => handleChange(field.label, e.target.value)}
//                 required={field.required}
//               >
//                 <option value="">Select...</option>
//                 {field.options.map((option, optionIndex) => (
//                   <option key={optionIndex} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             ) : field.type === 'file' && field.label === 'Resume (PDF Format Only)' ? (
//               <input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                 required={field.required}
//               />
//             ) : field.type === 'file' && field.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//               <input
//                 type="file"
//                 accept="image/png, image/jpeg"
//                 onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                 required={field.required}
//               />
//             ) : (
//               <input
//                 type={field.type}
//                 placeholder={field.placeholder}
//                 value={formValues[field.label]}
//                 onChange={(e) => handleChange(field.label, e.target.value)}
//                 required={field.required}
//               />
//             )}
//           </div>
//         ))}
//         <button type="submit" className="form-submit-button">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default PublicFormPreview;









































///png/jpg not work
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFiles((prevFiles) => [
//         ...prevFiles,
//         { label, file },
//       ]);
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: file.name,
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="public-form-preview">
//       <ToastContainer position="bottom-right" />
//       <h2>{formStructure.title}</h2>
//       <form onSubmit={handleSubmit}>
//         {formStructure.fields.map((field, index) => (
//           <div key={index} className="form-group">
//             <label>{field.label}</label>
//             {field.type === 'select' ? (
//               <select
//                 value={formValues[field.label]}
//                 onChange={(e) => handleChange(field.label, e.target.value)}
//                 required={field.required}
//               >
//                 <option value="">Select...</option>
//                 {field.options.map((option, optionIndex) => (
//                   <option key={optionIndex} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             ) : field.type === 'file' ? (
//               <input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                 required={field.required}
//               />
//             ) : (
//               <input
//                 type={field.type}
//                 placeholder={field.placeholder}
//                 value={formValues[field.label]}
//                 onChange={(e) => handleChange(field.label, e.target.value)}
//                 required={field.required}
//               />
//             )}
//           </div>
//         ))}
//         <button type="submit" className="form-submit-button">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default PublicFormPreview;










/////11  live






// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//         setFormValues(
//           data.fields.reduce((acc, field) => {
//             acc[field.label] = '';
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   const handleChange = (label, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [label]: value,
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFiles((prevFiles) => [
//         ...prevFiles,
//         { label, file },
//       ]);
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [label]: file.name,
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('formId', formId);
//       formData.append('responses', JSON.stringify(formValues));

//       files.forEach((fileWrapper) => {
//         formData.append(fileWrapper.label, fileWrapper.file);
//       });

//       const response = await fetch('http://localhost:5000/api/forms/public-form-submission', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success('Form submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Error submitting form');
//     }
//   };

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="public-form-preview">
//       <ToastContainer position="bottom-right" />
//       <h2>{formStructure.title}</h2>
//       <form onSubmit={handleSubmit}>
//         {formStructure.fields.map((field, index) => (
//           <div key={index} className="form-group">
//             <label>{field.label}</label>
//             {field.type === 'select' ? (
//               <select
//                 value={formValues[field.label]}
//                 onChange={(e) => handleChange(field.label, e.target.value)}
//                 required={field.required}
//               >
//                 <option value="">Select...</option>
//                 {field.options.map((option, optionIndex) => (
//                   <option key={optionIndex} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             ) : field.type === 'file' ? (
//               <input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={(e) => handleFileChange(field.label, e.target.files[0])}
//                 required={field.required}
//               />
//             ) : (
//               <input
//                 type={field.type}
//                 placeholder={field.placeholder}
//                 value={formValues[field.label]}
//                 onChange={(e) => handleChange(field.label, e.target.value)}
//                 required={field.required}
//               />
//             )}
//           </div>
//         ))}
//         <button type="submit" className="form-submit-button">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default PublicFormPreview;























//////////ok bef general shear and save 




// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const PublicFormPreview = () => {
//   const { formId } = useParams();
//   const [formStructure, setFormStructure] = useState(null);

//   useEffect(() => {
//     const fetchFormStructure = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`);
//         const data = await response.json();
//         setFormStructure(data);
//       } catch (error) {
//         console.error('Error fetching shared form:', error);
//       }
//     };

//     fetchFormStructure();
//   }, [formId]);

//   if (!formStructure) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="public-form-preview">
//       <h2>{formStructure.title}</h2>
//       <form>
//         {formStructure.fields.map((field, index) => (
//           <div key={index} className="form-group">
//             <label>{field.label}</label>
//             <input type={field.type} placeholder={field.placeholder} required={field.required} />
//           </div>
//         ))}
//       </form>
//     </div>
//   );
// };

// export default PublicFormPreview;
