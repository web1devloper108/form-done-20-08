import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/lib/style.css'; // Import the CSS for react-phone-input-2
import PhoneInput from 'react-phone-input-2';
import './FormBuilder.css';

const ItemTypes = {
  FIELD: 'field',
  FORM_ELEMENT: 'form-element',
};

const DraggableItem = ({ id, name, type }) => {
  const [, drag] = useDrag({
    type: ItemTypes.FIELD,
    item: { id, name, type },
  });
  return (
    <div ref={drag} className="draggable-item-formbuilder">
      {name}
    </div>
  );
};

const DropArea = ({ onDrop, children }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.FIELD,
    drop: (item) => onDrop(item),
  });
  return (
    <div ref={drop} className="drop-area-formbuilder">
      {children}
    </div>
  );
};

const DraggableFormElement = ({
  index,
  element,
  moveElement,
  toggleExpand,
  handleDelete,
  expanded,
  handleChange,
  handleOptionChange,
  handleAddOption,
  handleRemoveOption
}) => {
  const [, ref, preview] = useDrag({
    type: ItemTypes.FORM_ELEMENT,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.FORM_ELEMENT,
    hover: (item) => {
      if (item.index !== index) {
        moveElement(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="dropped-element-formbuilder">
      <div className="element-header-formbuilder">
        <span className="drag-handle-formbuilder" ref={preview}><FaGripVertical /></span>
        <span className="element-number-formbuilder">{index + 1}</span>
        <span className="element-label-formbuilder">{element.name}</span>
        <div className="element-actions-formbuilder">
          {expanded ? (
            <FaChevronUp className="icon-formbuilder" onClick={() => toggleExpand(index)} />
          ) : (
            <FaChevronDown className="icon-formbuilder" onClick={() => toggleExpand(index)} />
          )}
          <FaRegTrashAlt className="icon-formbuilder delete-formbuilder" onClick={() => handleDelete(index)} />
        </div>
      </div>
      {expanded && (
        <div className="element-details-formbuilder">
          <div className="form-group-formbuilder">
            <label className="label-text-formbuilder">Label <span className="required-formbuilder"></span> (Label must be required)</label>
            <input
              type="text"
              value={element.label}
              onChange={(e) => handleChange(index, 'label', e.target.value)} 
            />
          </div>
          <div className="form-group-formbuilder">
            <label>Input Type</label>
            <select
              value={element.type}
              onChange={(e) => handleChange(index, 'type', e.target.value)}
            >
              <option value="text">Text Answer</option>
              <option value="textarea">Long Answer</option>
              <option value="select">Single Select</option>
              <option value="multiselect">Multiple Select</option>
              <option value="file">File Upload</option>
              <option value="switch">Switch (True/False)</option>
              <option value="slider">Slider (Marks/Ratings)</option>
              <option value="date">Date</option>
              <option value="rows">Multiple Rows</option>
              <option value="email">Email</option>
              <option value="url">Link/URL</option>
              <option value="number">Number</option>
              <option value="pngjpg">PNG/JPG Format</option>
              <option value="radio">Single Select by Radio Button</option>
              <option value="phone">Phone Number</option> {/* Added phone number type */}
            </select>
          </div>
          {element.type !== 'select' && element.type !== 'multiselect' && element.type !== 'radio' && (
            <div className="form-group-formbuilder">
              <label>Placeholder</label>
              <input
                type="text"
                value={element.placeholder}
                onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
              />
            </div>
          )}
          {/* Character Limit Options - Start */}
          {element.type === 'text' && element.name !== 'Contact Number' && element.name !== 'Startup team size' && (
            <>
              <div className="form-group-formbuilder">
                <label>Maximum Character(s)</label>
                <input
                  type="number"
                  value={element.maxLength}
                  onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
                />
              </div>
              <div className="form-group-formbuilder">
                <label>Minimum Character(s)</label>
                <input
                  type="number"
                  value={element.minLength}
                  onChange={(e) => handleChange(index, 'minLength', e.target.value)}
                />
              </div>
            </>
          )}
          {/* Character Limit Options - End */}
          {(element.type === 'select' || element.type === 'multiselect' || element.type === 'radio') && (
            <>
              <div className="form-group-formbuilder">
                <label>Options</label>
                {element.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-group-formbuilder">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                      className="option-input-formbuilder"
                    />
                    <button type="button" className="remove-option-formbuilder" onClick={() => handleRemoveOption(index, optionIndex)}>
                      <FaTimesCircle />
                    </button>
                  </div>
                ))}
                <button type="button" className="add-option-formbuilder" onClick={() => handleAddOption(index)}>
                  Add Option
                </button>
              </div>
              {element.type !== 'radio' && (
                <div className="form-group-formbuilder">
                  <label>Maximum number of options that can be selected</label>
                  <input
                    type="number"
                    value={element.maxSelect}
                    onChange={(e) => handleChange(index, 'maxSelect', e.target.value)}
                  />
                </div>
              )}
              <div className="form-group-formbuilder">
                <label className="checkbox-label-formbuilder">
                  <input
                    type="checkbox"
                    checked={element.required}
                    onChange={(e) => handleChange(index, 'required', e.target.checked)}
                  />
                  Required
                </label>
              </div>
            </>
          )}
          {element.type === 'file' && (
            <div className="form-group-formbuilder">
              <label>Allowed File Type</label>
              {element.name === 'Resume (PDF Format Only)' && (
                <input
                  type="text"
                  value="PDF"
                  readOnly
                />
              )}
              {element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
                <input
                  type="text"
                  value="PNG, JPG"
                  readOnly
                />
              )}
              {element.name === 'File Upload' && (
                <input
                  type="text"
                  value="All file types"
                  readOnly
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FormBuilder = () => {
  const location = useLocation();
  const { formElements: initialFormElements = [], formTitle, formId } = location.state || {};
  const [formElements, setFormElements] = useState(Array.isArray(initialFormElements) ? initialFormElements : []);
  const [expandedElements, setExpandedElements] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(initialFormElements)) {
      setFormElements([]);
    } else {
      setFormElements(initialFormElements);
    }
  }, [initialFormElements]);

  const handleDrop = (item) => {
    const newElement = {
      ...item,
      label: '',
      placeholder: '',
      required: false,
      options: item.type === 'select' || item.type === 'multiselect' || item.type === 'radio' ? ['Option 1', 'Option 2', 'Option 3'] : [],
      maxSelect: item.type === 'multiselect' ? 2 : null,
    };

    if (item.type === 'text' && item.name !== 'Contact Number' && item.name !== 'Startup team size') {
      newElement.maxLength = 50;
      newElement.minLength = 0;
    }

    setFormElements((prev) => [...prev, newElement]);
  };

  const toggleExpand = (index) => {
    setExpandedElements((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDelete = (index) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui-formbuilder">
            <h1>Confirm to Delete</h1>
            <p>All collected data will be lost for this field. Are you sure you want to delete this Field?</p>
            <div className="button-group-formbuilder">
              <button
                className="delete-button-formbuilder"
                onClick={() => {
                  setFormElements((prev) => prev.filter((_, i) => i !== index));
                  setExpandedElements((prev) => {
                    const newExpanded = { ...prev };
                    delete newExpanded[index];
                    return newExpanded;
                  });
                  onClose();
                }}
              >
                Yes, Delete it!
              </button>
              <button className="cancel-button-normal-formbuilder" onClick={onClose}>
                No
              </button>
            </div>
          </div>
        );
      },
      overlayClassName: "custom-overlay-formbuilder",
    });
  };

  const handlePreview = () => {
    const emptyLabelIndex = formElements.findIndex(element => !element.label.trim());

    if (emptyLabelIndex !== -1) {
      const emptyLabelElementName = formElements[emptyLabelIndex].name;
      toast.error(`Label Not Found for ${emptyLabelElementName}`);
    } else {
      localStorage.setItem('formElements', JSON.stringify(formElements));
      navigate('/form-preview', { state: { formElements, formTitle, formId } });
    }
  };

  const handleChange = (index, field, value) => {
    const updatedElements = [...formElements];
    updatedElements[index][field] = value;
    setFormElements(updatedElements);
  };

  const handleOptionChange = (elementIndex, optionIndex, value) => {
    const updatedElements = [...formElements];
    updatedElements[elementIndex].options[optionIndex] = value;
    setFormElements(updatedElements);
  };

  const handleAddOption = (index) => {
    const updatedElements = [...formElements];
    updatedElements[index].options.push(`Option ${updatedElements[index].options.length + 1}`);
    setFormElements(updatedElements);
  };

  const handleRemoveOption = (elementIndex, optionIndex) => {
    const updatedElements = [...formElements];
    updatedElements[elementIndex].options.splice(optionIndex, 1);
    setFormElements(updatedElements);
  };

  const moveElement = (fromIndex, toIndex) => {
    const updatedElements = [...formElements];
    const [movedElement] = updatedElements.splice(fromIndex, 1);
    updatedElements.splice(toIndex, 0, movedElement);
    setFormElements(updatedElements);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="form-builder-container-formbuilder">
        <ToastContainer position="bottom-right" />
        <div className="form-builder-sidebar-formbuilder">
          <h3>Startup General</h3>
          <DraggableItem id="email" name="Email*" type="email" />
          <DraggableItem id="name" name="Name*" type="text" />
          <DraggableItem id="contact-number" name="Contact Number" type="phone" /> {/* Changed type to phone */}
          <DraggableItem id="date-of-birth" name="Date of Birth" type="date" />
          <DraggableItem id="designation" name="Designation" type="text" />
          <DraggableItem id="resume" name="Resume (PDF Format Only)" type="file" />
          <DraggableItem id="qualification" name="Qualification (Recent One)" type="text" />
          <DraggableItem id="registered-office-location" name="Registered Office Location" type="text" />
          <DraggableItem id="one-liner-of-your-startup" name="One Liner of your startup" type="textarea" />
          <DraggableItem id="upload-startup-logo" name="Upload Startup Logo (In PNG/JPG Format)" type="file" />
          <DraggableItem id="startup-team-size" name="Startup team size" type="number" />
          <DraggableItem id="brief-description-of-your-startup" name="Brief Description of your startup" type="textarea" />
          <DraggableItem id="startup-website" name="Startup Website" type="url" />
          <DraggableItem id="startup-postal-address" name="Startup Postal Address" type="textarea" />
          <DraggableItem id="social-media-link" name="Social Media Link" type="url" />
          <DraggableItem id="domain-of-startup" name="Domain Of Startup" type="text" />
          <DraggableItem id="single-select" name="Single Select" type="select" />
          <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
          <DraggableItem id="single-select-radio" name="Single Select by Radio Button" type="radio" /> {/* Add new draggable item here */}
          <DraggableItem id="file-upload" name="File Upload" type="file" />
          <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
          <DraggableItem id="date" name="Date" type="date" />
        </div>
        <div className="form-builder-content-formbuilder">
          <div className="form-builder-header-formbuilder">
            <h2>{formTitle || 'test'}</h2>
            <div className="form-builder-buttons-formbuilder">
              <button className="form-builder-preview-button-formbuilder" onClick={handlePreview}>Preview</button>
              <button className="form-builder-close-button-formbuilder" onClick={() => navigate('/form')}>Close</button>
            </div>
          </div>
          <p ><span className="required-formbuilder-note">*</span> "Email" and "Name" fields are mandatory.</p>
          <p style={{marginBottom:'15px'}}><span className="required-formbuilder-note">*</span> Label of "Name" and "Email" should be always same as <b>"Name"</b> and <b>"Email"</b>.</p>
          <DropArea onDrop={handleDrop}>
            {formElements.map((element, index) => (
              <DraggableFormElement
                key={index}
                index={index}
                element={element}
                moveElement={moveElement}
                toggleExpand={toggleExpand}
                handleDelete={handleDelete}
                expanded={expandedElements[index]}
                handleChange={handleChange}
                handleOptionChange={handleOptionChange}
                handleAddOption={handleAddOption}
                handleRemoveOption={handleRemoveOption}
              />
            ))}
          </DropArea>
        </div>
      </div>
    </DndProvider>
  );
};

export default FormBuilder;














///////good code before contact no +91

// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
//   FORM_ELEMENT: 'form-element', 
// };

// const DraggableItem = ({ id, name, type }) => {
//   const [, drag] = useDrag({
//     type: ItemTypes.FIELD,
//     item: { id, name, type },
//   });
//   return (
//     <div ref={drag} className="draggable-item-formbuilder">
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
//     <div ref={drop} className="drop-area-formbuilder">
//       {children}
//     </div>
//   );
// };

// const DraggableFormElement = ({
//   index,
//   element,
//   moveElement,
//   toggleExpand,
//   handleDelete,
//   expanded,
//   handleChange,
//   handleOptionChange,
//   handleAddOption,
//   handleRemoveOption
// }) => {
//   const [, ref, preview] = useDrag({
//     type: ItemTypes.FORM_ELEMENT,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.FORM_ELEMENT,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveElement(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="dropped-element-formbuilder">
//       <div className="element-header-formbuilder">
//         <span className="drag-handle-formbuilder" ref={preview}><FaGripVertical /></span>
//         <span className="element-number-formbuilder">{index + 1}</span>
//         <span className="element-label-formbuilder">{element.name}</span>
//         <div className="element-actions-formbuilder">
//           {expanded ? (
//             <FaChevronUp className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           ) : (
//             <FaChevronDown className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           )}
//           <FaRegTrashAlt className="icon-formbuilder delete-formbuilder" onClick={() => handleDelete(index)} />   
//         </div>
//       </div>
//       {expanded && (
//         <div className="element-details-formbuilder">
//           <div className="form-group-formbuilder">
//             <label className="label-text-formbuilder">Label <span className="required-formbuilder">*</span> (Label must be required)</label>
//             <input
//               type="text"
//               value={element.label}
//               onChange={(e) => handleChange(index, 'label', e.target.value)}
//             />
//           </div>
//           <div className="form-group-formbuilder">
//             <label>Input Type</label>
//             <select
//               value={element.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//             >
//               <option value="text">Text Answer</option>
//               <option value="textarea">Long Answer</option>
//               <option value="select">Single Select</option>
//               <option value="multiselect">Multiple Select</option>
//               <option value="file">File Upload</option>
//               <option value="switch">Switch (True/False)</option>
//               <option value="slider">Slider (Marks/Ratings)</option>
//               <option value="date">Date</option>
//               <option value="rows">Multiple Rows</option>
//               <option value="email">Email</option>
//               <option value="url">Link/URL</option>
//               <option value="number">Number</option>
//               <option value="pngjpg">PNG/JPG Format</option>
//               <option value="radio">Single Select by Radio Button</option>
//             </select>
//           </div>
//           {element.type !== 'select' && element.type !== 'multiselect' && element.type !== 'radio' && (
//             <div className="form-group-formbuilder">
//               <label>Placeholder</label>
//               <input
//                 type="text"
//                 value={element.placeholder}
//                 onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//               />
//             </div>
//           )}
//           {/* Character Limit Options - Start */}
//           {element.type === 'text' && element.name !== 'Contact Number' && element.name !== 'Startup team size' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Maximum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.maxLength}
//                   onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
//                 />
//               </div>
//               <div className="form-group-formbuilder">
//                 <label>Minimum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.minLength}
//                   onChange={(e) => handleChange(index, 'minLength', e.target.value)}
//                 />
//               </div>
//             </>
//           )}
//           {/* Character Limit Options - End */}
//           {(element.type === 'select' || element.type === 'multiselect' || element.type === 'radio') && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-group-formbuilder">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-input-formbuilder"
//                     />
//                     <button type="button" className="remove-option-formbuilder" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-option-formbuilder" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               {element.type !== 'radio' && (
//                 <div className="form-group-formbuilder">
//                   <label>Maximum number of options that can be selected</label>
//                   <input
//                     type="number"
//                     value={element.maxSelect}
//                     onChange={(e) => handleChange(index, 'maxSelect', e.target.value)}
//                   />
//                 </div>
//               )}
//               <div className="form-group-formbuilder">
//                 <label className="checkbox-label-formbuilder">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'file' && (
//             <div className="form-group-formbuilder">
//               <label>Allowed File Type</label>
//               {element.name === 'Resume (PDF Format Only)' && (
//                 <input
//                   type="text"
//                   value="PDF"
//                   readOnly
//                 />
//               )}
//               {element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//                 <input
//                   type="text"
//                   value="PNG, JPG"
//                   readOnly
//                 />
//               )}
//               {element.name === 'File Upload' && (
//                 <input
//                   type="text"
//                   value="All file types"
//                   readOnly
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       )}
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
//       options: item.type === 'select' || item.type === 'multiselect' || item.type === 'radio' ? ['Option 1', 'Option 2', 'Option 3'] : [],
//       maxSelect: item.type === 'multiselect' ? 2 : null,
//     };

//     if (item.type === 'text' && item.name !== 'Contact Number' && item.name !== 'Startup team size') {
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
//           <div className="custom-ui-formbuilder">
//             <h1>Confirm to Delete</h1>
//             <p>All collected data will be lost for this field. Are you sure you want to delete this Field?</p>
//             <div className="button-group-formbuilder">
//               <button
//                 className="delete-button-formbuilder"
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
//               <button className="cancel-button-normal-formbuilder" onClick={onClose}>
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-formbuilder",
//     });
//   };

//   const handlePreview = () => {
//     const emptyLabelIndex = formElements.findIndex(element => !element.label.trim());
    
//     if (emptyLabelIndex !== -1) {
//       const emptyLabelElementName = formElements[emptyLabelIndex].name;
//       toast.error(`Label Not Found for ${emptyLabelElementName}`);
//     } else {
//       localStorage.setItem('formElements', JSON.stringify(formElements));
//       navigate('/form-preview', { state: { formElements, formTitle, formId } });
//     }
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

//   const moveElement = (fromIndex, toIndex) => {
//     const updatedElements = [...formElements];
//     const [movedElement] = updatedElements.splice(fromIndex, 1);
//     updatedElements.splice(toIndex, 0, movedElement);
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container-formbuilder">
//         <ToastContainer position="bottom-right" />
//         <div className="form-builder-sidebar-formbuilder"> 
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
//           <DraggableItem id="single-select-radio" name="Single Select by Radio Button" type="radio" /> {/* Add new draggable item here */}
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="date" name="Date" type="date" />
//         </div>
//         <div className="form-builder-content-formbuilder">
//           <div className="form-builder-header-formbuilder">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons-formbuilder">
//               <button className="form-builder-preview-button-formbuilder" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button-formbuilder" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <p style={{marginBottom:'15px'}}>'Email' and 'Name' fields are mandatory</p>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <DraggableFormElement
//                 key={index}
//                 index={index}
//                 element={element}
//                 moveElement={moveElement}
//                 toggleExpand={toggleExpand}
//                 handleDelete={handleDelete}
//                 expanded={expandedElements[index]}
//                 handleChange={handleChange}
//                 handleOptionChange={handleOptionChange}
//                 handleAddOption={handleAddOption}
//                 handleRemoveOption={handleRemoveOption}
//               />
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;













//////////b contact char limit 


// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
//   FORM_ELEMENT: 'form-element', 
// };

// const DraggableItem = ({ id, name, type }) => {
//   const [, drag] = useDrag({
//     type: ItemTypes.FIELD,
//     item: { id, name, type },
//   });
//   return (
//     <div ref={drag} className="draggable-item-formbuilder">
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
//     <div ref={drop} className="drop-area-formbuilder">
//       {children}
//     </div>
//   );
// };

// const DraggableFormElement = ({
//   index,
//   element,
//   moveElement,
//   toggleExpand,
//   handleDelete,
//   expanded,
//   handleChange,
//   handleOptionChange,
//   handleAddOption,
//   handleRemoveOption
// }) => {
//   const [, ref, preview] = useDrag({
//     type: ItemTypes.FORM_ELEMENT,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.FORM_ELEMENT,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveElement(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="dropped-element-formbuilder">
//       <div className="element-header-formbuilder">
//         <span className="drag-handle-formbuilder" ref={preview}><FaGripVertical /></span>
//         <span className="element-number-formbuilder">{index + 1}</span>
//         <span className="element-label-formbuilder">{element.name}</span>
//         <div className="element-actions-formbuilder">
//           {expanded ? (
//             <FaChevronUp className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           ) : (
//             <FaChevronDown className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           )}
//           <FaRegTrashAlt className="icon-formbuilder delete-formbuilder" onClick={() => handleDelete(index)} />   
//         </div>
//       </div>
//       {expanded && (
//         <div className="element-details-formbuilder">
//           <div className="form-group-formbuilder">
//             <label className="label-text-formbuilder">Label <span className="required-formbuilder">*</span> (Label must be required)</label>
//             <input
//               type="text"
//               value={element.label}
//               onChange={(e) => handleChange(index, 'label', e.target.value)}
//             />
//           </div>
//           <div className="form-group-formbuilder">
//             <label>Input Type</label>
//             <select
//               value={element.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//             >
//               <option value="text">Text Answer</option>
//               <option value="textarea">Long Answer</option>
//               <option value="select">Single Select</option>
//               <option value="multiselect">Multiple Select</option>
//               <option value="file">File Upload</option>
//               <option value="switch">Switch (True/False)</option>
//               <option value="slider">Slider (Marks/Ratings)</option>
//               <option value="date">Date</option>
//               <option value="rows">Multiple Rows</option>
//               <option value="email">Email</option>
//               <option value="url">Link/URL</option>
//               <option value="number">Number</option>
//               <option value="pngjpg">PNG/JPG Format</option>
//               <option value="radio">Single Select by Radio Button</option> {/* New Radio Button Option */}
//             </select>
//           </div>
//           {element.type !== 'select' && element.type !== 'multiselect' && element.type !== 'radio' && ( /* Update this line to exclude radio type */
//             <div className="form-group-formbuilder">
//               <label>Placeholder</label>
//               <input
//                 type="text"
//                 value={element.placeholder}
//                 onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//               />
//             </div>
//           )}
//           {element.type === 'text' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Maximum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.maxLength}
//                   onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
//                 />
//               </div>
//               <div className="form-group-formbuilder">
//                 <label>Minimum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.minLength}
//                   onChange={(e) => handleChange(index, 'minLength', e.target.value)}
//                 />
//               </div>
//             </>
//           )}
//           {(element.type === 'select' || element.type === 'multiselect' || element.type === 'radio') && ( /* Add radio type here */
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-group-formbuilder">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-input-formbuilder"
//                     />
//                     <button type="button" className="remove-option-formbuilder" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-option-formbuilder" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               {element.type !== 'radio' && ( /* Exclude radio type from having maxSelect option */
//                 <div className="form-group-formbuilder">
//                   <label>Maximum number of options that can be selected</label>
//                   <input
//                     type="number"
//                     value={element.maxSelect}
//                     onChange={(e) => handleChange(index, 'maxSelect', e.target.value)}
//                   />
//                 </div>
//               )}
//               <div className="form-group-formbuilder">
//                 <label className="checkbox-label-formbuilder">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'file' && (
//             <div className="form-group-formbuilder">
//               <label>Allowed File Type</label>
//               {element.name === 'Resume (PDF Format Only)' && (
//                 <input
//                   type="text"
//                   value="PDF"
//                   readOnly
//                 />
//               )}
//               {element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//                 <input
//                   type="text"
//                   value="PNG, JPG"
//                   readOnly
//                 />
//               )}
//               {element.name === 'File Upload' && (
//                 <input
//                   type="text"
//                   value="All file types"
//                   readOnly
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       )}
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
//       options: item.type === 'select' || item.type === 'multiselect' || item.type === 'radio' ? ['Option 1', 'Option 2', 'Option 3'] : [], /* Add radio type here */
//       maxSelect: item.type === 'multiselect' ? 2 : null, // Add maxSelect property for multiselect
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
//           <div className="custom-ui-formbuilder">
//             <h1>Confirm to Delete</h1>
//             <p>All collected data will be lost for this field. Are you sure you want to delete this Field?</p>
//             <div className="button-group-formbuilder">
//               <button
//                 className="delete-button-formbuilder"
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
//               <button className="cancel-button-normal-formbuilder" onClick={onClose}>
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-formbuilder",
//     });
//   };

