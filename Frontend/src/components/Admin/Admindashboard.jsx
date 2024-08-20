// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   FaBell,
//   FaRocket,
//   FaUserCircle,
//   FaSort,
//   FaFileExport,
// } from 'react-icons/fa';
// import { FiMenu } from 'react-icons/fi';
// import { RiArrowDropDownLine } from 'react-icons/ri';
// import { IconButton, Menu, MenuItem } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import axios from 'axios';
// import logo from '../Public/logo.png';
// import successIcon from '../Public/Vector.png';
// import '../SuperAdmin/Superadmindash.css';
// import AddProgramManagerModal from './AddProgramManager';
// import EditProgramManagerModal from './EditProgramManager';
// import ViewProgramManagerModal from './ViewProgramManagerModal';

// const SuccessModal = ({ showSuccessModal, handleClose }) => {
//   if (!showSuccessModal) {
//     return null;
//   }

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <img src={successIcon} alt="Success" style={{ width: '50px', display: 'block', margin: '0 auto' }} />
//         <h2 className="modal-title">Program Manager Added Successfully</h2>
//         <p style={{ color: "#909090" }}>Program Manager details have been added successfully.</p>
//         <button onClick={handleClose} className="btn-primary">OK</button>
//       </div>
//     </div>
//   );
// };

// const Admindash = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [selectedAll, setSelectedAll] = useState(false);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [programManagerId, setProgramManagerId] = useState(null);
//   const [programManagers, setProgramManagers] = useState([]);
//   const [filteredProgramManagers, setFilteredProgramManagers] = useState([]);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();

//   const fetchProgramManagers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const config = {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       };
//       const response = await axios.get(`http://localhost:5000/api/admins/me/programmanagers`, config);
//       if (response.status === 200) {
//         setProgramManagers(response.data);
//         setFilteredProgramManagers(response.data);
//       } else {
//         console.error('Failed to fetch program managers');
//       }
//     } catch (error) {
//       console.error('Error fetching program managers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProgramManagers();
//   }, []);

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//     const filtered = programManagers.filter(pm => {
//       return (
//         pm.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
//         pm.adminName.toLowerCase().includes(event.target.value.toLowerCase()) ||
//         pm.adminPhone.toLowerCase().includes(event.target.value.toLowerCase()) ||
//         pm.username.toLowerCase().includes(event.target.value.toLowerCase()) ||
//         pm.email.toLowerCase().includes(event.target.value.toLowerCase())
//       );
//     });
//     setFilteredProgramManagers(filtered);
//     setCurrentPage(0); // Reset to first page when search query changes
//   };

//   const handleMenuClick = (event, admin) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedAdmin(admin);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedAdmin(null);
//   };

//   const handleViewDetails = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowViewModal(true);
//     handleMenuClose();
//   };

//   const handleEdit = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowEditModal(true);
//     handleMenuClose();
//   };

//   const handleDelete = async (adminId) => {
//     if (window.confirm("Are you sure you want to delete this Program Manager?")) {
//       try {
//         const token = localStorage.getItem('token');
//         const config = {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         };
//         const response = await axios.delete(`http://localhost:5000/api/admins/${adminId}/programmanagers`, config);
//         if (response.status === 200) {
//           alert('Program Manager deleted successfully');
//           fetchProgramManagers(); // Refresh the list after deletion
//         } else {
//           alert('Failed to delete Program Manager. Please try again.');
//         }
//       } catch (error) {
//         console.error('Error deleting Program Manager:', error);
//         if (error.response && error.response.status === 404) {
//           alert('Program Manager not found.');
//         } else {
//           alert('Error deleting Program Manager. Please try again.');
//         }
//       }
//     }
//     handleMenuClose();
//   };

