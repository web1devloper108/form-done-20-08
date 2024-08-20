// ///////good code before contact no +91
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import './FormPreview.css';

const FormPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

  const validationSchema = Yup.object().shape(
    formElements.reduce((acc, element) => {
      let validator = element.type === 'multiselect' ? Yup.array().of(Yup.string()) : Yup.string();
      if (element.required) {
        validator = validator.required('This field is required');
      }
      if (element.type === 'email') {
        validator = validator.email('Invalid email address');
      }
      if (element.type === 'url') {
        validator = validator.url('Invalid URL');
      }
      if (element.type === 'number') {
        validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
      }
      if (element.maxLength && element.label !== 'Startup team size') { // <-- Added condition here
        validator = validator.max(element.maxLength, `Maximum ${element.maxLength} characters`);
      }
      if (element.minLength) {
        validator = validator.min(element.minLength, `Minimum ${element.minLength} characters`);
      }
      acc[element.label] = validator;
      return acc;
    }, {})
  );

  const handleEdit = () => {
    navigate('/form-builder', { state: { formElements, formTitle, formId } });
  };

  const handleSave = async (values) => {
    for (let element of formElements) {
      if (!element.label) {
        toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
        return;
      }
    }

    const formData = {
      id: formId || new Date().getTime().toString(),
      title: formTitle,
      fields: formElements,
      lastModified: new Date().toISOString(), 
      category: 'Default',
      label: 'Default Label',
      status: 'Active',
    };

    try {
      const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) { 
        toast.success("Form saved successfully");
        setTimeout(() => {
          navigate('/form');
        }, 2000);
      } else {
        toast.error("Failed to save form");
        console.error(result);
      }
    } catch (error) {
      toast.error("Error saving form structure");
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-preview-containerformpreview">
      <ToastContainer position="bottom-right" />
      <div className="form-preview-headerformpreview">
        <h2>{formTitle}</h2>
        <div className="form-preview-buttonsformpreview">
          <button className="form-preview-save-buttonformpreview" onClick={() => handleSave()}>Save</button>
          <button className="form-preview-edit-buttonformpreview" onClick={handleEdit}>Edit</button>
          <button className="form-preview-close-buttonformpreview" onClick={() => navigate('/form')}>Close</button>
        </div>
      </div>
      <div className="form-preview-boxformpreview">
        <Formik
          initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: element.type === 'multiselect' ? [] : '' }), {})}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {formElements.map((element, index) => (
                <div key={index} className="form-groupformpreview" >
                  <label>
                    <span className="form-preview-label-numberformpreview" >{index + 1}</span>
                    {element.label}
                    {element.required && <span className="requiredformpreview">*</span>}
                  </label>
                  {element.type === 'select' ? (
                    <Field as="select" name={element.label} className="custom-form-inputformpreview" required={element.required}>
                      <option value="">Select...</option>
                      {element.options.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </Field>
                  ) : element.type === 'multiselect' ? (
                    element.options.map((option, idx) => (
                      <div key={idx} className="multiselect-option-formpreview" >
                        <input
                          type="checkbox"
                          name={element.label}
                          value={option}
                          checked={values[element.label].includes(option)}
                          onChange={(e) => {
                            const set = new Set(values[element.label]);
                            if (set.has(option)) {
                              set.delete(option);
                            } else if (set.size < element.maxSelect) {
                              set.add(option);
                            }
                            setFieldValue(element.label, Array.from(set));
                          }} 
                        />
                        <label>{option}</label>
                      </div>
                    ))
                  ) : element.type === 'radio' ? (
                    element.options.map((option, idx) => (
                      <div key={idx} className="radio-option-formpreview">
                        <Field
                          type="radio"
                          name={element.label}
                          value={option}
                          className="radio-input-formpreview"
                        />
                        <label>{option}</label>
                      </div>
                    ))
                  ) : (
                    <Field
                      name={element.label}
                      type={element.type}
                      placeholder={element.placeholder}
                      className="custom-form-inputformpreview"
                      maxLength={element.maxLength || undefined}
                    />
                  )}
                  <ErrorMessage name={element.label} component="div" className="error-messageformpreview" />
                  {(element.label !== 'Contact Number' && element.label !== 'Startup team size') && (element.maxLength || element.minLength) && (
                    <div className="character-limit-formpreview">
                      {element.maxLength && `${element.maxLength - (values[element.label]?.length || 0)} characters remaining`}
                      {element.minLength && (values[element.label]?.length || 0) < element.minLength && ` (Min: ${element.minLength} characters)`}
                    </div>
                  )}
                </div>
              ))}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FormPreview;







/* ///////////////////////input not same because of contact number third party module  */
// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import PhoneInput from 'react-phone-input-2'; // Import the PhoneInput component
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import 'react-phone-input-2/lib/style.css'; // Import the CSS for react-phone-input-2
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = element.type === 'multiselect' ? Yup.array().of(Yup.string()) : Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       if (element.maxLength && element.label !== 'Startup team size') { // <-- Added condition here
//         validator = validator.max(element.maxLength, `Maximum ${element.maxLength} characters`);
//       }
//       if (element.minLength) {
//         validator = validator.min(element.minLength, `Minimum ${element.minLength} characters`);
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsformpreview">
//           <button className="form-preview-save-buttonformpreview" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-buttonformpreview" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-buttonformpreview" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-boxformpreview">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: element.type === 'multiselect' ? [] : '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           {({ values, setFieldValue }) => (
//             <Form>
//               {formElements.map((element, index) => (
//                 <div key={index} className="form-groupformpreview">
//                   <label>
//                     <span className="form-preview-label-numberformpreview">{index + 1}</span>
//                     {element.label}
//                     {element.required && <span className="requiredformpreview">*</span>}
//                   </label>
//                   {element.type === 'select' ? (
//                     <Field as="select" name={element.label} className="custom-form-inputformpreview" required={element.required}>
//                       <option value="">Select...</option>
//                       {element.options.map((option, idx) => (
//                         <option key={idx} value={option}>{option}</option>
//                       ))}
//                     </Field>
//                   ) : element.type === 'multiselect' ? (
//                     element.options.map((option, idx) => (
//                       <div key={idx} className="multiselect-option-formpreview">
//                         <input
//                           type="checkbox"
//                           name={element.label}
//                           value={option}
//                           checked={values[element.label].includes(option)}
//                           onChange={(e) => {
//                             const set = new Set(values[element.label]);
//                             if (set.has(option)) {
//                               set.delete(option);
//                             } else if (set.size < element.maxSelect) {
//                               set.add(option);
//                             }
//                             setFieldValue(element.label, Array.from(set));
//                           }}
//                         />
//                         <label>{option}</label>
//                       </div>
//                     ))
//                   ) : element.type === 'radio' ? (
//                     element.options.map((option, idx) => (
//                       <div key={idx} className="radio-option-formpreview">
//                         <Field
//                           type="radio"
//                           name={element.label}
//                           value={option}
//                           className="radio-input-formpreview"
//                         />
//                         <label>{option}</label>
//                       </div>
//                     ))
//                   ) : element.type === 'phone' ? ( // Add phone number input
//                     <PhoneInput
//                       country={'us'}
//                       value={values[element.label]}
//                       onChange={(value) => setFieldValue(element.label, value)}
//                       inputClass="custom-form-inputformpreview" // Match the class name
//                       required={element.required}
//                     />
//                   ) : (
//                     <Field
//                       name={element.label}
//                       type={element.type}
//                       placeholder={element.placeholder}
//                       className="custom-form-inputformpreview"
//                       maxLength={element.maxLength || undefined}
//                     />
//                   )}
//                   <ErrorMessage name={element.label} component="div" className="error-messageformpreview" />
//                   {(element.label !== 'Contact Number' && element.label !== 'Startup team size') && (element.maxLength || element.minLength) && (
//                     <div className="character-limit-formpreview">
//                       {element.maxLength && `${element.maxLength - (values[element.label]?.length || 0)} characters remaining`}
//                       {element.minLength && (values[element.label]?.length || 0) < element.minLength && ` (Min: ${element.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;









//////////contact se remove bt not team se

// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = element.type === 'multiselect' ? Yup.array().of(Yup.string()) : Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       if (element.maxLength) {
//         validator = validator.max(element.maxLength, `Maximum ${element.maxLength} characters`);
//       }
//       if (element.minLength) {
//         validator = validator.min(element.minLength, `Minimum ${element.minLength} characters`);
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(), 
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) { 
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsformpreview">
//           <button className="form-preview-save-buttonformpreview" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-buttonformpreview" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-buttonformpreview" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-boxformpreview">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: element.type === 'multiselect' ? [] : '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           {({ values, setFieldValue }) => (
//             <Form>
//               {formElements.map((element, index) => (
//                 <div key={index} className="form-groupformpreview" >
//                   <label>
//                     <span className="form-preview-label-numberformpreview" >{index + 1}</span>
//                     {element.label}
//                     {element.required && <span className="requiredformpreview">*</span>}
//                   </label>
//                   {element.type === 'select' ? (
//                     <Field as="select" name={element.label} className="custom-form-inputformpreview" required={element.required}>
//                       <option value="">Select...</option>
//                       {element.options.map((option, idx) => (
//                         <option key={idx} value={option}>{option}</option>
//                       ))}
//                     </Field>
//                   ) : element.type === 'multiselect' ? (
//                     element.options.map((option, idx) => (
//                       <div key={idx} className="multiselect-option-formpreview" >
//                         <input
//                           type="checkbox"
//                           name={element.label}
//                           value={option}
//                           checked={values[element.label].includes(option)}
//                           onChange={(e) => {
//                             const set = new Set(values[element.label]);
//                             if (set.has(option)) {
//                               set.delete(option);
//                             } else if (set.size < element.maxSelect) {
//                               set.add(option);
//                             }
//                             setFieldValue(element.label, Array.from(set));
//                           }} 
//                         />
//                         <label>{option}</label>
//                       </div>
//                     ))
//                   ) : element.type === 'radio' ? ( /* Highlighted: Start of new radio button logic */
//                     element.options.map((option, idx) => (
//                       <div key={idx} className="radio-option-formpreview">
//                         <Field
//                           type="radio"
//                           name={element.label}
//                           value={option}
//                           className="radio-input-formpreview"
//                         />
//                         <label>{option}</label>
//                       </div>
//                     ))
//                   ) : ( /* Highlighted: End of new radio button logic */
//                     <Field
//                       name={element.label}
//                       type={element.type}
//                       placeholder={element.placeholder}
//                       className="custom-form-inputformpreview"
//                       maxLength={element.maxLength || undefined}
//                     />
//                   )}
//                   <ErrorMessage name={element.label} component="div" className="error-messageformpreview" />
//                   {element.label !== 'Contact Number' && element.label !== 'Startup team size' && (element.maxLength || element.minLength) && ( /* Highlighted: Start of exclusion logic */
//                     <div className="character-limit-formpreview">
//                       {element.maxLength && `${element.maxLength - (values[element.label]?.length || 0)} characters remaining`}
//                       {element.minLength && (values[element.label]?.length || 0) < element.minLength && ` (Min: ${element.minLength} characters)`}
//                     </div>
//                   ) /* Highlighted: End of exclusion logic */}
//                 </div>
//               ))}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;




////        contact num. char limit



// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = element.type === 'multiselect' ? Yup.array().of(Yup.string()) : Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       if (element.maxLength) {
//         validator = validator.max(element.maxLength, `Maximum ${element.maxLength} characters`);
//       }
//       if (element.minLength) {
//         validator = validator.min(element.minLength, `Minimum ${element.minLength} characters`);
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(), 
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) { 
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsformpreview">
//           <button className="form-preview-save-buttonformpreview" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-buttonformpreview" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-buttonformpreview" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-boxformpreview">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: element.type === 'multiselect' ? [] : '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           {({ values, setFieldValue }) => (
//             <Form>
//               {formElements.map((element, index) => (
//                 <div key={index} className="form-groupformpreview" >
//                   <label>
//                     <span className="form-preview-label-numberformpreview" >{index + 1}</span>
//                     {element.label}
//                     {element.required && <span className="requiredformpreview">*</span>}
//                   </label>
//                   {element.type === 'select' ? (
//                     <Field as="select" name={element.label} className="custom-form-inputformpreview" required={element.required}>
//                       <option value="">Select...</option>
//                       {element.options.map((option, idx) => (
//                         <option key={idx} value={option}>{option}</option>
//                       ))}
//                     </Field>
//                   ) : element.type === 'multiselect' ? (
//                     element.options.map((option, idx) => (
//                       <div key={idx} className="multiselect-option-formpreview" >
//                         <input
//                           type="checkbox"
//                           name={element.label}
//                           value={option}
//                           checked={values[element.label].includes(option)}
//                           onChange={(e) => {
//                             const set = new Set(values[element.label]);
//                             if (set.has(option)) {
//                               set.delete(option);
//                             } else if (set.size < element.maxSelect) {
//                               set.add(option);
//                             }
//                             setFieldValue(element.label, Array.from(set));
//                           }} 
//                         />
//                         <label>{option}</label>
//                       </div>
//                     ))
//                   ) : element.type === 'radio' ? ( /* Highlighted: Start of new radio button logic */
//                     element.options.map((option, idx) => (
//                       <div key={idx} className="radio-option-formpreview">
//                         <Field
//                           type="radio"
//                           name={element.label}
//                           value={option}
//                           className="radio-input-formpreview"
//                         />
//                         <label>{option}</label>
//                       </div>
//                     ))
//                   ) : ( /* Highlighted: End of new radio button logic */
//                     <Field
//                       name={element.label}
//                       type={element.type}
//                       placeholder={element.placeholder}
//                       className="custom-form-inputformpreview"
//                       maxLength={element.maxLength || undefined}
//                     />
//                   )}
//                   <ErrorMessage name={element.label} component="div" className="error-messageformpreview" />
//                   {(element.maxLength || element.minLength) && (
//                     <div className="character-limit-formpreview">
//                       {element.maxLength && `${element.maxLength - (values[element.label]?.length || 0)} characters remaining`}
//                       {element.minLength && (values[element.label]?.length || 0) < element.minLength && ` (Min: ${element.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;
















//////////before radio 

// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = element.type === 'multiselect' ? Yup.array().of(Yup.string()) : Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       if (element.maxLength) {
//         validator = validator.max(element.maxLength, `Maximum ${element.maxLength} characters`);
//       }
//       if (element.minLength) {
//         validator = validator.min(element.minLength, `Minimum ${element.minLength} characters`);
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(), 
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) { 
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsformpreview">
//           <button className="form-preview-save-buttonformpreview" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-buttonformpreview" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-buttonformpreview" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-boxformpreview">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: element.type === 'multiselect' ? [] : '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           {({ values, setFieldValue }) => (
//             <Form>
//               {formElements.map((element, index) => (
//                 <div key={index} className="form-groupformpreview" >
//                   <label>
//                     <span className="form-preview-label-numberformpreview" >{index + 1}</span>
//                     {element.label}
//                     {element.required && <span className="requiredformpreview">*</span>}
//                   </label>
//                   {element.type === 'select' ? (
//                     <Field as="select" name={element.label} className="custom-form-inputformpreview" required={element.required}>
//                       <option value="">Select...</option>
//                       {element.options.map((option, idx) => (
//                         <option key={idx} value={option}>{option}</option>
//                       ))}
//                     </Field>
//                   ) : element.type === 'multiselect' ? (
//                     element.options.map((option, idx) => (
//                       <div key={idx} className="multiselect-option-formpreview" >
//                         <input
//                           type="checkbox"
//                           name={element.label}
//                           value={option}
//                           checked={values[element.label].includes(option)}
//                           onChange={(e) => {
//                             const set = new Set(values[element.label]);
//                             if (set.has(option)) {
//                               set.delete(option);
//                             } else if (set.size < element.maxSelect) {
//                               set.add(option);
//                             }
//                             setFieldValue(element.label, Array.from(set));
//                           }} 
//                         />
//                         <label>{option}</label>
//                       </div>
//                     ))
//                   ) : (
//                     <Field
//                       name={element.label}
//                       type={element.type}
//                       placeholder={element.placeholder}
//                       className="custom-form-inputformpreview"
//                       maxLength={element.maxLength || undefined}
//                     />
//                   )}
//                   <ErrorMessage name={element.label} component="div" className="error-messageformpreview" />
//                   {(element.maxLength || element.minLength) && (
//                     <div className="character-limit-formpreview">
//                       {element.maxLength && `${element.maxLength - (values[element.label]?.length || 0)} characters remaining`}
//                       {element.minLength && (values[element.label]?.length || 0) < element.minLength && ` (Min: ${element.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;















// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = element.type === 'multiselect' ? Yup.array().of(Yup.string()) : Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       if (element.maxLength) {
//         validator = validator.max(element.maxLength, `Maximum ${element.maxLength} characters`);
//       }
//       if (element.minLength) {
//         validator = validator.min(element.minLength, `Minimum ${element.minLength} characters`);
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsformpreview">
//           <button className="form-preview-save-buttonformpreview" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-buttonformpreview" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-buttonformpreview" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-boxformpreview">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: element.type === 'multiselect' ? [] : '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           {({ values, setFieldValue }) => (
//             <Form>
//               {formElements.map((element, index) => (
//                 <div key={index} className="form-groupformpreview">
//                   <label>
//                     <span className="form-preview-label-numberformpreview">{index + 1}</span>
//                     {element.label}
//                     {element.required && <span className="requiredformpreview">*</span>}
//                   </label>
//                   {element.type === 'select' ? (
//                     <Field as="select" name={element.label} className="custom-form-inputformpreview" required={element.required}>
//                       <option value="">Select...</option>
//                       {element.options.map((option, idx) => (
//                         <option key={idx} value={option}>{option}</option>
//                       ))}
//                     </Field>
//                   ) : element.type === 'multiselect' ? (
//                     element.options.map((option, idx) => (
//                       <div key={idx} className="multiselect-option-formpreview" style={{fontSize:'13px'}}>
//                         <input
//                           type="checkbox"
//                           name={element.label}
//                           value={option}
//                           checked={values[element.label].includes(option)}
//                           onChange={(e) => {
//                             const set = new Set(values[element.label]);
//                             if (set.has(option)) {
//                               set.delete(option);
//                             } else if (set.size < element.maxSelect) {
//                               set.add(option);
//                             }
//                             setFieldValue(element.label, Array.from(set));
//                           }}
//                         />
//                         <label>{option}</label>
//                       </div>
//                     ))
//                   ) : (
//                     <Field
//                       name={element.label}
//                       type={element.type}
//                       placeholder={element.placeholder}
//                       className="custom-form-inputformpreview"
//                       maxLength={element.maxLength || undefined}
//                     />
//                   )}
//                   <ErrorMessage name={element.label} component="div" className="error-messageformpreview" />
//                   {(element.maxLength || element.minLength) && (
//                     <div className="character-limit-formpreview">
//                       {element.maxLength && `${element.maxLength - (values[element.label]?.length || 0)} characters remaining`}
//                       {element.minLength && (values[element.label]?.length || 0) < element.minLength && ` (Min: ${element.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;




//////multi all  ok but not style 

// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = element.type === 'multiselect' ? Yup.array().of(Yup.string()) : Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       if (element.maxLength) {
//         validator = validator.max(element.maxLength, `Maximum ${element.maxLength} characters`);
//       }
//       if (element.minLength) {
//         validator = validator.min(element.minLength, `Minimum ${element.minLength} characters`);
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsformpreview">
//           <button className="form-preview-save-buttonformpreview" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-buttonformpreview" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-buttonformpreview" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-boxformpreview">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: element.type === 'multiselect' ? [] : '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           {({ values, setFieldValue }) => (
//             <Form>
//               {formElements.map((element, index) => (
//                 <div key={index} className="form-groupformpreview">
//                   <label>
//                     <span className="form-preview-label-numberformpreview">{index + 1}</span>
//                     {element.label}
//                     {element.required && <span className="requiredformpreview">*</span>}
//                   </label>
//                   {element.type === 'select' ? (
//                     <Field as="select" name={element.label} className="custom-form-inputformpreview" required={element.required}>
//                       <option value="">Select...</option>
//                       {element.options.map((option, idx) => (
//                         <option key={idx} value={option}>{option}</option>
//                       ))}
//                     </Field>
//                   ) : element.type === 'multiselect' ? (
//                     element.options.map((option, idx) => (
//                       <div key={idx}>
//                         <input
//                           type="checkbox"
//                           name={element.label}
//                           value={option}
//                           checked={values[element.label].includes(option)}
//                           onChange={(e) => {
//                             const set = new Set(values[element.label]);
//                             if (set.has(option)) {
//                               set.delete(option);
//                             } else if (set.size < element.maxSelect) {
//                               set.add(option);
//                             }
//                             setFieldValue(element.label, Array.from(set));
//                           }}
//                         />
//                         <label>{option}</label>
//                       </div>
//                     ))
//                   ) : (
//                     <Field
//                       name={element.label}
//                       type={element.type}
//                       placeholder={element.placeholder}
//                       className="custom-form-inputformpreview"
//                       maxLength={element.maxLength || undefined}
//                     />
//                   )}
//                   <ErrorMessage name={element.label} component="div" className="error-messageformpreview" />
//                   {(element.maxLength || element.minLength) && (
//                     <div className="character-limit-formpreview">
//                       {element.maxLength && `${element.maxLength - (values[element.label]?.length || 0)} characters remaining`}
//                       {element.minLength && (values[element.label]?.length || 0) < element.minLength && ` (Min: ${element.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;






///////////////all Input work , max min ok


// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       if (element.maxLength) {
//         validator = validator.max(element.maxLength, `Maximum ${element.maxLength} characters`);
//       }
//       if (element.minLength) {
//         validator = validator.min(element.minLength, `Minimum ${element.minLength} characters`);
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsformpreview">
//           <button className="form-preview-save-buttonformpreview" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-buttonformpreview" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-buttonformpreview" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-boxformpreview">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           {({ values }) => (
//             <Form>
//               {formElements.map((element, index) => (
//                 <div key={index} className="form-groupformpreview">
//                   <label>
//                     <span className="form-preview-label-numberformpreview">{index + 1}</span>
//                     {element.label}
//                     {element.required && <span className="requiredformpreview">*</span>}
//                   </label>
//                   {element.type === 'select' ? (
//                     <Field as="select" name={element.label} className="custom-form-inputformpreview" required={element.required}>
//                       <option value="">Select...</option>
//                       {element.options.map((option, idx) => (
//                         <option key={idx} value={option}>{option}</option>
//                       ))}
//                     </Field>
//                   ) : (
//                     <Field
//                       name={element.label}
//                       type={element.type}
//                       placeholder={element.placeholder}
//                       className="custom-form-inputformpreview"
//                       maxLength={element.maxLength || undefined}
//                     />
//                   )}
//                   <ErrorMessage name={element.label} component="div" className="error-messageformpreview" />
//                   {(element.maxLength || element.minLength) && (
//                     <div className="character-limit-formpreview">
//                       {element.maxLength && `${element.maxLength - (values[element.label]?.length || 0)} characters remaining`}
//                       {element.minLength && (values[element.label]?.length || 0) < element.minLength && ` (Min: ${element.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;








////////////b  single select 



// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       if (element.maxLength) {
//         validator = validator.max(element.maxLength, `Maximum ${element.maxLength} characters`);
//       }
//       if (element.minLength) {
//         validator = validator.min(element.minLength, `Minimum ${element.minLength} characters`);
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsformpreview">
//           <button className="form-preview-save-buttonformpreview" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-buttonformpreview" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-buttonformpreview" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-boxformpreview">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           {({ values }) => (
//             <Form>
//               {formElements.map((element, index) => (
//                 <div key={index} className="form-groupformpreview">
//                   <label>
//                     <span className="form-preview-label-numberformpreview">{index + 1}</span>
//                     {element.label}
//                     {element.required && <span className="requiredformpreview">*</span>}
//                   </label>
//                   <Field
//                     name={element.label}
//                     type={element.type}
//                     placeholder={element.placeholder}
//                     className="custom-form-inputformpreview"
//                     maxLength={element.maxLength || undefined}
//                   />
//                   <ErrorMessage name={element.label} component="div" className="error-messageformpreview" />
//                   {(element.maxLength || element.minLength) && (
//                     <div className="character-limit-formpreview">
//                       {element.maxLength && `${element.maxLength - (values[element.label]?.length || 0)} characters remaining`}
//                       {element.minLength && (values[element.label]?.length || 0) < element.minLength && ` (Min: ${element.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;



//////max ok

// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       if (element.maxLength) {
//         validator = validator.max(element.maxLength, `Maximum ${element.maxLength} characters`);
//       }
//       if (element.minLength) {
//         validator = validator.min(element.minLength, `Minimum ${element.minLength} characters`);
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsformpreview">
//           <button className="form-preview-save-buttonformpreview" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-buttonformpreview" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-buttonformpreview" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-boxformpreview">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           {({ values }) => (
//             <Form>
//               {formElements.map((element, index) => (
//                 <div key={index} className="form-groupformpreview">
//                   <label>
//                     <span className="form-preview-label-numberformpreview">{index + 1}</span>
//                     {element.label}
//                     {element.required && <span className="requiredformpreview">*</span>}
//                   </label>
//                   <Field
//                     name={element.label}
//                     type={element.type}
//                     placeholder={element.placeholder}
//                     className="custom-form-inputformpreview"
//                     maxLength={element.maxLength || undefined}
//                   />
//                   <ErrorMessage name={element.label} component="div" className="error-messageformpreview" />
//                   {(element.maxLength || element.minLength) && (
//                     <div className="character-limit-formpreview">
//                       {element.maxLength && `${element.maxLength - (values[element.label]?.length || 0)} characters remaining`}
//                       {element.minLength && ` (Min: ${element.minLength} characters)`}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;








//////b 0 to 50

// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-containerformpreview">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-headerformpreview">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttonsformpreview">
//           <button className="form-preview-save-buttonformpreview" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-buttonformpreview" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-buttonformpreview" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-boxformpreview">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           <Form>
//             {formElements.map((element, index) => (
//               <div key={index} className="form-groupformpreview">
//                 <label>
//                   <span className="form-preview-label-numberformpreview">{index + 1}</span>
//                   {element.label}
//                   {element.required && <span className="requiredformpreview">*</span>}
//                 </label>
//                 {element.type === 'select' ? (
//                   <Field as="select" name={element.label} className="custom-form-inputformpreview">
//                     <option value="">Select...</option>
//                     {element.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </Field>
//                 ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                   <Field
//                     name={element.label}
//                     type="file"
//                     accept="application/pdf"
//                     className="custom-form-inputformpreview"
//                   />
//                 ) : element.type === 'file' && element.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                   <Field
//                     name={element.label}
//                     type="file"
//                     accept="image/png, image/jpeg"
//                     className="custom-form-inputformpreview"
//                   />
//                 ) : (
//                   <Field
//                     name={element.label}
//                     type={element.type}
//                     placeholder={element.placeholder}
//                     className="custom-form-inputformpreview"
//                   />
//                 )}
//                 <ErrorMessage name={element.label} component="div" className="error-messageformpreview" />
//               </div>
//             ))}
//             {/* <button type="submit" className="form-preview-submit-buttonformpreview" style={{width:"100px"}}>Submit</button> */}
//           </Form>
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;















/* // /////before css class selector  */


// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           <Form>
//             {formElements.map((element, index) => (
//               <div key={index} className="form-group">
//                 <label>
//                   <span className="form-preview-label-number">{index + 1}</span>
//                   {element.label}
//                   {element.required && <span className="required">*</span>}
//                 </label>
//                 {element.type === 'select' ? (
//                   <Field as="select" name={element.label} className="custom-form-input">
//                     <option value="">Select...</option>
//                     {element.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </Field>
//                 ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                   <Field
//                     name={element.label}
//                     type="file"
//                     accept="application/pdf"
//                     className="custom-form-input"
//                   />
//                 ) : element.type === 'file' && element.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                   <Field
//                     name={element.label}
//                     type="file"
//                     accept="image/png, image/jpeg"
//                     className="custom-form-input"
//                   />
//                 ) : (
//                   <Field
//                     name={element.label}
//                     type={element.type}
//                     placeholder={element.placeholder}
//                     className="custom-form-input"
//                   />
//                 )}
//                 <ErrorMessage name={element.label} component="div" className="error-message" />
//               </div>
//             ))}
//             <button type="submit" className="form-preview-submit-button">Submit</button>
//           </Form>
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;































/////////before nestedd dnd

// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const validationSchema = Yup.object().shape(
//     formElements.reduce((acc, element) => {
//       let validator = Yup.string();
//       if (element.required) {
//         validator = validator.required('This field is required');
//       }
//       if (element.type === 'email') {
//         validator = validator.email('Invalid email address');
//       }
//       if (element.type === 'url') {
//         validator = validator.url('Invalid URL');
//       }
//       if (element.type === 'number') {
//         validator = validator.matches(/^[0-9]+$/, 'Must be only digits');
//       }
//       acc[element.label] = validator;
//       return acc;
//     }, {})
//   );

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async (values) => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={() => handleSave()}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <Formik
//           initialValues={formElements.reduce((acc, element) => ({ ...acc, [element.label]: '' }), {})}
//           validationSchema={validationSchema}
//           onSubmit={handleSave}
//         >
//           <Form>
//             {formElements.map((element, index) => (
//               <div key={index} className="form-group">
//                 <label>
//                   <span className="form-preview-label-number">{index + 1}</span>
//                   {element.label}
//                   {element.required && <span className="required">*</span>}
//                 </label>
//                 {element.type === 'select' ? (
//                   <Field as="select" name={element.label} className="custom-form-input">
//                     <option value="">Select...</option>
//                     {element.options.map((option, optionIndex) => (
//                       <option key={optionIndex} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </Field>
//                 ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                   <Field
//                     name={element.label}
//                     type="file"
//                     accept="application/pdf"
//                     className="custom-form-input"
//                   />
//                 ) : element.type === 'file' && element.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                   <Field
//                     name={element.label}
//                     type="file"
//                     accept="image/png, image/jpeg"
//                     className="custom-form-input"
//                   />
//                 ) : (
//                   <Field
//                     name={element.label}
//                     type={element.type}
//                     placeholder={element.placeholder}
//                     className="custom-form-input"
//                   />
//                 )}
//                 <ErrorMessage name={element.label} component="div" className="error-message" />
//               </div>
//             ))}
//             <button type="submit" className="form-preview-submit-button">Submit</button>
//           </Form>
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;





















// ///////before validation work ok



// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file) {
//       if (label === 'Resume (PDF Format Only)' && file.type !== 'application/pdf') {
//         alert('Please upload a PDF file.');
//       } else if (label === 'Upload Startup Logo (In PNG/JPG Format)' && !['image/png', 'image/jpeg'].includes(file.type)) {
//         alert('Please upload a PNG or JPG file.');
//       } else {
//         setFormValues(prevValues => ({
//           ...prevValues,
//           [label]: file
//         }));
//       }
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async () => {
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default',
//       label: 'Default Label',
//       status: 'Active',
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : element.type === 'file' && element.label === 'Upload Startup Logo (In PNG/JPG Format)' ? (
//                 <input
//                   type="file"
//                   accept="image/png, image/jpeg"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;
























//////no PNG / JPG 


// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFormValues(prevValues => ({
//         ...prevValues,
//         [label]: file
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async () => {
//     // Check if all labels are filled
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default', // Adjust as necessary
//       label: 'Default Label', // Adjust as necessary
//       status: 'Active', // Adjust as necessary
//     };

//     try {
//       // Highlighted Change: Correct endpoint and HTTP method for saving form structure
//       const response = await fetch(`http://localhost:5000/api/forms/general/${formId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;








///////b 8 api

// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFormValues(prevValues => ({
//         ...prevValues,
//         [label]: file
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async () => {
//     // Check if all labels are filled
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default', // Adjust as necessary
//       label: 'Default Label', // Adjust as necessary
//       status: 'Active', // Adjust as necessary
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/forms/${formData.title}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;








// bfov   10/07/



// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFormValues(prevValues => ({
//         ...prevValues,
//         [label]: file
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async () => {
//     // Check if all labels are filled
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default', // Adjust as necessary
//       label: 'Default Label', // Adjust as necessary
//       status: 'Active', // Adjust as necessary
//     };

//     try {
//       const response = await fetch(`http://localhost:5000/api/generalFormStructure/${formData.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;




















///b put in f structure 


// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   }); 

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFormValues(prevValues => ({
//         ...prevValues,
//         [label]: file
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = async () => {
//     // Check if all labels are filled
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       id: formId || new Date().getTime().toString(),
//       title: formTitle,
//       fields: formElements,
//       lastModified: new Date().toISOString(),
//       category: 'Default', // Adjust as necessary
//       label: 'Default Label', // Adjust as necessary
//       status: 'Active', // Adjust as necessary
//     };

//     try {
//       const response = await fetch('http://localhost:5000/api/generalFormStructure', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success("Form saved successfully");
//         setTimeout(() => {
//           navigate('/form');
//         }, 2000);
//       } else {
//         toast.error("Failed to save form");
//         console.error(result);
//       }
//     } catch (error) {
//       toast.error("Error saving form structure");
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;















// bef form save in backend



// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   }); 

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFormValues(prevValues => ({
//         ...prevValues,
//         [label]: file
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = () => {
//     // Check if all labels are filled
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       title: formTitle,
//       formElements,
//       _id: formId,
//       lastModified: new Date().toISOString(),
//       category: 'Default', // Adjust as necessary
//       label: 'Default Label', // Adjust as necessary
//       status: 'Active', // Adjust as necessary
//     };

//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex((form) => form._id === formId);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));

//     const filledForms = JSON.parse(localStorage.getItem('filledForms')) || {};
//     filledForms[formId] = true;
//     localStorage.setItem('filledForms', JSON.stringify(filledForms));

//     toast.success("Success");
//     setTimeout(() => {
//       navigate(`/form`);
//     }, 2000); // Redirect after 2 seconds
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;












///////////edit but duplicate 
///////////////////
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle, formId } = location.state || { formElements: [], formTitle: '' };

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFormValues(prevValues => ({
//         ...prevValues,
//         [label]: file
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle, formId } });
//   };

//   const handleSave = () => {
//     // Check if all labels are filled
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = {
//       title: formTitle,
//       formElements,
//       _id: formId,
//       lastModified: new Date().toISOString(),
//       category: 'Default', // Adjust as necessary
//       label: 'Default Label', // Adjust as necessary
//       status: 'Active', // Adjust as necessary
//     };

//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex((form) => form._id === formId);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));

//     const filledForms = JSON.parse(localStorage.getItem('filledForms')) || {};
//     filledForms[formId] = true;
//     localStorage.setItem('filledForms', JSON.stringify(filledForms));

//     toast.success("Success");
//     setTimeout(() => {
//       navigate(`/form`);
//     }, 2000); // Redirect after 2 seconds
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;




//////////////ragular

// ////bef only one form in a table 
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle } = location.state || { formElements: [], formTitle: '' };

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFormValues(prevValues => ({
//         ...prevValues,
//         [label]: file
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle } });
//   };

//   const handleSave = () => {
//     // Check if all labels are filled
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = { title: formTitle, formElements };
//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(form => form.title === formTitle);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     toast.success("Success");
//     setTimeout(() => {
//       navigate(`/form/${formTitle}`, { state: { form: formData } });
//     }, 2000); // Redirect after 2 seconds
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;







//regular working // import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle } = location.state;

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFormValues(prevValues => ({
//         ...prevValues,
//         [label]: file.name
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle } });
//   };

//   const handleSave = () => {
//     // Check if all labels are filled
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = { title: formTitle, formElements };
//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(form => form.title === formTitle);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     toast.success("Success");
//     setTimeout(() => {
//       navigate(`/form/${formTitle}`, { state: { form: formData } });
//     }, 2000); // Redirect after 2 seconds
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;



///bd tost message 
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle } = location.state;

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFormValues(prevValues => ({
//         ...prevValues,
//         [label]: file.name
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle } });
//   };

//   const handleSave = () => {
//     const formData = { title: formTitle, formElements };
//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(form => form.title === formTitle);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     navigate(`/form/${formTitle}`, { state: { form: formData } });
//   };

//   return (
//     <div className="form-preview-container">
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;



















// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formTitle } = location.state || { formTitle: '' };

//   // Retrieve saved form structure from local storage if available
//   const savedFormElements = JSON.parse(localStorage.getItem(formTitle)) || [];
//   const [formElements, setFormElements] = useState(savedFormElements);

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     savedFormElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   useEffect(() => {
//     if (!savedFormElements.length) {
//       toast.error("No saved form structure found.");
//       navigate('/form-builder');
//     }
//   }, [savedFormElements, navigate]);

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFormValues(prevValues => ({
//         ...prevValues,
//         [label]: file
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle } });
//   };

//   const handleSave = () => {
//     // Check if all labels are filled
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = { title: formTitle, formElements };
//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(form => form.title === formTitle);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     localStorage.setItem(formTitle, JSON.stringify(formElements)); // Save form structure with formTitle as key
//     toast.success("Form structure saved successfully!");
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;







// ////bef only one form in a table 
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle } = location.state || { formElements: [], formTitle: '' };

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleFileChange = (label, file) => {
//     if (file && file.type === 'application/pdf') {
//       setFormValues(prevValues => ({
//         ...prevValues,
//         [label]: file
//       }));
//     } else {
//       alert('Please upload a PDF file.');
//     }
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle } });
//   };

//   const handleSave = () => {
//     // Check if all labels are filled
//     for (let element of formElements) {
//       if (!element.label) {
//         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
//         return;
//       }
//     }

//     const formData = { title: formTitle, formElements };
//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(form => form.title === formTitle);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     toast.success("Success");
//     setTimeout(() => {
//       navigate(`/form/${formTitle}`, { state: { form: formData } });
//     }, 2000); // Redirect after 2 seconds
//   };

//   return (
//     <div className="form-preview-container">
//       <ToastContainer position="bottom-right" />
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 >
//                   <option value="">Select...</option>
//                   {element.options.map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
//                   required={element.required}
//                 />
//               ) : (
//                 <input
//                   type={element.type}
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;







// //regular working // import React, { useState } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import { ToastContainer, toast } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';
// // import './FormPreview.css';

// // const FormPreview = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const { formElements, formTitle } = location.state;

// //   const [formValues, setFormValues] = useState(() => {
// //     const values = {};
// //     formElements.forEach(element => {
// //       values[element.label] = '';
// //     });
// //     return values;
// //   });

// //   const handleInputChange = (label, value) => {
// //     setFormValues(prevValues => ({
// //       ...prevValues,
// //       [label]: value
// //     }));
// //   };

// //   const handleFileChange = (label, file) => {
// //     if (file && file.type === 'application/pdf') {
// //       setFormValues(prevValues => ({
// //         ...prevValues,
// //         [label]: file.name
// //       }));
// //     } else {
// //       alert('Please upload a PDF file.');
// //     }
// //   };

// //   const handleEdit = () => {
// //     navigate('/form-builder', { state: { formElements, formTitle } });
// //   };

// //   const handleSave = () => {
// //     // Check if all labels are filled
// //     for (let element of formElements) {
// //       if (!element.label) {
// //         toast.error(`Question ${formElements.indexOf(element) + 1}: Label Not Found`);
// //         return;
// //       }
// //     }

// //     const formData = { title: formTitle, formElements };
// //     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
// //     const formIndex = savedForms.findIndex(form => form.title === formTitle);

// //     if (formIndex >= 0) {
// //       savedForms[formIndex] = formData;
// //     } else {
// //       savedForms.push(formData);
// //     }

// //     localStorage.setItem('forms', JSON.stringify(savedForms));
// //     toast.success("Success");
// //     setTimeout(() => {
// //       navigate(`/form/${formTitle}`, { state: { form: formData } });
// //     }, 2000); // Redirect after 2 seconds
// //   };

// //   return (
// //     <div className="form-preview-container">
// //       <ToastContainer position="bottom-right" />
// //       <div className="form-preview-header">
// //         <h2>{formTitle}</h2>
// //         <div className="form-preview-buttons">
// //           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
// //           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
// //           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
// //         </div>
// //       </div>
// //       <div className="form-preview-box">
// //         <form>
// //           {formElements.map((element, index) => (
// //             <div key={index} className="form-group">
// //               <label>
// //                 <span className="form-preview-label-number">{index + 1}</span>
// //                 {element.label}
// //                 {element.required && <span className="required">*</span>}
// //               </label>
// //               {element.type === 'select' ? (
// //                 <select
// //                   value={formValues[element.label]}
// //                   onChange={(e) => handleInputChange(element.label, e.target.value)}
// //                   required={element.required}
// //                 >
// //                   <option value="">Select...</option>
// //                   {element.options.map((option, optionIndex) => (
// //                     <option key={optionIndex} value={option}>
// //                       {option}
// //                     </option>
// //                   ))}
// //                 </select>
// //               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
// //                 <input
// //                   type="file"
// //                   accept="application/pdf"
// //                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
// //                   required={element.required}
// //                 />
// //               ) : (
// //                 <input
// //                   type={element.type}
// //                   placeholder={element.placeholder}
// //                   value={formValues[element.label]}
// //                   maxLength={element.maxLength}
// //                   onChange={(e) => handleInputChange(element.label, e.target.value)}
// //                   required={element.required}
// //                 />
// //               )}
// //               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
// //                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
// //               )}
// //             </div>
// //           ))}
// //           <button type="submit" className="form-preview-submit-button">Submit</button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default FormPreview;



// ///bd tost message 
// // import React, { useState } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import './FormPreview.css';

// // const FormPreview = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const { formElements, formTitle } = location.state;

// //   const [formValues, setFormValues] = useState(() => {
// //     const values = {};
// //     formElements.forEach(element => {
// //       values[element.label] = '';
// //     });
// //     return values;
// //   });

// //   const handleInputChange = (label, value) => {
// //     setFormValues(prevValues => ({
// //       ...prevValues,
// //       [label]: value
// //     }));
// //   };

// //   const handleFileChange = (label, file) => {
// //     if (file && file.type === 'application/pdf') {
// //       setFormValues(prevValues => ({
// //         ...prevValues,
// //         [label]: file.name
// //       }));
// //     } else {
// //       alert('Please upload a PDF file.');
// //     }
// //   };

// //   const handleEdit = () => {
// //     navigate('/form-builder', { state: { formElements, formTitle } });
// //   };

// //   const handleSave = () => {
// //     const formData = { title: formTitle, formElements };
// //     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
// //     const formIndex = savedForms.findIndex(form => form.title === formTitle);

// //     if (formIndex >= 0) {
// //       savedForms[formIndex] = formData;
// //     } else {
// //       savedForms.push(formData);
// //     }

// //     localStorage.setItem('forms', JSON.stringify(savedForms));
// //     navigate(`/form/${formTitle}`, { state: { form: formData } });
// //   };

// //   return (
// //     <div className="form-preview-container">
// //       <div className="form-preview-header">
// //         <h2>{formTitle}</h2>
// //         <div className="form-preview-buttons">
// //           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
// //           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
// //           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
// //         </div>
// //       </div>
// //       <div className="form-preview-box">
// //         <form>
// //           {formElements.map((element, index) => (
// //             <div key={index} className="form-group">
// //               <label>
// //                 <span className="form-preview-label-number">{index + 1}</span>
// //                 {element.label}
// //                 {element.required && <span className="required">*</span>}
// //               </label>
// //               {element.type === 'select' ? (
// //                 <select
// //                   value={formValues[element.label]}
// //                   onChange={(e) => handleInputChange(element.label, e.target.value)}
// //                   required={element.required}
// //                 >
// //                   <option value="">Select...</option>
// //                   {element.options.map((option, optionIndex) => (
// //                     <option key={optionIndex} value={option}>
// //                       {option}
// //                     </option>
// //                   ))}
// //                 </select>
// //               ) : element.type === 'file' && element.label === 'Resume (PDF Format Only)' ? (
// //                 <input
// //                   type="file"
// //                   accept="application/pdf"
// //                   onChange={(e) => handleFileChange(element.label, e.target.files[0])}
// //                   required={element.required}
// //                 />
// //               ) : (
// //                 <input
// //                   type={element.type}
// //                   placeholder={element.placeholder}
// //                   value={formValues[element.label]}
// //                   maxLength={element.maxLength}
// //                   onChange={(e) => handleInputChange(element.label, e.target.value)}
// //                   required={element.required}
// //                 />
// //               )}
// //               {element.maxLength && element.type !== 'select' && element.type !== 'number' && element.type !== 'file' && (
// //                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
// //               )}
// //             </div>
// //           ))}
// //           <button type="submit" className="form-preview-submit-button">Submit</button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default FormPreview;












//////bf preview 
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle } = location.state;

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle } });
//   };

//   const handleSave = () => {
//     const formData = { title: formTitle, formElements };
//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(form => form.title === formTitle);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     navigate(`/form/${formTitle}`, { state: { form: formData } });
//   };

//   return (
//     <div className="form-preview-container">
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
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
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && element.type !== 'number' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;


/////bf sasve 
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle } = location.state;

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle } });
//   };

//   const handleSave = () => {
//     const formData = { title: formTitle, formElements };
//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(form => form.title === formTitle);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     navigate(`/form/${formTitle}`, { state: { form: formData } });
//   };

//   return (
//     <div className="form-preview-container">
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               {element.type === 'select' ? (
//                 <select
//                   value={formValues[element.label]}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
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
//                   placeholder={element.placeholder}
//                   value={formValues[element.label]}
//                   maxLength={element.maxLength}
//                   onChange={(e) => handleInputChange(element.label, e.target.value)}
//                   required={element.required}
//                 />
//               )}
//               {element.maxLength && element.type !== 'select' && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;











////////bef single select 
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle } = location.state;

//   const [formValues, setFormValues] = useState(() => {
//     const values = {};
//     formElements.forEach(element => {
//       values[element.label] = '';
//     });
//     return values;
//   });

//   const handleInputChange = (label, value) => {
//     setFormValues(prevValues => ({
//       ...prevValues,
//       [label]: value
//     }));
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle } });
//   };

//   const handleSave = () => {
//     const formData = { title: formTitle, formElements };
//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(form => form.title === formTitle);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     navigate(`/form/${formTitle}`, { state: { form: formData } });
//   };

//   return (
//     <div className="form-preview-container">
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type={element.type}
//                 placeholder={element.placeholder}
//                 value={formValues[element.label]}
//                 maxLength={element.maxLength}
//                 onChange={(e) => handleInputChange(element.label, e.target.value)}
//                 required={element.required}
//               />
//               {element.maxLength && (
//                 <small>{element.maxLength - formValues[element.label].length} character(s) remaining</small>
//               )}
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;















// // //////////save ok okkkkk email 
// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle } = location.state;

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements, formTitle } });
//   };