//   const handlePreview = () => {
//     const emptyLabelIndex = formElements.findIndex(element => !element.label.trim());
    
//     if (emptyLabelIndex !== -1) {
//       const emptyLabelElementName = formElements[emptyLabelIndex].name;
//       toast.error(`Label Not Found for ${emptyLabelElementName}`);
//     } else {
//       localStorage.setItem('formElements', JSON.stringify(formElements));
//       navigate('/form-preview', { state: { formElements, formTitle, formId } });
//     }
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

//   const moveElement = (fromIndex, toIndex) => {
//     const updatedElements = [...formElements];
//     const [movedElement] = updatedElements.splice(fromIndex, 1);
//     updatedElements.splice(toIndex, 0, movedElement);
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container-formbuilder">
//         <ToastContainer position="bottom-right" />
//         <div className="form-builder-sidebar-formbuilder"> 
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
//           <DraggableItem id="single-select-radio" name="Single Select by Radio Button" type="radio" /> {/* Add new draggable item here */}
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="date" name="Date" type="date" />
//         </div>
//         <div className="form-builder-content-formbuilder">
//           <div className="form-builder-header-formbuilder">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons-formbuilder">
//               <button className="form-builder-preview-button-formbuilder" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button-formbuilder" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <DraggableFormElement
//                 key={index}
//                 index={index}
//                 element={element}
//                 moveElement={moveElement}
//                 toggleExpand={toggleExpand}
//                 handleDelete={handleDelete}
//                 expanded={expandedElements[index]}
//                 handleChange={handleChange}
//                 handleOptionChange={handleOptionChange}
//                 handleAddOption={handleAddOption}
//                 handleRemoveOption={handleRemoveOption}
//               />
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;




















//////////////////before radio button 


// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
//   FORM_ELEMENT: 'form-element', 
// };

// const DraggableItem = ({ id, name, type }) => {
//   const [, drag] = useDrag({
//     type: ItemTypes.FIELD,
//     item: { id, name, type },
//   });
//   return (
//     <div ref={drag} className="draggable-item-formbuilder">
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
//     <div ref={drop} className="drop-area-formbuilder">
//       {children}
//     </div>
//   );
// };

