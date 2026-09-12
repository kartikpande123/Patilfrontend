import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaArrowLeft,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import API_BASE_URL from './ApiConfig';

export default function AdminCategory() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to fetch all categories
  const fetchCategories = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      if (data.success) {
        // Convert object to array with keys
        const categoriesArray = Object.keys(data.data).map(key => ({
          id: key,
          ...data.data[key]
        }));
        setCategories(categoriesArray);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // Function to add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create category object
      const categoryData = {
        name: categoryName.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // POST API call to store category
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const data = await response.json();

      if (data.success) {
        setSuccess('Category added successfully!');
        setCategoryName('');
        // Refresh categories list
        fetchCategories();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(data.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setError('An error occurred while adding category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to start editing
  const handleEditStart = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  // Function to cancel editing
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Function to update category
  const handleUpdateCategory = async (categoryId) => {
    if (!editingName.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        name: editingName.trim(),
        updatedAt: new Date().toISOString()
      };

      // PUT API call to update category
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      const data = await response.json();

      if (data.success) {
        setSuccess('Category updated successfully!');
        setEditingId(null);
        setEditingName('');
        // Refresh categories list
        fetchCategories();
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(data.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setError('An error occurred while updating category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      const data = await response.json();
      if (data.success) {
        setSuccess('Category deleted successfully!');
        fetchCategories();
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#0A1628',
        padding: '15px 30px',
        margin: '-20px -20px 30px -20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => navigate('/admindashboard')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#00D4FF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            <FaArrowLeft />
            Back
          </button>
          <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '20px', fontWeight: '700' }}>
            Manage Categories
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Add Category Form */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #E2E8F0',
          marginBottom: '30px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#0A1628',
            margin: '0 0 20px 0'
          }}>
            Add New Category
          </h3>

          <form onSubmit={handleAddCategory}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  fontWeight: '600',
                  color: '#1A1A2E',
                  fontSize: '13px',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: error ? '2px solid #FF6B35' : '2px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#F8FAFC'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00D4FF';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    if (!error) {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }
                  }}
                />
                {error && (
                  <div style={{
                    color: '#FF6B35',
                    fontSize: '12px',
                    marginTop: '5px'
                  }}>
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#94A3B8' : '#00D4FF',
                  color: '#0A1628',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  opacity: isLoading ? 0.7 : 1,
                  minWidth: '120px',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
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
                    <span className="spinner-border spinner-border-sm" style={{ marginRight: '5px' }}></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Add Category
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Success Message */}
          {success && (
            <div style={{
              backgroundColor: '#D4EDDA',
              color: '#155724',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '15px',
              border: '1px solid #C3E6CB'
            }}>
              {success}
            </div>
          )}
        </div>

        {/* Categories List */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #E2E8F0'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#0A1628',
            margin: '0 0 20px 0'
          }}>
            All Categories
            <span style={{
              backgroundColor: '#E2E8F0',
              color: '#64748B',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '14px',
              marginLeft: '10px',
              fontWeight: '600'
            }}>
              {categories.length}
            </span>
          </h3>

          {isFetching ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div className="spinner-border" style={{ color: '#00D4FF' }}></div>
              <p style={{ color: '#64748B', marginTop: '10px' }}>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#94A3B8'
            }}>
              <p style={{ fontSize: '16px', margin: 0 }}>
                No categories added yet. Add your first category above!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 20px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00D4FF';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                >
                  {editingId === category.id ? (
                    // Edit Mode
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '2px solid #00D4FF',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: '#FFFFFF'
                        }}
                        autoFocus
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleUpdateCategory(category.id)}
                          disabled={isLoading}
                          style={{
                            backgroundColor: '#00D4FF',
                            color: '#0A1628',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '13px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            opacity: isLoading ? 0.7 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!isLoading) {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isLoading) {
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          <FaSave size={12} />
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          style={{
                            backgroundColor: '#E2E8F0',
                            color: '#64748B',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '13px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF6B35';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#E2E8F0';
                            e.currentTarget.style.color = '#64748B';
                          }}
                        >
                          <FaTimes size={12} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#0A1628'
                        }}>
                          {category.name}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: '#94A3B8',
                          backgroundColor: '#E2E8F0',
                          padding: '2px 8px',
                          borderRadius: '10px'
                        }}>
                          ID: {category.id.substring(0, 8)}...
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditStart(category)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #00D4FF',
                            color: '#00D4FF',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#00D4FF';
                            e.currentTarget.style.color = '#0A1628';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#00D4FF';
                          }}
                        >
                          <FaEdit size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #FF6B35',
                            color: '#FF6B35',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF6B35';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#FF6B35';
                          }}
                        >
                          <FaTrash size={12} />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS for spinner */}
      <style>
        {`
          .spinner-border {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid currentColor;
            border-right-color: transparent;
            border-radius: 50%;
            animation: spinner-border 0.75s linear infinite;
          }
          
          @keyframes spinner-border {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}