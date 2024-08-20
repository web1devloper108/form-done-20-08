// import React from 'react';
// import { useDrop } from 'react-dnd';

// const DropArea = ({ onDrop, children }) => {
//   const [, drop] = useDrop({
//     accept: 'ITEM',
//     drop: (item) => {
//       onDrop(item);
//     },
//   });

//   return (
//     <div ref={drop} className="form-builder-drop-area">
//       {children}
//     </div>
//   );
// };

// export default DropArea; 

































/////////////////

// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
// };

// const DraggableItem = ({ id, name, type }) => {
//   const [, drag] = useDrag({
//     type: ItemTypes.FIELD,
//     item: { id, name, type },
//   });
//   return (
//     <div ref={drag} className="draggable-item">
//       {name}
//     </div>
//   );
// };

// const DropArea = ({ onDrop, children }) => {
//   const [, drop] = useDrop({
//     accept: ItemTypes.FIELD,
//     drop: (item) => onDrop(item),
//   });
//   return (
//     <div ref={drop} className="drop-area">
//       {children}
//     </div>
//   );
// };

// const FormBuilder = () => {
//   const location = useLocation();
//   const { formElements: initialFormElements = [], formTitle, formId } = location.state || {};
//   const [formElements, setFormElements] = useState(Array.isArray(initialFormElements) ? initialFormElements : []);
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!Array.isArray(initialFormElements)) {
//       setFormElements([]);
//     } else {
//       setFormElements(initialFormElements);
//     }
//   }, [initialFormElements]);

//   const handleDrop = (item) => {
//     const newElement = {
//       ...item,
//       label: '',
//       placeholder: '',
//       required: false,
//       options: item.type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : [],
//     };

//     if (item.type === 'text' || item.type === 'number') {
//       newElement.maxLength = 50;
//       newElement.minLength = 0;
//     }

//     setFormElements((prev) => [...prev, newElement]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div className="custom-ui">
//             <h1>Confirm to Delete</h1>
//             <p>All collected data will be lost for this field. Are you sure you want to delete this Field?</p>
//             <div className="button-group">
//               <button
//                 className="delete-button"
//                 onClick={() => {
//                   setFormElements((prev) => prev.filter((_, i) => i !== index));
//                   setExpandedElements((prev) => {
//                     const newExpanded = { ...prev };
//                     delete newExpanded[index];
//                     return newExpanded;
//                   });
//                   onClose();
//                 }}
//               >
//                 Yes, Delete it!
//               </button>
//               <button className="cancel-button-normal-form" onClick={onClose}>
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay",
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle, formId } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   const handleOptionChange = (elementIndex, optionIndex, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[elementIndex].options[optionIndex] = value;
//     setFormElements(updatedElements);
//   };

//   const handleAddOption = (index) => {
//     const updatedElements = [...formElements];
//     updatedElements[index].options.push(`Option ${updatedElements[index].options.length + 1}`);
//     setFormElements(updatedElements);
//   };

//   const handleRemoveOption = (elementIndex, optionIndex) => {
//     const updatedElements = [...formElements];
//     updatedElements[elementIndex].options.splice(optionIndex, 1);
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Startup General</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="contact-number" name="Contact Number" type="number" />
//           <DraggableItem id="date-of-birth" name="Date of Birth" type="date" />
//           <DraggableItem id="designation" name="Designation" type="text" />
//           <DraggableItem id="resume" name="Resume (PDF Format Only)" type="file" />
//           <DraggableItem id="qualification" name="Qualification (Recent One)" type="text" />
//           <DraggableItem id="registered-office-location" name="Registered Office Location" type="text" />
//           <DraggableItem id="one-liner-of-your-startup" name="One Liner of your startup" type="textarea" />
//           <DraggableItem id="upload-startup-logo" name="Upload Startup Logo (In PNG/JPG Format)" type="file" />
//           <DraggableItem id="startup-team-size" name="Startup team size" type="number" />
//           <DraggableItem id="brief-description-of-your-startup" name="Brief Description of your startup" type="textarea" />
//           <DraggableItem id="startup-website" name="Startup Website" type="url" />
//           <DraggableItem id="startup-postal-address" name="Startup Postal Address" type="textarea" />
//           <DraggableItem id="social-media-link" name="Social Media Link" type="url" />
//           <DraggableItem id="domain-of-startup" name="Domain Of Startup" type="text" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="date" name="Date" type="date" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-preview-button" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-number">{index + 1}</span>
//                   <span className="element-label">{element.name}</span>
//                   <div className="element-actions">
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon delete" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label className="label-text">Label <span className="required">*</span> (Should be unique)</label>
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleChange(index, 'label', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Input Type</label>
//                       <select
//                         value={element.type}
//                         onChange={(e) => handleChange(index, 'type', e.target.value)}
//                       >
//                         <option value="text">Text Answer</option>
//                         <option value="textarea">Long Answer</option>
//                         <option value="select">Single Select</option>
//                         <option value="multiselect">Multiple Select</option>
//                         <option value="file">File Upload</option>
//                         <option value="switch">Switch (True/False)</option>
//                         <option value="slider">Slider (Marks/Ratings)</option>
//                         <option value="date">Date</option>
//                         <option value="rows">Multiple Rows</option>
//                         <option value="email">Email</option>
//                         <option value="url">Link/URL</option>
//                         <option value="number">Number</option>
//                         <option value="pngjpg">PNG/JPG Format</option>
//                       </select>
//                     </div>
//                     {element.type !== 'select' && (
//                       <div className="form-group">
//                         <label>Placeholder</label>
//                         <input
//                           type="text"
//                           value={element.placeholder}
//                           onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                         />
//                       </div>
//                     )}
//                     {element.type === 'text' && (
//                       <>
//                         <div className="form-group">
//                           <label>Maximum Character(s)</label>
//                           <input
//                             type="number"
//                             value={element.maxLength}
//                             onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>Minimum Character(s)</label>
//                           <input
//                             type="number"
//                             value={element.minLength}
//                             onChange={(e) => handleChange(index, 'minLength', e.target.value)}
//                           />
//                         </div>
//                       </>
//                     )}
//                     {element.type === 'select' && (
//                       <>
//                         <div className="form-group">
//                           <label>Options</label>
//                           {element.options.map((option, optionIndex) => (
//                             <div key={optionIndex} className="option-group">
//                               <input
//                                 type="text"
//                                 value={option}
//                                 onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                                 className="option-input"
//                               />
//                               <button type="button" className="remove-option" onClick={() => handleRemoveOption(index, optionIndex)}>
//                                 <FaTimesCircle />
//                               </button>
//                             </div>
//                           ))}
//                           <button type="button" className="add-option" onClick={() => handleAddOption(index)}>
//                             Add Option
//                           </button>
//                         </div>
//                         <div className="form-group">
//                           <label className="checkbox-label">
//                             <input
//                               type="checkbox"
//                               checked={element.required}
//                               onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                             />
//                             Required
//                           </label>
//                         </div>
//                       </>
//                     )}
//                     {element.type === 'file' && element.name === 'Resume (PDF Format Only)' && (
//                       <div className="form-group">
//                         <label>Allowed File Type</label>
//                         <input
//                           type="text"
//                           value="PDF"
//                           readOnly
//                         />
//                       </div>
//                     )}
//                     {element.type === 'file' && element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//                       <div className="form-group">
//                         <label>Allowed File Type</label>
//                         <input
//                           type="text"
//                           value="PNG, JPG"
//                           readOnly
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;


















































import React from 'react'

function DropArea() { 
  return (
    <div>DropArea</div>
  )
}

export default DropArea





// import React from 'react';
// import { useDrop } from 'react-dnd';

// const DropArea = ({ onDrop, children }) => {
//   const [, drop] = useDrop({
//     accept: 'ITEM',
//     drop: (item) => {
//       onDrop(item);
//     },
//   });

//   return (
//     <div ref={drop} className="form-builder-drop-area">
//       {children}
//     </div>
//   );
// };

// export default DropArea;





// import React from 'react';
// import { useDrop } from 'react-dnd';

// const DropArea = ({ onDrop, children }) => {
//   const [, drop] = useDrop({
//     accept: 'ITEM',
//     drop: (item) => {
//       onDrop(item);
//     },
//   });

//   return (
//     <div ref={drop} className="form-builder-drop-area">
//       {children}
//     </div>
//   );
// };

// export default DropArea;

















/////////////1//
// import React from 'react';
// import { useDrop } from 'react-dnd';

// const DropArea = ({ onDrop, children }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: 'FORM_ELEMENT',
//     drop: (item) => onDrop(item),
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   return (
//     <div ref={drop} style={{ minHeight: '300px', padding: '16px', border: '2px dashed #ccc', backgroundColor: isOver ? '#f0f0f0' : '#fff' }}>
//       {children}
//     </div>
//   );
// };

// export default DropArea;