// const DraggableFormElement = ({
//   index,
//   element,
//   moveElement,
//   toggleExpand,
//   handleDelete,
//   expanded,
//   handleChange,
//   handleOptionChange,
//   handleAddOption,
//   handleRemoveOption
// }) => {
//   const [, ref, preview] = useDrag({
//     type: ItemTypes.FORM_ELEMENT,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.FORM_ELEMENT,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveElement(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="dropped-element-formbuilder">
//       <div className="element-header-formbuilder">
//         <span className="drag-handle-formbuilder" ref={preview}><FaGripVertical /></span>
//         <span className="element-number-formbuilder">{index + 1}</span>
//         <span className="element-label-formbuilder">{element.name}</span>
//         <div className="element-actions-formbuilder">
//           {expanded ? (
//             <FaChevronUp className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           ) : (
//             <FaChevronDown className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           )}
//           <FaRegTrashAlt className="icon-formbuilder delete-formbuilder" onClick={() => handleDelete(index)} />   
//         </div>
//       </div>
//       {expanded && (
//         <div className="element-details-formbuilder">
//           <div className="form-group-formbuilder">
//             <label className="label-text-formbuilder">Label <span className="required-formbuilder">*</span> (Label must be required)</label>
//             <input
//               type="text"
//               value={element.label}
//               onChange={(e) => handleChange(index, 'label', e.target.value)}
//             />
//           </div>
//           <div className="form-group-formbuilder">
//             <label>Input Type</label>
//             <select
//               value={element.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//             >
//               <option value="text">Text Answer</option>
//               <option value="textarea">Long Answer</option>
//               <option value="select">Single Select</option>
//               <option value="multiselect">Multiple Select</option>
//               <option value="file">File Upload</option>
//               <option value="switch">Switch (True/False)</option>
//               <option value="slider">Slider (Marks/Ratings)</option>
//               <option value="date">Date</option>
//               <option value="rows">Multiple Rows</option>
//               <option value="email">Email</option>
//               <option value="url">Link/URL</option>
//               <option value="number">Number</option>
//               <option value="pngjpg">PNG/JPG Format</option>
//             </select>
//           </div>
//           {element.type !== 'select' && element.type !== 'multiselect' && (
//             <div className="form-group-formbuilder">
//               <label>Placeholder</label>
//               <input
//                 type="text"
//                 value={element.placeholder}
//                 onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//               />
//             </div>
//           )}
//           {element.type === 'text' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Maximum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.maxLength}
//                   onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
//                 />
//               </div>
//               <div className="form-group-formbuilder">
//                 <label>Minimum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.minLength}
//                   onChange={(e) => handleChange(index, 'minLength', e.target.value)}
//                 />
//               </div>
//             </>
//           )}
//           {element.type === 'select' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-group-formbuilder">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-input-formbuilder"
//                     />
//                     <button type="button" className="remove-option-formbuilder" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-option-formbuilder" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               <div className="form-group-formbuilder">
//                 <label className="checkbox-label-formbuilder">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'multiselect' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-group-formbuilder">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-input-formbuilder"
//                     />
//                     <button type="button" className="remove-option-formbuilder" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-option-formbuilder" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               <div className="form-group-formbuilder">
//                 <label>Maximum number of options that can be selected</label>
//                 <input
//                   type="number"
//                   value={element.maxSelect}
//                   onChange={(e) => handleChange(index, 'maxSelect', e.target.value)}
//                 />
//               </div>
//               <div className="form-group-formbuilder">
//                 <label className="checkbox-label-formbuilder">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'file' && (
//             <div className="form-group-formbuilder">
//               <label>Allowed File Type</label>
//               {element.name === 'Resume (PDF Format Only)' && (
//                 <input
//                   type="text"
//                   value="PDF"
//                   readOnly
//                 />
//               )}
//               {element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//                 <input
//                   type="text"
//                   value="PNG, JPG"
//                   readOnly
//                 />
//               )}
//               {element.name === 'File Upload' && (
//                 <input
//                   type="text"
//                   value="All file types"
//                   readOnly
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       )}
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
//       options: item.type === 'select' || item.type === 'multiselect' ? ['Option 1', 'Option 2', 'Option 3'] : [],
//       maxSelect: item.type === 'multiselect' ? 2 : null, // Add maxSelect property for multiselect
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
//           <div className="custom-ui-formbuilder">
//             <h1>Confirm to Delete</h1>
//             <p>All collected data will be lost for this field. Are you sure you want to delete this Field?</p>
//             <div className="button-group-formbuilder">
//               <button
//                 className="delete-button-formbuilder"
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
//               <button className="cancel-button-normal-formbuilder" onClick={onClose}>
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-formbuilder",
//     });
//   };

//   const handlePreview = () => {
//     const emptyLabelIndex = formElements.findIndex(element => !element.label.trim());
    
//     if (emptyLabelIndex !== -1) {
//       const emptyLabelElementName = formElements[emptyLabelIndex].name;
//       toast.error(`Label Not Found for ${emptyLabelElementName}`);
//     } else {
//       localStorage.setItem('formElements', JSON.stringify(formElements));
//       navigate('/form-preview', { state: { formElements, formTitle, formId } });
//     }
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

//   const moveElement = (fromIndex, toIndex) => {
//     const updatedElements = [...formElements];
//     const [movedElement] = updatedElements.splice(fromIndex, 1);
//     updatedElements.splice(toIndex, 0, movedElement);
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container-formbuilder">
//         <ToastContainer position="bottom-right" />
//         <div className="form-builder-sidebar-formbuilder"> 
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
//         <div className="form-builder-content-formbuilder">
//           <div className="form-builder-header-formbuilder">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons-formbuilder">
//               <button className="form-builder-preview-button-formbuilder" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button-formbuilder" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <DraggableFormElement
//                 key={index}
//                 index={index}
//                 element={element}
//                 moveElement={moveElement}
//                 toggleExpand={toggleExpand}
//                 handleDelete={handleDelete}
//                 expanded={expandedElements[index]}
//                 handleChange={handleChange}
//                 handleOptionChange={handleOptionChange}
//                 handleAddOption={handleAddOption}
//                 handleRemoveOption={handleRemoveOption}
//               />
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;



///multi work
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
//   FORM_ELEMENT: 'form-element',
// };

// const DraggableItem = ({ id, name, type }) => {
//   const [, drag] = useDrag({
//     type: ItemTypes.FIELD,
//     item: { id, name, type },
//   });
//   return (
//     <div ref={drag} className="draggable-item-formbuilder">
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
//     <div ref={drop} className="drop-area-formbuilder">
//       {children}
//     </div>
//   );
// };

// const DraggableFormElement = ({
//   index,
//   element,
//   moveElement,
//   toggleExpand,
//   handleDelete,
//   expanded,
//   handleChange,
//   handleOptionChange,
//   handleAddOption,
//   handleRemoveOption,
// }) => {
//   const [, ref, preview] = useDrag({
//     type: ItemTypes.FORM_ELEMENT,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.FORM_ELEMENT,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveElement(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="dropped-element-formbuilder">
//       <div className="element-header-formbuilder">
//         <span className="drag-handle-formbuilder" ref={preview}><FaGripVertical /></span>
//         <span className="element-number-formbuilder">{index + 1}</span>
//         <span className="element-label-formbuilder">{element.name}</span>
//         <div className="element-actions-formbuilder">
//           {expanded ? (
//             <FaChevronUp className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           ) : (
//             <FaChevronDown className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           )}
//           <FaRegTrashAlt className="icon-formbuilder delete-formbuilder" onClick={() => handleDelete(index)} />
//         </div>
//       </div>
//       {expanded && (
//         <div className="element-details-formbuilder">
//           <div className="form-group-formbuilder">
//             <label className="label-text-formbuilder">Label <span className="required-formbuilder">*</span> (Label must be required)</label>
//             <input
//               type="text"
//               value={element.label}
//               onChange={(e) => handleChange(index, 'label', e.target.value)}
//             />
//           </div>
//           <div className="form-group-formbuilder">
//             <label>Input Type</label>
//             <select
//               value={element.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//             >
//               <option value="text">Text Answer</option>
//               <option value="textarea">Long Answer</option>
//               <option value="select">Single Select</option>
//               <option value="multiselect">Multiple Select</option>
//               <option value="file">File Upload</option>
//               <option value="switch">Switch (True/False)</option>
//               <option value="slider">Slider (Marks/Ratings)</option>
//               <option value="date">Date</option>
//               <option value="rows">Multiple Rows</option>
//               <option value="email">Email</option>
//               <option value="url">Link/URL</option>
//               <option value="number">Number</option>
//               <option value="pngjpg">PNG/JPG Format</option>
//             </select>
//           </div>
//           {element.type !== 'select' && element.type !== 'multiselect' && (
//             <div className="form-group-formbuilder">
//               <label>Placeholder</label>
//               <input
//                 type="text"
//                 value={element.placeholder}
//                 onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//               />
//             </div>
//           )}
//           {(element.type === 'select' || element.type === 'multiselect') && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-group-formbuilder">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-input-formbuilder"
//                     />
//                     <button type="button" className="remove-option-formbuilder" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-option-formbuilder" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               {element.type === 'multiselect' && (
//                 <div className="form-group-formbuilder">
//                   <label>Maximum number of options that can be selected</label>
//                   <input
//                     type="number"
//                     value={element.maxSelect}
//                     onChange={(e) => handleChange(index, 'maxSelect', e.target.value)}
//                   />
//                 </div>
//               )}
//               <div className="form-group-formbuilder">
//                 <label className="checkbox-label-formbuilder">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'file' && (
//             <div className="form-group-formbuilder">
//               <label>Allowed File Type</label>
//               {element.name === 'Resume (PDF Format Only)' && (
//                 <input
//                   type="text"
//                   value="PDF"
//                   readOnly
//                 />
//               )}
//               {element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//                 <input
//                   type="text"
//                   value="PNG, JPG"
//                   readOnly
//                 />
//               )}
//               {element.name === 'File Upload' && (
//                 <input
//                   type="text"
//                   value="All file types"
//                   readOnly
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       )}
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
//       options: item.type === 'select' || item.type === 'multiselect' ? ['Option 1', 'Option 2', 'Option 3'] : [],
//       maxSelect: item.type === 'multiselect' ? 2 : null, // Add maxSelect property for multiselect
//     };
  
//     if (item.type === 'text' || item.type === 'number') {
//       newElement.maxLength = 50;
//       newElement.minLength = 0;
//     }
  
//     setFormElements((prev) => [...prev, newElement]);
//   };
  

//   // const handleDrop = (item) => {
//   //   const newElement = {
//   //     ...item,
//   //     label: '',
//   //     placeholder: '',
//   //     required: false,
//   //     options: item.type === 'select' || item.type === 'multiselect' ? ['Option 1', 'Option 2', 'Option 3'] : [],
//   //     maxSelect: item.type === 'multiselect' ? 1 : undefined,
//   //   };

//   //   if (item.type === 'text' || item.type === 'number') {
//   //     newElement.maxLength = 50;
//   //     newElement.minLength = 0;
//   //   }

//   //   setFormElements((prev) => [...prev, newElement]);
//   // };

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
//           <div className="custom-ui-formbuilder">
//             <h1>Confirm to Delete</h1>
//             <p>All collected data will be lost for this field. Are you sure you want to delete this Field?</p>
//             <div className="button-group-formbuilder">
//               <button
//                 className="delete-button-formbuilder"
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
//               <button className="cancel-button-normal-formbuilder" onClick={onClose}>
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-formbuilder",
//     });
//   };

//   const handlePreview = () => {
//     const emptyLabelIndex = formElements.findIndex(element => !element.label.trim());
    
//     if (emptyLabelIndex !== -1) {
//       const emptyLabelElementName = formElements[emptyLabelIndex].name;
//       toast.error(`Label Not Found for ${emptyLabelElementName}`);
//     } else {
//       localStorage.setItem('formElements', JSON.stringify(formElements));
//       navigate('/form-preview', { state: { formElements, formTitle, formId } });
//     }
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

//   const moveElement = (fromIndex, toIndex) => {
//     const updatedElements = [...formElements];
//     const [movedElement] = updatedElements.splice(fromIndex, 1);
//     updatedElements.splice(toIndex, 0, movedElement);
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container-formbuilder">
//         <ToastContainer position="bottom-right" />
//         <div className="form-builder-sidebar-formbuilder">
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
//         <div className="form-builder-content-formbuilder">
//           <div className="form-builder-header-formbuilder">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons-formbuilder">
//               <button className="form-builder-preview-button-formbuilder" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button-formbuilder" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <DraggableFormElement
//                 key={index}
//                 index={index}
//                 element={element}
//                 moveElement={moveElement}
//                 toggleExpand={toggleExpand}
//                 handleDelete={handleDelete}
//                 expanded={expandedElements[index]}
//                 handleChange={handleChange}
//                 handleOptionChange={handleOptionChange}
//                 handleAddOption={handleAddOption}
//                 handleRemoveOption={handleRemoveOption}
//               />
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;

























// /////////all Input work , max min ok
// ////ragular work 22/7     


// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
//   FORM_ELEMENT: 'form-element', 
// };

// const DraggableItem = ({ id, name, type }) => {
//   const [, drag] = useDrag({
//     type: ItemTypes.FIELD,
//     item: { id, name, type },
//   });
//   return (
//     <div ref={drag} className="draggable-item-formbuilder">
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
//     <div ref={drop} className="drop-area-formbuilder">
//       {children}
//     </div>
//   );
// };

