import React, { useState } from 'react';
import './AddDermatologistForm.css';
import { toast } from 'react-toastify';

const AddDermatologistForm = () => {
  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    place: '',
    experience: '',
    yearsOfExperience: '',
    qualifications: '',
    clinicName: '',
    fee: '',
    profileImage: '',
    isVerified: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    for (const key in form) {
      if (!form[key] && key !== 'clinicName' && key !== 'fee' && key !== 'profileImage') {
        toast.error('Please fill in all required fields.');
        return;
      }
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        qualifications: form.qualifications.split(',').map(q => q.trim())
      };
      const res = await fetch('/api/admin/add-dermatologist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Dermatologist added successfully!');
        setForm({ name: '', phoneNumber: '', place: '', experience: '', yearsOfExperience: '', qualifications: '', clinicName: '', fee: '', profileImage: '', isVerified: false });
      } else {
        toast.error(data.message || 'Failed to add dermatologist.');
      }
    } catch (err) {
      toast.error('Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-dermatologist-container">
      <h2>Add Dermatologist (Admin)</h2>
      <form className="add-dermatologist-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name*" value={form.name} onChange={handleChange} />
        <input type="text" name="phoneNumber" placeholder="Phone Number*" value={form.phoneNumber} onChange={handleChange} />
        <input type="text" name="place" placeholder="Location/City*" value={form.place} onChange={handleChange} />
        <input type="text" name="experience" placeholder="Experience (e.g., Acne Specialist)*" value={form.experience} onChange={handleChange} />
        <input type="number" name="yearsOfExperience" placeholder="Years of Experience*" value={form.yearsOfExperience} onChange={handleChange} min="0" />
        <input type="text" name="qualifications" placeholder="Qualifications (comma separated)*" value={form.qualifications} onChange={handleChange} />
        <input type="text" name="clinicName" placeholder="Clinic Name" value={form.clinicName} onChange={handleChange} />
        <input type="text" name="fee" placeholder="Consultation Fee" value={form.fee} onChange={handleChange} />
        <input type="text" name="profileImage" placeholder="Profile Image URL" value={form.profileImage} onChange={handleChange} />
        <label className="checkbox-label">
          <input type="checkbox" name="isVerified" checked={form.isVerified} onChange={handleChange} />
          Verified
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Dermatologist'}</button>
      </form>
    </div>
  );
};

export default AddDermatologistForm; 