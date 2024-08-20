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
import './Superadmindash.css';
import AddOrganizationModal from './AddOrganizationModal.jsx';
import EditOrganizationModal from './EditOrganizationModal.jsx';
import ViewOrganizationModal from './ViewOrganizationModal.jsx';

const SuccessModal = ({ showSuccessModal, handleClose }) => {
  if (!showSuccessModal) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={successIcon} alt="Success" style={{ width: '50px', display: 'block', margin: '0 auto' }} />
        <h2 className="modal-title">Organization ID Added Successfully</h2>
        <p style={{ color: "#909090" }}>Organization details have been added successfully.</p>
        <button onClick={handleClose} className="btn-primary">OK</button>
      </div>
    </div>
  );
};

const Superadmindash = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [organizationId, setOrganizationId] = useState(null);
  const [adminData, setAdminData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.get('http://localhost:5000/api/organizations', config);
      setAdminData(response.data);
      setFilteredData(response.data); // Set filtered data to be the same as fetched data initially
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = adminData.filter((admin) =>
      admin.name.toLowerCase().includes(query) ||
      admin.adminName.toLowerCase().includes(query) ||
      admin.adminPhone.toLowerCase().includes(query) ||
      admin.username.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
    setCurrentPage(0); // Reset to the first page when search query changes
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
    setOrganizationId(adminId);
    setShowViewModal(true);
    handleMenuClose();
  };

  const handleEdit = (adminId) => {
    setOrganizationId(adminId);
    setShowEditModal(true);
    handleMenuClose();
  };

  const handleDelete = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.delete(`http://localhost:5000/api/organizations/${adminId}`, config);
        if (response.status === 200) {
          alert('Organization deleted successfully');
          fetchOrganizations(); // Refresh the list after deletion
        } else {
          alert('Failed to delete organization. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting organization:', error);
        if (error.response && error.response.status === 404) {
          alert('Organization not found.');
        } else {
          alert('Error deleting organization. Please try again.');
        }
      }
    }
    handleMenuClose();
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectedAll(checked);
    if (checked) {
      const allIds = filteredData.map((admin) => admin._id);
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
      'Name Of The Organization',
      'Name Of The Admin',
      'Mobile Number',
      'User Name',
      'E-Mail',
    ];
    const rows = filteredData.map((admin) => [
      admin.name,
      admin.adminName,
      admin.adminPhone,
      admin.username,
      admin.email,
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';

    rows.forEach((rowArray) => {
      let row = rowArray.join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'organization_ids.csv');
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
    fetchOrganizations(); // Refresh organization list after adding a new one
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEditSuccessModal = () => {
    setShowEditModal(false);
    fetchOrganizations(); // Refresh organization list after editing an organization
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0); // Reset to the first page when rows per page changes
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(filteredData.length / rowsPerPage) - 1;
    setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
  };

  const paginatedData = filteredData.slice(
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
                <FaRocket className="nav-icon" /> Created Organization ID
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <span className="founder" style={{ fontSize: '24px' }}>
            <FiMenu style={{ color: '#909090' }} /> Super Admin
          </span>

          <div className="profile-section">
            <div className="notification-icon">
              <FaBell />
            </div>
            <div className="user-info">
              <span className="user-initials">SuperAdmin</span>
              <div className="user-details">
                <span className="user-name">
                  SuperAdmin <RiArrowDropDownLine className="drop" />
                </span>
                <span className="user-email">superadmin@mail.com</span>
              </div>
            </div>
          </div>
        </header>
        <section className="content">
          <div className="content-header">
            <h3>List of Organization ID</h3>
            <input
              type="text"
              placeholder="Search here"
              className="search-bar"
              style={{ height: '35px' }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="add-founder-button" onClick={handleOpenModal}>
              + Create Organization ID
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
                    Name Of The Organization <FaSort className="sorticon" />
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
                {paginatedData.map((admin) => (
                  <tr key={admin._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected(admin._id)}
                        onChange={(event) => handleSelectOne(event, admin._id)}
                      />
                    </td>
                    <td>{admin.name}</td>
                    <td>{admin.adminName}</td>
                    <td>{admin.adminPhone}</td>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>
                      <IconButton
                        onClick={(event) => handleMenuClick(event, admin)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl && selectedAdmin && selectedAdmin._id === admin._id)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => handleViewDetails(admin._id)}>View Details</MenuItem>
                        <MenuItem onClick={() => handleEdit(admin._id)}>Edit</MenuItem>
                        <MenuItem onClick={() => handleDelete(admin._id)}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <img src="/path/to/empty-icon.png" alt="No Organization" />
                      <p>No Organization ID Added Yet</p>
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
                  {currentPage + 1} of {Math.ceil(filteredData.length / rowsPerPage)}
                </span>
                <button
                  className="pagination-button"
                  onClick={handleNextPage}
                  disabled={currentPage >= Math.ceil(filteredData.length / rowsPerPage) - 1}
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
        <AddOrganizationModal showModal={showModal} handleClose={handleCloseModal} handleSuccess={handleSuccessModal} />
        <EditOrganizationModal showModal={showEditModal} handleClose={handleCloseEditModal} organizationId={organizationId} handleSuccess={handleEditSuccessModal} />
        <ViewOrganizationModal showModal={showViewModal} handleClose={() => setShowViewModal(false)} organizationId={organizationId} />
        <SuccessModal showSuccessModal={showSuccessModal} handleClose={handleCloseSuccessModal} />
      </main>
    </div>
  );
};

export default Superadmindash;