// const DraggableFormElement = ({
//   index,
//   element,
//   moveElement,
//   toggleExpand,
//   handleDelete,
//   expanded,
//   handleChange,
//   handleOptionChange,
//   handleAddOption,
//   handleRemoveOption
// }) => {
//   const [, ref, preview] = useDrag({
//     type: ItemTypes.FORM_ELEMENT,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.FORM_ELEMENT,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveElement(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="dropped-element-formbuilder">
//       <div className="element-header-formbuilder">
//         <span className="drag-handle-formbuilder" ref={preview}><FaGripVertical /></span>
//         <span className="element-number-formbuilder">{index + 1}</span>
//         <span className="element-label-formbuilder">{element.name}</span>
//         <div className="element-actions-formbuilder">
//           {expanded ? (
//             <FaChevronUp className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           ) : (
//             <FaChevronDown className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           )}
//           <FaRegTrashAlt className="icon-formbuilder delete-formbuilder" onClick={() => handleDelete(index)} />   
//         </div>
//       </div>
//       {expanded && (
//         <div className="element-details-formbuilder">
//           <div className="form-group-formbuilder">
//             <label className="label-text-formbuilder">Label <span className="required-formbuilder">*</span> (Label must be required)</label>
//             <input
//               type="text"
//               value={element.label}
//               onChange={(e) => handleChange(index, 'label', e.target.value)}
//             />
//           </div>
//           <div className="form-group-formbuilder">
//             <label>Input Type</label>
//             <select
//               value={element.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//             >
//               <option value="text">Text Answer</option>
//               <option value="textarea">Long Answer</option>
//               <option value="select">Single Select</option>
//               <option value="multiselect">Multiple Select</option>
//               <option value="file">File Upload</option>
//               <option value="switch">Switch (True/False)</option>
//               <option value="slider">Slider (Marks/Ratings)</option>
//               <option value="date">Date</option>
//               <option value="rows">Multiple Rows</option>
//               <option value="email">Email</option>
//               <option value="url">Link/URL</option>
//               <option value="number">Number</option>
//               <option value="pngjpg">PNG/JPG Format</option>
//             </select>
//           </div>
//           {element.type !== 'select' && (
//             <div className="form-group-formbuilder">
//               <label>Placeholder</label>
//               <input
//                 type="text"
//                 value={element.placeholder}
//                 onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//               />
//             </div>
//           )}
//           {element.type === 'text' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Maximum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.maxLength}
//                   onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
//                 />
//               </div>
//               <div className="form-group-formbuilder">
//                 <label>Minimum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.minLength}
//                   onChange={(e) => handleChange(index, 'minLength', e.target.value)}
//                 />
//               </div>
//             </>
//           )}
//           {element.type === 'select' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-group-formbuilder">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-input-formbuilder"
//                     />
//                     <button type="button" className="remove-option-formbuilder" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-option-formbuilder" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               <div className="form-group-formbuilder">
//                 <label className="checkbox-label-formbuilder">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'file' && (
//             <div className="form-group-formbuilder">
//               <label>Allowed File Type</label>
//               {element.name === 'Resume (PDF Format Only)' && (
//                 <input
//                   type="text"
//                   value="PDF"
//                   readOnly
//                 />
//               )}
//               {element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//                 <input
//                   type="text"
//                   value="PNG, JPG"
//                   readOnly
//                 />
//               )}
//               {element.name === 'File Upload' && (
//                 <input
//                   type="text"
//                   value="All file types"
//                   readOnly
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       )}
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
//           <div className="custom-ui-formbuilder">
//             <h1>Confirm to Delete</h1>
//             <p>All collected data will be lost for this field. Are you sure you want to delete this Field?</p>
//             <div className="button-group-formbuilder">
//               <button
//                 className="delete-button-formbuilder"
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
//               <button className="cancel-button-normal-formbuilder" onClick={onClose}>
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-formbuilder",
//     });
//   };

//   const handlePreview = () => {
//     const emptyLabelIndex = formElements.findIndex(element => !element.label.trim());
    
//     if (emptyLabelIndex !== -1) {
//       const emptyLabelElementName = formElements[emptyLabelIndex].name;
//       toast.error(`Label Not Found for ${emptyLabelElementName}`);
//     } else {
//       localStorage.setItem('formElements', JSON.stringify(formElements));
//       navigate('/form-preview', { state: { formElements, formTitle, formId } });
//     }
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

//   const moveElement = (fromIndex, toIndex) => {
//     const updatedElements = [...formElements];
//     const [movedElement] = updatedElements.splice(fromIndex, 1);
//     updatedElements.splice(toIndex, 0, movedElement);
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container-formbuilder">
//         <ToastContainer position="bottom-right" />
//         <div className="form-builder-sidebar-formbuilder">
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
//         <div className="form-builder-content-formbuilder">
//           <div className="form-builder-header-formbuilder">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons-formbuilder">
//               <button className="form-builder-preview-button-formbuilder" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button-formbuilder" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <DraggableFormElement
//                 key={index}
//                 index={index}
//                 element={element}
//                 moveElement={moveElement}
//                 toggleExpand={toggleExpand}
//                 handleDelete={handleDelete}
//                 expanded={expandedElements[index]}
//                 handleChange={handleChange}
//                 handleOptionChange={handleOptionChange}
//                 handleAddOption={handleAddOption}
//                 handleRemoveOption={handleRemoveOption}
//               />
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;


































////max ok 


// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
//   FORM_ELEMENT: 'form-element',
// };

// const DraggableItem = ({ id, name, type }) => {
//   const [, drag] = useDrag({
//     type: ItemTypes.FIELD,
//     item: { id, name, type },
//   });
//   return (
//     <div ref={drag} className="draggable-item-formbuilder">
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
//     <div ref={drop} className="drop-area-formbuilder">
//       {children}
//     </div>
//   );
// };

// const DraggableFormElement = ({
//   index,
//   element,
//   moveElement,
//   toggleExpand,
//   handleDelete,
//   expanded,
//   handleChange,
//   handleOptionChange,
//   handleAddOption,
//   handleRemoveOption
// }) => {
//   const [, ref, preview] = useDrag({
//     type: ItemTypes.FORM_ELEMENT,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.FORM_ELEMENT,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveElement(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="dropped-element-formbuilder">
//       <div className="element-header-formbuilder">
//         <span className="drag-handle-formbuilder" ref={preview}><FaGripVertical /></span>
//         <span className="element-number-formbuilder">{index + 1}</span>
//         <span className="element-label-formbuilder">{element.name}</span>
//         <div className="element-actions-formbuilder">
//           {expanded ? (
//             <FaChevronUp className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           ) : (
//             <FaChevronDown className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           )}
//           <FaRegTrashAlt className="icon-formbuilder delete-formbuilder" onClick={() => handleDelete(index)} />   
//         </div>
//       </div>
//       {expanded && (
//         <div className="element-details-formbuilder">
//           <div className="form-group-formbuilder">
//             <label className="label-text-formbuilder">Label <span className="required-formbuilder">*</span> (Label must be required)</label>
//             <input
//               type="text"
//               value={element.label}
//               onChange={(e) => handleChange(index, 'label', e.target.value)}
//             />
//           </div>
//           <div className="form-group-formbuilder">
//             <label>Input Type</label>
//             <select
//               value={element.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//             >
//               <option value="text">Text Answer</option>
//               <option value="textarea">Long Answer</option>
//               <option value="select">Single Select</option>
//               <option value="multiselect">Multiple Select</option>
//               <option value="file">File Upload</option>
//               <option value="switch">Switch (True/False)</option>
//               <option value="slider">Slider (Marks/Ratings)</option>
//               <option value="date">Date</option>
//               <option value="rows">Multiple Rows</option>
//               <option value="email">Email</option>
//               <option value="url">Link/URL</option>
//               <option value="number">Number</option>
//               <option value="pngjpg">PNG/JPG Format</option>
//             </select>
//           </div>
//           {element.type !== 'select' && (
//             <div className="form-group-formbuilder">
//               <label>Placeholder</label>
//               <input
//                 type="text"
//                 value={element.placeholder}
//                 onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//               />
//             </div>
//           )}
//           {element.type === 'text' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Maximum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.maxLength}
//                   onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
//                 />
//               </div>
//               <div className="form-group-formbuilder">
//                 <label>Minimum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.minLength}
//                   onChange={(e) => handleChange(index, 'minLength', e.target.value)}
//                 />
//               </div>
//             </>
//           )}
//           {element.type === 'select' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-group-formbuilder">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-input-formbuilder"
//                     />
//                     <button type="button" className="remove-option-formbuilder" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-option-formbuilder" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               <div className="form-group-formbuilder">
//                 <label className="checkbox-label-formbuilder">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'file' && (
//             <div className="form-group-formbuilder">
//               <label>Allowed File Type</label>
//               {element.name === 'Resume (PDF Format Only)' && (
//                 <input
//                   type="text"
//                   value="PDF"
//                   readOnly
//                 />
//               )}
//               {element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//                 <input
//                   type="text"
//                   value="PNG, JPG"
//                   readOnly
//                 />
//               )}
//               {element.name === 'File Upload' && (
//                 <input
//                   type="text"
//                   value="All file types"
//                   readOnly
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       )}
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
//           <div className="custom-ui-formbuilder">
//             <h1>Confirm to Delete</h1>
//             <p>All collected data will be lost for this field. Are you sure you want to delete this Field?</p>
//             <div className="button-group-formbuilder">
//               <button
//                 className="delete-button-formbuilder"
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
//               <button className="cancel-button-normal-formbuilder" onClick={onClose}>
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-formbuilder",
//     });
//   };

//   const handlePreview = () => {
//     const emptyLabelIndex = formElements.findIndex(element => !element.label.trim());
    
//     if (emptyLabelIndex !== -1) {
//       const emptyLabelElementName = formElements[emptyLabelIndex].name;
//       toast.error(`Label Not Found for ${emptyLabelElementName}`);
//     } else {
//       localStorage.setItem('formElements', JSON.stringify(formElements));
//       navigate('/form-preview', { state: { formElements, formTitle, formId } });
//     }
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

//   const moveElement = (fromIndex, toIndex) => {
//     const updatedElements = [...formElements];
//     const [movedElement] = updatedElements.splice(fromIndex, 1);
//     updatedElements.splice(toIndex, 0, movedElement);
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container-formbuilder">
//         <ToastContainer position="bottom-right" />
//         <div className="form-builder-sidebar-formbuilder">
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
//         <div className="form-builder-content-formbuilder">
//           <div className="form-builder-header-formbuilder">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons-formbuilder">
//               <button className="form-builder-preview-button-formbuilder" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button-formbuilder" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <DraggableFormElement
//                 key={index}
//                 index={index}
//                 element={element}
//                 moveElement={moveElement}
//                 toggleExpand={toggleExpand}
//                 handleDelete={handleDelete}
//                 expanded={expandedElements[index]}
//                 handleChange={handleChange}
//                 handleOptionChange={handleOptionChange}
//                 handleAddOption={handleAddOption}
//                 handleRemoveOption={handleRemoveOption}
//               />
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;











/////////b 0 to 50


// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
//   FORM_ELEMENT: 'form-element',
// };

// const DraggableItem = ({ id, name, type }) => {
//   const [, drag] = useDrag({
//     type: ItemTypes.FIELD,
//     item: { id, name, type },
//   });
//   return (
//     <div ref={drag} className="draggable-item-formbuilder">
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
//     <div ref={drop} className="drop-area-formbuilder">
//       {children}
//     </div>
//   );
// };

// const DraggableFormElement = ({
//   index,
//   element,
//   moveElement,
//   toggleExpand,
//   handleDelete,
//   expanded,
//   handleChange,
//   handleOptionChange,
//   handleAddOption,
//   handleRemoveOption
// }) => {
//   const [, ref, preview] = useDrag({
//     type: ItemTypes.FORM_ELEMENT,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.FORM_ELEMENT,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveElement(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="dropped-element-formbuilder">
//       <div className="element-header-formbuilder">
//         <span className="drag-handle-formbuilder" ref={preview}><FaGripVertical /></span>
//         <span className="element-number-formbuilder">{index + 1}</span>
//         <span className="element-label-formbuilder">{element.name}</span>
//         <div className="element-actions-formbuilder">
//           {expanded ? (
//             <FaChevronUp className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           ) : (
//             <FaChevronDown className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           )}
//           <FaRegTrashAlt className="icon-formbuilder delete-formbuilder" onClick={() => handleDelete(index)} />   
//         </div>
//       </div>
//       {expanded && (
//         <div className="element-details-formbuilder">
//           <div className="form-group-formbuilder">
//             <label className="label-text-formbuilder">Label <span className="required-formbuilder">*</span> (Label must be required)</label>
//             <input
//               type="text"
//               value={element.label}
//               onChange={(e) => handleChange(index, 'label', e.target.value)}
//             />
//           </div>
//           <div className="form-group-formbuilder">
//             <label>Input Type</label>
//             <select
//               value={element.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//             >
//               <option value="text">Text Answer</option>
//               <option value="textarea">Long Answer</option>
//               <option value="select">Single Select</option>
//               <option value="multiselect">Multiple Select</option>
//               <option value="file">File Upload</option>
//               <option value="switch">Switch (True/False)</option>
//               <option value="slider">Slider (Marks/Ratings)</option>
//               <option value="date">Date</option>
//               <option value="rows">Multiple Rows</option>
//               <option value="email">Email</option>
//               <option value="url">Link/URL</option>
//               <option value="number">Number</option>
//               <option value="pngjpg">PNG/JPG Format</option>
//             </select>
//           </div>
//           {element.type !== 'select' && (
//             <div className="form-group-formbuilder">
//               <label>Placeholder</label>
//               <input
//                 type="text"
//                 value={element.placeholder}
//                 onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//               />
//             </div>
//           )}
//           {element.type === 'text' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Maximum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.maxLength}
//                   onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
//                 />
//               </div>
//               <div className="form-group-formbuilder">
//                 <label>Minimum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.minLength}
//                   onChange={(e) => handleChange(index, 'minLength', e.target.value)}
//                 />
//               </div>
//             </>
//           )}
//           {element.type === 'select' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-group-formbuilder">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-input-formbuilder"
//                     />
//                     <button type="button" className="remove-option-formbuilder" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-option-formbuilder" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               <div className="form-group-formbuilder">
//                 <label className="checkbox-label-formbuilder">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'file' && (
//             <div className="form-group-formbuilder">
//               <label>Allowed File Type</label>
//               {element.name === 'Resume (PDF Format Only)' && (
//                 <input
//                   type="text"
//                   value="PDF"
//                   readOnly
//                 />
//               )}
//               {element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//                 <input
//                   type="text"
//                   value="PNG, JPG"
//                   readOnly
//                 />
//               )}
//               {element.name === 'File Upload' && (
//                 <input
//                   type="text"
//                   value="All file types"
//                   readOnly
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       )}
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
//     // console.log('Element dropped:', item); 

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
//           <div className="custom-ui-formbuilder">
//             <h1>Confirm to Delete</h1>
//             <p>All collected data will be lost for this field. Are you sure you want to delete this Field?</p>
//             <div className="button-group-formbuilder">
//               <button
//                 className="delete-button-formbuilder"
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
//               <button className="cancel-button-normal-formbuilder" onClick={onClose}>
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-formbuilder",
//     });
//   };

