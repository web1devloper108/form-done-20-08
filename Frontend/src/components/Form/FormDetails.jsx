import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FormDetails.css'; 

const FormDetails = () => {
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
  const navigate = useNavigate();

  if (!form) {
    return <p>No form data available.</p>;
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormValues({ ...formValues, [name]: files[0] });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    if (formValues[name] === formData.formElements.find(element => element.label === name)?.placeholder) {
      setFormValues({ ...formValues, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === '') {
      setFormValues({
        ...formValues,
        [name]: formData.formElements.find(element => element.label === name)?.placeholder || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file uploads if any
    const submissionData = new FormData();
    submissionData.append('formTitle', formData.title);
    submissionData.append('formData', JSON.stringify(formValues));

    for (let key in formValues) {
      if (formValues[key] instanceof File) {
        submissionData.append(key, formValues[key]);
      }
    }

    try {
      const response = await axios.post('http://localhost:5000/api/formSubmissions', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Form submitted:', response.data);
      alert('Form submitted successfully!');
      navigate(`/form/${form.title}`, { state: { form: formData } });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };

  const handleEdit = () => {
    const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
    navigate('/form-builder', { state: { formElements, formTitle: formData.title } });
  };

  const handleClose = () => {
    navigate('/form');
  };

  return (
    <div className="form-details-container-formdetails">
      <div className="header-container-formdetails">
        <h2>{formData.title}</h2> {/* Display the title from formData */}
        <div className="form-details-buttons-formdetails">
          <button className="edit-button-formdetails" onClick={handleEdit}>Edit</button>
          <button className="close-button-formdetails" onClick={handleClose}>Close</button>
        </div>
      </div>
      <div className="form-content-container-formdetails">
        <form className="form-details-form-formdetails" onSubmit={handleSubmit}>
          {formData.formElements && formData.formElements.map((element, index) => (
            <div key={index} className="form-group-formdetails">
              <label>
                <span className="number-box-formdetails">{index + 1}</span> {element.label} {element.required && <span className="required-formdetails">*</span>}
              </label>
              {element.type === 'select' ? (
                <select
                  name={element.label}
                  value={formValues[element.label]}
                  onChange={handleChange}
                  required={element.required}
                >
                  <option value="">Select...</option>
                  {element.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={element.type}
                  name={element.label}
                  value={element.type === 'file' ? undefined : formValues[element.label]}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required={element.required}
                  placeholder={element.placeholder}
                  maxLength={element.maxLength}
                />
              )}
              {element.maxLength && element.type !== 'select' && element.type !== 'number' && (
                <small>{element.maxLength - (formValues[element.label] || '').length} character(s) remaining</small>
              )}
            </div>
          ))}
          <div className="form-buttons-formdetails">
            <button type="submit" className="submit-button-formdetails">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormDetails;














// /////before css class selector 




// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './FormDetails.css';

// const FormDetails = () => {
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

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === 'file') {
//       setFormValues({ ...formValues, [name]: files[0] });
//     } else {
//       setFormValues({ ...formValues, [name]: value });
//     }
//   };

//   const handleFocus = (e) => {
//     const { name } = e.target;
//     if (formValues[name] === formData.formElements.find(element => element.label === name)?.placeholder) {
//       setFormValues({ ...formValues, [name]: '' });
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     if (value === '') {
//       setFormValues({
//         ...formValues,
//         [name]: formData.formElements.find(element => element.label === name)?.placeholder || ''
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create a FormData object to handle file uploads if any
//     const submissionData = new FormData();
//     submissionData.append('formTitle', formData.title);
//     submissionData.append('formData', JSON.stringify(formValues));

//     for (let key in formValues) {
//       if (formValues[key] instanceof File) {
//         submissionData.append(key, formValues[key]);
//       }
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/formSubmissions', submissionData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log('Form submitted:', response.data);
//       alert('Form submitted successfully!');
//       navigate(`/form/${form.title}`, { state: { form: formData } });
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('There was an error submitting the form. Please try again.');
//     }
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/form-builder', { state: { formElements, formTitle: formData.title } });
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
//                 <span className="number-box">{index + 1}</span> {element.label} {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   name={element.label}
//                   value={formValues[element.label]}
//                   onChange={handleChange}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   type={element.type}
//                   name={element.label}
//                   value={element.type === 'file' ? undefined : formValues[element.label]}
//                   onChange={handleChange}
//                   onFocus={handleFocus}
//                   onBlur={handleBlur}
//                   required={element.required}
//                   placeholder={element.placeholder}
//                   maxLength={element.maxLength}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && (
//                 <small>{element.maxLength - (formValues[element.label] || '').length} character(s) remaining</small>
//               )}
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

// export default FormDetails;





















//regular working // import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './FormDetails.css';

// const FormDetails = () => {
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

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === 'file') {
//       setFormValues({ ...formValues, [name]: files[0] });
//     } else {
//       setFormValues({ ...formValues, [name]: value });
//     }
//   };

//   const handleFocus = (e) => {
//     const { name } = e.target;
//     if (formValues[name] === formData.formElements.find(element => element.label === name)?.placeholder) {
//       setFormValues({ ...formValues, [name]: '' });
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     if (value === '') {
//       setFormValues({
//         ...formValues,
//         [name]: formData.formElements.find(element => element.label === name)?.placeholder || ''
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create a FormData object to handle file uploads if any
//     const submissionData = new FormData();
//     submissionData.append('formTitle', formData.title);
//     submissionData.append('formData', JSON.stringify(formValues));

//     for (let key in formValues) {
//       if (formValues[key] instanceof File) {
//         submissionData.append(key, formValues[key]);
//       }
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/submitForm', submissionData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log('Form submitted:', response.data);
//       alert('Form submitted successfully!');
//       navigate(`/form/${form.title}`, { state: { form: formData } });
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('There was an error submitting the form. Please try again.');
//     }
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/form-builder', { state: { formElements, formTitle: formData.title } });
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
//                 <span className="number-box">{index + 1}</span> {element.label} {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   name={element.label}
//                   value={formValues[element.label]}
//                   onChange={handleChange}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   type={element.type}
//                   name={element.label}
//                   value={element.type === 'file' ? undefined : formValues[element.label]}
//                   onChange={handleChange}
//                   onFocus={handleFocus}
//                   onBlur={handleBlur}
//                   required={element.required}
//                   placeholder={element.placeholder}
//                   maxLength={element.maxLength}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && (
//                 <small>{element.maxLength - (formValues[element.label] || '').length} character(s) remaining</small>
//               )}
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

// export default FormDetails;







// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './FormDetails.css';

// const FormDetails = () => {
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

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === 'file') {
//       setFormValues({ ...formValues, [name]: files[0] });
//     } else {
//       setFormValues({ ...formValues, [name]: value });
//     }
//   };

//   const handleFocus = (e) => {
//     const { name } = e.target;
//     if (formValues[name] === formData.formElements.find(element => element.label === name)?.placeholder) {
//       setFormValues({ ...formValues, [name]: '' });
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     if (value === '') {
//       setFormValues({
//         ...formValues,
//         [name]: formData.formElements.find(element => element.label === name)?.placeholder || ''
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create a FormData object to handle file uploads if any
//     const submissionData = new FormData();
//     submissionData.append('formTitle', formData.title);
//     submissionData.append('formData', JSON.stringify(formValues));

//     for (let key in formValues) {
//       if (formValues[key] instanceof File) {
//         submissionData.append(key, formValues[key]);
//       }
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/submitForm', submissionData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log('Form submitted:', response.data);
//       alert('Form submitted successfully!');
//       navigate(`/form/${form.title}`, { state: { form: formData } });
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('There was an error submitting the form. Please try again.');
//     }
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/form-builder', { state: { formElements, formTitle: formData.title } });
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
//                 <span className="number-box">{index + 1}</span> {element.label} {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   name={element.label}
//                   value={formValues[element.label]}
//                   onChange={handleChange}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   type={element.type}
//                   name={element.label}
//                   value={element.type === 'file' ? undefined : formValues[element.label]}
//                   onChange={handleChange}
//                   onFocus={handleFocus}
//                   onBlur={handleBlur}
//                   required={element.required}
//                   placeholder={element.placeholder}
//                   maxLength={element.maxLength}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && (
//                 <small>{element.maxLength - (formValues[element.label] || '').length} character(s) remaining</small>
//               )}
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

// export default FormDetails;















//////////before save to backend 

// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     form?.formElements?.forEach(element => {
//       values[element.label] = element.placeholder || '';
//     });
//     return values;
//   });
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//   };

//   const handleFocus = (e) => {
//     const { name } = e.target;
//     if (formValues[name] === formData.formElements.find(element => element.label === name)?.placeholder) {
//       setFormValues({ ...formValues, [name]: '' });
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     if (value === '') {
//       setFormValues({
//         ...formValues,
//         [name]: formData.formElements.find(element => element.label === name)?.placeholder || ''
//       });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault(); // Prevent the default form submission behavior
//     handleSave(); // Call handleSave to save form data
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
//     console.log('Form data saved:', updatedFormData);
//     navigate(`/form/${form.title}`, { state: { form: updatedFormData } });
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/form-builder', { state: { formElements, formTitle: formData.title } });
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-details-container">
//       <div className="header-container">
//         <h2>{formData.title}</h2> {/* Display the title from formData */}
//         <div className="form-details-buttons">
//           {/* <button className="save-button" onClick={handleSave}>Save</button> */}
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <div className="form-content-container">
//         <form className="form-details-form" onSubmit={handleSubmit}>
//           {formData.formElements && formData.formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="number-box">{index + 1}</span> {element.label} {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   name={element.label}
//                   value={formValues[element.label]}
//                   onChange={handleChange}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   type={element.type}
//                   name={element.label}
//                   value={formValues[element.label]}
//                   onChange={handleChange}
//                   onFocus={handleFocus}
//                   onBlur={handleBlur}
//                   required={element.required}
//                   placeholder={element.placeholder}
//                   maxLength={element.maxLength}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && (
//                 <small>{element.maxLength - (formValues[element.label] || '').length} character(s) remaining</small>
//               )}
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

// export default FormDetails;




















/////////////////before single select save 
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
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

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//   };

//   const handleFocus = (e) => {
//     const { name } = e.target;
//     if (formValues[name] === formData.formElements.find(element => element.label === name)?.placeholder) {
//       setFormValues({ ...formValues, [name]: '' });
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     if (value === '') {
//       setFormValues({
//         ...formValues,
//         [name]: formData.formElements.find(element => element.label === name)?.placeholder || ''
//       });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault(); // Prevent the default form submission behavior
//     handleSave(); // Call handleSave to save form data
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
//     console.log('Form data saved:', updatedFormData);
//     navigate(`/form/${form.title}`, { state: { form: updatedFormData } });
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/form-builder', { state: { formElements, formTitle: formData.title } });
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
//         <form className="form-details-form" onSubmit={handleSubmit}>
//           {formData.formElements && formData.formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="number-box">{index + 1}</span> {element.label} {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type={element.type}
//                 name={element.label}
//                 value={formValues[element.label]}
//                 onChange={handleChange}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//                 required={element.required}
//                 placeholder={element.placeholder}
//                 maxLength={element.maxLength}
//               />
//               {element.maxLength && (
//                 <small>{element.maxLength - (formValues[element.label] || '').length} character(s) remaining</small>
//               )}
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

// export default FormDetails;






// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     form?.formElements?.forEach(element => {
//       values[element.label] = element.placeholder || '';
//     });
//     return values;
//   });
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//   };

//   const handleFocus = (e) => {
//     const { name } = e.target;
//     if (formValues[name] === formData.formElements.find(element => element.label === name)?.placeholder) {
//       setFormValues({ ...formValues, [name]: '' });
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     if (value === '') {
//       setFormValues({
//         ...formValues,
//         [name]: formData.formElements.find(element => element.label === name)?.placeholder || ''
//       });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault(); // Prevent the default form submission behavior
//     handleSave(); // Call handleSave to save form data
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
//     console.log('Form data saved:', updatedFormData);
//     navigate(`/form/${form.title}`, { state: { form: updatedFormData } });
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/form-builder', { state: { formElements, formTitle: formData.title } });
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
//         <form className="form-details-form" onSubmit={handleSubmit}>
//           {formData.formElements && formData.formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="number-box">{index + 1}</span> {element.label} {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type={element.type}
//                 name={element.label}
//                 value={formValues[element.label]}
//                 onChange={handleChange}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//                 required={element.required}
//                 placeholder={element.placeholder}
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

// export default FormDetails;










// bf input correct2
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(savedForm => savedForm.title === formData.title);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     console.log('Form data saved:', formData);
//   };

//   const handleEdit = () => {
//     const formElements = Array.isArray(formData.formElements) ? formData.formElements : [];
//     navigate('/form-builder', { state: { formElements, formTitle: formData.title } });
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
//                 <span className="number-box">{index + 1}</span> {element.label} *
//               </label>
//               <input
//                 type={element.type}
//                 name={element.label}
//                 value={element.placeholder}
//                 onChange={handleChange}
//                 required={element.required}
//                 placeholder={element.placeholder}
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

// export default FormDetails;

















///////save ok 
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(savedForm => savedForm.title === formData.title);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     console.log('Form data saved:', formData);
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements: formData.formElements, formTitle: formData.title } });
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
//                 <span className="number-box">{index + 1}</span> {element.label} *
//               </label>
//               <input
//                 type={element.type}
//                 name={element.label}
//                 value={element.placeholder}
//                 onChange={handleChange}
//                 required={element.required}
//                 placeholder={element.placeholder}
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

// export default FormDetails;

















// //bf  save
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     // Handle saving the updated form data to localStorage or backend
//     console.log('Form data saved:', formData);
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { form: formData } });
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
//           <div className="form-group">
//             <label htmlFor="email">
//               <span className="number-box">1</span> Email *
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email || ''}
//               onChange={handleChange}
//               required
//               placeholder="Enter Your Email"
//             />
//             <small>This email will be used for further communications.</small>
//           </div>
//           <div className="form-group">
//             <label htmlFor="name">
//               <span className="number-box">2</span> Name *
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name || ''}
//               onChange={handleChange}
//               required
//               placeholder="Enter Your Name"
//             />
//             <small>50 character(s) remaining</small>
//           </div>
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">Submit</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormDetails;







// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     // Handle saving the updated form data to localStorage or backend
//     console.log('Form data saved:', formData);
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { form: formData } });
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
//           {Object.keys(formData).map((key, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="number-box">{index + 1}</span> {key} *
//               </label>
//               <input
//                 type="text"
//                 id={key}
//                 name={key}
//                 value={formData[key]}
//                 onChange={handleChange}
//                 required
//                 placeholder={`Enter Your ${key}`}
//               />
//               <small>This is a {key} field.</small>
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

// export default FormDetails;

















//////bf nav
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     // Handle saving the updated form data to localStorage or backend
//     console.log('Form data saved:', formData);
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { form } });
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
//           <div className="form-group">
//             <label htmlFor="email">
//               <span className="number-box">1</span> Email *
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email || ''}
//               onChange={handleChange}
//               required
//               placeholder="Enter Your Email"
//             />
//             <small>This email will be used for further communications.</small>
//           </div>
//           <div className="form-group">
//             <label htmlFor="name">
//               <span className="number-box">2</span> Name *
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name || ''}
//               onChange={handleChange}
//               required
//               placeholder="Enter Your Name"
//             />
//             <small>50 character(s) remaining</small>
//           </div>
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">Submit</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormDetails;


















///////bef drag  draop 
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     // Handle saving the updated form data to localStorage or backend
//     console.log('Form data saved:', formData);
//   };

//   const handleEdit = () => {
//     console.log('Edit button clicked');
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
//           <div className="form-group">
//             <label htmlFor="email">
//               <span className="number-box">1</span> Email *
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email || ''}
//               onChange={handleChange}
//               required
//               placeholder="Enter Your Email"
//             />
//             <small>This email will be used for further communications.</small>
//           </div>
//           <div className="form-group">
//             <label htmlFor="name">
//               <span className="number-box">2</span> Name *
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name || ''}
//               onChange={handleChange}
//               required
//               placeholder="Enter Your Name"
//             />  
//             <small>50 character(s) remaining</small>
//           </div>
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">Submit</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormDetails;








// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     // Handle saving the updated form data to localStorage or backend
//     console.log('Form data saved:', formData);
//   };

//   const handleEdit = () => {
//     console.log('Edit button clicked');
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-details-container">
//       <div className="header-container">
//         <h2>Test Form DRISHTI</h2>
//         <div className="form-details-buttons">
//           <button className="save-button" onClick={handleSave}>Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <div className="form-content-container">
//         <form className="form-details-form">
//           <div className="form-group">
//             <label htmlFor="email">
//               <span className="number-box">1</span> Email *
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email || ''}
//               onChange={handleChange}
//               required
//               placeholder="Enter Your Email"
//             />
//             <small>This email will be used for further communications.</small>
//           </div>
//           <div className="form-group">
//             <label htmlFor="name">
//               <span className="number-box">2</span> Name *
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name || ''}
//               onChange={handleChange}
//               required
//               placeholder="Enter Your Name"
//             />
//             <small>50 character(s) remaining</small>
//           </div>
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">Submit</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormDetails;
















