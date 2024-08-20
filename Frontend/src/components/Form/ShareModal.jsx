import React from 'react';
import { FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import './ShareModal.css';
 
const ShareModal = ({ shareableLink, copyLinkToClipboard, closeShareModal }) => {
  return (
    <div className="modal-backgroundsharemodal">
      <div className="share-modalsharemodal">
        <div className="share-modal-headersharemodal">
          <h2 style={{fontSize:"22px"}}>Share Form</h2>
          <button className="close-icon-buttonsharemodal" onClick={closeShareModal}>×</button>
        </div>
        <p className='textinlinksharemodal'>Use the link below to share the form:</p>  
        <div className="link-containersharemodal">
          <input type="text" value={shareableLink} readOnly />
          <button className="copy-link-buttonsharemodal" onClick={copyLinkToClipboard}>  
            <span className="link-iconsharemodal">&#128279;</span> Copy Link
          </button>
        </div>
        <div className="social-share-buttonssharemodal">
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareableLink}`} target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={34} />
          </a>
          <a href={`https://wa.me/?text=${shareableLink}`} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={34} />
          </a>
          <a href={`mailto:?subject=Check this form&body=${shareableLink}`} target="_blank" rel="noopener noreferrer">
            <FaEnvelope size={34} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;










/* // /////before css class selector form */




// import React from 'react';
// import { FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
// import './ShareModal.css';

// const ShareModal = ({ shareableLink, copyLinkToClipboard, closeShareModal }) => {
//   return (
//     <div className="modal-background">
//       <div className="share-modal">
//         <div className="share-modal-header">
//           <h2>Share Form</h2>
//           <button className="close-button" onClick={closeShareModal}>×</button>
//         </div>
//         <p className='textinlink'>Use the link below to share the form:</p>
//         <div className="link-container">
//           <input type="text" value={shareableLink} readOnly />
//           <button className="copy-link-button" onClick={copyLinkToClipboard}>
//             <span className="link-icon">&#128279;</span> Copy Link
//           </button>
//         </div>
//         <div className="social-share-buttons">
//           <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//             <FaLinkedin size={34} />
//           </a>
//           <a href={`https://wa.me/?text=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//             <FaWhatsapp size={34} />
//           </a>
//           <a href={`mailto:?subject=Check this form&body=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//             <FaEnvelope size={34} />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShareModal;















// import React from 'react';
// import { FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
// import './ShareModal.css';

// const ShareModal = ({ shareableLink, copyLinkToClipboard, closeShareModal }) => {
//   return (
//     <div className="share-modal">
//       <div className="share-modal-header">
//         <h2>Share Form</h2>
//         <button className="close-button" onClick={closeShareModal}>×</button>
//       </div>
//       <p>Use the link below to share the form:</p>
//       <div className="link-container">
//         <input type="text" value={shareableLink} readOnly />
//         <button className="copy-link-button" onClick={copyLinkToClipboard}>
//           <span className="link-icon">&#128279;</span> Copy Link
//         </button>
//       </div>
//       <div className="social-share-buttons">
//         <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaLinkedin size={24} />
//         </a>
//         <a href={`https://wa.me/?text=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaWhatsapp size={24} />
//         </a>
//         <a href={`mailto:?subject=Check this form&body=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaEnvelope size={24} />
//         </a>
//       </div>
//     </div>
//   );
// };

// export default ShareModal;







// import React from 'react';
// import { FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
// import './ShareModal.css';

// const ShareModal = ({ shareableLink, copyLinkToClipboard, closeShareModal }) => {
//   return (
//     <div className="share-modal">
//       <div className="share-modal-header">
//         <h2>Share Form</h2>
//         <button className="close-button" onClick={closeShareModal}>×</button>
//       </div>
//       <p>Use the link below to share the form:</p>
//       <div className="link-container">
//         <input type="text" value={shareableLink} readOnly />
//         <button className="copy-link-button" onClick={copyLinkToClipboard}>
//           <span className="link-icon">&#128279;</span> Copy Link
//         </button>
//       </div>
//       <div className="social-share-buttons">
//         <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaLinkedin size={24} />
//         </a>
//         <a href={`https://wa.me/?text=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaWhatsapp size={24} />
//         </a>
//         <a href={`mailto:?subject=Check this form&body=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaEnvelope size={24} />
//         </a>
//       </div>
//     </div>
//   );
// };

// export default ShareModal;







// import React from 'react';
// import { FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
// import './ShareModal.css';

// const ShareModal = ({ shareableLink, copyLinkToClipboard, closeShareModal }) => {
//   return (
//     <div className="share-modal">
//       <h2>Share Form</h2>
//       <p>Use the link below to share the form:</p>
//       <input type="text" value={shareableLink} readOnly />
//       <button onClick={copyLinkToClipboard}>Copy Link</button>
//       <div className="social-share-buttons">
//         <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaLinkedin size={24} />
//         </a>
//         <a href={`https://wa.me/?text=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaWhatsapp size={24} />
//         </a>
//         <a href={`mailto:?subject=Check this form&body=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaEnvelope size={24} />
//         </a>
//       </div>
//       <button onClick={closeShareModal}>Close</button>
//     </div>
//   );
// };

// export default ShareModal;















// import React from 'react';
// import { FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
// import './ShareModal.css';

// const ShareModal = ({ shareableLink, copyLinkToClipboard, closeShareModal }) => {
//   return (
//     <div className="share-modal">
//       <h2>Share Form</h2>
//       <p>Use the link below to share the form:</p>
//       <input type="text" value={shareableLink} readOnly />
//       <button onClick={copyLinkToClipboard}>Copy Link</button>
//       <div className="social-share-buttons">
//         <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaLinkedin size={24} />
//         </a>
//         <a href={`https://wa.me/?text=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaWhatsapp size={24} />
//         </a>
//         <a href={`mailto:?subject=Check this form&body=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaEnvelope size={24} />
//         </a>
//       </div>
//       <button onClick={closeShareModal}>Close</button>
//     </div>
//   );
// };

// export default ShareModal;

















// import React from 'react';
// import { FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
// import './ShareModal.css';

// const ShareModal = ({ shareableLink, copyLinkToClipboard, closeShareModal }) => {
//   return (
//     <div className="share-modal">
//       <h2>Share Form</h2>
//       <p>Use the link below to share the form:</p>
//       <input type="text" value={shareableLink} readOnly />
//       <button onClick={copyLinkToClipboard}>Copy Link</button>
//       <div className="social-share-buttons">
//         <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaLinkedin size={32} />
//         </a>
//         <a href={`https://wa.me/?text=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaWhatsapp size={32} />
//         </a>
//         <a href={`mailto:?subject=Check this form&body=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaEnvelope size={32} />
//         </a>
//       </div>
//       <button onClick={closeShareModal}>Close</button>
//     </div>
//   );
// };

// export default ShareModal;











// import React from 'react';
// import { FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

// const ShareModal = ({ shareableLink, copyLinkToClipboard, closeShareModal }) => {
//   return (
//     <div className="share-modal">
//       <h2>Share Form</h2>
//       <p>Use the link below to share the form:</p>
//       <input type="text" value={shareableLink} readOnly />
//       <button onClick={copyLinkToClipboard}>Copy Link</button>
//       <div className="social-share-buttons">
//         <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaLinkedin size={32} />
//         </a>
//         <a href={`https://wa.me/?text=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaWhatsapp size={32} />
//         </a>
//         <a href={`mailto:?subject=Check this form&body=${shareableLink}`} target="_blank" rel="noopener noreferrer">
//           <FaEnvelope size={32} />
//         </a>
//       </div>
//       <button onClick={closeShareModal}>Close</button>
//     </div>
//   );
// };

// export default ShareModal;
