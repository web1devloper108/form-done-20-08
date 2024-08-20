import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaRocket,
  FaUserCircle,
  FaSort,
  FaFileExport,
} from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import logo from '../Public/logo.png';
import successIcon from '../Public/Vector.png';
import '../SuperAdmin/Superadmindash.css';
import AddProgramManagerModal from './AddProgramManager';
import EditProgramManagerModal from './EditProgramManager';
import ViewProgramManagerModal from './ViewProgramManagerModal';

const SuccessModal = ({ showSuccessModal, handleClose }) => {
  if (!showSuccessModal) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={successIcon} alt="Success" style={{ width: '50px', display: 'block', margin: '0 auto' }} />
        <h2 className="modal-title">Program Manager Added Successfully</h2>
        <p style={{ color: "#909090" }}>Program Manager details have been added successfully.</p>
        <button onClick={handleClose} className="btn-primary">OK</button>
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
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchProgramManagers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.get(`http://localhost:5000/api/admins/me/programmanagers`, config);
      if (response.status === 200) {
        setProgramManagers(response.data);
        setFilteredProgramManagers(response.data);
      } else {
        console.error('Failed to fetch program managers');
      }
    } catch (error) {
      console.error('Error fetching program managers:', error);
    }
  };

  useEffect(() => {
    fetchProgramManagers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    const filtered = programManagers.filter(pm => {
      return (
        pm.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        pm.adminName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        pm.adminPhone.toLowerCase().includes(event.target.value.toLowerCase()) ||
        pm.username.toLowerCase().includes(event.target.value.toLowerCase()) ||
        pm.email.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
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

  const handleDelete = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this Program Manager?")) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.delete(`http://localhost:5000/api/admins/${adminId}/programmanagers`, config);
        if (response.status === 200) {
          alert('Program Manager deleted successfully');
          fetchProgramManagers(); // Refresh the list after deletion
        } else {
          alert('Failed to delete Program Manager. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting Program Manager:', error);
        if (error.response && error.response.status === 404) {
          alert('Program Manager not found.');
        } else {
          alert('Error deleting Program Manager. Please try again.');
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
      'Name Of The Program Manager',
      'Name Of The Admin',
      'Mobile Number',
      'User Name',
      'E-Mail',
    ];
    const rows = filteredProgramManagers.map((pm) => [
      pm.name,
      pm.adminName,
      pm.adminPhone,
      pm.username,
      pm.email,
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';

    rows.forEach((rowArray) => {
      let row = rowArray.join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'program_manager_ids.csv');
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
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
        </div>
        <div className="nav-container">
          <nav className="nav">
            <ul>
              <li className="nav-item" style={{ marginTop: '80px' }}>
                <FaUserCircle className="nav-icon" /> Profile
              </li>
              <li className="nav-item">
                <FaRocket className="nav-icon" /> Created Program Manager ID
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <span className="founder" style={{ fontSize: '24px' }}>
            <FiMenu style={{ color: '#909090' }} /> Admin
          </span>
         
          <div className="profile-section">
            <div className="notification-icon">
              <FaBell />
            </div>
            <div className="user-info">
              <span className="user-initials">Admin</span>
              <div className="user-details">
                <span className="user-name">
                  Admin <RiArrowDropDownLine className="drop" />
                </span>
                <span className="user-email">admin@mail.com</span>
              </div>
            </div>
          </div>
        </header>

        <section className="content">
          <div className="content-header">
            <h3>List of Program Manager</h3>
            <input
              type="text"
              placeholder="Search here"
              className="search-bar"
              style={{ height: '35px' }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="add-founder-button" onClick={handleOpenModal}>
              + Create Program Manager ID
            </button>
          </div>
          <div className="admin-list">
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
                    Name Of The Program Manager <FaSort className="sorticon" />
                  </th>
                  <th>
                    Name Of The Admin <FaSort className="sorticon" />
                  </th>
                  <th>
                    Mobile Number <FaSort className="sorticon" />
                  </th>
                  <th>
                    User Name <FaSort className="sorticon" />
                  </th>
                  <th>
                    E-Mail <FaSort className="sorticon" />
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
                    <td>{pm.name}</td>
                    <td>{pm.adminName}</td>
                    <td>{pm.adminPhone}</td>
                    <td>{pm.username}</td>
                    <td>{pm.email}</td>
                    <td>
                      <IconButton
                        onClick={(event) => handleMenuClick(event, pm)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl && selectedAdmin && selectedAdmin._id === pm._id)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => handleViewDetails(pm._id)}>View Details</MenuItem>
                        <MenuItem onClick={() => handleEdit(pm._id)}>Edit</MenuItem>
                        <MenuItem onClick={() => handleDelete(pm._id)}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                ))}
                {filteredProgramManagers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <img src="/path/to/empty-icon.png" alt="No Program Manager" />
                      <p>No Program Manager ID Added Yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="table-footer">
              <button className="export-button" onClick={exportTableToCSV}>
                <FaFileExport className="icon" /> Export Table
              </button>
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  {'<'}
                </button>
                <span className="pagination-info">
                  {currentPage + 1} of {Math.ceil(filteredProgramManagers.length / rowsPerPage)}
                </span>
                <button
                  className="pagination-button"
                  onClick={handleNextPage}
                  disabled={currentPage >= Math.ceil(filteredProgramManagers.length / rowsPerPage) - 1}
                >
                  {'>'}
                </button>
                <div className="rows-per-page">
                  <span>Rows per page</span>
                  <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>
        <AddProgramManagerModal showModal={showModal} handleClose={handleCloseModal} handleSuccess={handleSuccessModal} />
        <EditProgramManagerModal showModal={showEditModal} handleClose={handleCloseEditModal} programManagerId={programManagerId} handleSuccess={handleEditSuccessModal} />
        <ViewProgramManagerModal showModal={showViewModal} handleClose={() => setShowViewModal(false)} programManagerId={programManagerId} />
        <SuccessModal showSuccessModal={showSuccessModal} handleClose={handleCloseSuccessModal} />
      </main>
    </div>
  );
};

export default Admindash;