//   const handlePreview = () => {
//     const emptyLabelIndex = formElements.findIndex(element => !element.label.trim());
    
//     if (emptyLabelIndex !== -1) {
//       const emptyLabelElementName = formElements[emptyLabelIndex].name;
//       toast.error(`Label Not Found for ${emptyLabelElementName}`);
//     } else {
//       localStorage.setItem('formElements', JSON.stringify(formElements));
//       navigate('/form-preview', { state: { formElements, formTitle, formId } });
//     }
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     console.log(`Changed element ${index} field ${field} to ${value}`); // Debugging statement
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

//   const moveElement = (fromIndex, toIndex) => {
//     const updatedElements = [...formElements];
//     const [movedElement] = updatedElements.splice(fromIndex, 1);
//     updatedElements.splice(toIndex, 0, movedElement);
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container-formbuilder">
//         <ToastContainer position="bottom-right" />
//         <div className="form-builder-sidebar-formbuilder">
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
//         <div className="form-builder-content-formbuilder">
//           <div className="form-builder-header-formbuilder">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons-formbuilder">
//               <button className="form-builder-preview-button-formbuilder" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button-formbuilder" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <DraggableFormElement
//                 key={index}
//                 index={index}
//                 element={element}
//                 moveElement={moveElement}
//                 toggleExpand={toggleExpand}
//                 handleDelete={handleDelete}
//                 expanded={expandedElements[index]}
//                 handleChange={handleChange}
//                 handleOptionChange={handleOptionChange}
//                 handleAddOption={handleAddOption}
//                 handleRemoveOption={handleRemoveOption}
//               />
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;











/* bef both file save  */


// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
//   FORM_ELEMENT: 'form-element',
// };

// const DraggableItem = ({ id, name, type }) => {
//   const [, drag] = useDrag({
//     type: ItemTypes.FIELD,
//     item: { id, name, type },
//   });
//   return (
//     <div ref={drag} className="draggable-item-formbuilder">
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
//     <div ref={drop} className="drop-area-formbuilder">
//       {children}
//     </div>
//   );
// };

// const DraggableFormElement = ({
//   index,
//   element,
//   moveElement,
//   toggleExpand,
//   handleDelete,
//   expanded,
//   handleChange,
//   handleOptionChange,
//   handleAddOption,
//   handleRemoveOption
// }) => {
//   const [, ref, preview] = useDrag({
//     type: ItemTypes.FORM_ELEMENT,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.FORM_ELEMENT,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveElement(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="dropped-element-formbuilder">
//       <div className="element-header-formbuilder">
//         <span className="drag-handle-formbuilder" ref={preview}><FaGripVertical /></span>
//         <span className="element-number-formbuilder">{index + 1}</span>
//         <span className="element-label-formbuilder">{element.name}</span>
//         <div className="element-actions-formbuilder">
//           {expanded ? (
//             <FaChevronUp className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           ) : (
//             <FaChevronDown className="icon-formbuilder" onClick={() => toggleExpand(index)} />
//           )}
//           <FaRegTrashAlt className="icon-formbuilder delete-formbuilder" onClick={() => handleDelete(index)} />
//         </div>
//       </div>
//       {expanded && (
//         <div className="element-details-formbuilder">
//           <div className="form-group-formbuilder">
//             {/* <label className="label-text-formbuilder">Label <span className="required-formbuilder">*</span> (Should be unique)</label> */}
//             <label className="label-text-formbuilder">Label <span className="required-formbuilder">*</span> (Label must be required)</label>
//             <input
//               type="text"
//               value={element.label}
//               onChange={(e) => handleChange(index, 'label', e.target.value)}
//             />
//           </div>
//           <div className="form-group-formbuilder">
//             <label>Input Type</label>
//             <select
//               value={element.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//             >
//               <option value="text">Text Answer</option>
//               <option value="textarea">Long Answer</option>
//               <option value="select">Single Select</option>
//               <option value="multiselect">Multiple Select</option>
//               <option value="file">File Upload</option>
//               <option value="switch">Switch (True/False)</option>
//               <option value="slider">Slider (Marks/Ratings)</option>
//               <option value="date">Date</option>
//               <option value="rows">Multiple Rows</option>
//               <option value="email">Email</option>
//               <option value="url">Link/URL</option>
//               <option value="number">Number</option>
//               <option value="pngjpg">PNG/JPG Format</option>
//             </select>
//           </div>
//           {element.type !== 'select' && (
//             <div className="form-group-formbuilder">
//               <label>Placeholder</label>
//               <input
//                 type="text"
//                 value={element.placeholder}
//                 onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//               />
//             </div>
//           )}
//           {element.type === 'text' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Maximum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.maxLength}
//                   onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
//                 />
//               </div>
//               <div className="form-group-formbuilder">
//                 <label>Minimum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.minLength}
//                   onChange={(e) => handleChange(index, 'minLength', e.target.value)}
//                 />
//               </div>
//             </>
//           )}
//           {element.type === 'select' && (
//             <>
//               <div className="form-group-formbuilder">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-group-formbuilder">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-input-formbuilder"
//                     />
//                     <button type="button" className="remove-option-formbuilder" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-option-formbuilder" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               <div className="form-group-formbuilder">
//                 <label className="checkbox-label-formbuilder">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'file' && element.name === 'Resume (PDF Format Only)' && (
//             <div className="form-group-formbuilder">
//               <label>Allowed File Type</label>
//               <input
//                 type="text"
//                 value="PDF"
//                 readOnly
//               />
//             </div>
//           )}
//           {element.type === 'file' && element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//             <div className="form-group-formbuilder">
//               <label>Allowed File Type</label>
//               <input
//                 type="text"
//                 value="PNG, JPG"
//                 readOnly
//               />
//             </div>
//           )}
//         </div>
//       )}
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
//           <div className="custom-ui-formbuilder">
//             <h1>Confirm to Delete</h1>
//             <p>All collected data will be lost for this field. Are you sure you want to delete this Field?</p>
//             <div className="button-group-formbuilder">
//               <button
//                 className="delete-button-formbuilder"
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
//               <button className="cancel-button-normal-formbuilder" onClick={onClose}>
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlay-formbuilder",
//     });
//   };

//   const handlePreview = () => {
//     const emptyLabelIndex = formElements.findIndex(element => !element.label.trim());
    
//     if (emptyLabelIndex !== -1) {
//       const emptyLabelElementName = formElements[emptyLabelIndex].name;
//       toast.error(`Label Not Found for ${emptyLabelElementName}`);
//     } else {
//       localStorage.setItem('formElements', JSON.stringify(formElements));
//       navigate('/form-preview', { state: { formElements, formTitle, formId } });
//     }
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

//   const moveElement = (fromIndex, toIndex) => {
//     const updatedElements = [...formElements];
//     const [movedElement] = updatedElements.splice(fromIndex, 1);
//     updatedElements.splice(toIndex, 0, movedElement);
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container-formbuilder">
//         <ToastContainer position="bottom-right" />
//         <div className="form-builder-sidebar-formbuilder">
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
//         <div className="form-builder-content-formbuilder">
//           <div className="form-builder-header-formbuilder">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons-formbuilder">
//               <button className="form-builder-preview-button-formbuilder" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button-formbuilder" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <DraggableFormElement
//                 key={index}
//                 index={index}
//                 element={element}
//                 moveElement={moveElement}
//                 toggleExpand={toggleExpand}
//                 handleDelete={handleDelete}
//                 expanded={expandedElements[index]}
//                 handleChange={handleChange}
//                 handleOptionChange={handleOptionChange}
//                 handleAddOption={handleAddOption}
//                 handleRemoveOption={handleRemoveOption}
//               />
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;



















// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
//   FORM_ELEMENT: 'form-element',
// };

// const DraggableItem = ({ id, name, type }) => {
//   const [, drag] = useDrag({
//     type: ItemTypes.FIELD,
//     item: { id, name, type },
//   });
//   return (
//     <div ref={drag} className="draggable-itemformbuilder">
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
//     <div ref={drop} className="drop-areaformbuilder">
//       {children}
//     </div>
//   );
// };

// // New component for draggable form element
// const DraggableFormElement = ({
//   index,
//   element,
//   moveElement,
//   toggleExpand,
//   handleDelete,
//   expanded,
//   handleChange,
//   handleOptionChange,
//   handleAddOption,
//   handleRemoveOption
// }) => {
//   const [, ref, preview] = useDrag({
//     type: ItemTypes.FORM_ELEMENT,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.FORM_ELEMENT,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveElement(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="dropped-elementformbuilder">
//       <div className="element-headerformbuilder">
//         <span className="drag-handleformbuilder" ref={preview}><FaGripVertical /></span> {/* New drag handle */}
//         <span className="element-numberformbuilder">{index + 1}</span>
//         <span className="element-labelformbuilder">{element.name}</span>
//         <div className="element-actionsformbuilder">
//           {expanded ? (
//             <FaChevronUp className="iconformbuilder" onClick={() => toggleExpand(index)} />
//           ) : (
//             <FaChevronDown className="iconformbuilder" onClick={() => toggleExpand(index)} />
//           )}
//           <FaRegTrashAlt className="icon deleteformbuilder" onClick={() => handleDelete(index)} />
//         </div>
//       </div>
//       {expanded && (
//         <div className="element-detailsformbuilder">
//           <div className="form-groupformbuilder">
//             <label className="label-textformbuilder">Label <span className="requiredformbuilder">*</span> (Should be unique)</label>
//             <input
//               type="text"
//               value={element.label}
//               onChange={(e) => handleChange(index, 'label', e.target.value)}
//             />
//           </div>
//           <div className="form-groupformbuilder">
//             <label>Input Type</label>
//             <select
//               value={element.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//             >
//               <option value="text">Text Answer</option>
//               <option value="textarea">Long Answer</option>
//               <option value="select">Single Select</option>
//               <option value="multiselect">Multiple Select</option>
//               <option value="file">File Upload</option>
//               <option value="switch">Switch (True/False)</option>
//               <option value="slider">Slider (Marks/Ratings)</option>
//               <option value="date">Date</option>
//               <option value="rows">Multiple Rows</option>
//               <option value="email">Email</option>
//               <option value="url">Link/URL</option>
//               <option value="number">Number</option>
//               <option value="pngjpg">PNG/JPG Format</option>
//             </select>
//           </div>
//           {element.type !== 'select' && (
//             <div className="form-groupformbuilder">
//               <label>Placeholder</label>
//               <input
//                 type="text"
//                 value={element.placeholder}
//                 onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//               />
//             </div>
//           )}
//           {element.type === 'text' && (
//             <>
//               <div className="form-groupformbuilder">
//                 <label>Maximum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.maxLength}
//                   onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
//                 />
//               </div>
//               <div className="form-groupformbuilder">
//                 <label>Minimum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.minLength}
//                   onChange={(e) => handleChange(index, 'minLength', e.target.value)}
//                 />
//               </div>
//             </>
//           )}
//           {element.type === 'select' && (
//             <>
//               <div className="form-groupformbuilder">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-groupformbuilder">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-inputformbuilder"
//                     />
//                     <button type="button" className="remove-optionformbuilder" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-optionformbuilder" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               <div className="form-groupformbuilder">
//                 <label className="checkbox-labelformbuilder">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'file' && element.name === 'Resume (PDF Format Only)' && (
//             <div className="form-groupformbuilder">
//               <label>Allowed File Type</label>
//               <input
//                 type="text"
//                 value="PDF"
//                 readOnly
//               />
//             </div>
//           )}
//           {element.type === 'file' && element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//             <div className="form-groupformbuilder">
//               <label>Allowed File Type</label>
//               <input
//                 type="text"
//                 value="PNG, JPG"
//                 readOnly
//               />
//             </div>
//           )}
//         </div>
//       )}
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
//           <div className="custom-uiformbuilder">
//             <h1>Confirm to Delete</h1>
//             <p>All collected data will be lost for this field. Are you sure you want to delete this Field?</p>
//             <div className="button-groupformbuilder">
//               <button
//                 className="delete-buttonformbuilder"
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
//               <button className="cancel-button-normal-formformbuilder" onClick={onClose}>
//                 No
//               </button>
//             </div>
//           </div>
//         );
//       },
//       overlayClassName: "custom-overlayformbuilder",
//     });
//   };

