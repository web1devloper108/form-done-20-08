import React from 'react';
import { FaTimes, FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ShareFormModal.css';

const ShareFormModal = ({ closeModal, form }) => {
  const formLink = `${window.location.origin}/shared-form-preview/${form._id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formLink);
    toast.success('Link copied to clipboard!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true, 
      progress: undefined,
    });
  };

  return (
    <div className="modal-overlay-customeditformmodal">
      <div className="modal-content-customeditformmodal">
        <div className="modal-header-customeditformmodal">
          <h2>Share Form</h2>
          <FaTimes className="close-icon-customeditformmodal" onClick={closeModal} />
        </div>
        <div className="modal-body-customeditformmodal">
          <p className='textinlink-customeditformmodal'>Use the link below to share the form:</p> 
          <div className="link-container-customeditformmodal">
            <input
              type="text"
              value={formLink}
              readOnly
              className="share-link-input-customeditformmodal"
            />
            <button className="copy-link-button-customeditformmodal" onClick={handleCopyLink}>
              <span className="link-icon-customeditformmodal">&#128279;</span> Copy Link
            </button>
          </div>
          <div className="share-buttons-customeditformmodal">
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${formLink}`} target="_blank" rel="noopener noreferrer" className="icon-buttoneditformmodal custom-icon-linkedineditformmodal">
              <FaLinkedin size={20} />
            </a>
            <a href={`https://wa.me/?text=${formLink}`} target="_blank" rel="noopener noreferrer" className="icon-buttoneditformmodal custom-icon-whatsappeditformmodal">
              <FaWhatsapp size={20} />
            </a>
            <a href={`mailto:?subject=Check this form&body=${formLink}`} target="_blank" rel="noopener noreferrer" className="icon-buttoneditformmodal custom-icon-emaileditformmodal">
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
      <ToastContainer position="bottom-right" />

    </div>
  );
};

export default ShareFormModal;















/* // /////before css class selector  */



// import React from 'react';
// import { FaTimes, FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './ShareFormModal.css';

// const ShareFormModal = ({ closeModal, form }) => {
//   const formLink = `${window.location.origin}/shared-form-preview/${form._id}`;

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(formLink);
//     toast.success('Link copied to clipboard!', {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//   };

//   return (
//     <div className="modal-overlay-custom">
//       <div className="modal-content-custom">
//         <div className="modal-header-custom">
//           <h2>Share Form</h2>
//           <FaTimes className="close-icon-custom" onClick={closeModal} />
//         </div>
//         <div className="modal-body-custom">
//           <p className='textinlink-custom'>Use the link below to share the form:</p>
//           <div className="link-container-custom">
//             <input
//               type="text"
//               value={formLink}
//               readOnly
//               className="share-link-input-custom"
//             />
//             <button className="copy-link-button-custom" onClick={handleCopyLink}>
//               <span className="link-icon-custom">&#128279;</span> Copy Link
//             </button>
//           </div>
//           <div className="share-buttons-custom">
//             <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${formLink}`} target="_blank" rel="noopener noreferrer" className="icon-button custom-icon-linkedin">
//               <FaLinkedin size={20} />
//             </a>
//             <a href={`https://wa.me/?text=${formLink}`} target="_blank" rel="noopener noreferrer" className="icon-button custom-icon-whatsapp">
//               <FaWhatsapp size={20} />
//             </a>
//             <a href={`mailto:?subject=Check this form&body=${formLink}`} target="_blank" rel="noopener noreferrer" className="icon-button custom-icon-email">
//               <FaEnvelope size={20} />
//             </a>
//           </div>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default ShareFormModal;

















// import React from 'react';
// import { FaTimes } from 'react-icons/fa';
// import {
//   LinkedinShareButton,
//   WhatsappShareButton,
//   EmailShareButton,
//   LinkedinIcon,
//   WhatsappIcon,
//   EmailIcon
// } from 'react-share';
// import './ShareFormModal.css';

// const ShareFormModal = ({ closeModal, form }) => {
//   const formLink = `${window.location.origin}/shared-form-preview/${form._id}`;

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(formLink);
//     alert('Link copied to clipboard!');
//   };

//   return (
//     <div className="modal-overlay-custom">
//       <div className="modal-content-custom">
//         <div className="modal-header-custom">
//           <h2>Share Form</h2>
//           <FaTimes className="close-icon-custom" onClick={closeModal} />
//         </div>
//         <div className="modal-body-custom">
//           <p className='textinlink-custom'>Use the link below to share the form:</p>
//           <div className="link-container-custom">
//             <input
//               type="text"
//               value={formLink}
//               readOnly
//               className="share-link-input-custom"
//             />
//             <button className="copy-link-button-custom" onClick={handleCopyLink}>
//               <span className="link-icon-custom">&#128279;</span> Copy Link
//             </button>
//           </div>
//           <div className="share-buttons-custom">
//             <LinkedinShareButton url={formLink} className="icon-custom">
//               <LinkedinIcon size={34} round={false} />
//             </LinkedinShareButton>
//             <WhatsappShareButton url={formLink} className="icon-custom">
//               <WhatsappIcon size={34} round={false} />
//             </WhatsappShareButton>
//             <EmailShareButton url={formLink} className="icon-custom">
//               <EmailIcon size={34} round={false} />
//             </EmailShareButton>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShareFormModal;



















// import React from 'react';
// import { FaTimes } from 'react-icons/fa';
// import {
//   LinkedinShareButton,
//   TwitterShareButton,
//   WhatsappShareButton,
//   EmailShareButton,
//   LinkedinIcon,
//   TwitterIcon,
//   WhatsappIcon,
//   EmailIcon
// } from 'react-share';
// import './ShareFormModal.css';

// const ShareFormModal = ({ closeModal, form }) => {
//   const formLink = `${window.location.origin}/shared-form-preview/${form._id}`;

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(formLink);
//     alert('Link copied to clipboard!');
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Share Form</h2>
//           <FaTimes className="close-icon" onClick={closeModal} />
//         </div>
//         <div className="modal-body">
//           <p>Use the link below to share the form:</p>
//           <input
//             type="text"
//             value={formLink}
//             readOnly
//             className="share-link-input"
//           />
//           <button className="copy-link-button" onClick={handleCopyLink}>
//             Copy Link
//           </button>
//           <div className="share-buttons">
//             <LinkedinShareButton url={formLink}>
//               <LinkedinIcon size={32} round />
//             </LinkedinShareButton>
//             {/* <TwitterShareButton url={formLink}>
//               <TwitterIcon size={32} round />
//             </TwitterShareButton> */}
//             <WhatsappShareButton url={formLink}>
//               <WhatsappIcon size={32} round />
//             </WhatsappShareButton>
//             <EmailShareButton url={formLink}>
//               <EmailIcon size={32} round /> 
//             </EmailShareButton>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShareFormModal;