//   const handleSave = () => {
//     const formData = { title: formTitle, formElements };
//     const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     const formIndex = savedForms.findIndex(form => form.title === formTitle);

//     if (formIndex >= 0) {
//       savedForms[formIndex] = formData;
//     } else {
//       savedForms.push(formData);
//     }

//     localStorage.setItem('forms', JSON.stringify(savedForms));
//     navigate(`/form/${formTitle}`, { state: { form: formData } });
//   };

//   return (
//     <div className="form-preview-container">
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button" onClick={handleSave}>Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type={element.type}
//                 placeholder={element.placeholder}
//                 required={element.required}
//               />
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;







////////bf save 
// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements, formTitle } = location.state;
  
//   const handleEdit = () => {
//     navigate('/form-builder', { state: { form: formElements, formTitle } });
//   };

//   return (
//     <div className="form-preview-container">
//       <div className="form-preview-header">
//         <h2>{formTitle}</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button">Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type={element.type}
//                 placeholder={element.placeholder}
//                 required={element.required}
//               />
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;















// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements } = location.state;

//   const handleEdit = () => {
//     navigate('/form-builder');
//   };

//   return (
//     <div className="form-preview-container">
//       <div className="form-preview-header">
//         <h2>First Test</h2>
//         <div className="form-preview-buttons">
//           <button className="form-preview-save-button">Save</button>
//           <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//           <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <div className="form-preview-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="form-preview-label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type={element.type}
//                 placeholder={element.placeholder}
//                 required={element.required}
//               />
//             </div>
//           ))}
//           <button type="submit" className="form-preview-submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;