// // FormDetails.jsx
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     // Handle saving the updated form data to localStorage or backend
//     console.log('Form data saved:', formData);
//   };

//   const handleEdit = () => {
//     console.log('Edit button clicked');
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-details-container">
//       <div className="form-details-header">
//         <h2>Test Form DRISHTI</h2>
//         <div className="form-details-buttons">
//           <button className="save-button" onClick={handleSave}>Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <div className="form-details-content">
//         <form className="form-details-form">
//           <div className="form-group">
//             <label htmlFor="email">
//               <span className="number-box">1</span> Email *
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email || ''}
//               onChange={handleChange}
//               required
//               placeholder="Enter Your Email"
//             />
//             <small>This email will be used for further communications.</small>
//           </div>
//           <div className="form-group">
//             <label htmlFor="name">
//               <span className="number-box">2</span> Name *
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name || ''}
//               onChange={handleChange}
//               required
//               placeholder="Enter Your Name"
//             />
//             <small>50 character(s) remaining</small>
//           </div>
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">Submit</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormDetails;













// // FormDetails.jsx
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     // Handle saving the updated form data to localStorage or backend
//     console.log('Form data saved:', formData);
//   };

//   const handleEdit = () => {
//     console.log('Edit button clicked');
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-details-container">
//       <div className="form-details-header">
//         <h2>Test Form DRISHTI</h2>
//         <div className="form-details-buttons">
//           <button className="save-button" onClick={handleSave}>Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <form className="form-details-form">
//         <div className="form-group">
//           <label htmlFor="email">
//             <span className="number-box">1</span> Email *
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email || ''}
//             onChange={handleChange}
//             required
//             placeholder="Enter Your Email"
//           />
//           <small>This email will be used for further communications.</small>
//         </div>
//         <div className="form-group">
//           <label htmlFor="name">
//             <span className="number-box">2</span> Name *
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name || ''}
//             onChange={handleChange}
//             required
//             placeholder="Enter Your Name"
//           />
//           <small>50 character(s) remaining</small>
//         </div>
//         <div className="form-buttons">
//           <button type="submit" className="submit-button">Submit</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FormDetails;













