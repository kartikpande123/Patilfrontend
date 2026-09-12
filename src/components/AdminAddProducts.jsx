import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaTrash,
  FaUpload,
  FaImage,
  FaPercent,
  FaRupeeSign,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle
} from 'react-icons/fa';
import API_BASE_URL from './ApiConfig';

// Description limits (whichever hits first blocks input)
const MAX_DESCRIPTION_WORDS = 50;
const MAX_DESCRIPTION_CHARS = 200;

export default function AdminAddProducts() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [descriptionWarning, setDescriptionWarning] = useState('');

  // Ref to the top of the form (used to scroll to top after successful submit)
  const formTopRef = useRef(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    category: '',
    productName: '',
    description: '',
    price: '',
    discount: '',
  });

  // Image states - 3 images
  const [images, setImages] = useState({
    productImage1: null,
    productImage2: null,
    productImage3: null,
  });
  const [imagePreviews, setImagePreviews] = useState({
    productImage1: null,
    productImage2: null,
    productImage3: null,
  });

  // Calculated fields
  const [finalPrice, setFinalPrice] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Calculate final price
  useEffect(() => {
    calculateFinalPrice();
  }, [formData.price, formData.discount]);

  // Fetch categories
  const fetchCategories = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      if (data.success) {
        const arr = Object.keys(data.data).map(key => ({
          id: key,
          ...data.data[key]
        }));
        setCategories(arr);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load categories');
    } finally {
      setIsFetching(false);
    }
  };

  // Count words in a string (split by whitespace, ignore empty tokens)
  const countWords = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for description — enforce char & word limits
    if (name === 'description') {
      // Check character limit first (simplest & strictest)
      if (value.length > MAX_DESCRIPTION_CHARS) {
        setDescriptionWarning(
          `Description is limited to ${MAX_DESCRIPTION_CHARS} characters.`
        );
        return; // reject the change
      }
      // Then check word limit
      const words = countWords(value);
      if (words > MAX_DESCRIPTION_WORDS) {
        setDescriptionWarning(
          `Description is limited to ${MAX_DESCRIPTION_WORDS} words.`
        );
        return; // reject the change
      }
      // All good — clear any warning
      setDescriptionWarning('');
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Handle image upload
  const handleImageUpload = (e, slot) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setImages(prev => ({ ...prev, [slot]: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(prev => ({ ...prev, [slot]: reader.result }));
    };
    reader.readAsDataURL(file);
    setError('');
  };

  // Remove image
  const handleRemoveImage = (slot) => {
    setImages(prev => ({ ...prev, [slot]: null }));
    setImagePreviews(prev => ({ ...prev, [slot]: null }));
  };

  // Calculate final price
  const calculateFinalPrice = () => {
    const price = parseFloat(formData.price);
    const discount = parseFloat(formData.discount);

    if (price && !isNaN(price)) {
      if (discount && !isNaN(discount) && discount > 0) {
        const discountedPrice = price - (price * (discount / 100));
        setFinalPrice(discountedPrice.toFixed(2));
      } else {
        setFinalPrice(price.toFixed(2));
      }
    } else {
      setFinalPrice('');
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      setError('Please select a category');
      return;
    }
    if (!formData.productName.trim()) {
      setError('Please enter product name');
      return;
    }
    if (!images.productImage1) {
      setError('At least the first product image is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    // Final safety checks for description
    if (formData.description.length > MAX_DESCRIPTION_CHARS) {
      setError(`Description must be ${MAX_DESCRIPTION_CHARS} characters or fewer`);
      return;
    }
    const descWords = countWords(formData.description);
    if (descWords > MAX_DESCRIPTION_WORDS) {
      setError(`Description must be ${MAX_DESCRIPTION_WORDS} words or fewer`);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const fd = new FormData();
      fd.append('category', formData.category);
      fd.append('productName', formData.productName.trim());
      fd.append('description', formData.description.trim());
      fd.append('price', formData.price);
      fd.append('discount', formData.discount || 0);
      fd.append('finalPrice', finalPrice);

      fd.append('productImage1', images.productImage1);
      if (images.productImage2) fd.append('productImage2', images.productImage2);
      if (images.productImage3) fd.append('productImage3', images.productImage3);

      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        body: fd,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      if (data.success) {
        setSuccess('Product added successfully!');

        // ===== Scroll to top of the form on success =====
        if (formTopRef.current) {
          formTopRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        // ================================================

        setTimeout(() => {
          resetForm();
          setSuccess('');
        }, 2000);
      } else {
        setError(data.message || 'Failed to add product');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while adding product');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      category: '',
      productName: '',
      description: '',
      price: '',
      discount: '',
    });
    setImages({
      productImage1: null,
      productImage2: null,
      productImage3: null,
    });
    setImagePreviews({
      productImage1: null,
      productImage2: null,
      productImage3: null,
    });
    setFinalPrice('');
    setDescriptionWarning('');
  };

  const getCategoryName = (id) => {
    const c = categories.find(cat => cat.id === id);
    return c ? c.name : '';
  };

  // ===== Word / Char counter styling helpers =====
  const currentChars = formData.description.length;
  const currentWords = countWords(formData.description);
  const charsNearLimit = currentChars >= MAX_DESCRIPTION_CHARS - 30;
  const wordsNearLimit = currentWords >= MAX_DESCRIPTION_WORDS - 5;
  const charsOver = currentChars > MAX_DESCRIPTION_CHARS;
  const wordsOver = currentWords > MAX_DESCRIPTION_WORDS;

  const charCounterColor = charsOver
    ? '#EF4444'
    : charsNearLimit
      ? '#F59E0B'
      : '#64748B';

  const wordCounterColor = wordsOver
    ? '#EF4444'
    : wordsNearLimit
      ? '#F59E0B'
      : '#64748B';

  // Image upload box component
  const ImageUploadBox = ({ slot, label, required }) => (
    <div>
      <label style={{
        fontWeight: '600',
        color: '#0F172A',
        fontSize: '13px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {label}
        {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>

      {!imagePreviews[slot] ? (
        <div
          style={{
            border: error && required && !images[slot] 
              ? '2px dashed #EF4444' 
              : '2px dashed #CBD5E1',
            borderRadius: '12px',
            padding: '25px 15px',
            textAlign: 'center',
            backgroundColor: '#F1F5F9',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: isLoading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.borderColor = '#0099CC';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && !error) {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.backgroundColor = '#F1F5F9';
            }
          }}
          onClick={() => {
            if (!isLoading) document.getElementById(`img-${slot}`).click();
          }}
        >
          <div style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 153, 204, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px',
            color: '#0099CC',
            fontSize: '20px'
          }}>
            <FaUpload />
          </div>
          <p style={{ fontSize: '13px', color: '#334155', margin: 0, fontWeight: '600' }}>
            Click to upload
          </p>
          <p style={{ fontSize: '11px', color: '#64748B', margin: '3px 0 0' }}>
            PNG, JPG • Max 5MB
          </p>
          <input
            id={`img-${slot}`}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, slot)}
            disabled={isLoading}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div style={{
          border: '2px solid #0099CC',
          borderRadius: '12px',
          padding: '10px',
          backgroundColor: '#F8FAFC',
          position: 'relative'
        }}>
          <img
            src={imagePreviews[slot]}
            alt={label}
            style={{
              width: '100%',
              height: '110px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(slot)}
            disabled={isLoading}
            style={{
              marginTop: '8px',
              width: '100%',
              backgroundColor: '#FEF2F2',
              color: '#EF4444',
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #FECACA',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#EF4444';
                e.currentTarget.style.color = '#FFFFFF';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#FEF2F2';
                e.currentTarget.style.color = '#EF4444';
              }
            }}
          >
            <FaTrash size={10} /> Remove
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)',
        padding: '18px 30px',
        margin: '-20px -20px 30px -20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 4px 20px rgba(10, 22, 40, 0.15)'
      }}>
        <button
          onClick={() => navigate('/admindashboard')}
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.15)';
            e.currentTarget.style.borderColor = '#00D4FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
        >
          <FaArrowLeft /> Back
        </button>
        <div style={{
          width: '1px',
          height: '28px',
          backgroundColor: 'rgba(255,255,255,0.15)'
        }} />
        <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '0.3px' }}>
          Add New Product
        </h2>
      </div>

      <div ref={formTopRef} style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Info Banner */}
        <div style={{
          backgroundColor: 'rgba(0, 153, 204, 0.08)',
          border: '1px solid rgba(0, 153, 204, 0.25)',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FaInfoCircle style={{ color: '#0099CC', fontSize: '18px', flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '13px', color: '#0F172A', lineHeight: '1.5' }}>
            Fill in the product details below. Fields marked with <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span> are required.
            The first image is mandatory; the other two are optional.
            Description is limited to <strong>{MAX_DESCRIPTION_CHARS} characters</strong> / <strong>{MAX_DESCRIPTION_WORDS} words</strong>.
          </p>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '35px',
          boxShadow: '0 4px 25px rgba(15, 23, 42, 0.06)',
          border: '1px solid #E2E8F0'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Section: Basic Information */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '2px solid #F1F5F9'
              }}>
                <div style={{
                  width: '4px',
                  height: '20px',
                  backgroundColor: '#0099CC',
                  borderRadius: '2px'
                }} />
                <h3 style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#0F172A',
                  letterSpacing: '0.3px'
                }}>
                  Basic Information
                </h3>
              </div>

              {/* Category */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontWeight: '600',
                  color: '#0F172A',
                  fontSize: '13px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  Select Category <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={handleInputChange}
                  name="category"
                  disabled={isFetching || isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: formData.category ? '#0F172A' : '#64748B',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    cursor: isFetching ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0099CC';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 153, 204, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">{isFetching ? 'Loading categories...' : 'Select a category'}</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {formData.category && (
                  <div style={{
                    marginTop: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#0099CC',
                    backgroundColor: 'rgba(0, 153, 204, 0.08)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}>
                    <FaCheckCircle size={11} />
                    Selected: {getCategoryName(formData.category)}
                  </div>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label style={{
                  fontWeight: '600',
                  color: '#0F172A',
                  fontSize: '13px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  Product Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="e.g. HCG123 Camera Lock"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0F172A',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0099CC';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 153, 204, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Section: Description */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '2px solid #F1F5F9'
              }}>
                <div style={{
                  width: '4px',
                  height: '20px',
                  backgroundColor: '#0099CC',
                  borderRadius: '2px'
                }} />
                <h3 style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#0F172A',
                  letterSpacing: '0.3px'
                }}>
                  Description
                  <span style={{
                    marginLeft: '8px',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#64748B',
                    backgroundColor: '#F1F5F9',
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>
                    Optional • Max {MAX_DESCRIPTION_CHARS} chars / {MAX_DESCRIPTION_WORDS} words
                  </span>
                </h3>
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder={`Provide a short product description (max ${MAX_DESCRIPTION_CHARS} characters)...`}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: descriptionWarning
                    ? '1.5px solid #EF4444'
                    : '1.5px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#0F172A',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                  lineHeight: '1.5',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (!descriptionWarning) {
                    e.currentTarget.style.borderColor = '#0099CC';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 153, 204, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (!descriptionWarning) {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                  }
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />

              {/* Counter + warning row */}
              <div style={{
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {/* Counters */}
                <div style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  {/* Characters counter */}
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: charCounterColor
                  }}>
                    {currentChars} / {MAX_DESCRIPTION_CHARS} characters
                  </span>

                  <span style={{ color: '#CBD5E1', fontSize: '12px' }}>•</span>

                  {/* Words counter */}
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: wordCounterColor
                  }}>
                    {currentWords} / {MAX_DESCRIPTION_WORDS} words
                  </span>
                </div>

                {/* Warning message (shows only when user typed too much) */}
                {descriptionWarning && (
                  <div style={{
                    fontSize: '12px',
                    color: '#EF4444',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <FaExclamationCircle style={{ fontSize: '11px' }} />
                    {descriptionWarning}
                  </div>
                )}
              </div>
            </div>

            {/* Section: Images */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '2px solid #F1F5F9'
              }}>
                <div style={{
                  width: '4px',
                  height: '20px',
                  backgroundColor: '#0099CC',
                  borderRadius: '2px'
                }} />
                <h3 style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#0F172A',
                  letterSpacing: '0.3px'
                }}>
                  Product Images
                </h3>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#64748B',
                  backgroundColor: '#F1F5F9',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  1 required, 2 optional
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px'
              }}>
                <ImageUploadBox slot="productImage1" label="Image 1" required={true} />
                <ImageUploadBox slot="productImage2" label="Image 2" required={false} />
                <ImageUploadBox slot="productImage3" label="Image 3" required={false} />
              </div>
            </div>

            {/* Section: Pricing */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '2px solid #F1F5F9'
              }}>
                <div style={{
                  width: '4px',
                  height: '20px',
                  backgroundColor: '#0099CC',
                  borderRadius: '2px'
                }} />
                <h3 style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#0F172A',
                  letterSpacing: '0.3px'
                }}>
                  Pricing
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px'
              }}>
                <div>
                  <label style={{
                    fontWeight: '600',
                    color: '#0F172A',
                    fontSize: '13px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <FaRupeeSign style={{ color: '#0099CC', fontSize: '12px' }} />
                    Price <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#0F172A',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0099CC';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 153, 204, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    fontWeight: '600',
                    color: '#0F172A',
                    fontSize: '13px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <FaPercent style={{ color: '#0099CC', fontSize: '12px' }} />
                    Discount
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#64748B',
                      marginLeft: '4px'
                    }}>
                      (optional)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="0"
                    min="0"
                    max="100"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#0F172A',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0099CC';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 153, 204, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Final Price Display */}
            {finalPrice && (
              <div style={{
                background: 'linear-gradient(135deg, #F0FDFF 0%, #E0F7FF 100%)',
                border: '1.5px solid #00D4FF',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '25px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 15px rgba(0, 212, 255, 0.1)'
              }}>
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#475569',
                    margin: 0,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Final Price
                  </p>
                  <p style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#0A1628',
                    margin: '6px 0 0 0',
                    letterSpacing: '-0.5px'
                  }}>
                    ₹ {finalPrice}
                  </p>
                </div>
                {formData.discount && parseFloat(formData.discount) > 0 && (
                  <div style={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #E85A24 100%)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                    letterSpacing: '0.5px'
                  }}>
                    {formData.discount}% OFF
                  </div>
                )}
              </div>
            )}

            {/* Error / Success Messages */}
            {error && (
              <div style={{
                backgroundColor: '#FEF2F2',
                color: '#B91C1C',
                padding: '14px 16px',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '1.5px solid #FECACA',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaExclamationCircle style={{ fontSize: '16px', flexShrink: 0 }} />
                {error}
              </div>
            )}
            {success && (
              <div style={{
                backgroundColor: '#F0FDF4',
                color: '#166534',
                padding: '14px 16px',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '1.5px solid #BBF7D0',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaCheckCircle style={{ fontSize: '16px', flexShrink: 0 }} />
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading 
                  ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)' 
                  : 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                color: isLoading ? '#FFFFFF' : '#0A1628',
                padding: '16px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: '700',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px',
                boxShadow: isLoading ? 'none' : '0 6px 20px rgba(0, 212, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.3)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                  Adding Product...
                </>
              ) : (
                <>
                  <FaSave /> Add Product
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        select option {
          color: #0F172A;
          background: #FFFFFF;
          padding: 8px;
        }
        select:disabled {
          background-color: #F1F5F9;
          color: #94A3B8;
        }
      `}</style>
    </div>
  );
}