/////bf unique class
// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements } = location.state;

//   const handleEdit = () => {
//     navigate('/form-builder');
//   };

//   return (
//     <div className="form-preview-container">
//       <div className="form-builder-header">
//         <h2>First Test</h2>
//         <div className="form-builder-buttons">
//           <button className="save-button">Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <form>
//         {formElements.map((element, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {element.label || element.name}
//               {element.required && <span className="required">*</span>}
//             </label>
//             <input
//               type={element.type}
//               placeholder={element.placeholder}
//               required={element.required}
//             />
//           </div>
//         ))}
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default FormPreview;



























// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements } = location.state;

//   const handleEdit = () => {
//     navigate('/form-builder');
//   };

//   return (
//     <div className="form-preview-container">
//       <div className="form-builder-header">
//         <h2>First Test</h2>
//         <div className="form-builder-buttons">
//   <button className="form-preview-save-button">Save</button>
//   <button className="form-preview-edit-button" onClick={handleEdit}>Edit</button>
//   <button className="form-preview-close-button" onClick={() => navigate('/form')}>Close</button>
// </div>

//         {/* <div className="form-builder-buttons">
//           <button className="save-button">Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//         </div> */}
//       </div>
//       <div className="form-box">
//         <form>
//           {formElements.map((element, index) => (
//             <div key={index} className="form-group">
//               <label>
//                 <span className="label-number">{index + 1}</span>
//                 {element.label}
//                 {element.required && <span className="required">*</span>}
//               </label>
//               <input
//                 type={element.type}
//                 placeholder={element.placeholder}
//                 required={element.required}
//               />
//             </div>
//           ))}
//           <button type="submit" className="submit-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;