// // FormDetails.jsx
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     // Handle saving the updated form data to localStorage or backend
//     console.log('Form data saved:', formData);
//   };

//   const handleEdit = () => {
//     console.log('Edit button clicked');
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-details-container">
//       <div className="form-details-header">
//         <h2>Test Form DRISHTI</h2>
//         <div className="form-details-buttons">
//           <button className="save-button" onClick={handleSave}>Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <form className="form-details-form">
//         <div className="form-group">
//           <label htmlFor="email">
//             <span className="number-box">1</span> Email *
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email || ''}
//             onChange={handleChange}
//             required
//           />
//           <small>This email will be used for further communications.</small>
//         </div>
//         <div className="form-group">
//           <label htmlFor="name">
//             <span className="number-box">2</span> Name *
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name || ''}
//             onChange={handleChange}
//             required
//           />
//           <small>50 character(s) remaining</small>
//         </div>
//         <div className="form-buttons">
//           <button type="submit" className="submit-button">Submit</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FormDetails;















// // FormDetails.jsx
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state || {};
//   const [formData, setFormData] = useState(form || {});
//   const navigate = useNavigate();

//   if (!form) {
//     return <p>No form data available.</p>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     // Handle saving the updated form data to localStorage or backend
//     console.log('Form data saved:', formData);
//   };

