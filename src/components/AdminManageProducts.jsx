import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaSave,
  FaTimes,
  FaSearch,
  FaSpinner,
  FaRupeeSign,
  FaPercent,
  FaImage,
  FaPlus,
  FaUpload,
  FaCheckCircle,
  FaExclamationCircle,
  FaFilter
} from 'react-icons/fa';
import API_BASE_URL from './ApiConfig';

// How many product rows to render at a time. Keeps first paint fast even
// with hundreds of products / images - rest load in as the user scrolls.
const CHUNK_SIZE = 12;

export default function AdminManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // How many of the filtered products are currently rendered on screen
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const loadMoreRef = useRef(null);
  
  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    category: '',
    productName: '',
    description: '',
    price: '',
    discount: '',
    finalPrice: '',
    status: 'active'
  });

  // 3 images for editing
  const [editImages, setEditImages] = useState({
    productImage1: null,
    productImage2: null,
    productImage3: null,
  });
  const [editPreviews, setEditPreviews] = useState({
    productImage1: null,
    productImage2: null,
    productImage3: null,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ===== FIX: Auto-recalculate finalPrice in edit mode =====
  // Whenever price or discount changes while editing, recompute the final price.
  useEffect(() => {
    if (editingId === null) return;

    const price = parseFloat(editFormData.price);
    const discount = parseFloat(editFormData.discount);

    if (!isNaN(price) && price > 0) {
      let computed = price;
      if (!isNaN(discount) && discount > 0) {
        computed = price - (price * (discount / 100));
      }
      const formatted = computed.toFixed(2);
      // Only update if changed to avoid infinite loop
      if (formatted !== editFormData.finalPrice) {
        setEditFormData(prev => ({ ...prev, finalPrice: formatted }));
      }
    } else {
      if (editFormData.finalPrice !== '') {
        setEditFormData(prev => ({ ...prev, finalPrice: '' }));
      }
    }
  }, [editFormData.price, editFormData.discount, editingId]);

  const fetchProducts = async () => {
    setIsFetching(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      if (data.success) {
        const arr = Object.keys(data.data).map(key => ({
          id: key,
          ...data.data[key]
        }));
        // ===== Sort newest first =====
        arr.sort((a, b) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tB - tA;
        });
        // =============================
        setProducts(arr);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load products');
    } finally {
      setIsFetching(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      if (data.success) {
        const arr = Object.keys(data.data).map(key => ({
          id: key,
          ...data.data[key]
        }));
        setCategories(arr);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryName = (id) => {
    const c = categories.find(cat => cat.id === id);
    return c ? c.name : 'Unknown';
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Reset the visible chunk whenever the underlying result set changes,
  // so filtering/searching doesn't leave a huge stale render count behind.
  useEffect(() => {
    setVisibleCount(CHUNK_SIZE);
  }, [searchTerm, selectedCategory, products.length]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + CHUNK_SIZE, filteredProducts.length));
  }, [filteredProducts.length]);

  // Auto-load the next chunk as the sentinel scrolls into view, so long
  // lists page themselves in without the user having to click repeatedly.
  useEffect(() => {
    if (!hasMore) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, visibleProducts.length]);

  // Handle edit start
  const handleEditStart = (product) => {
    setEditingId(product.id);
    setEditFormData({
      category: product.category || '',
      productName: product.productName || '',
      description: product.description || '',
      price: product.price || '',
      discount: product.discount || '',
      finalPrice: product.finalPrice || '',
      status: product.status || 'active'
    });

    const existing = product.images || [];
    if (existing.length === 0 && product.imageUrl) {
      existing.push({ imageUrl: product.imageUrl, imageName: product.imageName });
    }

    setEditPreviews({
      productImage1: existing[0]?.imageUrl || null,
      productImage2: existing[1]?.imageUrl || null,
      productImage3: existing[2]?.imageUrl || null,
    });

    setEditImages({
      productImage1: null,
      productImage2: null,
      productImage3: null,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({
      category: '',
      productName: '',
      description: '',
      price: '',
      discount: '',
      finalPrice: '',
      status: 'active'
    });
    setEditImages({
      productImage1: null,
      productImage2: null,
      productImage3: null,
    });
    setEditPreviews({
      productImage1: null,
      productImage2: null,
      productImage3: null,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditImageUpload = (e, slot) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setEditImages(prev => ({ ...prev, [slot]: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditPreviews(prev => ({ ...prev, [slot]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProduct = async (productId) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const fd = new FormData();
      fd.append('category', editFormData.category);
      fd.append('productName', editFormData.productName);
      fd.append('description', editFormData.description || '');
      fd.append('price', editFormData.price);
      fd.append('discount', editFormData.discount || 0);
      fd.append('finalPrice', editFormData.finalPrice);
      fd.append('status', editFormData.status);

      if (editImages.productImage1) fd.append('productImage1', editImages.productImage1);
      if (editImages.productImage2) fd.append('productImage2', editImages.productImage2);
      if (editImages.productImage3) fd.append('productImage3', editImages.productImage3);

      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'PUT',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update product');

      if (data.success) {
        setSuccess('Product updated successfully!');
        await fetchProducts();
        setTimeout(() => {
          setSuccess('');
          handleEditCancel();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete');

      if (data.success) {
        setSuccess('Product deleted successfully!');
        await fetchProducts();
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProductStatus = async (product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      const fd = new FormData();
      fd.append('category', product.category);
      fd.append('productName', product.productName);
      fd.append('description', product.description || '');
      fd.append('price', product.price);
      fd.append('discount', product.discount || 0);
      fd.append('finalPrice', product.finalPrice);
      fd.append('status', newStatus);

      const res = await fetch(`${API_BASE_URL}/api/products/${product.id}`, {
        method: 'PUT',
        body: fd,
      });
      const data = await res.json();
      if (data.success) await fetchProducts();
    } catch (err) {
      console.error(err);
      setError('Failed to update product status');
    }
  };

  // Image upload box for edit mode - only "Change" option
  const EditImageBox = ({ slot, label }) => {
    const hasPreview = editPreviews[slot];
    return (
      <div>
        <label style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#0F172A',
          display: 'block',
          marginBottom: '6px'
        }}>
          {label}
        </label>
        {hasPreview ? (
          <div style={{
            border: '1.5px solid #CBD5E1',
            borderRadius: '8px',
            padding: '8px',
            backgroundColor: '#F8FAFC'
          }}>
            <img
              src={editPreviews[slot]}
              alt={label}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '6px'
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById(`edit-img-${slot}`).click()}
              style={{
                width: '100%',
                marginTop: '6px',
                backgroundColor: '#0099CC',
                color: '#FFFFFF',
                padding: '6px 8px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#007A99'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0099CC'}
            >
              <FaUpload size={10} /> Change
            </button>
          </div>
        ) : (
          <div
            onClick={() => document.getElementById(`edit-img-${slot}`).click()}
            style={{
              border: '2px dashed #CBD5E1',
              borderRadius: '8px',
              padding: '15px 10px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0099CC';
              e.currentTarget.style.backgroundColor = '#F0FDFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.backgroundColor = '#F8FAFC';
            }}
          >
            <FaUpload style={{ color: '#64748B', fontSize: '18px' }} />
            <p style={{ fontSize: '11px', color: '#475569', margin: '4px 0 0', fontWeight: '600' }}>
              Upload
            </p>
          </div>
        )}
        <input
          id={`edit-img-${slot}`}
          type="file"
          accept="image/*"
          onChange={(e) => handleEditImageUpload(e, slot)}
          style={{ display: 'none' }}
        />
      </div>
    );
  };

  // Product thumbnail row - images use native lazy loading so off-screen
  // rows don't fetch their images until they're about to be scrolled into view.
  const ProductThumbnails = ({ product }) => {
    const imgs = product.images || (product.imageUrl ? [{ imageUrl: product.imageUrl }] : []);
    const showImgs = imgs.slice(0, 3);
    if (showImgs.length === 0) {
      return (
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '10px',
          backgroundColor: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94A3B8',
          border: '1px solid #E2E8F0'
        }}>
          <FaImage size={24} />
        </div>
      );
    }
    return showImgs.map((img, idx) => (
      <div key={idx} style={{
        width: '70px',
        height: '70px',
        borderRadius: '10px',
        overflow: 'hidden',
        border: idx === 0 ? '2px solid #0099CC' : '1px solid #E2E8F0',
        boxShadow: idx === 0 ? '0 2px 8px rgba(0, 153, 204, 0.2)' : 'none',
        backgroundColor: '#F1F5F9'
      }}>
        <img
          src={img.imageUrl}
          alt={`${product.productName}-${idx}`}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    ));
  };

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
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(10, 22, 40, 0.15)',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
          <h2 style={{
            color: '#FFFFFF',
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            letterSpacing: '0.3px'
          }}>
            Manage Products
          </h2>
        </div>
        <button
          onClick={() => navigate('/add-products')}
          style={{
            background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
            color: '#0A1628',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
          }}
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Search & Filter */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 25px',
          marginBottom: '25px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid #CBD5E1',
              borderRadius: '10px',
              padding: '10px 14px',
              backgroundColor: '#FFFFFF',
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
              <FaSearch style={{ color: '#64748B', marginRight: '10px' }} />
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
            </div>
          </div>
          <div style={{ minWidth: '200px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid #CBD5E1',
              borderRadius: '10px',
              padding: '0 14px',
              backgroundColor: '#FFFFFF'
            }}>
              <FaFilter style={{ color: '#64748B', marginRight: '8px', fontSize: '12px' }} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: selectedCategory ? '#0F172A' : '#64748B',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{
            fontSize: '13px',
            color: '#0F172A',
            fontWeight: '600',
            backgroundColor: 'rgba(0, 153, 204, 0.08)',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(0, 153, 204, 0.2)'
          }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            color: '#B91C1C',
            padding: '14px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1.5px solid #FECACA',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaExclamationCircle />
            {error}
          </div>
        )}
        {success && (
          <div style={{
            backgroundColor: '#F0FDF4',
            color: '#166534',
            padding: '14px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1.5px solid #BBF7D0',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaCheckCircle />
            {success}
          </div>
        )}

        {/* Products */}
        {isFetching ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)'
          }}>
            <FaSpinner style={{ fontSize: '40px', color: '#0099CC', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#475569', marginTop: '15px', fontWeight: '600' }}>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 153, 204, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <FaImage style={{ fontSize: '36px', color: '#0099CC' }} />
            </div>
            <h3 style={{ color: '#0F172A', margin: '15px 0 8px', fontSize: '18px', fontWeight: '700' }}>
              No Products Found
            </h3>
            <p style={{ color: '#64748B', fontSize: '14px' }}>
              {searchTerm || selectedCategory ? 'Try adjusting your search or filter' : 'Start by adding your first product'}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                style={{
                  marginTop: '20px',
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '13px',
                  boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '20px',
                    border: editingId === product.id ? '2px solid #0099CC' : '1px solid #E2E8F0',
                    boxShadow: editingId === product.id 
                      ? '0 8px 25px rgba(0, 153, 204, 0.15)' 
                      : '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {editingId === product.id ? (
                    // ===== EDIT MODE =====
                    <div>
                      {/* Edit Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '20px',
                        paddingBottom: '14px',
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
                          Editing: {product.productName}
                        </h3>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                            Category <span style={{ color: '#EF4444' }}>*</span>
                          </label>
                          <select
                            name="category"
                            value={editFormData.category}
                            onChange={handleEditInputChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1.5px solid #CBD5E1',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#0F172A',
                              outline: 'none',
                              backgroundColor: '#FFFFFF',
                              cursor: 'pointer'
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
                            <option value="">Select category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                            Product Name <span style={{ color: '#EF4444' }}>*</span>
                          </label>
                          <input
                            type="text"
                            name="productName"
                            value={editFormData.productName}
                            onChange={handleEditInputChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1.5px solid #CBD5E1',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#0F172A',
                              outline: 'none',
                              backgroundColor: '#FFFFFF',
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
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                            Price <span style={{ color: '#EF4444' }}>*</span>
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={editFormData.price}
                            onChange={handleEditInputChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1.5px solid #CBD5E1',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#0F172A',
                              outline: 'none',
                              backgroundColor: '#FFFFFF',
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
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                            Discount (%)
                          </label>
                          <input
                            type="number"
                            name="discount"
                            value={editFormData.discount}
                            onChange={handleEditInputChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1.5px solid #CBD5E1',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#0F172A',
                              outline: 'none',
                              backgroundColor: '#FFFFFF',
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
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                            Status
                          </label>
                          <select
                            name="status"
                            value={editFormData.status}
                            onChange={handleEditInputChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1.5px solid #CBD5E1',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#0F172A',
                              outline: 'none',
                              backgroundColor: '#FFFFFF',
                              cursor: 'pointer'
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
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                            Final Price
                            <span style={{
                              marginLeft: '6px',
                              fontSize: '10px',
                              fontWeight: '500',
                              color: '#007A99',
                              backgroundColor: 'rgba(0, 153, 204, 0.1)',
                              padding: '2px 6px',
                              borderRadius: '8px'
                            }}>
                              auto-calculated
                            </span>
                          </label>
                          <input
                            type="text"
                            value={editFormData.finalPrice ? `₹ ${editFormData.finalPrice}` : '—'}
                            readOnly
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1.5px solid #BAE6FD',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none',
                              background: 'linear-gradient(135deg, #F0FDFF 0%, #E0F7FF 100%)',
                              color: '#0A1628',
                              fontWeight: '700',
                              boxSizing: 'border-box',
                              cursor: 'not-allowed'
                            }}
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                          Description
                          <span style={{
                            marginLeft: '6px',
                            fontSize: '10px',
                            fontWeight: '500',
                            color: '#64748B',
                            backgroundColor: '#F1F5F9',
                            padding: '2px 6px',
                            borderRadius: '8px'
                          }}>
                            Optional
                          </span>
                        </label>
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditInputChange}
                          rows={3}
                          placeholder="Enter product description (optional)"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#0F172A',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            backgroundColor: '#FFFFFF',
                            lineHeight: '1.5',
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

                      {/* Images */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A', display: 'block', marginBottom: '10px' }}>
                          Product Images
                          <span style={{
                            marginLeft: '6px',
                            fontSize: '10px',
                            fontWeight: '500',
                            color: '#64748B',
                            backgroundColor: '#F1F5F9',
                            padding: '2px 6px',
                            borderRadius: '8px'
                          }}>
                            Click "Change" to replace
                          </span>
                        </label>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '12px'
                        }}>
                          <EditImageBox slot="productImage1" label="Image 1" />
                          <EditImageBox slot="productImage2" label="Image 2" />
                          <EditImageBox slot="productImage3" label="Image 3" />
                        </div>
                      </div>

                      {/* Edit Actions */}
                      <div style={{
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'flex-end',
                        borderTop: '2px solid #F1F5F9',
                        paddingTop: '18px'
                      }}>
                        <button
                          onClick={handleEditCancel}
                          style={{
                            padding: '10px 22px',
                            backgroundColor: '#FFFFFF',
                            color: '#475569',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: '700',
                            fontSize: '13px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F1F5F9';
                            e.currentTarget.style.borderColor = '#94A3B8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#CBD5E1';
                          }}
                        >
                          <FaTimes /> Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateProduct(product.id)}
                          disabled={isLoading}
                          style={{
                            padding: '10px 22px',
                            background: isLoading 
                              ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)' 
                              : 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: '700',
                            fontSize: '13px',
                            boxShadow: isLoading ? 'none' : '0 4px 15px rgba(0, 212, 255, 0.3)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isLoading) {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isLoading) {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
                            }
                          }}
                        >
                          {isLoading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaSave />}
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // ===== VIEW MODE =====
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      {/* Image Thumbnails - lazy loaded */}
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <ProductThumbnails product={product} />
                      </div>

                      {/* Product Details */}
                      <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <h3 style={{
                            margin: 0,
                            fontSize: '17px',
                            fontWeight: '700',
                            color: '#0A1628',
                            letterSpacing: '-0.2px'
                          }}>
                            {product.productName}
                          </h3>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            backgroundColor: 'rgba(0, 153, 204, 0.08)',
                            color: '#007A99',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            border: '1px solid rgba(0, 153, 204, 0.25)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {getCategoryName(product.category)}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            backgroundColor: product.status === 'active' 
                              ? 'rgba(22, 101, 52, 0.08)' 
                              : 'rgba(255, 107, 53, 0.08)',
                            color: product.status === 'active' ? '#166534' : '#C2410C',
                            border: `1px solid ${product.status === 'active' ? 'rgba(22, 101, 52, 0.25)' : 'rgba(255, 107, 53, 0.25)'}`,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            ● {product.status || 'active'}
                          </span>
                        </div>

                        {product.description && (
                          <p style={{
                            margin: '0 0 10px 0',
                            fontSize: '13px',
                            color: '#334155',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {product.description}
                          </p>
                        )}

                        <div style={{
                          display: 'flex',
                          gap: '16px',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          paddingTop: '6px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{
                              fontSize: '11px',
                              color: '#64748B',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.3px'
                            }}>
                              Price:
                            </span>
                            <span style={{
                              fontSize: '15px',
                              fontWeight: '700',
                              color: '#0A1628'
                            }}>
                              <FaRupeeSign style={{ display: 'inline', marginRight: '2px', fontSize: '12px' }} />
                              {product.price}
                            </span>
                          </div>

                          {product.discount > 0 && (
                            <>
                              <span style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#C2410C',
                                backgroundColor: 'rgba(255, 107, 53, 0.08)',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 107, 53, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <FaPercent size={9} />
                                {product.discount}% OFF
                              </span>
                            </>
                          )}

                          <div style={{
                            padding: '4px 12px',
                            background: 'linear-gradient(135deg, #F0FDFF 0%, #E0F7FF 100%)',
                            borderRadius: '10px',
                            border: '1px solid rgba(0, 153, 204, 0.3)',
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '6px'
                          }}>
                            <span style={{
                              fontSize: '11px',
                              color: '#007A99',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.3px'
                            }}>
                              Final:
                            </span>
                            <span style={{
                              fontSize: '15px',
                              fontWeight: '700',
                              color: '#007A99'
                            }}>
                              ₹{product.finalPrice || product.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => toggleProductStatus(product)}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: product.status === 'active' ? '#FFF7ED' : '#F0FDF4',
                            color: product.status === 'active' ? '#C2410C' : '#166534',
                            border: `1.5px solid ${product.status === 'active' ? '#FED7AA' : '#BBF7D0'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '700',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = product.status === 'active' ? '#C2410C' : '#166534';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = product.status === 'active' ? '#FFF7ED' : '#F0FDF4';
                            e.currentTarget.style.color = product.status === 'active' ? '#C2410C' : '#166534';
                          }}
                        >
                          {product.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEditStart(product)}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: 'rgba(0, 153, 204, 0.08)',
                            color: '#007A99',
                            border: '1.5px solid rgba(0, 153, 204, 0.3)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '12px',
                            fontWeight: '700',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#0099CC';
                            e.currentTarget.style.color = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#0099CC';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 153, 204, 0.08)';
                            e.currentTarget.style.color = '#007A99';
                            e.currentTarget.style.borderColor = 'rgba(0, 153, 204, 0.3)';
                          }}
                        >
                          <FaEdit size={11} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.productName)}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: '#FEF2F2',
                            color: '#B91C1C',
                            border: '1.5px solid #FECACA',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '12px',
                            fontWeight: '700',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#B91C1C';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FEF2F2';
                            e.currentTarget.style.color = '#B91C1C';
                          }}
                        >
                          <FaTrash size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chunked loading: sentinel auto-loads next batch, with a manual
                fallback button for browsers/situations where the observer doesn't fire */}
            {hasMore && (
              <div
                ref={loadMoreRef}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '24px 0 8px'
                }}
              >
                <button
                  onClick={loadMore}
                  style={{
                    padding: '10px 26px',
                    backgroundColor: '#FFFFFF',
                    color: '#007A99',
                    border: '1.5px solid rgba(0, 153, 204, 0.35)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '13px',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0099CC';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#007A99';
                  }}
                >
                  Load more ({filteredProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
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
      `}</style>
    </div>
  );
}