//   const handlePreview = () => {
//     const emptyLabelIndex = formElements.findIndex(element => !element.label.trim());
    
//     if (emptyLabelIndex !== -1) {
//       const emptyLabelElementName = formElements[emptyLabelIndex].name;
//       toast.error(`Label Not Found for ${emptyLabelElementName}`);
//     } else {
//       localStorage.setItem('formElements', JSON.stringify(formElements));
//       navigate('/form-preview', { state: { formElements, formTitle, formId } });
//     }
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

//   const moveElement = (fromIndex, toIndex) => {
//     const updatedElements = [...formElements];
//     const [movedElement] = updatedElements.splice(fromIndex, 1);
//     updatedElements.splice(toIndex, 0, movedElement);
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-containerformbuilder">
//         <ToastContainer position="bottom-right" />
//         <div className="form-builder-sidebarformbuilder">
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
//         <div className="form-builder-contentformbuilder">
//           <div className="form-builder-headerformbuilder">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttonsformbuilder">
//               <button className="form-builder-preview-buttonformbuilder" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-buttonformbuilder" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <DraggableFormElement
//                 key={index}
//                 index={index}
//                 element={element}
//                 moveElement={moveElement}
//                 toggleExpand={toggleExpand}
//                 handleDelete={handleDelete}
//                 expanded={expandedElements[index]}
//                 handleChange={handleChange}
//                 handleOptionChange={handleOptionChange}
//                 handleAddOption={handleAddOption}
//                 handleRemoveOption={handleRemoveOption}
//               />
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;















/* // /////before css class selector  */


// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import 'react-toastify/dist/ReactToastify.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
//   FORM_ELEMENT: 'form-element',
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

// // New component for draggable form element
// const DraggableFormElement = ({
//   index,
//   element,
//   moveElement,
//   toggleExpand,
//   handleDelete,
//   expanded,
//   handleChange,
//   handleOptionChange,
//   handleAddOption,
//   handleRemoveOption
// }) => {
//   const [, ref, preview] = useDrag({
//     type: ItemTypes.FORM_ELEMENT,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.FORM_ELEMENT,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveElement(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="dropped-element">
//       <div className="element-header">
//         <span className="drag-handle" ref={preview}><FaGripVertical /></span> {/* New drag handle */}
//         <span className="element-number">{index + 1}</span>
//         <span className="element-label">{element.name}</span>
//         <div className="element-actions">
//           {expanded ? (
//             <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//           ) : (
//             <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//           )}
//           <FaRegTrashAlt className="icon delete" onClick={() => handleDelete(index)} />
//         </div>
//       </div>
//       {expanded && (
//         <div className="element-details">
//           <div className="form-group">
//             <label className="label-text">Label <span className="required">*</span> (Should be unique)</label>
//             <input
//               type="text"
//               value={element.label}
//               onChange={(e) => handleChange(index, 'label', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Input Type</label>
//             <select
//               value={element.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//             >
//               <option value="text">Text Answer</option>
//               <option value="textarea">Long Answer</option>
//               <option value="select">Single Select</option>
//               <option value="multiselect">Multiple Select</option>
//               <option value="file">File Upload</option>
//               <option value="switch">Switch (True/False)</option>
//               <option value="slider">Slider (Marks/Ratings)</option>
//               <option value="date">Date</option>
//               <option value="rows">Multiple Rows</option>
//               <option value="email">Email</option>
//               <option value="url">Link/URL</option>
//               <option value="number">Number</option>
//               <option value="pngjpg">PNG/JPG Format</option>
//             </select>
//           </div>
//           {element.type !== 'select' && (
//             <div className="form-group">
//               <label>Placeholder</label>
//               <input
//                 type="text"
//                 value={element.placeholder}
//                 onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//               />
//             </div>
//           )}
//           {element.type === 'text' && (
//             <>
//               <div className="form-group">
//                 <label>Maximum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.maxLength}
//                   onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Minimum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.minLength}
//                   onChange={(e) => handleChange(index, 'minLength', e.target.value)}
//                 />
//               </div>
//             </>
//           )}
//           {element.type === 'select' && (
//             <>
//               <div className="form-group">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-group">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-input"
//                     />
//                     <button type="button" className="remove-option" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-option" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               <div className="form-group">
//                 <label className="checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'file' && element.name === 'Resume (PDF Format Only)' && (
//             <div className="form-group">
//               <label>Allowed File Type</label>
//               <input
//                 type="text"
//                 value="PDF"
//                 readOnly
//               />
//             </div>
//           )}
//           {element.type === 'file' && element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//             <div className="form-group">
//               <label>Allowed File Type</label>
//               <input
//                 type="text"
//                 value="PNG, JPG"
//                 readOnly
//               />
//             </div>
//           )}
//         </div>
//       )}
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
//     const emptyLabelIndex = formElements.findIndex(element => !element.label.trim());
    
//     if (emptyLabelIndex !== -1) {
//       const emptyLabelElementName = formElements[emptyLabelIndex].name;
//       toast.error(`Label Not Found for ${emptyLabelElementName}`);
//     } else {
//       localStorage.setItem('formElements', JSON.stringify(formElements));
//       navigate('/form-preview', { state: { formElements, formTitle, formId } });
//     }
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

//   const moveElement = (fromIndex, toIndex) => {
//     const updatedElements = [...formElements];
//     const [movedElement] = updatedElements.splice(fromIndex, 1);
//     updatedElements.splice(toIndex, 0, movedElement);
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <ToastContainer position="bottom-right" />
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
//               <DraggableFormElement
//                 key={index}
//                 index={index}
//                 element={element}
//                 moveElement={moveElement}
//                 toggleExpand={toggleExpand}
//                 handleDelete={handleDelete}
//                 expanded={expandedElements[index]}
//                 handleChange={handleChange}
//                 handleOptionChange={handleOptionChange}
//                 handleAddOption={handleAddOption}
//                 handleRemoveOption={handleRemoveOption}
//               />
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;











///label error not show


// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle, FaGripVertical } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import './FormBuilder.css';

// const ItemTypes = {
//   FIELD: 'field',
//   FORM_ELEMENT: 'form-element',
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

// // New component for draggable form element
// const DraggableFormElement = ({
//   index,
//   element,
//   moveElement,
//   toggleExpand,
//   handleDelete,
//   expanded,
//   handleChange,
//   handleOptionChange,
//   handleAddOption,
//   handleRemoveOption
// }) => {
//   const [, ref, preview] = useDrag({
//     type: ItemTypes.FORM_ELEMENT,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.FORM_ELEMENT,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveElement(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="dropped-element">
//       <div className="element-header">
//         <span className="drag-handle" ref={preview}><FaGripVertical /></span> {/* New drag handle */}
//         <span className="element-number">{index + 1}</span>
//         <span className="element-label">{element.name}</span>
//         <div className="element-actions">
//           {expanded ? (
//             <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//           ) : (
//             <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//           )}
//           <FaRegTrashAlt className="icon delete" onClick={() => handleDelete(index)} />
//         </div>
//       </div>
//       {expanded && (
//         <div className="element-details">
//           <div className="form-group">
//             <label className="label-text">Label <span className="required">*</span> (Should be unique)</label>
//             <input
//               type="text"
//               value={element.label}
//               onChange={(e) => handleChange(index, 'label', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Input Type</label>
//             <select
//               value={element.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//             >
//               <option value="text">Text Answer</option>
//               <option value="textarea">Long Answer</option>
//               <option value="select">Single Select</option>
//               <option value="multiselect">Multiple Select</option>
//               <option value="file">File Upload</option>
//               <option value="switch">Switch (True/False)</option>
//               <option value="slider">Slider (Marks/Ratings)</option>
//               <option value="date">Date</option>
//               <option value="rows">Multiple Rows</option>
//               <option value="email">Email</option>
//               <option value="url">Link/URL</option>
//               <option value="number">Number</option>
//               <option value="pngjpg">PNG/JPG Format</option>
//             </select>
//           </div>
//           {element.type !== 'select' && (
//             <div className="form-group">
//               <label>Placeholder</label>
//               <input
//                 type="text"
//                 value={element.placeholder}
//                 onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//               />
//             </div>
//           )}
//           {element.type === 'text' && (
//             <>
//               <div className="form-group">
//                 <label>Maximum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.maxLength}
//                   onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Minimum Character(s)</label>
//                 <input
//                   type="number"
//                   value={element.minLength}
//                   onChange={(e) => handleChange(index, 'minLength', e.target.value)}
//                 />
//               </div>
//             </>
//           )}
//           {element.type === 'select' && (
//             <>
//               <div className="form-group">
//                 <label>Options</label>
//                 {element.options.map((option, optionIndex) => (
//                   <div key={optionIndex} className="option-group">
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//                       className="option-input"
//                     />
//                     <button type="button" className="remove-option" onClick={() => handleRemoveOption(index, optionIndex)}>
//                       <FaTimesCircle />
//                     </button>
//                   </div>
//                 ))}
//                 <button type="button" className="add-option" onClick={() => handleAddOption(index)}>
//                   Add Option
//                 </button>
//               </div>
//               <div className="form-group">
//                 <label className="checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={element.required}
//                     onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                   />
//                   Required
//                 </label>
//               </div>
//             </>
//           )}
//           {element.type === 'file' && element.name === 'Resume (PDF Format Only)' && (
//             <div className="form-group">
//               <label>Allowed File Type</label>
//               <input
//                 type="text"
//                 value="PDF"
//                 readOnly
//               />
//             </div>
//           )}
//           {element.type === 'file' && element.name === 'Upload Startup Logo (In PNG/JPG Format)' && (
//             <div className="form-group">
//               <label>Allowed File Type</label>
//               <input
//                 type="text"
//                 value="PNG, JPG"
//                 readOnly
//               />
//             </div>
//           )}
//         </div>
//       )}
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

//   const moveElement = (fromIndex, toIndex) => {
//     const updatedElements = [...formElements];
//     const [movedElement] = updatedElements.splice(fromIndex, 1);
//     updatedElements.splice(toIndex, 0, movedElement);
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
//               <DraggableFormElement
//                 key={index}
//                 index={index}
//                 element={element}
//                 moveElement={moveElement}
//                 toggleExpand={toggleExpand}
//                 handleDelete={handleDelete}
//                 expanded={expandedElements[index]}
//                 handleChange={handleChange}
//                 handleOptionChange={handleOptionChange}
//                 handleAddOption={handleAddOption}
//                 handleRemoveOption={handleRemoveOption}
//               />
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;




























/////////befpre nested D n D

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





















// ///////before validation work ok


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






























































////////// not correct PNG/JPG




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
//     // Highlighted Change: Navigate to FormPreview with form data
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










//////////////good , 8  API



// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
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










///////////edit but duplicate 
//////
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
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







////////ragular
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//     navigate('/form-preview', { state: { formElements, formTitle } });
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










// /////////////b not navigation
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//     navigate('/form-preview', { state: { formElements, formTitle } });
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

















//egulAR WOKING// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//     navigate('/form-preview', { state: { formElements, formTitle } });
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







// ///////////bef delete popup12
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
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
















////////before remove copy and edit 
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
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
//           <h3>Question Type</h3>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
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





// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//       useUniqueLabel: false,
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
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
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
//           <h3>Question Type</h3>
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
//               <button className="form-builder-save-button">Save</button>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
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
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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













///////////bf social link 
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//       useUniqueLabel: false,
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
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
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
//           <h3>Question Type</h3>
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
//               <button className="form-builder-save-button">Save</button>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
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
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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




/////bf resume 
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//       useUniqueLabel: false,
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
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
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
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="contact-number" name="Contact Number" type="number" />
//           <DraggableItem id="date-of-birth" name="Date of Birth" type="date" />
//           <DraggableItem id="designation" name="Designation" type="text" />
//           <DraggableItem id="resume" name="Resume" type="file" />
//           <DraggableItem id="qualification" name="Qualification (Recent One)" type="text" />
//           <DraggableItem id="registered-office-location" name="Registered Office Location" type="text" />
//           <DraggableItem id="one-liner-of-your-startup" name="One Liner of your startup" type="textarea" />
//           <DraggableItem id="upload-startup-logo" name="Upload Startup Logo (In PNG/JPG Format)" type="file" />
//           <DraggableItem id="startup-team-size" name="Startup team size" type="number" />
//           <DraggableItem id="brief-description-of-your-startup" name="Brief Description of your startup" type="textarea" />
//           <DraggableItem id="startup-website" name="Startup Website" type="url" />
//           <DraggableItem id="startup-postal-address" name="Startup Postal Address" type="textarea" />
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
//               <button className="form-builder-save-button">Save</button>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
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
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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




///////bf number 
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//       useUniqueLabel: false,
//       options: item.type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : [],
//     };