//   const handleEdit = () => {
//     console.log('Edit button clicked');
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-details-container">
//       <div className="form-details-header">
//         <h2>Test Form DRISHTI</h2>
//         <div className="form-details-buttons">
//           <button className="save-button" onClick={handleSave}>Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={handleClose}>Close</button>
//         </div>
//       </div>
//       <form className="form-details-form">
//         <div className="form-group">
//           <label htmlFor="email">1. Email *</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email || ''}
//             onChange={handleChange}
//             required
//           />
//           <small>This email will be used for further communications.</small>
//         </div>
//         <div className="form-group">
//           <label htmlFor="name">2. Name *</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name || ''}
//             onChange={handleChange}
//             required
//           />
//           <small>50 character(s) remaining</small>
//         </div>
//         <div className="form-buttons">
//           <button type="submit" className="submit-button">Submit</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FormDetails;











// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import './FormDetails.css';

// const FormDetails = () => {
//   const location = useLocation();
//   const { form } = location.state;

//   return (
//     <div className="form-details">
//       <header className="header-form-details">
//         <h1>{form.title}</h1>
//       </header>
//       <section className="form-content-details">
//         <form className="form-content-details">
//           <div className="form-group">
//             <label htmlFor="email">Email *</label>
//             <input type="email" id="email" name="email" placeholder="Enter Your Email" required />
//             <small>This email will be used for further communications.</small>
//           </div>
//           <div className="form-group">
//             <label htmlFor="name">Name *</label>
//             <input type="text" id="name" name="name" placeholder="Enter Your Name" required />
//             <small>50 character(s) remaining</small>
//           </div>
//           <button type="submit" className="submit-button">Submit</button>
//         </form>
//       </section>
//     </div>
//   );
// };

