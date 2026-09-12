import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import API_BASE_URL from './ApiConfig';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminId: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.adminId) {
      newErrors.adminId = 'Admin ID is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Fetch admin data
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin data');
      }

      const data = await response.json();

      console.log('Full API Response:', data);

      if (!data.success) {
        setLoginError('Failed to fetch admin data');
        setIsLoading(false);
        return;
      }

      // Get the admin data
      const adminData = data.data;
      console.log('Admin Data:', adminData);

      // Check if the entered adminId matches the id in the data
      if (!adminData || adminData.id !== formData.adminId) {
        setLoginError('Invalid Admin ID or Password');
        setIsLoading(false);
        return;
      }

      // Compare password - convert both to string for comparison
      const storedPassword = String(adminData.password);
      const enteredPassword = String(formData.password);

      console.log('Stored Password:', storedPassword);
      console.log('Entered Password:', enteredPassword);

      if (storedPassword !== enteredPassword) {
        setLoginError('Invalid Admin ID or Password');
        setIsLoading(false);
        return;
      }

      // Login successful - Set localStorage items
      localStorage.setItem('PatilAdminLogin', 'True');
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminId', formData.adminId);
      localStorage.setItem('adminData', JSON.stringify(adminData));

      console.log('Login successful!');
      console.log('PatilAdminLogin set to:', localStorage.getItem('PatilAdminLogin'));
      
      // Navigate to admin dashboard
      navigate('/admindashboard');

    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div 
        className="card shadow-lg"
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '16px',
          border: 'none',
          overflow: 'hidden',
          animation: 'fadeInUp 0.5s ease-out',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div 
          style={{
            background: 'linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)',
            padding: '30px 30px 25px',
            textAlign: 'center'
          }}
        >
          <div 
            style={{
              width: '65px',
              height: '65px',
              backgroundColor: 'rgba(0, 212, 255, 0.12)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '32px',
              color: '#00D4FF',
              border: '2px solid rgba(0, 212, 255, 0.2)'
            }}
          >
            <FaUserShield />
          </div>
          <h2 style={{ 
            color: '#FFFFFF', 
            fontWeight: '700', 
            margin: 0, 
            fontSize: '22px',
            letterSpacing: '0.5px'
          }}>
            Login
          </h2>
          <p style={{ 
            color: '#94A3B8', 
            margin: '4px 0 0', 
            fontSize: '13px',
            fontWeight: '400'
          }}>
            Secure access to admin dashboard
          </p>
        </div>

        <div style={{ padding: '30px 30px 25px', backgroundColor: '#FFFFFF' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label 
                htmlFor="adminId"
                style={{
                  fontWeight: '600',
                  color: '#1A1A2E',
                  fontSize: '13px',
                  marginBottom: '6px',
                  display: 'block'
                }}
              >
                <AiOutlineUser style={{ marginRight: '6px', color: '#00D4FF' }} />
                Enter Admin ID
              </label>
              <div 
                className="input-group"
                style={{
                  border: errors.adminId ? '2px solid #FF6B35' : '2px solid #E2E8F0',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  backgroundColor: '#F8FAFC'
                }}
              >
                <span 
                  className="input-group-text"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#00D4FF',
                    padding: '0 0 0 12px',
                    fontSize: '15px'
                  }}
                >
                  <FaUser />
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="adminId"
                  name="adminId"
                  value={formData.adminId}
                  onChange={handleChange}
                  placeholder="Enter Admin ID"
                  disabled={isLoading}
                  style={{
                    border: 'none',
                    padding: '10px 12px',
                    fontSize: '14px',
                    outline: 'none',
                    boxShadow: 'none',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
              {errors.adminId && (
                <div 
                  style={{
                    color: '#FF6B35',
                    fontSize: '11px',
                    marginTop: '4px',
                    fontWeight: '500'
                  }}
                >
                  {errors.adminId}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label 
                htmlFor="password"
                style={{
                  fontWeight: '600',
                  color: '#1A1A2E',
                  fontSize: '13px',
                  marginBottom: '6px',
                  display: 'block'
                }}
              >
                <AiOutlineLock style={{ marginRight: '6px', color: '#00D4FF' }} />
                Enter password
              </label>
              <div 
                className="input-group"
                style={{
                  border: errors.password ? '2px solid #FF6B35' : '2px solid #E2E8F0',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  backgroundColor: '#F8FAFC'
                }}
              >
                <span 
                  className="input-group-text"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#00D4FF',
                    padding: '0 0 0 12px',
                    fontSize: '15px'
                  }}
                >
                  <FaLock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  disabled={isLoading}
                  style={{
                    border: 'none',
                    padding: '10px 12px',
                    fontSize: '14px',
                    outline: 'none',
                    boxShadow: 'none',
                    backgroundColor: 'transparent'
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    padding: '0 12px 0 0',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#00D4FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94A3B8';
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <div 
                  style={{
                    color: '#FF6B35',
                    fontSize: '11px',
                    marginTop: '4px',
                    fontWeight: '500'
                  }}
                >
                  {errors.password}
                </div>
              )}
            </div>

            {loginError && (
              <div 
                style={{
                  backgroundColor: '#FFF3F3',
                  color: '#FF6B35',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  marginBottom: '12px',
                  border: '1px solid #FFD6D6',
                  textAlign: 'center'
                }}
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="btn w-100"
              disabled={isLoading}
              style={{
                background: isLoading ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)' : 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                color: isLoading ? '#FFFFFF' : '#0A1628',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '700',
                fontSize: '15px',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '6px',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" style={{ marginRight: '8px' }}></span>
                  Logging in...
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  Login
                </>
              )}
            </button>
          </form>

          <div 
            style={{
              textAlign: 'center',
              marginTop: '18px',
              paddingTop: '16px',
              borderTop: '1px solid #E2E8F0'
            }}
          >
            <p style={{ 
              color: '#94A3B8', 
              fontSize: '12px', 
              margin: 0 
            }}>
              &copy; {new Date().getFullYear()} Admin Panel
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .form-control:focus {
            box-shadow: none !important;
          }
          
          .input-group:focus-within {
            border-color: #00D4FF !important;
            box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.12);
            background-color: #FFFFFF !important;
          }
          
          .input-group:focus-within .input-group-text {
            color: #00D4FF !important;
          }

          .spinner-border {
            width: 16px;
            height: 16px;
            border-width: 2px;
          }
        `}
      </style>
    </div>
  );
}