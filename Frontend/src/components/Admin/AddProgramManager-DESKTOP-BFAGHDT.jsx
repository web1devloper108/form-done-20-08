import React, { useState } from 'react';
import axios from 'axios';
import './AddProgramManagerModal.css';

const AddProgramManagerModal = ({ showModal, handleClose, handleSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    adminName: '',
    adminPhone: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.adminName) errors.adminName = 'Admin Name is required';
    if (!formData.adminPhone) errors.adminPhone = 'Admin Phone is required';
    if (!formData.username) errors.username = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };
        console.log('Sending data to:', 'http://localhost:5000/api/programmanagers');
        console.log('Data:', formData);
        const response = await axios.post('http://localhost:5000/api/programmanagers', formData, config);

        if (response.status === 200) {
          handleSuccess();
          handleClose();
        } else {
          setErrors({ general: response.data.msg || 'Failed to add program manager. Please try again.' });
        }
      } catch (err) {
        console.error('Failed to add program manager:', err.response ? err.response.data : err.message);
        setErrors({ general: err.response?.data?.msg || 'Server error' });
      }
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-content">
        <h2 className="modal-title">Add Program Manager</h2>
        <form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <div className="form-group" key={key}>
              <label>{key[0].toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={key === 'password' ? 'password' : 'text'}
                name={key}
                value={value}
                onChange={handleChange}
                required
              />
              {errors[key] && <div className="error">{errors[key]}</div>}
            </div>
          ))}
          <div className="button-group">
            <button type="submit" className="btn-primary">Add</button>
            <button onClick={handleClose} className="btn-secondary">Cancel</button>
          </div>
          {errors.general && <div className="error">{errors.general}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddProgramManagerModal;