// export default FormDetails;














// import React from 'react';
// import { useParams } from 'react-router-dom';
// import './FormDetails.css'; // Assuming you have CSS for the form details

// const FormDetails = () => {
//   const { id } = useParams();
//   const forms = JSON.parse(localStorage.getItem('forms'));
//   const form = forms[id];

//   return (
//     <div className="form-details-page">
//       <header className="form-header">
//         <h2>{form.title}</h2>
//       </header>
//       <div className="form-content">
//         <div className="form-element">
//           <label>Email *</label>
//           <input type="email" placeholder="Enter Your Email" />
//           <p>This email will be used for further communications.</p>
//         </div>
//         <div className="form-element">
//           <label>Name *</label>
//           <input type="text" placeholder="Enter Your Name" />
//         </div>
//         <button type="submit">Submit</button>
//       </div>
//     </div>
//   );
// };

// export default FormDetails;








// import React from 'react';
// import './FormDetails.css';

// const FormDetails = () => {
//   const form = {
//     title: "test",
//     questions: [
//       {
//         id: 1,
//         type: "email",
//         label: "Email",
//       },
//       {
//         id: 2,
//         type: "text",
//         label: "Name",
//       },
//     ],
//   };

//   return (
//     <div className="form-details-page">
//       <header className="form-header">
//         <h2>{form.title}</h2>
//       </header>
//       <div className="form-builder">
//         <div className="question-type">
//           <h3>Question Type</h3>
//           <ul>
//             <li>Short Answer</li>
//             <li>Long Answer</li>
//             <li>Single Select</li>
//             <li>Multiple Select</li>
//             <li>File Upload</li>
//             <li>Switch (True/False)</li>
//             <li>Slider (Marks/Ratings)</li>
//             <li>Date</li>
//             <li>Multiple Rows</li>
//           </ul>
//         </div>
//         <div className="form-area">
//           <div className="hints">
//             <h3>Hints</h3>
//             <p>Drop your question type below</p>
//             <p>'Name' & 'Email' fields are compulsory</p>
//             <p>Include 'Startup Name' field to capture startup names</p>
//           </div>
//           <div className="questions-list">
//             {form.questions.map((question, index) => (
//               <div key={question.id} className="question-item">
//                 <span className="question-number">{index + 1}</span>
//                 <span className="question-label">{question.label}</span>
//                 <span className="question-type">{question.type}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormDetails;