// ///////preview work12
// ///////
// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements } = location.state;

//   const handleEdit = () => {
//     navigate('/form-builder');
//   };

//   return (
//     <div className="form-preview-container">
//       <div className="form-builder-header">
//         <h2>First Test</h2>
//         <div className="form-builder-buttons">
//           <button className="save-button">Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <form>
//         {formElements.map((element, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {element.label || element.name}
//               {element.required && <span className="required">*</span>}
//             </label>
//             <input
//               type={element.type}
//               placeholder={element.placeholder}
//               required={element.required}
//             />
//           </div>
//         ))}
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default FormPreview;










// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements } = location.state;

//   const handleEdit = () => {
//     navigate('/form-builder');
//   };

//   return (
//     <div className="form-preview-container">
//       <div className="form-builder-header">
//         <h2>First Test</h2>
//         <div className="form-builder-buttons">
//           <button className="save-button">Save</button>
//           <button className="edit-button" onClick={handleEdit}>Edit</button>
//           <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//         </div>
//       </div>
//       <form>
//         {formElements.map((element, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {element.name}
//               {element.required && <span className="required">*</span>}
//             </label>
//             <input
//               type={element.type}
//               placeholder={element.placeholder}
//               required={element.required}
//             />
//           </div>
//         ))}
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default FormPreview;












// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements } = location.state;

//   const handleSave = () => {
//     // Implement save functionality
//   };

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements } });
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-preview-container">
//       <h2>First Test</h2>
//       <div className="form-preview-buttons">
//         <button className="save-button" onClick={handleSave}>Save</button>
//         <button className="edit-button" onClick={handleEdit}>Edit</button>
//         <button className="close-button" onClick={handleClose}>Close</button>
//       </div>
//       <form>
//         {formElements.map((element, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {element.label}
//               {element.required && <span className="required">*</span>}
//             </label>
//             <input
//               type={element.type}
//               placeholder={element.placeholder}
//               required={element.required}
//             />
//           </div>
//         ))}
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default FormPreview;



// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formElements } = location.state;

//   const handleEdit = () => {
//     navigate('/form-builder', { state: { formElements } });
//   };

//   const handleClose = () => {
//     navigate('/form');
//   };

//   return (
//     <div className="form-preview-container">
//       <h2>First Test</h2>
//       <form>
//         {formElements.map((element, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {element.name}
//               {element.required && <span className="required">*</span>}
//             </label>
//             <input
//               type={element.type}
//               placeholder={element.placeholder}
//               required={element.required}
//             />
//           </div>
//         ))}
//         <button type="submit">Submit</button>
//       </form>
//       <div className="preview-buttons">
//         <button className="save-button">Save</button>
//         <button className="edit-button" onClick={handleEdit}>Edit</button>
//         <button className="close-button" onClick={handleClose}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default FormPreview;










// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const { formElements } = location.state;

//   return (
//     <div className="form-preview-container">
//       <div className="form-builder-header">
//         <h2>First Test</h2>
//         <div className="form-builder-buttons">
//           <button className="save-button">Save</button>
//           <button className="edit-button">Edit</button>
//           <button className="close-button">Close</button>
//         </div>
//       </div>
//       <form>
//         {formElements.map((element, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {element.name}
//               {element.required && <span className="required">*</span>}
//             </label>
//             <input
//               type={element.type}
//               placeholder={element.placeholder}
//               required={element.required}
//             />
//           </div>
//         ))}
//         <button type="submit" className="submit-button">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default FormPreview;









// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import './FormPreview.css';

// const FormPreview = () => {
//   const location = useLocation();
//   const { formElements } = location.state;

//   return (
//     <div className="form-preview-container">
//       <h2>First Test</h2>
//       <form>
//         {formElements.map((element, index) => (
//           <div key={index} className="form-group">
//             <label>
//               {element.label}
//               {element.required && <span className="required">*</span>}
//             </label>
//             <input
//               type={element.type}
//               placeholder={element.placeholder}
//               required={element.required}
//             />
//           </div>
//         ))}
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default FormPreview;