//     if (item.type === 'text') {
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
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
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
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="contact-number" name="Contact Number" type="text" />
//           <DraggableItem id="date-of-birth" name="Date of Birth" type="date" />
//           <DraggableItem id="designation" name="Designation" type="text" />
//           <DraggableItem id="resume" name="Resume" type="file" />
//           <DraggableItem id="qualification" name="Qualification (Recent One)" type="text" />
//           <DraggableItem id="registered-office-location" name="Registered Office Location" type="text" />
//           <DraggableItem id="one-liner-of-your-startup" name="One Liner of your startup" type="textarea" />
//           <DraggableItem id="upload-startup-logo" name="Upload Startup Logo (In PNG/JPG Format)" type="file" />
//           <DraggableItem id="startup-team-size" name="Startup team size" type="number" />
//           <DraggableItem id="brief-description-of-your-startup" name="Brief Description of your startup" type="textarea" />
//           <DraggableItem id="startup-website" name="Startup Website" type="url" />
//           <DraggableItem id="startup-postal-address" name="Startup Postal Address" type="textarea" />
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
//               <button className="form-builder-save-button">Save</button>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
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
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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












///////////be add new sidebar
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//       useUniqueLabel: false,
//       options: item.type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : [],
//     };

//     if (item.type === 'text') {
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
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
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
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
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
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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






///single ok
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//       useUniqueLabel: false,
//       options: item.type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : [],
//     };

//     if (item.type === 'text') {
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
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
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
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
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
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
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






/////////no drop 
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt, FaTimesCircle } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//       useUniqueLabel: false,
//       options: item.type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : [],
//     };

//     if (item.type === 'text') {
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
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
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
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
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
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
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












//////////email and name  complete 
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//       useUniqueLabel: false,
//     };

//     if (item.type === 'text') {
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
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
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
//                       <label className="checkbox-label">  
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
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
//                     <div className="form-group">
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         />
//                         Required
//                       </label>
//                     </div>
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























///////ok email 100%
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false, useUniqueLabel: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
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
//                   {/* <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div> */}
//                       <div className="element-actions">
//                            <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                          {expandedElements[index] ? (
//                         <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                           ) : (
//                              <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                               )}
//                            <FaRegTrashAlt className="icon delete" onClick={() => handleDelete(index)} />
//                            </div>
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
//                       <label className="checkbox-label">  
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         />
//                         Required
//                       </label>
//                     </div>
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




























































///////////thoda left side 
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false, useUniqueLabel: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
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
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         />
//                         Required
//                       </label>
//                     </div>
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







































// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false, useUniqueLabel: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
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
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         />
//                         Required
//                       </label>
//                     </div>
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









// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false, useUniqueLabel: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
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
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
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
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         />
//                         Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label className="checkbox-label">
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         />
//                         Required
//                       </label>
//                     </div>
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











// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
//               <button className="form-builder-preview-button" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     <span className="element-number">{index + 1}</span>
//                     <span className="drag-handle">::</span>
//                     {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label className="label-text">
//                         Label <span className="required">*</span> (Should be unique)
//                       </label>
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleChange(index, 'label', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group label-checkbox">
//                       <input
//                         type="checkbox"
//                         checked={element.useUniqueLabel}
//                         onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                       />
//                       <label>Use unique label as the display text for the question</label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group label-checkbox">
//                       <input
//                         type="checkbox"
//                         checked={element.required}
//                         onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                       />
//                       <label>Required</label>
//                     </div>
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











// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
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
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
//               <button className="form-builder-preview-button" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleChange(index, 'label', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         /> Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         /> Required
//                       </label>
//                     </div>
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


















// ///////save ok 
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { formElements: initialFormElements = [], formTitle } = location.state || {};
//   const [formElements, setFormElements] = useState(initialFormElements.map((item, index) => ({ ...item, id: index })));
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedFormElements = JSON.parse(localStorage.getItem('formElements'));
//     if (savedFormElements) {
//       setFormElements(savedFormElements);
//     }
//   }, []);

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements, formTitle } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{formTitle || 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
//               <button className="form-builder-preview-button" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleChange(index, 'label', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         /> Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         /> Required
//                       </label>
//                     </div>
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














// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const { form } = location.state || {};
//   const [formElements, setFormElements] = useState(form ? Object.keys(form).map(key => ({ name: key, label: form[key] })) : []);
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedFormElements = JSON.parse(localStorage.getItem('formElements'));
//     if (savedFormElements) {
//       setFormElements(savedFormElements);
//     }
//   }, []);

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>{form ? form.title : 'test'}</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
//               <button className="form-builder-preview-button" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleChange(index, 'label', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         /> Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         /> Required
//                       </label>
//                     </div>
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





















//////bf neev
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
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
//   const [formElements, setFormElements] = useState([]);
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedFormElements = JSON.parse(localStorage.getItem('formElements'));
//     if (savedFormElements) {
//       setFormElements(savedFormElements);
//     }
//   }, []);

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="form-builder-save-button">Save</button>
//               <button className="form-builder-preview-button" onClick={handlePreview}>Preview</button>
//               <button className="form-builder-close-button">Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleChange(index, 'label', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         /> Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         /> Required
//                       </label>
//                     </div>
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








/////bf uniq class
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
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
//   const [formElements, setFormElements] = useState([]);
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedFormElements = JSON.parse(localStorage.getItem('formElements'));
//     if (savedFormElements) {
//       setFormElements(savedFormElements);
//     }
//   }, []);

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button">Save</button>
//               <button className="preview-button" onClick={handlePreview}>Preview</button>
//               <button className="close-button">Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleChange(index, 'label', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         /> Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         /> Required
//                       </label>
//                     </div>
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
































// ///////preview work12
// /////
// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
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
//   const [formElements, setFormElements] = useState([]);
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedFormElements = JSON.parse(localStorage.getItem('formElements'));
//     if (savedFormElements) {
//       setFormElements(savedFormElements);
//     }
//   }, []);

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//   <button className="form-builder-save-button">Save</button>
//   <button className="form-builder-edit-button" onClick={handlePreview}>Preview</button> 
//   <button className="form-builder-close-button">Close</button>
// </div>

//             {/* <div className="form-builder-buttons">
//               <button className="save-button">Save</button>
//               <button className="preview-button" onClick={handlePreview}>Preview</button> 
//               <button className="close-button">Close</button>
//             </div> */}
            
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleChange(index, 'label', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         /> Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         /> Required
//                       </label>
//                     </div>
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












// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
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
//   const [formElements, setFormElements] = useState([]);
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedFormElements = JSON.parse(localStorage.getItem('formElements'));
//     if (savedFormElements) {
//       setFormElements(savedFormElements);
//     }
//   }, []);

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, { ...item, label: '', placeholder: '', required: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     localStorage.setItem('formElements', JSON.stringify(formElements));
//     navigate('/form-preview', { state: { formElements } });
//   };

//   const handleChange = (index, field, value) => {
//     const updatedElements = [...formElements];
//     updatedElements[index][field] = value;
//     setFormElements(updatedElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button">Save</button>
//               <button className="preview-button" onClick={handlePreview}>Preview</button>
//               <button className="close-button">Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleChange(index, 'label', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.useUniqueLabel}
//                           onChange={(e) => handleChange(index, 'useUniqueLabel', e.target.checked)}
//                         /> Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         /> Required
//                       </label>
//                     </div>
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




























// import React, { useState } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
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
//   const [formElements, setFormElements] = useState([]);
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, { ...item, label: item.name, placeholder: '', required: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handleChange = (index, key, value) => {
//     setFormElements((prev) =>
//       prev.map((element, i) => (i === index ? { ...element, [key]: value } : element))
//     );
//   };

//   const handlePreview = () => {
//     navigate('/form-preview', { state: { formElements } });
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button">Save</button>
//               <button className="preview-button" onClick={handlePreview}>Preview</button>
//               <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleChange(index, 'label', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.uniqueLabel}
//                           onChange={(e) => handleChange(index, 'uniqueLabel', e.target.checked)}
//                         /> Use unique label as the display text for the question
//                       </label>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleChange(index, 'required', e.target.checked)}
//                         /> Required
//                       </label>
//                     </div>
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



// import React, { useState } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
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
//   const [formElements, setFormElements] = useState([]);
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, item]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     navigate('/form-preview', { state: { formElements } });
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button">Save</button>
//               <button className="preview-button" onClick={handlePreview}>Preview</button>
//               <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input type="text" defaultValue={element.name} />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input type="checkbox" defaultChecked /> Use unique label as the display text for the question
//                       </label>
//                     </div>
//                     <div className="form-group">
//                       <label>Input Type</label>
//                       <select defaultValue={element.type}>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input type="text" placeholder="Enter Your Placeholder" />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input type="checkbox" /> Required
//                       </label>
//                     </div>
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








// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const [formElements, setFormElements] = useState([]);
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state && location.state.formElements) {
//       setFormElements(location.state.formElements);
//     }
//   }, [location.state]);

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, item]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     navigate('/form-preview', { state: { formElements } });
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button">Save</button>
//               <button className="preview-button" onClick={handlePreview}>Preview</button>
//               <button className="close-button">Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input type="text" defaultValue={element.name} />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input type="checkbox" defaultChecked /> Use unique label as the display text for the question
//                       </label>
//                     </div>
//                     <div className="form-group">
//                       <label>Input Type</label>
//                       <select defaultValue={element.type}>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input type="text" placeholder="Enter Your Placeholder" />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input type="checkbox" /> Required
//                       </label>
//                     </div>
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










// import React, { useState } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
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
//   const [formElements, setFormElements] = useState([]);
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, item]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handlePreview = () => {
//     navigate('/form-preview', { state: { formElements } });
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button">Save</button>
//               <button className="preview-button" onClick={handlePreview}>Preview</button>
//               <button className="close-button">Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input type="text" defaultValue={element.name} />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input type="checkbox" defaultChecked /> Use unique label as the display text for the question
//                       </label>
//                     </div>
//                     <div className="form-group">
//                       <label>Input Type</label>
//                       <select defaultValue={element.type}>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input type="text" placeholder="Enter Your Placeholder" />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input type="checkbox" /> Required
//                       </label>
//                     </div>
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










// import React, { useState } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
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
//   const [formElements, setFormElements] = useState([]);
//   const [expandedElements, setExpandedElements] = useState({});
//   const navigate = useNavigate();

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, { ...item, label: item.name, placeholder: '', required: false }]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   const handleInputChange = (index, key, value) => {
//     setFormElements((prev) => {
//       const newElements = [...prev];
//       newElements[index][key] = value;
//       return newElements;
//     });
//   };

//   const handlePreview = () => {
//     navigate('/form-preview', { state: { formElements } });
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button">Save</button>
//               <button className="preview-button" onClick={handlePreview}>Preview</button>
//               <button className="close-button">Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleInputChange(index, 'label', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleInputChange(index, 'required', e.target.checked)}
//                         /> Use unique label as the display text for the question
//                       </label>
//                     </div>
//                     <div className="form-group">
//                       <label>Input Type</label>
//                       <select
//                         value={element.type}
//                         onChange={(e) => handleInputChange(index, 'type', e.target.value)}
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleInputChange(index, 'placeholder', e.target.value)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={element.required}
//                           onChange={(e) => handleInputChange(index, 'required', e.target.checked)}
//                         /> Required
//                       </label>
//                     </div>
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












// //////////bf preview
// import React, { useState } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FaRegCopy, FaRegEdit, FaChevronDown, FaChevronUp, FaRegTrashAlt } from 'react-icons/fa';
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
//   const [formElements, setFormElements] = useState([]);
//   const [expandedElements, setExpandedElements] = useState({});

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, item]);
//   };

//   const toggleExpand = (index) => {
//     setExpandedElements((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//     setExpandedElements((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[index];
//       return newExpanded;
//     });
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="email" name="Email" type="email" />
//           <DraggableItem id="name" name="Name" type="text" />
//           <DraggableItem id="short-answer" name="Short Answer" type="text" />
//           <DraggableItem id="long-answer" name="Long Answer" type="textarea" />
//           <DraggableItem id="single-select" name="Single Select" type="select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" type="multiselect" />
//           <DraggableItem id="file-upload" name="File Upload" type="file" />
//           <DraggableItem id="switch" name="Switch (True/False)" type="switch" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" type="slider" />
//           <DraggableItem id="date" name="Date" type="date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" type="rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button">Save</button>
//               <button className="preview-button">Preview</button>
//               <button className="close-button">Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-header">
//                   <span className="element-label">
//                     {index + 1} {element.name}
//                   </span>
//                   <div className="element-actions">
//                     <FaRegCopy className="icon" />
//                     <FaRegEdit className="icon" />
//                     {expandedElements[index] ? (
//                       <FaChevronUp className="icon" onClick={() => toggleExpand(index)} />
//                     ) : (
//                       <FaChevronDown className="icon" onClick={() => toggleExpand(index)} />
//                     )}
//                     <FaRegTrashAlt className="icon" onClick={() => handleDelete(index)} />
//                   </div>
//                 </div>
//                 {expandedElements[index] && (
//                   <div className="element-details">
//                     <div className="form-group">
//                       <label>Label <span className="required">*</span> (Should be unique)</label>
//                       <input type="text" defaultValue={element.name} />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input type="checkbox" defaultChecked /> Use unique label as the display text for the question
//                       </label>
//                     </div>
//                     <div className="form-group">
//                       <label>Input Type</label>
//                       <select defaultValue={element.type}>
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
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input type="text" placeholder="Enter Your Placeholder" />
//                     </div>
//                     <div className="form-group">
//                       <label>
//                         <input type="checkbox" /> Required
//                       </label>
//                     </div>
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




////////no default 
// import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import DraggableItem from './DraggableItem';
// import DropArea from './DropArea';
// import { useNavigate } from 'react-router-dom';
// import './FormBuilder.css';

// const FormBuilder = () => {
//   const [formElements, setFormElements] = useState([]);
//   const [expandedElement, setExpandedElement] = useState(null);
//   const navigate = useNavigate();

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, { ...item, id: new Date().getTime() }]);
//   };

