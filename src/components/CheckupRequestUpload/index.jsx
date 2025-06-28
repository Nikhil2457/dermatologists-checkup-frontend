import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

const CheckupRequestUpload = ({ dermatologistId, patientId, checkupRequestId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    image: null,
    description: '',
    bodyPart: '',
    skinType: '',
    symptoms: '',
    duration: '',
    onsetType: '',
    spreading: '',
    itchLevel: 0,
    painLevel: 0,
    bleedingOrPus: '',
    sunExposure: '',
    cosmeticUse: '',
    newProductUse: '',
    workExposure: '',
    allergies: '',
    pastSkinConditions: '',
    familyHistory: '',
    medicationsUsed: '',
    lesionType: '',
    lesionColor: '',
    lesionShape: '',
    lesionBorder: '',
    lesionTexture: '',
    associatedFeatures: '',
    patientNotes: '',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please select an image.');
      return;
    }

    setLoading(true);
    const payload = new FormData();
    payload.append('dermatologistId', dermatologistId);
    payload.append('patientId', patientId);
    payload.append('images', formData.image);
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'image') payload.append(key, value);
    });

    try {
      if (checkupRequestId) {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/checkup-request/${checkupRequestId}/add-images`,
          payload,
          {
            headers: { 
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/checkup-request`, payload, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }

      toast.success('Checkup Request Sent Successfully!');
      setTimeout(onSuccess, 2000);
    } catch (error) {
      console.error('Error sending request:', error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentStep < 4) {
      e.preventDefault();
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4].map(step => (
        <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 && 'Basic Info'}
            {step === 2 && 'Symptoms'}
            {step === 3 && 'Medical History'}
            {step === 4 && 'Lesion Details'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="form-step">
      <h3>📸 Basic Information</h3>
      <div className="form-group">
        <label>Upload Image *</label>
        <input 
          type="file" 
          onChange={handleChange} 
          name="image" 
          accept="image/*"
          required 
        />
        <small>Please upload a clear image of the affected area</small>
      </div>
      
      <div className="form-group">
        <label>Description *</label>
        <textarea 
          name="description" 
          placeholder="Describe the issue in detail..." 
          onChange={handleChange} 
          required 
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Affected Body Part *</label>
          <input 
            name="bodyPart" 
            placeholder="e.g., face, arm, leg..." 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Skin Type *</label>
          <select name="skinType" onChange={handleChange} required>
            <option value="">Select Skin Type</option>
            <option value="Oily">Oily</option>
            <option value="Dry">Dry</option>
            <option value="Combination">Combination</option>
            <option value="Sensitive">Sensitive</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3>🩺 Symptoms & Duration</h3>
      
      <div className="form-group">
        <label>Symptoms *</label>
        <textarea 
          name="symptoms" 
          placeholder="Describe symptoms (itch, pain, burning, etc.)..." 
          onChange={handleChange} 
          required 
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Duration *</label>
          <input 
            name="duration" 
            placeholder="e.g., 5 days, 2 weeks..." 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Onset Type</label>
          <select name="onsetType" onChange={handleChange}>
            <option value="">Select Onset Type</option>
            <option value="Sudden">Sudden</option>
            <option value="Gradual">Gradual</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Spreading Pattern</label>
        <select name="spreading" onChange={handleChange}>
          <option value="">Select Spreading Pattern</option>
          <option value="Localized">Localized</option>
          <option value="Spreading">Spreading</option>
          <option value="Generalized">Generalized</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Itch Level: {formData.itchLevel}/10</label>
          <input 
            type="range" 
            name="itchLevel" 
            min="0" 
            max="10" 
            value={formData.itchLevel}
            onChange={handleChange} 
          />
        </div>
        
        <div className="form-group">
          <label>Pain Level: {formData.painLevel}/10</label>
          <input 
            type="range" 
            name="painLevel" 
            min="0" 
            max="10" 
            value={formData.painLevel}
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Bleeding or Pus</label>
          <select name="bleedingOrPus" onChange={handleChange}>
            <option value="">Select Option</option>
            <option value="None">None</option>
            <option value="Occasional">Occasional</option>
            <option value="Continuous">Continuous</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Sun Exposure</label>
          <select name="sunExposure" onChange={handleChange}>
            <option value="">Select Level</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3>📋 Medical History</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Recent Cosmetic Use</label>
          <input 
            name="cosmeticUse" 
            placeholder="Any cosmetics used recently?" 
            onChange={handleChange} 
          />
        </div>
        
        <div className="form-group">
          <label>New Product Use</label>
          <input 
            name="newProductUse" 
            placeholder="Any new products applied?" 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="form-group">
        <label>Work Exposure</label>
        <input 
          name="workExposure" 
          placeholder="Exposure to chemicals, dust, etc." 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label>Known Allergies</label>
        <input 
          name="allergies" 
          placeholder="Any known allergies?" 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label>Previous Skin Conditions</label>
        <input 
          name="pastSkinConditions" 
          placeholder="Any previous skin issues?" 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label>Family History</label>
        <input 
          name="familyHistory" 
          placeholder="Family history of skin diseases?" 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label>Medications Used</label>
        <input 
          name="medicationsUsed" 
          placeholder="Any medications used for skin issues?" 
          onChange={handleChange} 
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step">
      <h3>🔍 Lesion Characteristics</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Lesion Type</label>
          <input 
            name="lesionType" 
            placeholder="e.g., macule, papule, nodule..." 
            onChange={handleChange} 
          />
        </div>
        
        <div className="form-group">
          <label>Lesion Color</label>
          <input 
            name="lesionColor" 
            placeholder="e.g., red, black, brown..." 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Lesion Shape</label>
          <input 
            name="lesionShape" 
            placeholder="e.g., round, irregular, linear..." 
            onChange={handleChange} 
          />
        </div>
        
        <div className="form-group">
          <label>Lesion Border</label>
          <input 
            name="lesionBorder" 
            placeholder="e.g., sharp, faded, irregular..." 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="form-group">
        <label>Surface Texture</label>
        <input 
          name="lesionTexture" 
          placeholder="e.g., smooth, scaly, rough..." 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label>Associated Features</label>
        <textarea 
          name="associatedFeatures" 
          placeholder="Other symptoms like fever, ulcers, etc." 
          onChange={handleChange} 
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Additional Notes</label>
        <textarea 
          name="patientNotes" 
          placeholder="Any other information you'd like to share..." 
          onChange={handleChange} 
          rows="3"
        />
      </div>
    </div>
  );

  return (
    <div className="checkup-upload-container">
      <div className="checkup-upload-header">
        <h2 className="checkup-upload-title">🧬 Dermatology Checkup Request</h2>
        <p className="checkup-upload-subtitle">Please provide detailed information for accurate diagnosis</p>
      </div>

      {renderStepIndicator()}

      {currentStep < 4 ? (
        <div className="checkup-upload-form">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="nav-btn prev-btn">
                ← Previous
              </button>
            )}
            <button type="button" onClick={nextStep} className="nav-btn next-btn">
              Next →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="checkup-upload-form">
          {renderStep4()}
          <div className="form-navigation">
            <button type="button" onClick={prevStep} className="nav-btn prev-btn">
              ← Previous
            </button>
            <button 
              type="submit" 
              className="checkup-upload-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <TailSpin height={20} width={20} color="#ffffff" />
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit Checkup Request'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckupRequestUpload;
