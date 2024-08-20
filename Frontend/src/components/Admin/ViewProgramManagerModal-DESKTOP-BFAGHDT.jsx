import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewProgramManagerModal.css';

const ViewProgramManagerModal = ({ showModal, handleClose, programManagerId }) => {
  const [programManagerDetails, setProgramManagerDetails] = useState(null);

  useEffect(() => {
    if (programManagerId) {
      fetchProgramManagerDetails();
    }
  }, [programManagerId]);

  const fetchProgramManagerDetails = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(`http://localhost:5000/api/programmanagers/${programManagerId}`, config);
      setProgramManagerDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch program manager details:', error);
      alert('Failed to load details. Please try again.');
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Program Manager Details</h2>
        {programManagerDetails ? (
          <div>
            <p><strong>Name:</strong> {programManagerDetails.name}</p>
            <p><strong>Admin Name:</strong> {programManagerDetails.adminName}</p>
            <p><strong>Phone:</strong> {programManagerDetails.adminPhone}</p>
            <p><strong>Username:</strong> {programManagerDetails.username}</p>
            <p><strong>Email:</strong> {programManagerDetails.email}</p>
          </div>
        ) : <p>Loading...</p>}
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default ViewProgramManagerModal;