//   const handleSave = () => {
//     // Save form elements logic here
//     console.log('Form elements saved:', formElements);
//   };

//   const handleToggleExpand = (id) => {
//     setExpandedElement(expandedElement === id ? null : id);
//   };

//   const handleDelete = (id) => {
//     setFormElements((prev) => prev.filter((element) => element.id !== id));
//   };

//   const handleCopy = (element) => {
//     const newElement = { ...element, id: new Date().getTime() };
//     setFormElements((prev) => [...prev, newElement]);
//   };

//   const handleInputChange = (id, field, value) => {
//     setFormElements((prev) =>
//       prev.map((element) =>
//         element.id === id ? { ...element, [field]: value } : element
//       )
//     );
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="short-answer" name="Short Answer" />
//           <DraggableItem id="long-answer" name="Long Answer" />
//           <DraggableItem id="single-select" name="Single Select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" />
//           <DraggableItem id="file-upload" name="File Upload" />
//           <DraggableItem id="switch" name="Switch (True/False)" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" />
//           <DraggableItem id="date" name="Date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button" onClick={handleSave}>Save</button>
//               <button className="preview-button" onClick={() => navigate('/form-preview')}>Preview</button>
//               <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={element.id} className="dropped-element">
//                 <div className="element-header">
//                   <div className="element-title">
//                     <span>{index + 1}</span> {element.name}
//                   </div>
//                   <div className="element-controls">
//                     <button onClick={() => handleCopy(element)}>
//                       <i className="icon-copy"></i>
//                     </button>
//                     <button onClick={() => handleToggleExpand(element.id)}>
//                       <i className={`icon-${expandedElement === element.id ? 'collapse' : 'expand'}`}></i>
//                     </button>
//                     <button onClick={() => handleDelete(element.id)}>
//                       <i className="icon-delete"></i>
//                     </button>
//                   </div>
//                 </div>
//                 {expandedElement === element.id && (
//                   <div className="element-details">
//                     <label>
//                       Label *
//                       <input
//                         type="text"
//                         value={element.label}
//                         onChange={(e) => handleInputChange(element.id, 'label', e.target.value)}
//                       />
//                     </label>
//                     <label>
//                       Input Type
//                       <select
//                         value={element.inputType}
//                         onChange={(e) => handleInputChange(element.id, 'inputType', e.target.value)}
//                       >
//                         <option value="email">Email</option>
//                         <option value="text">Text Answer</option>
//                         <option value="number">Numeric Answer</option>
//                         <option value="url">Link/URL</option>
//                       </select>
//                     </label>
//                     <label>
//                       Placeholder
//                       <input
//                         type="text"
//                         value={element.placeholder}
//                         onChange={(e) => handleInputChange(element.id, 'placeholder', e.target.value)}
//                       />
//                     </label>
//                     <label>
//                       <input
//                         type="checkbox"
//                         checked={element.required}
//                         onChange={(e) => handleInputChange(element.id, 'required', e.target.checked)}
//                       />
//                       Required
//                     </label>
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

























// /////////////default email and name 
// import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import DraggableItem from './DraggableItem';
// import DropArea from './DropArea';
// import { useNavigate } from 'react-router-dom';
// import { FaCopy, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
// import './FormBuilder.css';

// const FormBuilder = () => {
//   const [formElements, setFormElements] = useState([
//     { id: 1, name: 'Email', type: 'text', expanded: false },
//     { id: 2, name: 'Name', type: 'text', expanded: false },
//   ]);
//   const navigate = useNavigate();

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, item]);
//   };

//   const handleSave = () => {
//     console.log('Form elements saved:', formElements);
//   };

//   const handleCopy = (index) => {
//     const elementToCopy = formElements[index];
//     setFormElements((prev) => [...prev, { ...elementToCopy, id: prev.length + 1 }]);
//   };

//   const handleExpand = (index) => {
//     setFormElements((prev) => {
//       const newElements = prev.map((element, i) => 
//         i === index ? { ...element, expanded: !element.expanded } : element
//       );
//       return newElements;
//     });
//   };

//   const handleDelete = (index) => {
//     setFormElements((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="short-answer" name="Short Answer" />
//           <DraggableItem id="long-answer" name="Long Answer" />
//           <DraggableItem id="single-select" name="Single Select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" />
//           <DraggableItem id="file-upload" name="File Upload" />
//           <DraggableItem id="switch" name="Switch (True/False)" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" />
//           <DraggableItem id="date" name="Date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button" onClick={handleSave}>Save</button>
//               <button className="preview-button" onClick={() => navigate('/form-preview')}>Preview</button>
//               <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <div className="hints">
//             <h3>Hints</h3>
//             <ul>
//               <li>Drop your question type below</li>
//               <li>'Name' & 'Email' fields are compulsory</li>
//               <li>Include 'Startup Name' field to capture startup names</li>
//             </ul>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-label">
//                   <div className="element-index">{index + 1}</div>
//                   <div className="element-name">{element.name}</div>
//                 </div>
//                 <div className="element-actions">
//                   <FaCopy className="icon" onClick={() => handleCopy(index)} />
//                   <FaEdit className="icon" />
//                   {element.expanded ? (
//                     <FaChevronUp className="icon" onClick={() => handleExpand(index)} />
//                   ) : (
//                     <FaChevronDown className="icon" onClick={() => handleExpand(index)} />
//                   )}
//                   <FaTrash className="icon" onClick={() => handleDelete(index)} />
//                 </div>
//                 {element.expanded && (
//                   <div className="expanded-content">
//                     <div className="form-group">
//                       <label>Label *</label>
//                       <input type="text" value={element.name} readOnly />
//                     </div>
//                     <div className="form-group">
//                       <label>Input Type</label>
//                       <select value={element.type}>
//                         <option value="text">Text</option>
//                         <option value="email">Email</option>
//                         <option value="number">Number</option>
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label>Placeholder</label>
//                       <input type="text" placeholder={`Enter Your ${element.name}`} />
//                     </div>
//                     <div className="form-group">
//                       <label>Required</label>
//                       <input type="checkbox" defaultChecked />
//                     </div>
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















//////////good icon
// import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import DraggableItem from './DraggableItem';
// import DropArea from './DropArea';
// import { useNavigate } from 'react-router-dom';
// import { FaCopy, FaEdit, FaTrash, FaChevronDown } from 'react-icons/fa';
// import './FormBuilder.css';

// const FormBuilder = () => {
//   const [formElements, setFormElements] = useState([
//     { id: 1, name: 'Email', type: 'text' },
//     { id: 2, name: 'Name', type: 'text' },
//   ]);
//   const navigate = useNavigate();

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, item]);
//   };

//   const handleSave = () => {
//     console.log('Form elements saved:', formElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="short-answer" name="Short Answer" />
//           <DraggableItem id="long-answer" name="Long Answer" />
//           <DraggableItem id="single-select" name="Single Select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" />
//           <DraggableItem id="file-upload" name="File Upload" />
//           <DraggableItem id="switch" name="Switch (True/False)" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" />
//           <DraggableItem id="date" name="Date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button" onClick={handleSave}>Save</button>
//               <button className="preview-button" onClick={() => navigate('/form-preview')}>Preview</button>
//               <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <div className="hints">
//             <h3>Hints</h3>
//             <ul>
//               <li>Drop your question type below</li>
//               <li>'Name' & 'Email' fields are compulsory</li>
//               <li>Include 'Startup Name' field to capture startup names</li>
//             </ul>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-label">
//                   <div className="element-index">{index + 1}</div>
//                   <div className="element-name">{element.name}</div>
//                 </div>
//                 <div className="element-actions">
//                   <FaCopy className="icon" />
//                   <FaEdit className="icon" />
//                   <FaChevronDown className="icon" />
//                   <FaTrash className="icon" />
//                 </div>
//               </div>
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;

















// import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import DraggableItem from './DraggableItem';
// import DropArea from './DropArea';
// import { useNavigate } from 'react-router-dom';
// import { FaCopy, FaEdit, FaTrash, FaChevronDown } from 'react-icons/fa';
// import './FormBuilder.css';

// const FormBuilder = () => {
//   const [formElements, setFormElements] = useState([
//     { id: 1, name: 'Email', type: 'text' },
//     { id: 2, name: 'Name', type: 'text' },
//   ]);
//   const navigate = useNavigate();

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, item]);
//   };

//   const handleSave = () => {
//     console.log('Form elements saved:', formElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="short-answer" name="Short Answer" />
//           <DraggableItem id="long-answer" name="Long Answer" />
//           <DraggableItem id="single-select" name="Single Select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" />
//           <DraggableItem id="file-upload" name="File Upload" />
//           <DraggableItem id="switch" name="Switch (True/False)" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" />
//           <DraggableItem id="date" name="Date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button" onClick={handleSave}>Save</button>
//               <button className="preview-button" onClick={() => navigate('/form-preview')}>Preview</button>
//               <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 <div className="element-label">{index + 1} {element.name}</div>
//                 <div className="element-actions">
//                   <FaCopy className="icon" />
//                   <FaEdit className="icon" />
//                   <FaChevronDown className="icon" />
//                   <FaTrash className="icon delete-icon" />
//                 </div>
//               </div>
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;












// import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import DraggableItem from './DraggableItem';
// import DropArea from './DropArea';
// import { useNavigate } from 'react-router-dom';
// import './FormBuilder.css';

// const FormBuilder = () => {
//   const [formElements, setFormElements] = useState([]);
//   const navigate = useNavigate();

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, item]);
//   };

//   const handleSave = () => {
//     // Save form elements logic here
//     console.log('Form elements saved:', formElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="short-answer" name="Short Answer" />
//           <DraggableItem id="long-answer" name="Long Answer" />
//           <DraggableItem id="single-select" name="Single Select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" />
//           <DraggableItem id="file-upload" name="File Upload" />
//           <DraggableItem id="switch" name="Switch (True/False)" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" />
//           <DraggableItem id="date" name="Date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button" onClick={handleSave}>Save</button>
//               <button className="preview-button" onClick={() => navigate('/form-preview')}>Preview</button>
//               <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 {element.name}
//               </div>
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;





// import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import DraggableItem from './DraggableItem';
// import DropArea from './DropArea';
// import { useNavigate } from 'react-router-dom';
// import './FormBuilder.css';

// const FormBuilder = () => {
//   const [formElements, setFormElements] = useState([]);
//   const navigate = useNavigate();

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, item]);
//   };

//   const handleSave = () => {
//     // Save form elements logic here
//     console.log('Form elements saved:', formElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="short-answer" name="Short Answer" />
//           <DraggableItem id="long-answer" name="Long Answer" />
//           <DraggableItem id="single-select" name="Single Select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" />
//           <DraggableItem id="file-upload" name="File Upload" />
//           <DraggableItem id="switch" name="Switch (True/False)" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" />
//           <DraggableItem id="date" name="Date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button" onClick={handleSave}>Save</button>
//               <button className="preview-button" onClick={() => navigate('/form-preview')}>Preview</button>
//               <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <div className="form-builder-drop-area">
//             <DropArea onDrop={handleDrop}>
//               {formElements.map((element, index) => (
//                 <div key={index} className="dropped-element">
//                   {element.name}
//                 </div>
//               ))}
//             </DropArea>
//           </div>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;








/////////
///////
// import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import DraggableItem from './DraggableItem';
// import DropArea from './DropArea';
// import { useNavigate } from 'react-router-dom';
// import './FormBuilder.css';

// const FormBuilder = () => {
//   const [formElements, setFormElements] = useState([]);
//   const navigate = useNavigate();

//   const handleDrop = (item) => {
//     setFormElements((prev) => [...prev, item]);
//   };

//   const handleSave = () => {
//     // Save form elements logic here
//     console.log('Form elements saved:', formElements);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="form-builder-container">
//         <div className="form-builder-sidebar">
//           <h3>Question Type</h3>
//           <DraggableItem id="short-answer" name="Short Answer" />
//           <DraggableItem id="long-answer" name="Long Answer" />
//           <DraggableItem id="single-select" name="Single Select" />
//           <DraggableItem id="multiple-select" name="Multiple Select" />
//           <DraggableItem id="file-upload" name="File Upload" />
//           <DraggableItem id="switch" name="Switch (True/False)" />
//           <DraggableItem id="slider" name="Slider (Marks/Ratings)" />
//           <DraggableItem id="date" name="Date" />
//           <DraggableItem id="multiple-rows" name="Multiple Rows" />
//         </div>
//         <div className="form-builder-content">
//           <div className="form-builder-header">
//             <h2>test</h2>
//             <div className="form-builder-buttons">
//               <button className="save-button" onClick={handleSave}>Save</button>
//               <button className="preview-button" onClick={() => navigate('/form-preview')}>Preview</button>
//               <button className="close-button" onClick={() => navigate('/form')}>Close</button>
//             </div>
//           </div>
//           <DropArea onDrop={handleDrop}>
//             {formElements.map((element, index) => (
//               <div key={index} className="dropped-element">
//                 {element.name}
//               </div>
//             ))}
//           </DropArea>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default FormBuilder;