//   const handleSelectAll = (event) => {
//     const checked = event.target.checked;
//     setSelectedAll(checked);
//     if (checked) {
//       const allIds = filteredProgramManagers.map((pm) => pm._id);
//       setSelectedIds(allIds);
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleSelectOne = (event, id) => {
//     const checked = event.target.checked;
//     if (checked) {
//       setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
//     } else {
//       setSelectedIds((prevSelectedIds) =>
//         prevSelectedIds.filter((selectedId) => selectedId !== id)
//       );
//     }
//   };

//   const isSelected = (id) => selectedIds.includes(id);

//   const exportTableToCSV = () => {
//     const headers = [
//       'Name Of The Program Manager',
//       'Name Of The Admin',
//       'Mobile Number',
//       'User Name',
//       'E-Mail',
//     ];
//     const rows = filteredProgramManagers.map((pm) => [
//       pm.name,
//       pm.adminName,
//       pm.adminPhone,
//       pm.username,
//       pm.email,
//     ]);

//     let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';

//     rows.forEach((rowArray) => {
//       let row = rowArray.join(',');
//       csvContent += row + '\n';
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', 'program_manager_ids.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleSuccessModal = () => {
//     setShowModal(false);
//     setShowSuccessModal(true);
//     fetchProgramManagers(); // Refresh program managers list after adding a new one
//   };

//   const handleCloseSuccessModal = () => {
//     setShowSuccessModal(false);
//   };

//   const handleCloseEditModal = () => {
//     setShowEditModal(false);
//   };

//   const handleEditSuccessModal = () => {
//     setShowEditModal(false);
//     fetchProgramManagers(); // Refresh program managers list after editing a program manager
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(0); // Reset to the first page when rows per page changes
//   };

//   const handlePreviousPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
//   };

//   const handleNextPage = () => {
//     const maxPage = Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1;
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
//   };

//   const paginatedData = filteredProgramManagers.slice(
//     currentPage * rowsPerPage,
//     currentPage * rowsPerPage + rowsPerPage
//   );

//   return (
//     <div className="dashboard">
//       <aside className="sidebar">
//         <div className="logo-container">
//           <div className="logo">
//             <img src={logo} alt="Logo" />
//           </div>
//         </div>
//         <div className="nav-container">
//           <nav className="nav">
//             <ul>
//               <li className="nav-item" style={{ marginTop: '80px' }}>
//                 <FaUserCircle className="nav-icon" /> Profile
//               </li>
//               <li className="nav-item">
//                 <FaRocket className="nav-icon" /> Created Program Manager ID
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>

//       <main className="main-content">
//         <header className="header">
//           <span className="founder" style={{ fontSize: '24px' }}>
//             <FiMenu style={{ color: '#909090' }} /> Admin
//           </span>
         
//           <div className="profile-section">
//             <div className="notification-icon">
//               <FaBell />
//             </div>
//             <div className="user-info">
//               <span className="user-initials">Admin</span>
//               <div className="user-details">
//                 <span className="user-name">
//                   Admin <RiArrowDropDownLine className="drop" />
//                 </span>
//                 <span className="user-email">admin@mail.com</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         <section className="content">
//           <div className="content-header">
//             <h3>List of Program Manager</h3>
//             <input
//               type="text"
//               placeholder="Search here"
//               className="search-bar"
//               style={{ height: '35px' }}
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button className="add-founder-button" onClick={handleOpenModal}>
//             Create Program Manager ID
//             </button>
//           </div>
//           <div className="admin-list">
//             <table>
//               <thead>
//                 <tr>
//                   <th>
//                     <input
//                       type="checkbox"
//                       checked={selectedAll}
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   <th>
//                     Name Of The Program Manager <FaSort className="sorticon" />
//                   </th>
//                   <th>
//                     Name Of The Admin <FaSort className="sorticon" />
//                   </th>
//                   <th>
//                     Mobile Number <FaSort className="sorticon" />
//                   </th>
//                   <th>
//                     User Name <FaSort className="sorticon" />
//                   </th>
//                   <th>
//                     E-Mail <FaSort className="sorticon" />
//                   </th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.map((pm) => (
//                   <tr key={pm._id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={isSelected(pm._id)}
//                         onChange={(event) => handleSelectOne(event, pm._id)}
//                       />
//                     </td>
//                     <td>{pm.name}</td>
//                     <td>{pm.adminName}</td>
//                     <td>{pm.adminPhone}</td>
//                     <td>{pm.username}</td>
//                     <td>{pm.email}</td>
//                     <td>
//                       <IconButton
//                         onClick={(event) => handleMenuClick(event, pm)}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(anchorEl && selectedAdmin && selectedAdmin._id === pm._id)}
//                         onClose={handleMenuClose}
//                       >
//                         <MenuItem onClick={() => handleViewDetails(pm._id)}>View Details</MenuItem>
//                         <MenuItem onClick={() => handleEdit(pm._id)}>Edit</MenuItem>
//                         <MenuItem onClick={() => handleDelete(pm._id)}>Delete</MenuItem>
//                       </Menu>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredProgramManagers.length === 0 && (
//                   <tr>
//                     <td colSpan="7" className="text-center">
//                       <img src="/path/to/empty-icon.png" alt="No Program Manager" />
//                       <p>No Program Manager ID Added Yet</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             <div className="table-footer">
//               <button className="export-button" onClick={exportTableToCSV}>
//                 <FaFileExport className="icon" /> Export Table
//               </button>
//               <div className="pagination">
//                 <button
//                   className="pagination-button"
//                   onClick={handlePreviousPage}
//                   disabled={currentPage === 0}
//                 >
//                   {'<'}
//                 </button>
//                 <span className="pagination-info">
//                   {currentPage + 1} of {Math.ceil(filteredProgramManagers.length / rowsPerPage)}
//                 </span>
//                 <button
//                   className="pagination-button"
//                   onClick={handleNextPage}
//                   disabled={currentPage >= Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1}
//                 >
//                   {'>'}
//                 </button>
//                 <div className="rows-per-page">
//                   <span>Rows per page</span>
//                   <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
//                     <option value="5">5</option>
//                     <option value="10">10</option>
//                     <option value="15">15</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <AddProgramManagerModal showModal={showModal} handleClose={handleCloseModal} handleSuccess={handleSuccessModal} />
//         <EditProgramManagerModal showModal={showEditModal} handleClose={handleCloseEditModal} programManagerId={programManagerId} handleSuccess={handleEditSuccessModal} />
//         <ViewProgramManagerModal showModal={showViewModal} handleClose={() => setShowViewModal(false)} programManagerId={programManagerId} />
//         <SuccessModal showSuccessModal={showSuccessModal} handleClose={handleCloseSuccessModal} />
//       </main>
//     </div>
//   );
// };

// export default Admindash;








// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   FaBell,
//   FaRocket,
//   FaUserCircle,
//   FaSort,
//   FaFileExport,
// } from 'react-icons/fa';
// import { FiMenu } from 'react-icons/fi';
// import { RiArrowDropDownLine } from 'react-icons/ri';
// import { IconButton, Menu, MenuItem } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import axios from 'axios';
// import logo from '../Public/logo.png';
// import successIcon from '../Public/Vector.png';
// import './admindash.css';
// import AddProgramManagerModal from './AddProgramManager';
// import EditProgramManagerModal from './EditProgramManager';
// import ViewProgramManagerModal from './ViewProgramManagerModal';

// const SuccessModal = ({ showSuccessModal, handleClose }) => {
//   if (!showSuccessModal) {
//     return null;
//   }

//   return (
//     <div className="modal-overlay admindash-modal-overlay">
//       <div className="modal-content admindash-modal-content">
//         <img src={successIcon} alt="Success" style={{ width: '50px', display: 'block', margin: '0 auto' }} />
//         <h2 className="modal-title admindash-modal-title" style={{marginTop:"15px"}}>Program Manager Added Successfully</h2>
//         <p style={{ color: "#909090" }}>Program Manager details have been added successfully.</p>
//         <button onClick={handleClose} className="btn-primary admindash-btn-primary">OK</button>
//       </div>
//     </div>
//   );
// };

// const Admindash = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [selectedAll, setSelectedAll] = useState(false);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [programManagerId, setProgramManagerId] = useState(null);
//   const [programManagers, setProgramManagers] = useState([]);
//   const [filteredProgramManagers, setFilteredProgramManagers] = useState([]);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();

//   const fetchProgramManagers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const config = {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       };
//       const response = await axios.get(`http://localhost:5000/api/admins/me/programmanagers`, config);
//       if (response.status === 200) {
//         setProgramManagers(response.data);
//         setFilteredProgramManagers(response.data);
//       } else {
//         console.error('Failed to fetch program managers');
//       }
//     } catch (error) {
//       console.error('Error fetching program managers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProgramManagers();
//   }, []);

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//     const filtered = programManagers.filter(pm => {
//       return (
//         pm.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
//         pm.adminName.toLowerCase().includes(event.target.value.toLowerCase()) ||
//         pm.adminPhone.toLowerCase().includes(event.target.value.toLowerCase()) ||
//         pm.username.toLowerCase().includes(event.target.value.toLowerCase()) ||
//         pm.email.toLowerCase().includes(event.target.value.toLowerCase())
//       );
//     });
//     setFilteredProgramManagers(filtered);
//     setCurrentPage(0); // Reset to first page when search query changes
//   };

//   const handleMenuClick = (event, admin) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedAdmin(admin);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedAdmin(null);
//   };

//   const handleViewDetails = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowViewModal(true);
//     handleMenuClose();
//   };

//   const handleEdit = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowEditModal(true);
//     handleMenuClose();
//   };

//   const handleDelete = async (adminId) => {
//     if (window.confirm("Are you sure you want to delete this Program Manager?")) {
//       try {
//         const token = localStorage.getItem('token');
//         const config = {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         };
//         const response = await axios.delete(`http://localhost:5000/api/admins/${adminId}/programmanagers`, config);
//         if (response.status === 200) {
//           alert('Program Manager deleted successfully');
//           fetchProgramManagers(); // Refresh the list after deletion
//         } else {
//           alert('Failed to delete Program Manager. Please try again.');
//         }
//       } catch (error) {
//         console.error('Error deleting Program Manager:', error);
//         if (error.response && error.response.status === 404) {
//           alert('Program Manager not found.');
//         } else {
//           alert('Error deleting Program Manager. Please try again.');
//         }
//       }
//     }
//     handleMenuClose();
//   };

//   const handleSelectAll = (event) => {
//     const checked = event.target.checked;
//     setSelectedAll(checked);
//     if (checked) {
//       const allIds = filteredProgramManagers.map((pm) => pm._id);
//       setSelectedIds(allIds);
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleSelectOne = (event, id) => {
//     const checked = event.target.checked;
//     if (checked) {
//       setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
//     } else {
//       setSelectedIds((prevSelectedIds) =>
//         prevSelectedIds.filter((selectedId) => selectedId !== id)
//       );
//     }
//   };

//   const isSelected = (id) => selectedIds.includes(id);

//   const exportTableToCSV = () => {
//     const headers = [
//       'Name Of The Program Manager',
//       'Name Of The Admin',
//       'Mobile Number',
//       'User Name',
//       'E-Mail',
//     ];
//     const rows = filteredProgramManagers.map((pm) => [
//       pm.name,
//       pm.adminName,
//       pm.adminPhone,
//       pm.username,
//       pm.email,
//     ]);

//     let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';

//     rows.forEach((rowArray) => {
//       let row = rowArray.join(',');
//       csvContent += row + '\n';
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', 'program_manager_ids.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleSuccessModal = () => {
//     setShowModal(false);
//     setShowSuccessModal(true);
//     fetchProgramManagers(); // Refresh program managers list after adding a new one
//   };

//   const handleCloseSuccessModal = () => {
//     setShowSuccessModal(false);
//   };

//   const handleCloseEditModal = () => {
//     setShowEditModal(false);
//   };

//   const handleEditSuccessModal = () => {
//     setShowEditModal(false);
//     fetchProgramManagers(); // Refresh program managers list after editing a program manager
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(0); // Reset to the first page when rows per page changes
//   };

//   const handlePreviousPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
//   };

//   const handleNextPage = () => {
//     const maxPage = Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1;
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
//   };

//   const paginatedData = filteredProgramManagers.slice(
//     currentPage * rowsPerPage,
//     currentPage * rowsPerPage + rowsPerPage
//   );

//   return (
//     <div className="dashboard admindash-dashboard">
//       <aside className="sidebar admindash-sidebar">
//         <div className="logo-container admindash-logo-container">
//           <div className="logo admindash-logo">
//             <img src={logo} alt="Logo" />
//           </div>
//         </div>
//         <div className="nav-container admindash-nav-container">
//           <nav className="nav admindash-nav">
//             <ul>
//               <li className="nav-item admindash-nav-item" style={{ marginTop: '80px' }}>
//                 <FaUserCircle className="nav-icon admindash-nav-icon" /> Profile
//               </li>
//               <li className="nav-item admindash-nav-item">
//                 <FaRocket className="nav-icon admindash-nav-icon" /> Created Program Manager ID
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>

//       <main className="main-content admindash-main-content">
//         <header className="header admindash-header">
//           <span className="founder admindash-founder" style={{ fontSize: '24px' }}>
//             <FiMenu style={{ color: '#909090' }} /> Admin
//           </span>

//           <div className="profile-section admindash-profile-section">
//             <div className="notification-icon admindash-notification-icon">
//               <FaBell />
//             </div>
//             <div className="user-info admindash-user-info">
//               <span className="user-initials admindash-user-initials">Admin</span>
//               <div className="user-details admindash-user-details">
//                 <span className="user-name admindash-user-name">
//                   Admin <RiArrowDropDownLine className="drop admindash-drop" />
//                 </span>
//                 <span className="user-email admindash-user-email">admin@mail.com</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         <section className="content admindash-content">
//           <div className="content-header admindash-content-header">
//             <h3>List of Program Manager</h3>
//             <input
//               type="text"
//               placeholder="Search here"
//               className="search-bar admindash-search-bar"
//               style={{ height: '35px' }}
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button className="add-founder-button admindash-add-founder-button" onClick={handleOpenModal}>
//             Create Program Manager ID
//             </button>
//           </div>
//           <div className="admin-list admindash-admin-list">
//             <table>
//               <thead>
//                 <tr>
//                   <th>
//                     <input
//                       type="checkbox"
//                       checked={selectedAll}
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   <th>
//                     Name Of The Program Manager <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     Name Of The Admin <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     Mobile Number <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     User Name <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     E-Mail <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.map((pm) => (
//                   <tr key={pm._id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={isSelected(pm._id)}
//                         onChange={(event) => handleSelectOne(event, pm._id)}
//                       />
//                     </td>
//                     <td>{pm.name}</td>
//                     <td>{pm.adminName}</td>
//                     <td>{pm.adminPhone}</td>
//                     <td>{pm.username}</td>
//                     <td>{pm.email}</td>
//                     <td>
//                       <IconButton
//                         onClick={(event) => handleMenuClick(event, pm)}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(anchorEl && selectedAdmin && selectedAdmin._id === pm._id)}
//                         onClose={handleMenuClose}
//                       >
//                         <MenuItem onClick={() => handleViewDetails(pm._id)}>View Details</MenuItem>
//                         <MenuItem onClick={() => handleEdit(pm._id)}>Edit</MenuItem>
//                         <MenuItem onClick={() => handleDelete(pm._id)}>Delete</MenuItem>
//                       </Menu>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredProgramManagers.length === 0 && (
//                   <tr>
//                     <td colSpan="7" className="text-center admindash-text-center">
//                       <img src="/path/to/empty-icon.png" alt="No Program Manager" />
//                       <p>No Program Manager ID Added Yet</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             <div className="table-footer admindash-table-footer">
//               <button className="export-button admindash-export-button" onClick={exportTableToCSV}>
//                 <FaFileExport className="icon admindash-icon" /> Export Table
//               </button>
//               <div className="pagination admindash-pagination">
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handlePreviousPage}
//                   disabled={currentPage === 0}
//                 >
//                   {'<'}
//                 </button>
//                 <span className="pagination-info admindash-pagination-info">
//                   {currentPage + 1} of {Math.ceil(filteredProgramManagers.length / rowsPerPage)}
//                 </span>
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handleNextPage}
//                   disabled={currentPage >= Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1}
//                 >
//                   {'>'}
//                 </button>
//                 <div className="rows-per-page admindash-rows-per-page">
//                   <span>Rows per page</span>
//                   <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
//                     <option value="5">5</option>
//                     <option value="10">10</option>
//                     <option value="15">15</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <AddProgramManagerModal showModal={showModal} handleClose={handleCloseModal} handleSuccess={handleSuccessModal} />
//         <EditProgramManagerModal showModal={showEditModal} handleClose={handleCloseEditModal} programManagerId={programManagerId} handleSuccess={handleEditSuccessModal} />
//         <ViewProgramManagerModal showModal={showViewModal} handleClose={() => setShowViewModal(false)} programManagerId={programManagerId} />
//         <SuccessModal showSuccessModal={showSuccessModal} handleClose={handleCloseSuccessModal} />
//       </main>
//     </div>
//   );
// };

// export default Admindash;








// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   FaBell,
//   FaRocket,
//   FaUserCircle,
//   FaSort,
//   FaFileExport,
// } from 'react-icons/fa';
// import { FiMenu } from 'react-icons/fi';
// import { RiArrowDropDownLine } from 'react-icons/ri';
// import { IconButton, Menu, MenuItem } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import axios from 'axios';
// import logo from '../Public/logo.png';
// import successIcon from '../Public/Vector.png';
// import './admindash.css';
// import AddProgramManagerModal from './AddProgramManager';
// import EditProgramManagerModal from './EditProgramManager';
// import ViewProgramManagerModal from './ViewProgramManagerModal';

// const SuccessModal = ({ showSuccessModal, handleClose }) => {
//   if (!showSuccessModal) {
//     return null;
//   }

//   return (
//     <div className="modal-overlay admindash-modal-overlay">
//       <div className="modal-content admindash-modal-content">
//         <img src={successIcon} alt="Success" style={{ width: '50px', display: 'block', margin: '0 auto' }} />
//         <h2 className="modal-title admindash-modal-title" style={{ marginTop: "15px", fontSize:"18px" }}>Program Manager Added Successfully</h2>
//         <p style={{ color: "#909090" }}>Program Manager details have been added successfully.</p>
//         <button onClick={handleClose} className="btn-primary admindash-btn-primary" style={{width:"auto"}}>OK</button>
//       </div>
//     </div>
//   );
// };

// const Admindash = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [selectedAll, setSelectedAll] = useState(false);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [programManagerId, setProgramManagerId] = useState(null);
//   const [programManagers, setProgramManagers] = useState([]);
//   const [filteredProgramManagers, setFilteredProgramManagers] = useState([]);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();

//   const fetchProgramManagers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const config = {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       };
//       const response = await axios.get(`http://localhost:5000/api/admins/me/programmanagers`, config);
//       if (response.status === 200) {
//         setProgramManagers(response.data);
//         setFilteredProgramManagers(response.data);
//       } else {
//         console.error('Failed to fetch program managers');
//       }
//     } catch (error) {
//       console.error('Error fetching program managers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProgramManagers();
//   }, []);

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//     const filtered = programManagers.filter(pm => {
//       return (
//         pm.adminName.toLowerCase().includes(event.target.value.toLowerCase()) ||
//         pm.adminPhone.toLowerCase().includes(event.target.value.toLowerCase()) ||
//         pm.username.toLowerCase().includes(event.target.value.toLowerCase()) ||
//         pm.email.toLowerCase().includes(event.target.value.toLowerCase())
//       );
//     });
//     setFilteredProgramManagers(filtered);
//     setCurrentPage(0); // Reset to first page when search query changes
//   };

//   const handleMenuClick = (event, admin) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedAdmin(admin);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedAdmin(null);
//   };

//   const handleViewDetails = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowViewModal(true);
//     handleMenuClose();
//   };

//   const handleEdit = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowEditModal(true);
//     handleMenuClose();
//   };

//   const handleDelete = async (adminId) => {
//     if (window.confirm("Are you sure you want to delete this Program Manager?")) {
//       try {
//         const token = localStorage.getItem('token');
//         const config = {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         };
//         const response = await axios.delete(`http://localhost:5000/api/admins/${adminId}/programmanagers`, config);
//         if (response.status === 200) {
//           alert('Program Manager deleted successfully');
//           fetchProgramManagers(); // Refresh the list after deletion
//         } else {
//           alert('Failed to delete Program Manager. Please try again.');
//         }
//       } catch (error) {
//         console.error('Error deleting Program Manager:', error);
//         if (error.response && error.response.status === 404) {
//           alert('Program Manager not found.');
//         } else {
//           alert('Error deleting Program Manager. Please try again.');
//         }
//       }
//     }
//     handleMenuClose();
//   };

//   const handleSelectAll = (event) => {
//     const checked = event.target.checked;
//     setSelectedAll(checked);
//     if (checked) {
//       const allIds = filteredProgramManagers.map((pm) => pm._id);
//       setSelectedIds(allIds);
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleSelectOne = (event, id) => {
//     const checked = event.target.checked;
//     if (checked) {
//       setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
//     } else {
//       setSelectedIds((prevSelectedIds) =>
//         prevSelectedIds.filter((selectedId) => selectedId !== id)
//       );
//     }
//   };

//   const isSelected = (id) => selectedIds.includes(id);

//   const exportTableToCSV = () => {
//     const headers = [
//       'Name Of The Admin',
//       'Mobile Number',
//       'User Name',
//       'E-Mail',
//     ];
//     const rows = filteredProgramManagers.map((pm) => [
//       pm.adminName,
//       pm.adminPhone,
//       pm.username,
//       pm.email,
//     ]);

//     let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';

//     rows.forEach((rowArray) => {
//       let row = rowArray.join(',');
//       csvContent += row + '\n';
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', 'program_manager_ids.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleSuccessModal = () => {
//     setShowModal(false);
//     setShowSuccessModal(true);
//     fetchProgramManagers(); // Refresh program managers list after adding a new one
//   };

//   const handleCloseSuccessModal = () => {
//     setShowSuccessModal(false);
//   };

//   const handleCloseEditModal = () => {
//     setShowEditModal(false);
//   };

//   const handleEditSuccessModal = () => {
//     setShowEditModal(false);
//     fetchProgramManagers(); // Refresh program managers list after editing a program manager
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(0); // Reset to the first page when rows per page changes
//   };

//   const handlePreviousPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
//   };

//   const handleNextPage = () => {
//     const maxPage = Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1;
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
//   };

//   const paginatedData = filteredProgramManagers.slice(
//     currentPage * rowsPerPage,
//     currentPage * rowsPerPage + rowsPerPage
//   );

//   return (
//     <div className="dashboard admindash-dashboard">
//       <aside className="sidebar admindash-sidebar">
//         <div className="logo-container admindash-logo-container">
//           <div className="logo admindash-logo">
//             <img src={logo} alt="Logo" />
//           </div>
//         </div>
//         <div className="nav-container admindash-nav-container">
//           <nav className="nav admindash-nav">
//             <ul>
//               <li
//                 className="nav-item admindash-nav-item"
//                 style={{ marginTop: "80px" }}
//               >
//                 <FaUserCircle className="nav-icon admindash-nav-icon" /> Active
//                 ID
//               </li>
//               <li className="nav-item admindash-nav-item">
//                 <FaRocket className="nav-icon admindash-nav-icon" /> Inactive ID
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>

//       <main className="main-content admindash-main-content">
//         <header className="header admindash-header">
//           <span
//             className="founder admindash-founder"
//             style={{ fontSize: "24px" }}
//           >
//             <FiMenu style={{ color: "#909090" }} /> Admin
//           </span>

//           <div className="profile-section admindash-profile-section">
//             <div className="notification-icon admindash-notification-icon">
//               <FaBell />
//             </div>
//             <div className="user-info admindash-user-info">
//               <span className="user-initials admindash-user-initials">
//                 Admin
//               </span>
//               <div className="user-details admindash-user-details">
//                 <span className="user-name admindash-user-name">
//                   Admin <RiArrowDropDownLine className="drop admindash-drop" />
//                 </span>
//                 <span className="user-email admindash-user-email">
//                   admin@mail.com
//                 </span>
//               </div>
//             </div>
//           </div>
//         </header>

//         <section className="content admindash-content">
//           <div className="content-header admindash-content-header">
//             <h3>List of Program Manager</h3>
//             <input
//               type="text"
//               placeholder="Search here"
//               className="search-bar admindash-search-bar"
//               style={{ height: "35px" }}
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button
//               className="add-founder-button admindash-add-founder-button"
//               onClick={handleOpenModal}
//             >
//               Create Program Manager ID
//             </button>
//           </div>
//           <div className="admin-list admindash-admin-list">
//             <table>
//               <thead>
//                 <tr>
//                   <th>
//                     <input
//                       type="checkbox"
//                       checked={selectedAll}
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   <th>
//                     Name Of The Admin{" "}
//                     <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     Mobile Number{" "}
//                     <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     User Name <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     E-Mail <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.map((pm) => (
//                   <tr key={pm._id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={isSelected(pm._id)}
//                         onChange={(event) => handleSelectOne(event, pm._id)}
//                       />
//                     </td>
//                     <td>{pm.adminName}</td>
//                     <td>{pm.adminPhone}</td>
//                     <td>{pm.username}</td>
//                     <td>{pm.email}</td>
//                     <td>
//                       <IconButton
//                         onClick={(event) => handleMenuClick(event, pm)}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(
//                           anchorEl &&
//                             selectedAdmin &&
//                             selectedAdmin._id === pm._id
//                         )}
//                         onClose={handleMenuClose}
//                       >
//                         <MenuItem onClick={() => handleViewDetails(pm._id)}>
//                           View Details
//                         </MenuItem>
//                         <MenuItem onClick={() => handleEdit(pm._id)}>
//                           Edit
//                         </MenuItem>
//                         <MenuItem onClick={() => handleDelete(pm._id)}>
//                           Delete
//                         </MenuItem>
//                       </Menu>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredProgramManagers.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan="6"
//                       className="text-center admindash-text-center"
//                     >
//                       <img
//                         src="/path/to/empty-icon.png"
//                         alt="No Program Manager"
//                       />
//                       <p>No Program Manager ID Added Yet</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             <div className="table-footer admindash-table-footer">
//               <button
//                 className="export-button admindash-export-button"
//                 onClick={exportTableToCSV}
//               >
//                 <FaFileExport className="icon admindash-icon" /> Export Table
//               </button>
//               <div className="pagination admindash-pagination">
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handlePreviousPage}
//                   disabled={currentPage === 0}
//                 >
//                   {"<"}
//                 </button>
//                 <span className="pagination-info admindash-pagination-info">
//                   {currentPage + 1} of{" "}
//                   {Math.ceil(filteredProgramManagers.length / rowsPerPage)}
//                 </span>
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handleNextPage}
//                   disabled={
//                     currentPage >=
//                     Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1
//                   }
//                 >
//                   {">"}
//                 </button>
//                 <div className="rows-per-page admindash-rows-per-page">
//                   <span>Rows per page</span>
//                   <select
//                     value={rowsPerPage}
//                     onChange={handleRowsPerPageChange}
//                   >
//                     <option value="5">5</option>
//                     <option value="10">10</option>
//                     <option value="15">15</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <AddProgramManagerModal
//           showModal={showModal}
//           handleClose={handleCloseModal}
//           handleSuccess={handleSuccessModal}
//         />
//         <EditProgramManagerModal
//           showModal={showEditModal}
//           handleClose={handleCloseEditModal}
//           programManagerId={programManagerId}
//           handleSuccess={handleEditSuccessModal}
//         />
//         <ViewProgramManagerModal
//           showModal={showViewModal}
//           handleClose={() => setShowViewModal(false)}
//           programManagerId={programManagerId}
//         />
//         <SuccessModal
//           showSuccessModal={showSuccessModal}
//           handleClose={handleCloseSuccessModal}
//         />
//       </main>
//     </div>
//   );
// };

// export default Admindash;






// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaBell,
//   FaRocket,
//   FaUserCircle,
//   FaSort,
//   FaFileExport,
// } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import { IconButton, Menu, MenuItem } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import axios from "axios";
// import logo from "../Public/logo.png";
// import successIcon from "../Public/Vector.png";
// import "./admindash.css";
// import AddProgramManagerModal from "./AddProgramManager";
// import EditProgramManagerModal from "./EditProgramManager";
// import ViewProgramManagerModal from "./ViewProgramManagerModal";

// const SuccessModal = ({ showSuccessModal, handleClose }) => {
//   if (!showSuccessModal) {
//     return null;
//   }

//   return (
//     <div className="modal-overlay admindash-modal-overlay">
//       <div className="modal-content admindash-modal-content">
//         <img
//           src={successIcon}
//           alt="Success"
//           style={{ width: "50px", display: "block", margin: "0 auto" }}
//         />
//         <h2
//           className="modal-title admindash-modal-title"
//           style={{ marginTop: "15px", fontSize: "18px" }}
//         >
//           Program Manager Added Successfully
//         </h2>
//         <p style={{ color: "#909090" }}>
//           Program Manager details have been added successfully.
//         </p>
//         <button
//           onClick={handleClose}
//           className="btn-primary admindash-btn-primary"
//           style={{ width: "auto" }}
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// };

// const Admindash = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [selectedAll, setSelectedAll] = useState(false);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [programManagerId, setProgramManagerId] = useState(null);
//   const [programManagers, setProgramManagers] = useState([]);
//   const [filteredProgramManagers, setFilteredProgramManagers] = useState([]);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showActive, setShowActive] = useState(true); // New state for filtering
//   const navigate = useNavigate();

//   const fetchProgramManagers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await axios.get(
//         "http://localhost:5000/api/programmanagers",
//         config
//       );
//       if (response.status === 200) {
//         setProgramManagers(response.data);
//         setFilteredProgramManagers(
//           response.data.filter((pm) => pm.isActive === showActive)
//         );
//       } else {
//         console.error("Failed to fetch program managers");
//       }
//     } catch (error) {
//       console.error("Error fetching program managers:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProgramManagers();
//   }, [showActive]);

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//     const filtered = programManagers
//       .filter((pm) => {
//         return (
//           pm.adminName
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.adminPhone
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.username
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.email.toLowerCase().includes(event.target.value.toLowerCase())
//         );
//       })
//       .filter((pm) => pm.isActive === showActive);
//     setFilteredProgramManagers(filtered);
//     setCurrentPage(0); // Reset to first page when search query changes
//   };

//   const handleMenuClick = (event, admin) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedAdmin(admin);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedAdmin(null);
//   };

//   const handleViewDetails = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowViewModal(true);
//     handleMenuClose();
//   };

//   const handleEdit = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowEditModal(true);
//     handleMenuClose();
//   };

//   const handleDisable = async (adminId) => {
//     if (
//       window.confirm("Are you sure you want to disable this Program Manager?")
//     ) {
//       try {
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const response = await axios.put(
//           `http://localhost:5000/api/programmanagers/${adminId}/disable`,
//           {},
//           config
//         );
//         if (response.status === 200) {
//           alert("Program Manager disabled successfully");
//           fetchProgramManagers(); // Refresh the list after disabling
//         } else {
//           alert("Failed to disable Program Manager. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error disabling Program Manager:", error);
//         if (error.response && error.response.status === 404) {
//           alert("Program Manager not found.");
//         } else {
//           alert("Error disabling Program Manager. Please try again.");
//         }
//       }
//     }
//     handleMenuClose();
//   };

//   const handleEnable = async (adminId) => {
//     if (
//       window.confirm("Are you sure you want to enable this Program Manager?")
//     ) {
//       try {
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const response = await axios.put(
//           `http://localhost:5000/api/programmanagers/${adminId}/enable`,
//           {},
//           config
//         );
//         if (response.status === 200) {
//           alert("Program Manager enabled successfully");
//           fetchProgramManagers(); // Refresh the list after enabling
//         } else {
//           alert("Failed to enable Program Manager. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error enabling Program Manager:", error);
//         if (error.response && error.response.status === 404) {
//           alert("Program Manager not found.");
//         } else {
//           alert("Error enabling Program Manager. Please try again.");
//         }
//       }
//     }
//     handleMenuClose();
//   };

//   const handleSelectAll = (event) => {
//     const checked = event.target.checked;
//     setSelectedAll(checked);
//     if (checked) {
//       const allIds = filteredProgramManagers.map((pm) => pm._id);
//       setSelectedIds(allIds);
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleSelectOne = (event, id) => {
//     const checked = event.target.checked;
//     if (checked) {
//       setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
//     } else {
//       setSelectedIds((prevSelectedIds) =>
//         prevSelectedIds.filter((selectedId) => selectedId !== id)
//       );
//     }
//   };

//   const isSelected = (id) => selectedIds.includes(id);

//   const exportTableToCSV = () => {
//     const headers = [
//       "Name Of The Admin",
//       "Mobile Number",
//       "User Name",
//       "E-Mail",
//     ];
//     const rows = filteredProgramManagers.map((pm) => [
//       pm.adminName,
//       pm.adminPhone,
//       pm.username,
//       pm.email,
//     ]);

//     let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

//     rows.forEach((rowArray) => {
//       let row = rowArray.join(",");
//       csvContent += row + "\n";
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "program_manager_ids.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleSuccessModal = () => {
//     setShowModal(false);
//     setShowSuccessModal(true);
//     fetchProgramManagers(); // Refresh program managers list after adding a new one
//   };

//   const handleCloseSuccessModal = () => {
//     setShowSuccessModal(false);
//   };

//   const handleCloseEditModal = () => {
//     setShowEditModal(false);
//   };

//   const handleEditSuccessModal = () => {
//     setShowEditModal(false);
//     fetchProgramManagers(); // Refresh program managers list after editing a program manager
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(0); // Reset to the first page when rows per page changes
//   };

//   const handlePreviousPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
//   };

//   const handleNextPage = () => {
//     const maxPage = Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1;
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
//   };

//   const paginatedData = filteredProgramManagers.slice(
//     currentPage * rowsPerPage,
//     currentPage * rowsPerPage + rowsPerPage
//   );

//   return (
//     <div className="dashboard admindash-dashboard">
//       <aside className="sidebar admindash-sidebar">
//         <div className="logo-container admindash-logo-container">
//           <div className="logo admindash-logo">
//             <img src={logo} alt="Logo" />
//           </div>
//         </div>
//         <div className="nav-container admindash-nav-container">
//           <nav className="nav admindash-nav">
//             <ul>
//               <li
//                 className="nav-item admindash-nav-item"
//                 style={{ marginTop: "80px" }}
//                 onClick={() => setShowActive(true)} // Show active IDs
//               >
//                 <FaUserCircle className="nav-icon admindash-nav-icon" /> Active
//                 ID
//               </li>
//               <li
//                 className="nav-item admindash-nav-item"
//                 onClick={() => setShowActive(false)} // Show disabled IDs
//               >
//                 <FaRocket className="nav-icon admindash-nav-icon" /> Inactive ID
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>

//       <main className="main-content admindash-main-content">
//         <header className="header admindash-header">
//           <span
//             className="founder admindash-founder"
//             style={{ fontSize: "24px" }}
//           >
//             <FiMenu style={{ color: "#909090" }} /> Admin
//           </span>

//           <div className="profile-section admindash-profile-section">
//             <div className="notification-icon admindash-notification-icon">
//               <FaBell />
//             </div>
//             <div className="user-info admindash-user-info">
//               <span className="user-initials admindash-user-initials">
//                 Admin
//               </span>
//               <div className="user-details admindash-user-details">
//                 <span className="user-name admindash-user-name">
//                   Admin <RiArrowDropDownLine className="drop admindash-drop" />
//                 </span>
//                 <span className="user-email admindash-user-email">
//                   admin@mail.com
//                 </span>
//               </div>
//             </div>
//           </div>
//         </header>

//         <section className="content admindash-content">
//           <div className="content-header admindash-content-header">
//             <h3>List of Program Manager</h3>
//             <input
//               type="text"
//               placeholder="Search here"
//               className="search-bar admindash-search-bar"
//               style={{ height: "35px" }}
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button
//               className="add-founder-button admindash-add-founder-button"
//               onClick={handleOpenModal}
//             >
//               Create Program Manager ID
//             </button>
//           </div>
//           <div className="admin-list admindash-admin-list">
//             <table>
//               <thead>
//                 <tr>
//                   <th>
//                     <input
//                       type="checkbox"
//                       checked={selectedAll}
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   <th>
//                     Name Of The Admin{" "}
//                     <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     Mobile Number{" "}
//                     <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     User Name <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     E-Mail <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.map((pm) => (
//                   <tr key={pm._id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={isSelected(pm._id)}
//                         onChange={(event) => handleSelectOne(event, pm._id)}
//                       />
//                     </td>
//                     <td>{pm.adminName}</td>
//                     <td>{pm.adminPhone}</td>
//                     <td>{pm.username}</td>
//                     <td>{pm.email}</td>
//                     <td>
//                       <IconButton
//                         onClick={(event) => handleMenuClick(event, pm)}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(
//                           anchorEl &&
//                             selectedAdmin &&
//                             selectedAdmin._id === pm._id
//                         )}
//                         onClose={handleMenuClose}
//                       >
//                         <MenuItem onClick={() => handleViewDetails(pm._id)}>
//                           View Details
//                         </MenuItem>
//                         <MenuItem onClick={() => handleEdit(pm._id)}>
//                           Edit
//                         </MenuItem>
//                         {showActive ? (
//                           <MenuItem onClick={() => handleDisable(pm._id)}>
//                             Disable
//                           </MenuItem>
//                         ) : (
//                           <MenuItem onClick={() => handleEnable(pm._id)}>
//                             Enable
//                           </MenuItem>
//                         )}
//                       </Menu>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredProgramManagers.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan="6"
//                       className="text-center admindash-text-center"
//                     >
//                       <img
//                         src="/path/to/empty-icon.png"
//                         alt="No Program Manager"
//                       />
//                       <p>No Program Manager ID Added Yet</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             <div className="table-footer admindash-table-footer">
//               <button
//                 className="export-button admindash-export-button"
//                 onClick={exportTableToCSV}
//               >
//                 <FaFileExport className="icon admindash-icon" /> Export Table
//               </button>
//               <div className="pagination admindash-pagination">
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handlePreviousPage}
//                   disabled={currentPage === 0}
//                 >
//                   {"<"}
//                 </button>
//                 <span className="pagination-info admindash-pagination-info">
//                   {currentPage + 1} of{" "}
//                   {Math.ceil(filteredProgramManagers.length / rowsPerPage)}
//                 </span>
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handleNextPage}
//                   disabled={
//                     currentPage >=
//                     Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1
//                   }
//                 >
//                   {">"}
//                 </button>
//                 <div className="rows-per-page admindash-rows-per-page">
//                   <span>Rows per page</span>
//                   <select
//                     value={rowsPerPage}
//                     onChange={handleRowsPerPageChange}
//                   >
//                     <option value="5">5</option>
//                     <option value="10">10</option>
//                     <option value="15">15</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <AddProgramManagerModal
//           showModal={showModal}
//           handleClose={handleCloseModal}
//           handleSuccess={handleSuccessModal}
//         />
//         <EditProgramManagerModal
//           showModal={showEditModal}
//           handleClose={handleCloseEditModal}
//           programManagerId={programManagerId}
//           handleSuccess={handleEditSuccessModal}
//         />
//         <ViewProgramManagerModal
//           showModal={showViewModal}
//           handleClose={() => setShowViewModal(false)}
//           programManagerId={programManagerId}
//         />
//         <SuccessModal
//           showSuccessModal={showSuccessModal}
//           handleClose={handleCloseSuccessModal}
//         />
//       </main>
//     </div>
//   );
// };

// export default Admindash;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaBell,
//   FaRocket,
//   FaUserCircle,
//   FaSort,
//   FaFileExport,
// } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import { IconButton, Menu, MenuItem } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import axios from "axios";
// import logo from "../Public/logo.png";
// import successIcon from "../Public/Vector.png";
// import "./admindash.css";
// import AddProgramManagerModal from "./AddProgramManager";
// import EditProgramManagerModal from "./EditProgramManager";
// import ViewProgramManagerModal from "./ViewProgramManagerModal";

// const SuccessModal = ({ showSuccessModal, handleClose }) => {
//   if (!showSuccessModal) {
//     return null;
//   }

//   return (
//     <div className="modal-overlay admindash-modal-overlay">
//       <div className="modal-content admindash-modal-content">
//         <img
//           src={successIcon}
//           alt="Success"
//           style={{ width: "50px", display: "block", margin: "0 auto" }}
//         />
//         <h2
//           className="modal-title admindash-modal-title"
//           style={{ marginTop: "15px", fontSize: "18px" }}
//         >
//           Program Manager Added Successfully
//         </h2>
//         <p style={{ color: "#909090" }}>
//           Program Manager details have been added successfully.
//         </p>
//         <button
//           onClick={handleClose}
//           className="btn-primary admindash-btn-primary"
//           style={{ width: "auto" }}
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// };

// const Admindash = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [selectedAll, setSelectedAll] = useState(false);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [programManagerId, setProgramManagerId] = useState(null);
//   const [programManagers, setProgramManagers] = useState([]);
//   const [filteredProgramManagers, setFilteredProgramManagers] = useState([]);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showActive, setShowActive] = useState(true); // New state for filtering
//   const [adminDetails, setAdminDetails] = useState({}); // State for admin details

//   const navigate = useNavigate();

//   const fetchAdminDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await axios.get(
//         "http://localhost:5000/api/admins/me",
//         config
//       );
//       setAdminDetails(response.data);
//     } catch (error) {
//       console.error("Error fetching admin details:", error);
//     }
//   };

//   const fetchProgramManagers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await axios.get(
//         "http://localhost:5000/api/programmanagers",
//         config
//       );
//       if (response.status === 200) {
//         setProgramManagers(response.data);
//         setFilteredProgramManagers(
//           response.data.filter((pm) => pm.isActive === showActive)
//         );
//       } else {
//         console.error("Failed to fetch program managers");
//       }
//     } catch (error) {
//       console.error("Error fetching program managers:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAdminDetails();
//     fetchProgramManagers();
//   }, [showActive]);

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//     const filtered = programManagers
//       .filter((pm) => {
//         return (
//           pm.adminName
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.adminPhone
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.username
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.email.toLowerCase().includes(event.target.value.toLowerCase())
//         );
//       })
//       .filter((pm) => pm.isActive === showActive);
//     setFilteredProgramManagers(filtered);
//     setCurrentPage(0); // Reset to first page when search query changes
//   };

//   const handleMenuClick = (event, admin) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedAdmin(admin);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedAdmin(null);
//   };

//   const handleViewDetails = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowViewModal(true);
//     handleMenuClose();
//   };

//   const handleEdit = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowEditModal(true);
//     handleMenuClose();
//   };

//   const handleDisable = async (adminId) => {
//     if (
//       window.confirm("Are you sure you want to disable this Program Manager?")
//     ) {
//       try {
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const response = await axios.put(
//           `http://localhost:5000/api/programmanagers/${adminId}/disable`,
//           {},
//           config
//         );
//         if (response.status === 200) {
//           alert("Program Manager disabled successfully");
//           fetchProgramManagers(); // Refresh the list after disabling
//         } else {
//           alert("Failed to disable Program Manager. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error disabling Program Manager:", error);
//         if (error.response && error.response.status === 404) {
//           alert("Program Manager not found.");
//         } else {
//           alert("Error disabling Program Manager. Please try again.");
//         }
//       }
//     }
//     handleMenuClose();
//   };

//   const handleEnable = async (adminId) => {
//     if (
//       window.confirm("Are you sure you want to enable this Program Manager?")
//     ) {
//       try {
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const response = await axios.put(
//           `http://localhost:5000/api/programmanagers/${adminId}/enable`,
//           {},
//           config
//         );
//         if (response.status === 200) {
//           alert("Program Manager enabled successfully");
//           fetchProgramManagers(); // Refresh the list after enabling
//         } else {
//           alert("Failed to enable Program Manager. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error enabling Program Manager:", error);
//         if (error.response && error.response.status === 404) {
//           alert("Program Manager not found.");
//         } else {
//           alert("Error enabling Program Manager. Please try again.");
//         }
//       }
//     }
//     handleMenuClose();
//   };

//   const handleSelectAll = (event) => {
//     const checked = event.target.checked;
//     setSelectedAll(checked);
//     if (checked) {
//       const allIds = filteredProgramManagers.map((pm) => pm._id);
//       setSelectedIds(allIds);
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleSelectOne = (event, id) => {
//     const checked = event.target.checked;
//     if (checked) {
//       setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
//     } else {
//       setSelectedIds((prevSelectedIds) =>
//         prevSelectedIds.filter((selectedId) => selectedId !== id)
//       );
//     }
//   };

//   const isSelected = (id) => selectedIds.includes(id);

//   const exportTableToCSV = () => {
//     const headers = [
//       "Name Of The Admin",
//       "Mobile Number",
//       "User Name",
//       "E-Mail",
//     ];
//     const rows = filteredProgramManagers.map((pm) => [
//       pm.adminName,
//       pm.adminPhone,
//       pm.username,
//       pm.email,
//     ]);

//     let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

//     rows.forEach((rowArray) => {
//       let row = rowArray.join(",");
//       csvContent += row + "\n";
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "program_manager_ids.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleSuccessModal = () => {
//     setShowModal(false);
//     setShowSuccessModal(true);
//     fetchProgramManagers(); // Refresh program managers list after adding a new one
//   };

//   const handleCloseSuccessModal = () => {
//     setShowSuccessModal(false);
//   };

//   const handleCloseEditModal = () => {
//     setShowEditModal(false);
//   };

//   const handleEditSuccessModal = () => {
//     setShowEditModal(false);
//     fetchProgramManagers(); // Refresh program managers list after editing a program manager
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(0); // Reset to the first page when rows per page changes
//   };

//   const handlePreviousPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
//   };

//   const handleNextPage = () => {
//     const maxPage = Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1;
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
//   };

//   const paginatedData = filteredProgramManagers.slice(
//     currentPage * rowsPerPage,
//     currentPage * rowsPerPage + rowsPerPage
//   );

//   return (
//     <div className="dashboard admindash-dashboard">
//       <aside className="sidebar admindash-sidebar">
//         <div className="logo-container admindash-logo-container">
//           <div className="logo admindash-logo">
//             <img src={logo} alt="Logo" />
//           </div>
//         </div>
//         <div className="nav-container admindash-nav-container">
//           <nav className="nav admindash-nav">
//             <ul>
//               <li
//                 className="nav-item admindash-nav-item"
//                 style={{ marginTop: "80px" }}
//                 onClick={() => setShowActive(true)} // Show active IDs
//               >
//                 <FaUserCircle className="nav-icon admindash-nav-icon" /> Active
//                 ID
//               </li>
//               <li
//                 className="nav-item admindash-nav-item"
//                 onClick={() => setShowActive(false)} // Show disabled IDs
//               >
//                 <FaRocket className="nav-icon admindash-nav-icon" /> Inactive ID
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>

//       <main className="main-content admindash-main-content">
//         <header className="header admindash-header">
//           <span
//             className="founder admindash-founder"
//             style={{ fontSize: "24px" }}
//           >
//             <FiMenu style={{ color: "#909090" }} /> Admin
//           </span>

//           <div className="profile-section admindash-profile-section">
//             <div className="notification-icon admindash-notification-icon">
//               <FaBell />
//             </div>
//             <div className="user-info admindash-user-info">
//               <span className="user-initials admindash-user-initials">
//                 {adminDetails.name}
//               </span>
//               <div className="user-details admindash-user-details">
//                 <span className="user-name admindash-user-name">
//                   {adminDetails.name}{" "}
//                   <RiArrowDropDownLine className="drop admindash-drop" />
//                 </span>
//                 <span className="user-email admindash-user-email">
//                   {adminDetails.email}
//                 </span>
//               </div>
//               <button
//                 className="logout-button admindash-logout-button"
//                 onClick={handleLogout}
//                 style={{ textAlign: "center", marginLeft: "10px" }}
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </header>

//         <section className="content admindash-content">
//           <div className="content-header admindash-content-header">
//             <h3>List of Program Manager</h3>
//             <input
//               type="text"
//               placeholder="Search here"
//               className="search-bar admindash-search-bar"
//               style={{ height: "35px" }}
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button
//               className="add-founder-button admindash-add-founder-button"
//               onClick={handleOpenModal}
//             >
//               Create Program Manager ID
//             </button>
//           </div>
//           <div className="admin-list admindash-admin-list">
//             <table>
//               <thead>
//                 <tr>
//                   <th>
//                     <input
//                       type="checkbox"
//                       checked={selectedAll}
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   <th>
//                     Name Of The Admin{" "}
//                     <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     Mobile Number{" "}
//                     <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     User Name <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     E-Mail <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.map((pm) => (
//                   <tr key={pm._id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={isSelected(pm._id)}
//                         onChange={(event) => handleSelectOne(event, pm._id)}
//                       />
//                     </td>
//                     <td>{pm.adminName}</td>
//                     <td>{pm.adminPhone}</td>
//                     <td>{pm.username}</td>
//                     <td>{pm.email}</td>
//                     <td>
//                       <IconButton
//                         onClick={(event) => handleMenuClick(event, pm)}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(
//                           anchorEl &&
//                             selectedAdmin &&
//                             selectedAdmin._id === pm._id
//                         )}
//                         onClose={handleMenuClose}
//                       >
//                         <MenuItem onClick={() => handleViewDetails(pm._id)}>
//                           View Details
//                         </MenuItem>
//                         <MenuItem onClick={() => handleEdit(pm._id)}>
//                           Edit
//                         </MenuItem>
//                         {showActive ? (
//                           <MenuItem onClick={() => handleDisable(pm._id)}>
//                             Disable
//                           </MenuItem>
//                         ) : (
//                           <MenuItem onClick={() => handleEnable(pm._id)}>
//                             Enable
//                           </MenuItem>
//                         )}
//                       </Menu>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredProgramManagers.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan="6"
//                       className="text-center admindash-text-center"
//                     >
                     
//                       <img
//                         src="/founders/not.png"
//                         alt="No Organization"
//                         style={{
//                           width: "50px",
//                           marginRight: "10px",
//                           textAlign: "left",
//                         }}
//                       />
                      
//                       <p>No Program Manager ID Added Yet</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             <div className="table-footer admindash-table-footer">
//               <button
//                 className="export-button admindash-export-button"
//                 onClick={exportTableToCSV}
//               >
//                 <FaFileExport className="icon admindash-icon" /> Export Table
//               </button>
//               <div className="pagination admindash-pagination">
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handlePreviousPage}
//                   disabled={currentPage === 0}
//                 >
//                   {"<"}
//                 </button>
//                 <span className="pagination-info admindash-pagination-info">
//                   {currentPage + 1} of{" "}
//                   {Math.ceil(filteredProgramManagers.length / rowsPerPage)}
//                 </span>
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handleNextPage}
//                   disabled={
//                     currentPage >=
//                     Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1
//                   }
//                 >
//                   {">"}
//                 </button>
//                 <div className="rows-per-page admindash-rows-per-page">
//                   <span>Rows per page</span>
//                   <select
//                     value={rowsPerPage}
//                     onChange={handleRowsPerPageChange}
//                   >
//                     <option value="5">5</option>
//                     <option value="10">10</option>
//                     <option value="15">15</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <AddProgramManagerModal
//           showModal={showModal}
//           handleClose={handleCloseModal}
//           handleSuccess={handleSuccessModal}
//         />
//         <EditProgramManagerModal
//           showModal={showEditModal}
//           handleClose={handleCloseEditModal}
//           programManagerId={programManagerId}
//           handleSuccess={handleEditSuccessModal}
//         />
//         <ViewProgramManagerModal
//           showModal={showViewModal}
//           handleClose={() => setShowViewModal(false)}
//           programManagerId={programManagerId}
//         />
//         <SuccessModal
//           showSuccessModal={showSuccessModal}
//           handleClose={handleCloseSuccessModal}
//         />
//       </main>
//     </div>
//   );
// };

// export default Admindash;







// components/Admin/Admindash.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaBell,
//   FaRocket,
//   FaUserCircle,
//   FaSort,
//   FaFileExport,
// } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import { IconButton, Menu, MenuItem } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import axios from "axios";
// import logo from "../Public/logo.png";
// import successIcon from "../Public/Vector.png";
// import "./admindash.css";
// import AddProgramManagerModal from "./AddProgramManager";
// import EditProgramManagerModal from "./EditProgramManager";
// import ViewProgramManagerModal from "./ViewProgramManagerModal";
// import loginLogo from "../Public/login.jpg";

// const SuccessModal = ({ showSuccessModal, handleClose }) => {
//   if (!showSuccessModal) {
//     return null;
//   }

//   return (
//     <div className="modal-overlay admindash-modal-overlay">
//       <div className="modal-content admindash-modal-content">
//         <img
//           src={successIcon}
//           alt="Success"
//           style={{ width: "50px", display: "block", margin: "0 auto" }}
//         />
//         <h2
//           className="modal-title admindash-modal-title"
//           style={{ marginTop: "15px", fontSize: "18px" }}
//         >
//           Program Manager Added Successfully
//         </h2>
//         <p style={{ color: "#909090" }}>
//           Program Manager details have been added successfully.
//         </p>
//         <button
//           onClick={handleClose}
//           className="btn-primary admindash-btn-primary"
//           style={{ width: "auto" }}
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// };

// const Admindash = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [selectedAll, setSelectedAll] = useState(false);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [programManagerId, setProgramManagerId] = useState(null);
//   const [programManagers, setProgramManagers] = useState([]);
//   const [filteredProgramManagers, setFilteredProgramManagers] = useState([]);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showActive, setShowActive] = useState(true); // New state for filtering
//   const [adminDetails, setAdminDetails] = useState({}); // State for admin details

//   const navigate = useNavigate();

//   const fetchAdminDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await axios.get(
//         "http://localhost:5000/api/admins/me",
//         config
//       );
//       setAdminDetails(response.data);
//     } catch (error) {
//       console.error("Error fetching admin details:", error);
//     }
//   };

//   const fetchProgramManagers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await axios.get(
//         "http://localhost:5000/api/programmanagers/all",
//         config
//       );
//       if (response.status === 200) {
//         setProgramManagers(response.data);
//         setFilteredProgramManagers(
//           response.data.filter((pm) => pm.isActive === showActive)
//         );
//       } else {
//         console.error("Failed to fetch program managers");
//       }
//     } catch (error) {
//       console.error("Error fetching program managers:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAdminDetails();
//     fetchProgramManagers();
//   }, [showActive]);

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//     const filtered = programManagers
//       .filter((pm) => {
//         return (
//           pm.adminName
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.adminPhone
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.username
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.email.toLowerCase().includes(event.target.value.toLowerCase())
//         );
//       })
//       .filter((pm) => pm.isActive === showActive);
//     setFilteredProgramManagers(filtered);
//     setCurrentPage(0); // Reset to first page when search query changes
//   };

//   const handleMenuClick = (event, admin) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedAdmin(admin);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedAdmin(null);
//   };

//   const handleViewDetails = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowViewModal(true);
//     handleMenuClose();
//   };

//   const handleEdit = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowEditModal(true);
//     handleMenuClose();
//   };

//   const handleDisable = async (adminId) => {
//     if (
//       window.confirm("Are you sure you want to disable this Program Manager?")
//     ) {
//       try {
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const response = await axios.put(
//           `http://localhost:5000/api/programmanagers/${adminId}/disable`,
//           {},
//           config
//         );
//         if (response.status === 200) {
//           alert("Program Manager disabled successfully");
//           fetchProgramManagers(); // Refresh the list after disabling
//         } else {
//           alert("Failed to disable Program Manager. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error disabling Program Manager:", error);
//         if (error.response && error.response.status === 404) {
//           alert("Program Manager not found.");
//         } else {
//           alert("Error disabling Program Manager. Please try again.");
//         }
//       }
//     }
//     handleMenuClose();
//   };

//   const handleEnable = async (adminId) => {
//     if (
//       window.confirm("Are you sure you want to enable this Program Manager?")
//     ) {
//       try {
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const response = await axios.put(
//           `http://localhost:5000/api/programmanagers/${adminId}/enable`,
//           {},
//           config
//         );
//         if (response.status === 200) {
//           alert("Program Manager enabled successfully");
//           fetchProgramManagers(); // Refresh the list after enabling
//         } else {
//           alert("Failed to enable Program Manager. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error enabling Program Manager:", error);
//         if (error.response && error.response.status === 404) {
//           alert("Program Manager not found.");
//         } else {
//           alert("Error enabling Program Manager. Please try again.");
//         }
//       }
//     }
//     handleMenuClose();
//   };

//   const handleSelectAll = (event) => {
//     const checked = event.target.checked;
//     setSelectedAll(checked);
//     if (checked) {
//       const allIds = filteredProgramManagers.map((pm) => pm._id);
//       setSelectedIds(allIds);
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleSelectOne = (event, id) => {
//     const checked = event.target.checked;
//     if (checked) {
//       setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
//     } else {
//       setSelectedIds((prevSelectedIds) =>
//         prevSelectedIds.filter((selectedId) => selectedId !== id)
//       );
//     }
//   };

//   const isSelected = (id) => selectedIds.includes(id);

//   const exportTableToCSV = () => {
//     const headers = [
//       "Name Of The Admin",
//       "Mobile Number",
//       "User Name",
//       "E-Mail",
//     ];

//     // Check if any program manager is selected
//     const rows = selectedIds.length
//       ? filteredProgramManagers
//           .filter((pm) => selectedIds.includes(pm._id))
//           .map((pm) => [pm.adminName, pm.adminPhone, pm.username, pm.email])
//       : filteredProgramManagers.map((pm) => [
//           pm.adminName,
//           pm.adminPhone,
//           pm.username,
//           pm.email,
//         ]);

//     let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

//     rows.forEach((rowArray) => {
//       let row = rowArray.join(",");
//       csvContent += row + "\n";
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "program_manager_ids.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleSuccessModal = () => {
//     setShowModal(false);
//     setShowSuccessModal(true);
//     fetchProgramManagers(); // Refresh program managers list after adding a new one
//   };

//   const handleCloseSuccessModal = () => {
//     setShowSuccessModal(false);
//   };

//   const handleCloseEditModal = () => {
//     setShowEditModal(false);
//   };

//   const handleEditSuccessModal = () => {
//     setShowEditModal(false);
//     fetchProgramManagers(); // Refresh program managers list after editing a program manager
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(0); // Reset to the first page when rows per page changes
//   };

//   const handlePreviousPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
//   };

//   const handleNextPage = () => {
//     const maxPage = Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1;
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
//   };

//   const paginatedData = filteredProgramManagers.slice(
//     currentPage * rowsPerPage,
//     currentPage * rowsPerPage + rowsPerPage
//   );

//   return (
//     <div className="dashboard admindash-dashboard">
//       <aside className="sidebar admindash-sidebar">
//         <div className="logo-container admindash-logo-container">
//           <div className="logo admindash-logo">
//             <img src={logo} alt="Logo" />
//           </div>
//         </div>
//         <div className="nav-container admindash-nav-container">
//           <nav className="nav admindash-nav">
//             <ul>
//               <li
//                 className="nav-item admindash-nav-item"
//                 style={{ marginTop: "80px" }}
//                 onClick={() => setShowActive(true)} // Show active IDs
//               >
//                 <FaUserCircle className="nav-icon admindash-nav-icon" /> Active
//                 Program manager
//               </li>
//               <li
//                 className="nav-item admindash-nav-item"
//                 onClick={() => setShowActive(false)} // Show disabled IDs
//               >
//                 <FaRocket className="nav-icon admindash-nav-icon" /> Inactive
//                 Program manager
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>

//       <main className="main-content admindash-main-content">
//         <header className="header admindash-header">
//           <span
//             className="founder admindash-founder"
//             style={{ fontSize: "24px" }}
//           >
//             <FiMenu style={{ color: "#909090" }} /> Admin
//           </span>

//           <div className="profile-section admindash-profile-section">
//             {/* <div className="notification-icon admindash-notification-icon">
//               <FaBell />
//             </div> */}
//             <div className="user-info admindash-user-info">
//               <span className="user-initials admindash-user-initials">
//                 <img src={loginLogo} alt="Login" style={{ width: "40px" }} />
//               </span>
//               <div className="user-details admindash-user-details">
//                 <span className="user-name admindash-user-name">
//                   {adminDetails.name}{" "}
//                   <RiArrowDropDownLine className="drop admindash-drop" />
//                 </span>
//                 <span className="user-email admindash-user-email">
//                   {adminDetails.email}
//                 </span>
//               </div>
//               <button
//                 className="logout-button admindash-logout-button"
//                 onClick={handleLogout}
//                 style={{ marginLeft: "10px", padding: "8px" }}
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </header>

//         <section className="content admindash-content">
//           <div className="content-header admindash-content-header">
//             <h3>List of Program Manager</h3>
//             <input
//               type="text"
//               placeholder="Search here"
//               className="search-bar admindash-search-bar"
//               style={{ height: "35px" }}
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button
//               className="add-founder-button admindash-add-founder-button"
//               onClick={handleOpenModal}
//             >
//               Create Program Manager ID
//             </button>
//           </div>
//           <div className="admin-list admindash-admin-list">
//             <table>
//               <thead>
//                 <tr>
//                   <th>
//                     <input
//                       type="checkbox"
//                       checked={selectedAll}
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   <th>
//                     Name Of The Admin{" "}
//                     <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     Mobile Number{" "}
//                     <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     User Name <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     E-Mail <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.map((pm) => (
//                   <tr key={pm._id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={isSelected(pm._id)}
//                         onChange={(event) => handleSelectOne(event, pm._id)}
//                       />
//                     </td>
//                     <td>{pm.adminName}</td>
//                     <td>{pm.adminPhone}</td>
//                     <td>{pm.username}</td>
//                     <td>{pm.email}</td>
//                     <td>
//                       <IconButton
//                         onClick={(event) => {
//                           event.stopPropagation();
//                           handleMenuClick(event, pm);
//                         }}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(
//                           anchorEl &&
//                             selectedAdmin &&
//                             selectedAdmin._id === pm._id
//                         )}
//                         onClose={handleMenuClose}
//                       >
//                         <MenuItem onClick={() => handleViewDetails(pm._id)}>
//                           View Details
//                         </MenuItem>
//                         <MenuItem onClick={() => handleEdit(pm._id)}>
//                           Edit
//                         </MenuItem>
//                         {showActive ? (
//                           <MenuItem onClick={() => handleDisable(pm._id)}>
//                             Disable
//                           </MenuItem>
//                         ) : (
//                           <MenuItem onClick={() => handleEnable(pm._id)}>
//                             Enable
//                           </MenuItem>
//                         )}
//                       </Menu>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredProgramManagers.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan="6"
//                       className="text-center admindash-text-center"
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <img
//                           src="/founders/not.png"
//                           alt="No Organization"
//                           style={{
//                             width: "50px",
//                             marginRight: "10px",
//                             textAlign: "left",
//                           }}
//                         />
//                         <p style={{ margin: 0 }}>
//                           No program manager added yet
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             <div className="table-footer admindash-table-footer">
//               <button
//                 className="export-button admindash-export-button"
//                 onClick={exportTableToCSV}
//               >
//                 <FaFileExport className="icon admindash-icon" /> Export Table
//               </button>
//               <div className="pagination admindash-pagination">
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handlePreviousPage}
//                   disabled={currentPage === 0}
//                 >
//                   {"<"}
//                 </button>
//                 <span className="pagination-info admindash-pagination-info">
//                   {currentPage + 1} of{" "}
//                   {Math.ceil(filteredProgramManagers.length / rowsPerPage)}
//                 </span>
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handleNextPage}
//                   disabled={
//                     currentPage >=
//                     Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1
//                   }
//                 >
//                   {">"}
//                 </button>
//                 <div className="rows-per-page admindash-rows-per-page">
//                   <span>Rows per page</span>
//                   <select
//                     value={rowsPerPage}
//                     onChange={handleRowsPerPageChange}
//                   >
//                     <option value="5">5</option>
//                     <option value="10">10</option>
//                     <option value="15">15</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <AddProgramManagerModal
//           showModal={showModal}
//           handleClose={handleCloseModal}
//           handleSuccess={handleSuccessModal}
//         />
//         <EditProgramManagerModal
//           showModal={showEditModal}
//           handleClose={handleCloseEditModal}
//           programManagerId={programManagerId}
//           handleSuccess={handleEditSuccessModal}
//         />
//         <ViewProgramManagerModal
//           showModal={showViewModal}
//           handleClose={() => setShowViewModal(false)}
//           programManagerId={programManagerId}
//         />
//         <SuccessModal
//           showSuccessModal={showSuccessModal}
//           handleClose={handleCloseSuccessModal}
//         />
//       </main>
//     </div>
//   );
// };

// export default Admindash;






//cuureent



// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   FaBell,
//   FaRocket,
//   FaUserCircle,
//   FaSort,
//   FaFileExport,
// } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import { IconButton, Menu, MenuItem } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import axios from "axios";
// import logo from "../Public/logo.png";
// import successIcon from "../Public/Vector.png";
// import "./admindash.css";
// import AddProgramManagerModal from "./AddProgramManager";
// import EditProgramManagerModal from "./EditProgramManager";
// import ViewProgramManagerModal from "./ViewProgramManagerModal";
// import loginLogo from "../Public/login.png";

// const SuccessModal = ({ showSuccessModal, handleClose }) => {
//   if (!showSuccessModal) {
//     return null;
//   }

//   return (
//     <div className="modal-overlay admindash-modal-overlay">
//       <div className="modal-content admindash-modal-content">
//         <img
//           src={successIcon}
//           alt="Success"
//           style={{ width: "50px", display: "block", margin: "0 auto" }}
//         />
//         <h2
//           className="modal-title admindash-modal-title"
//           style={{ marginTop: "15px", fontSize: "18px" }}
//         >
//           Program Manager Added Successfully
//         </h2>
//         <p style={{ color: "#909090" }}>
//           Program Manager details have been added successfully.
//         </p>
//         <button
//           onClick={handleClose}
//           className="btn-primary admindash-btn-primary"
//           style={{ width: "auto" }}
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// };

// const Admindash = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [selectedAll, setSelectedAll] = useState(false);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [programManagerId, setProgramManagerId] = useState(null);
//   const [programManagers, setProgramManagers] = useState([]);
//   const [filteredProgramManagers, setFilteredProgramManagers] = useState([]);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showActive, setShowActive] = useState(true); // New state for filtering
//   const [adminDetails, setAdminDetails] = useState({}); // State for admin details

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state && location.state.showActive !== undefined) {
//       setShowActive(location.state.showActive);
//     }
//   }, [location.state]);

//   const fetchAdminDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await axios.get(
//         "http://localhost:5000/api/admins/me",
//         config
//       );
//       setAdminDetails(response.data);
//     } catch (error) {
//       console.error("Error fetching admin details:", error);
//     }
//   };

//   const fetchProgramManagers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await axios.get(
//         "http://localhost:5000/api/programmanagers/all",
//         config
//       );
//       if (response.status === 200) {
//         setProgramManagers(response.data);
//         setFilteredProgramManagers(
//           response.data.filter((pm) => pm.isActive === showActive)
//         );
//       } else {
//         console.error("Failed to fetch program managers");
//       }
//     } catch (error) {
//       console.error("Error fetching program managers:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAdminDetails();
//     fetchProgramManagers();
//   }, [showActive]);

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//     const filtered = programManagers
//       .filter((pm) => {
//         return (
//           pm.adminName
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.adminPhone
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.username
//             .toLowerCase()
//             .includes(event.target.value.toLowerCase()) ||
//           pm.email.toLowerCase().includes(event.target.value.toLowerCase())
//         );
//       })
//       .filter((pm) => pm.isActive === showActive);
//     setFilteredProgramManagers(filtered);
//     setCurrentPage(0); // Reset to first page when search query changes
//   };

//   const handleMenuClick = (event, admin) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedAdmin(admin);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedAdmin(null);
//   };

//   const handleViewDetails = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowViewModal(true);
//     handleMenuClose();
//   };

//   const handleEdit = (adminId) => {
//     setProgramManagerId(adminId);
//     setShowEditModal(true);
//     handleMenuClose();
//   };

//   const handleDisable = async (adminId) => {
//     if (
//       window.confirm("Are you sure you want to disable this Program Manager?")
//     ) {
//       try {
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const response = await axios.put(
//           `http://localhost:5000/api/programmanagers/${adminId}/disable`,
//           {},
//           config
//         );
//         if (response.status === 200) {
//           alert("Program Manager disabled successfully");
//           fetchProgramManagers(); // Refresh the list after disabling
//         } else {
//           alert("Failed to disable Program Manager. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error disabling Program Manager:", error);
//         if (error.response && error.response.status === 404) {
//           alert("Program Manager not found.");
//         } else {
//           alert("Error disabling Program Manager. Please try again.");
//         }
//       }
//     }
//     handleMenuClose();
//   };

//   const handleEnable = async (adminId) => {
//     if (
//       window.confirm("Are you sure you want to enable this Program Manager?")
//     ) {
//       try {
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const response = await axios.put(
//           `http://localhost:5000/api/programmanagers/${adminId}/enable`,
//           {},
//           config
//         );
//         if (response.status === 200) {
//           alert("Program Manager enabled successfully");
//           fetchProgramManagers(); // Refresh the list after enabling
//         } else {
//           alert("Failed to enable Program Manager. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error enabling Program Manager:", error);
//         if (error.response && error.response.status === 404) {
//           alert("Program Manager not found.");
//         } else {
//           alert("Error enabling Program Manager. Please try again.");
//         }
//       }
//     }
//     handleMenuClose();
//   };

//   const handleSelectAll = (event) => {
//     const checked = event.target.checked;
//     setSelectedAll(checked);
//     if (checked) {
//       const allIds = filteredProgramManagers.map((pm) => pm._id);
//       setSelectedIds(allIds);
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleSelectOne = (event, id) => {
//     const checked = event.target.checked;
//     if (checked) {
//       setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
//     } else {
//       setSelectedIds((prevSelectedIds) =>
//         prevSelectedIds.filter((selectedId) => selectedId !== id)
//       );
//     }
//   };

//   const isSelected = (id) => selectedIds.includes(id);

//   const exportTableToCSV = () => {
//     const headers = [
//       "Name Of The Admin",
//       "Mobile Number",
//       "User Name",
//       "E-Mail",
//     ];

//     // Check if any program manager is selected
//     const rows = selectedIds.length
//       ? filteredProgramManagers
//           .filter((pm) => selectedIds.includes(pm._id))
//           .map((pm) => [pm.adminName, pm.adminPhone, pm.username, pm.email])
//       : filteredProgramManagers.map((pm) => [
//           pm.adminName,
//           pm.adminPhone,
//           pm.username,
//           pm.email,
//         ]);

//     let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

//     rows.forEach((rowArray) => {
//       let row = rowArray.join(",");
//       csvContent += row + "\n";
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "program_manager_ids.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleSuccessModal = () => {
//     setShowModal(false);
//     setShowSuccessModal(true);
//     fetchProgramManagers(); // Refresh program managers list after adding a new one
//   };

//   const handleCloseSuccessModal = () => {
//     setShowSuccessModal(false);
//   };

//   const handleCloseEditModal = () => {
//     setShowEditModal(false);
//   };

//   const handleEditSuccessModal = () => {
//     setShowEditModal(false);
//     fetchProgramManagers(); // Refresh program managers list after editing a program manager
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(0); // Reset to the first page when rows per page changes
//   };

//   const handlePreviousPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
//   };

//   const handleNextPage = () => {
//     const maxPage = Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1;
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
//   };

//   const paginatedData = filteredProgramManagers.slice(
//     currentPage * rowsPerPage,
//     currentPage * rowsPerPage + rowsPerPage
//   );

//   return (
//     <div className="dashboard admindash-dashboard">
//       <aside className="sidebar admindash-sidebar">
//         <div className="logo-container admindash-logo-container">
//           <div className="logo admindash-logo">
//             <img src={logo} alt="Logo" />
//           </div>
//         </div>
//         <div className="nav-container admindash-nav-container">
//           <nav className="nav admindash-nav">
//             <ul>
//               <li
//                 className="nav-item admindash-nav-item"
//                 style={{ marginTop: "80px" }}
//                 onClick={() => setShowActive(true)} // Show active IDs
//               >
//                 <FaUserCircle className="nav-icon admindash-nav-icon" /> Active
//                 Program manager
//               </li>
//               <li
//                 className="nav-item admindash-nav-item"
//                 onClick={() => setShowActive(false)} // Show disabled IDs
//               >
//                 <FaRocket className="nav-icon admindash-nav-icon" /> Inactive
//                 Program manager
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>

//       <main className="main-content admindash-main-content">
//         <header className="header admindash-header">
//           <span
//             className="founder admindash-founder"
//             style={{ fontSize: "24px" }}
//           >
//             <FiMenu style={{ color: "#909090" }} /> Admin
//           </span>

//           <div className="profile-section admindash-profile-section">
//             {/* <div className="notification-icon admindash-notification-icon">
//               <FaBell />
//             </div> */}
//             <div className="user-info admindash-user-info">
//               <span className="user-initials admindash-user-initials">
//                 <img src={loginLogo} alt="Login" style={{ width: "40px" }} />
//               </span>
//               <div className="user-details admindash-user-details">
//                 <span className="user-name admindash-user-name">
//                   {adminDetails.name}{" "}
//                   <RiArrowDropDownLine className="drop admindash-drop" />
//                 </span>
//                 <span className="user-email admindash-user-email">
//                   {adminDetails.email}
//                 </span>
//               </div>
//               <button
//                 className="logout-button admindash-logout-button"
//                 onClick={handleLogout}
//                 style={{ marginLeft: "10px", padding: "8px" }}
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </header>

//         <section className="content admindash-content">
//           <div className="content-header admindash-content-header">
//             <h3>List of Program Manager</h3>
//             <input
//               type="text"
//               placeholder="Search here"
//               className="search-bar admindash-search-bar"
//               style={{ height: "35px" }}
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button
//               className="add-founder-button admindash-add-founder-button"
//               onClick={handleOpenModal}
//             >
//               Create Program Manager ID
//             </button>
//           </div>
//           <div className="admin-list admindash-admin-list">
//             <table>
//               <thead>
//                 <tr>
//                   <th>
//                     <input
//                       type="checkbox"
//                       checked={selectedAll}
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   <th>
//                     Name Of The Admin{" "}
//                     <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     Mobile Number{" "}
//                     <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     User Name <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>
//                     E-Mail <FaSort className="sorticon admindash-sorticon" />
//                   </th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.map((pm) => (
//                   <tr key={pm._id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={isSelected(pm._id)}
//                         onChange={(event) => handleSelectOne(event, pm._id)}
//                       />
//                     </td>
//                     <td>{pm.adminName}</td>
//                     <td>{pm.adminPhone}</td>
//                     <td>{pm.username}</td>
//                     <td>{pm.email}</td>
//                     <td>
//                       <IconButton
//                         onClick={(event) => {
//                           event.stopPropagation();
//                           handleMenuClick(event, pm);
//                         }}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(
//                           anchorEl &&
//                             selectedAdmin &&
//                             selectedAdmin._id === pm._id
//                         )}
//                         onClose={handleMenuClose}
//                       >
//                         <MenuItem onClick={() => handleViewDetails(pm._id)}>
//                           View Details
//                         </MenuItem>
//                         <MenuItem onClick={() => handleEdit(pm._id)}>
//                           Edit
//                         </MenuItem>
//                         {showActive ? (
//                           <MenuItem onClick={() => handleDisable(pm._id)}>
//                             Disable
//                           </MenuItem>
//                         ) : (
//                           <MenuItem onClick={() => handleEnable(pm._id)}>
//                             Enable
//                           </MenuItem>
//                         )}
//                       </Menu>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredProgramManagers.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan="6"
//                       className="text-center admindash-text-center"
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <img
//                           src="/founders/not.png"
//                           alt="No Organization"
//                           style={{
//                             width: "50px",
//                             marginRight: "10px",
//                             textAlign: "left",
//                           }}
//                         />
//                         <p style={{ margin: 0 }}>
//                           No program manager added yet
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             <div className="table-footer admindash-table-footer">
//               <button
//                 className="export-button admindash-export-button"
//                 onClick={exportTableToCSV}
//               >
//                 <FaFileExport className="icon admindash-icon" /> Export Table
//               </button>
//               <div className="pagination admindash-pagination">
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handlePreviousPage}
//                   disabled={currentPage === 0}
//                 >
//                   {"<"}
//                 </button>
//                 <span className="pagination-info admindash-pagination-info">
//                   {currentPage + 1} of{" "}
//                   {Math.ceil(filteredProgramManagers.length / rowsPerPage)}
//                 </span>
//                 <button
//                   className="pagination-button admindash-pagination-button"
//                   onClick={handleNextPage}
//                   disabled={
//                     currentPage >=
//                     Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1
//                   }
//                 >
//                   {">"}
//                 </button>
//                 <div className="rows-per-page admindash-rows-per-page">
//                   <span>Rows per page</span>
//                   <select
//                     value={rowsPerPage}
//                     onChange={handleRowsPerPageChange}
//                   >
//                     <option value="5">5</option>
//                     <option value="10">10</option>
//                     <option value="15">15</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <AddProgramManagerModal
//           showModal={showModal}
//           handleClose={handleCloseModal}
//           handleSuccess={handleSuccessModal}
//         />
//         <EditProgramManagerModal
//           showModal={showEditModal}
//           handleClose={handleCloseEditModal}
//           programManagerId={programManagerId}
//           handleSuccess={handleEditSuccessModal}
//         />
//         <ViewProgramManagerModal
//           showModal={showViewModal}
//           handleClose={() => setShowViewModal(false)}
//           programManagerId={programManagerId}
//         />
//         <SuccessModal
//           showSuccessModal={showSuccessModal}
//           handleClose={handleCloseSuccessModal}
//         />
//       </main>
//     </div>
//   );
// };

// export default Admindash;











import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBell,
  FaRocket,
  FaUserCircle,
  FaSort,
  FaFileExport,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import logo from "../Public/logo.png";
import successIcon from "../Public/Vector.png";
import "./admindash.css";
import AddProgramManagerModal from "./AddProgramManager";
import EditProgramManagerModal from "./EditProgramManager";
import ViewProgramManagerModal from "./ViewProgramManagerModal";
import loginLogo from "../Public/login.png";

const SuccessModal = ({ showSuccessModal, handleClose }) => {
  if (!showSuccessModal) {
    return null;
  }

  return (
    <div className="modal-overlay admindash-modal-overlay">
      <div className="modal-content admindash-modal-content">
        <img
          src={successIcon}
          alt="Success"
          style={{ width: "50px", display: "block", margin: "0 auto" }}
        />
        <h2
          className="modal-title admindash-modal-title"
          style={{ marginTop: "15px", fontSize: "18px" }}
        >
          Program Manager Added Successfully
        </h2>
        <p style={{ color: "#909090" }}>
          Program Manager details have been added successfully.
        </p>
        <button
          onClick={handleClose}
          className="btn-primary admindash-btn-primary"
          style={{ width: "auto" }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

const Admindash = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [programManagerId, setProgramManagerId] = useState(null);
  const [programManagers, setProgramManagers] = useState([]);
  const [filteredProgramManagers, setFilteredProgramManagers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActive, setShowActive] = useState(true); // New state for filtering
  const [adminDetails, setAdminDetails] = useState({}); // State for admin details

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.showActive !== undefined) {
      setShowActive(location.state.showActive);
    }
  }, [location.state]);

  const fetchAdminDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        "http://localhost:5000/api/admins/me",
        config
      );
      setAdminDetails(response.data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  const fetchProgramManagers = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Fetch program managers associated with the logged-in admin
      const response = await axios.get(
        "http://localhost:5000/api/admins/me/programmanagers",
        config
      );
      if (response.status === 200) {
        setProgramManagers(response.data);
        setFilteredProgramManagers(
          response.data.filter((pm) => pm.isActive === showActive)
        );
      } else {
        console.error("Failed to fetch program managers");
      }
    } catch (error) {
      console.error("Error fetching program managers:", error);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
    fetchProgramManagers();
  }, [showActive]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    const filtered = programManagers
      .filter((pm) => {
        return (
          pm.adminName
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          pm.adminPhone
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          pm.username
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          pm.email.toLowerCase().includes(event.target.value.toLowerCase())
        );
      })
      .filter((pm) => pm.isActive === showActive);
    setFilteredProgramManagers(filtered);
    setCurrentPage(0); // Reset to first page when search query changes
  };

  const handleMenuClick = (event, admin) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdmin(admin);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAdmin(null);
  };

  const handleViewDetails = (adminId) => {
    setProgramManagerId(adminId);
    setShowViewModal(true);
    handleMenuClose();
  };

  const handleEdit = (adminId) => {
    setProgramManagerId(adminId);
    setShowEditModal(true);
    handleMenuClose();
  };

  const handleDisable = async (adminId) => {
    if (
      window.confirm("Are you sure you want to disable this Program Manager?")
    ) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.put(
          `http://localhost:5000/api/programmanagers/${adminId}/disable`,
          {},
          config
        );
        if (response.status === 200) {
          alert("Program Manager disabled successfully");
          fetchProgramManagers(); // Refresh the list after disabling
        } else {
          alert("Failed to disable Program Manager. Please try again.");
        }
      } catch (error) {
        console.error("Error disabling Program Manager:", error);
        if (error.response && error.response.status === 404) {
          alert("Program Manager not found.");
        } else {
          alert("Error disabling Program Manager. Please try again.");
        }
      }
    }
    handleMenuClose();
  };

  const handleEnable = async (adminId) => {
    if (
      window.confirm("Are you sure you want to enable this Program Manager?")
    ) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.put(
          `http://localhost:5000/api/programmanagers/${adminId}/enable`,
          {},
          config
        );
        if (response.status === 200) {
          alert("Program Manager enabled successfully");
          fetchProgramManagers(); // Refresh the list after enabling
        } else {
          alert("Failed to enable Program Manager. Please try again.");
        }
      } catch (error) {
        console.error("Error enabling Program Manager:", error);
        if (error.response && error.response.status === 404) {
          alert("Program Manager not found.");
        } else {
          alert("Error enabling Program Manager. Please try again.");
        }
      }
    }
    handleMenuClose();
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectedAll(checked);
    if (checked) {
      const allIds = filteredProgramManagers.map((pm) => pm._id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (event, id) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
    } else {
      setSelectedIds((prevSelectedIds) =>
        prevSelectedIds.filter((selectedId) => selectedId !== id)
      );
    }
  };

  const isSelected = (id) => selectedIds.includes(id);

  const exportTableToCSV = () => {
    const headers = [
      "Name Of The Admin",
      "Mobile Number",
      "User Name",
      "E-Mail",
    ];

    // Check if any program manager is selected
    const rows = selectedIds.length
      ? filteredProgramManagers
          .filter((pm) => selectedIds.includes(pm._id))
          .map((pm) => [pm.adminName, pm.adminPhone, pm.username, pm.email])
      : filteredProgramManagers.map((pm) => [
          pm.adminName,
          pm.adminPhone,
          pm.username,
          pm.email,
        ]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

    rows.forEach((rowArray) => {
      let row = rowArray.join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "program_manager_ids.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSuccessModal = () => {
    setShowModal(false);
    setShowSuccessModal(true);
    fetchProgramManagers(); // Refresh program managers list after adding a new one
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEditSuccessModal = () => {
    setShowEditModal(false);
    fetchProgramManagers(); // Refresh program managers list after editing a program manager
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0); // Reset to the first page when rows per page changes
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1;
    setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
  };

  const paginatedData = filteredProgramManagers.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <div className="dashboard admindash-dashboard">
      <aside className="sidebar admindash-sidebar">
        <div className="logo-container admindash-logo-container">
          <div className="logo admindash-logo">
            <img src={logo} alt="Logo" />
          </div>
        </div>
        <div className="nav-container admindash-nav-container">
          <nav className="nav admindash-nav">
            <ul>
              <li
                className="nav-item admindash-nav-item"
                style={{ marginTop: "80px" }}
                onClick={() => setShowActive(true)} // Show active IDs
              >
                <FaUserCircle className="nav-icon admindash-nav-icon" /> Active
                Program manager
              </li>
              <li
                className="nav-item admindash-nav-item"
                onClick={() => setShowActive(false)} // Show disabled IDs
              >
                <FaRocket className="nav-icon admindash-nav-icon" /> Inactive
                Program manager
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <main className="main-content admindash-main-content">
        <header className="header admindash-header">
          <span
            className="founder admindash-founder"
            style={{ fontSize: "24px" }}
          >
            <FiMenu style={{ color: "#909090" }} /> Admin
          </span>

          <div className="profile-section admindash-profile-section">
            {/* <div className="notification-icon admindash-notification-icon">
              <FaBell />
            </div> */}
            <div className="user-info admindash-user-info">
              <span className="user-initials admindash-user-initials">
                <img src={loginLogo} alt="Login" style={{ width: "40px" }} />
              </span>
              <div className="user-details admindash-user-details">
                <span className="user-name admindash-user-name">
                  {adminDetails.name}{" "}
                  <RiArrowDropDownLine className="drop admindash-drop" />
                </span>
                <span className="user-email admindash-user-email">
                  {adminDetails.email}
                </span>
              </div>
              <button
                className="logout-button admindash-logout-button"
                onClick={handleLogout}
                style={{ marginLeft: "10px", padding: "8px" }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="content admindash-content">
          <div className="content-header admindash-content-header">
            <h3>List of Program Manager</h3>
            <input
              type="text"
              placeholder="Search here"
              className="search-bar admindash-search-bar"
              style={{ height: "35px" }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              className="add-founder-button admindash-add-founder-button"
              onClick={handleOpenModal}
            >
              Create Program Manager ID
            </button>
          </div>
          <div className="admin-list admindash-admin-list">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>
                    Name Of The Admin{" "}
                    <FaSort className="sorticon admindash-sorticon" />
                  </th>
                  <th>
                    Mobile Number{" "}
                    <FaSort className="sorticon admindash-sorticon" />
                  </th>
                  <th>
                    User Name <FaSort className="sorticon admindash-sorticon" />
                  </th>
                  <th>
                    E-Mail <FaSort className="sorticon admindash-sorticon" />
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((pm) => (
                  <tr key={pm._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected(pm._id)}
                        onChange={(event) => handleSelectOne(event, pm._id)}
                      />
                    </td>
                    <td>{pm.adminName}</td>
                    <td>{pm.adminPhone}</td>
                    <td>{pm.username}</td>
                    <td>{pm.email}</td>
                    <td>
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          handleMenuClick(event, pm);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(
                          anchorEl &&
                            selectedAdmin &&
                            selectedAdmin._id === pm._id
                        )}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => handleViewDetails(pm._id)}>
                          View Details
                        </MenuItem>
                        <MenuItem onClick={() => handleEdit(pm._id)}>
                          Edit
                        </MenuItem>
                        {showActive ? (
                          <MenuItem onClick={() => handleDisable(pm._id)}>
                            Disable
                          </MenuItem>
                        ) : (
                          <MenuItem onClick={() => handleEnable(pm._id)}>
                            Enable
                          </MenuItem>
                        )}
                      </Menu>
                    </td>
                  </tr>
                ))}
                {filteredProgramManagers.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center admindash-text-center"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src="/founders/not.png"
                          alt="No Organization"
                          style={{
                            width: "50px",
                            marginRight: "10px",
                            textAlign: "left",
                          }}
                        />
                        <p style={{ margin: 0 }}>
                          No program manager added yet
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="table-footer admindash-table-footer">
              <button
                className="export-button admindash-export-button"
                onClick={exportTableToCSV}
              >
                <FaFileExport className="icon admindash-icon" /> Export Table
              </button>
              <div className="pagination admindash-pagination">
                <button
                  className="pagination-button admindash-pagination-button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  {"<"}
                </button>
                <span className="pagination-info admindash-pagination-info">
                  {currentPage + 1} of{" "}
                  {Math.ceil(filteredProgramManagers.length / rowsPerPage)}
                </span>
                <button
                  className="pagination-button admindash-pagination-button"
                  onClick={handleNextPage}
                  disabled={
                    currentPage >=
                    Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1
                  }
                >
                  {">"}
                </button>
                <div className="rows-per-page admindash-rows-per-page">
                  <span>Rows per page</span>
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>
        <AddProgramManagerModal
          showModal={showModal}
          handleClose={handleCloseModal}
          handleSuccess={handleSuccessModal}
        />
        <EditProgramManagerModal
          showModal={showEditModal}
          handleClose={handleCloseEditModal}
          programManagerId={programManagerId}
          handleSuccess={handleEditSuccessModal}
        />
        <ViewProgramManagerModal
          showModal={showViewModal}
          handleClose={() => setShowViewModal(false)}
          programManagerId={programManagerId}
        />
        <SuccessModal
          showSuccessModal={showSuccessModal}
          handleClose={handleCloseSuccessModal}
        />
      </main>
    </div>
  );
};

export default Admindash;
