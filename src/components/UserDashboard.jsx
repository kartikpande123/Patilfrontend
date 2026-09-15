import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaRupeeSign, 
  FaPercent, 
  FaSpinner, 
  FaTimes, 
  FaCheckCircle,
  FaPhoneAlt,
  FaUser,
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaWhatsapp
} from 'react-icons/fa';
import Header from './Header';
import API_BASE_URL from './ApiConfig';
import Footer from './Footer';

export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Buy Now popup state
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track active image index for each product card
  const [activeImageIndex, setActiveImageIndex] = useState({});
  // Track active image index for popup gallery
  const [popupImageIndex, setPopupImageIndex] = useState(0);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsFetching(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      if (data.success) {
        // Show ALL products (active + inactive). No filtering by status.
        const arr = Object.keys(data.data)
          .map(key => ({ id: key, ...data.data[key] }));
        setProducts(arr);
        const initial = {};
        arr.forEach(p => { initial[p.id] = 0; });
        setActiveImageIndex(initial);
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
    return c ? c.name : '';
  };

  const getProductImages = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images.map(img => img.imageUrl);
    }
    if (product.imageUrl) return [product.imageUrl];
    return [];
  };

  // Helper: is this product out of stock (deactivated)?
  const isOutOfStock = (product) => {
    const status = product.status || 'active';
    return status !== 'active';
  };

  // ===== FILTER + SORT (newest first) =====
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(p =>
        (p.productName || '').toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    result.sort((a, b) => {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tB - tA;
    });

    return result;
  }, [products, searchTerm, selectedCategory]);

  const handleNextImage = (e, product) => {
    e.stopPropagation();
    const imgs = getProductImages(product);
    if (imgs.length <= 1) return;
    setActiveImageIndex(prev => {
      const current = prev[product.id] || 0;
      const next = (current + 1) % imgs.length;
      return { ...prev, [product.id]: next };
    });
  };

  const handlePrevImage = (e, product) => {
    e.stopPropagation();
    const imgs = getProductImages(product);
    if (imgs.length <= 1) return;
    setActiveImageIndex(prev => {
      const current = prev[product.id] || 0;
      const prevIdx = (current - 1 + imgs.length) % imgs.length;
      return { ...prev, [product.id]: prevIdx };
    });
  };

  const handlePopupNextImage = () => {
    if (!selectedProduct) return;
    const imgs = getProductImages(selectedProduct);
    if (imgs.length <= 1) return;
    setPopupImageIndex(prev => (prev + 1) % imgs.length);
  };

  const handlePopupPrevImage = () => {
    if (!selectedProduct) return;
    const imgs = getProductImages(selectedProduct);
    if (imgs.length <= 1) return;
    setPopupImageIndex(prev => (prev - 1 + imgs.length) % imgs.length);
  };

  const handleBuyNow = (product) => {
    // Guard: don't open popup for out-of-stock products
    if (isOutOfStock(product)) return;
    setSelectedProduct(product);
    setShowPopup(true);
    setPopupImageIndex(0);
    setCustomerName('');
    setCustomerPhone('');
    setFormError('');
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
    setPopupImageIndex(0);
    setCustomerName('');
    setCustomerPhone('');
    setFormError('');
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('Please enter your name');
      return;
    }
    if (!customerPhone.trim()) {
      setFormError('Please enter your phone number');
      return;
    }
    if (!/^[0-9]{10}$/.test(customerPhone.trim())) {
      setFormError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const images = getProductImages(selectedProduct);
      const primaryImage = images.length > 0 ? images[0] : '';

      const payload = {
        productId: selectedProduct.id,
        productName: selectedProduct.productName,
        productCategory: selectedProduct.category || '',
        productPrice: selectedProduct.price || 0,
        productFinalPrice: selectedProduct.finalPrice || selectedProduct.price || 0,
        productDiscount: selectedProduct.discount || 0,
        productImageUrl: primaryImage,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim()
      };

      const res = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit inquiry');
      }

      setIsSubmitted(true);

    } catch (err) {
      console.error('Inquiry submit error:', err);
      setFormError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Header />

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

        {/* ===== Section Heading ===== */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '28px'
        }}>
          <div style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #EAF6FB 0%, #DDF1FA 100%)',
            border: '2px solid #0099CC',
            borderRadius: '16px',
            padding: '14px 42px',
            boxShadow: '0 8px 24px rgba(0, 153, 204, 0.18)',
            position: 'relative'
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#0099CC',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}>
              Explore Our Range
            </span>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#0A1628',
              margin: 0,
              letterSpacing: '-0.3px',
              textAlign: 'center'
            }} id="our-products">
              Our Products
            </h2>
            <div style={{
              width: '60px',
              height: '4px',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
              marginTop: '10px'
            }} />
          </div>
        </div>

        {/* ===== Search + Filter Bar ===== */}
        <div style={{
          backgroundColor: '#EAF6FB',
          borderRadius: '14px',
          padding: '16px 18px',
          marginBottom: '24px',
          border: '1px solid #CDE9F2',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Search Input */}
          <div style={{
            flex: 1,
            minWidth: isMobile ? '100%' : '260px',
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid #B7DCE9',
            borderRadius: '10px',
            padding: '0 14px',
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease'
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = '#0099CC';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 153, 204, 0.1)';
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = '#B7DCE9';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <FaSearch style={{ color: '#64748B', fontSize: '14px', marginRight: '10px' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: '500',
                color: '#0F172A',
                padding: '12px 0',
                width: '100%'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  fontSize: '14px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div style={{
            minWidth: isMobile ? '100%' : '220px',
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid #B7DCE9',
            borderRadius: '10px',
            padding: '0 14px',
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease'
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = '#0099CC';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 153, 204, 0.1)';
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = '#B7DCE9';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: '600',
                color: selectedCategory ? '#0F172A' : '#64748B',
                padding: '12px 0',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Result count */}
          <div style={{
            fontSize: '13px',
            color: '#0F172A',
            fontWeight: '600',
            backgroundColor: 'rgba(0, 153, 204, 0.08)',
            padding: '8px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(0, 153, 204, 0.2)',
            whiteSpace: 'nowrap',
            marginLeft: 'auto'
          }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            color: '#B91C1C',
            padding: '14px 18px',
            borderRadius: '10px',
            marginBottom: '24px',
            border: '1.5px solid #FECACA',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        {isFetching ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <FaSpinner style={{ fontSize: '40px', color: '#0099CC', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748B', marginTop: '16px', fontSize: '15px', fontWeight: '600' }}>
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '70px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 153, 204, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FaSearch style={{ fontSize: '28px', color: '#0099CC' }} />
            </div>
            <p style={{ color: '#0F172A', fontSize: '16px', margin: '0 0 6px', fontWeight: '700' }}>
              No products found
            </p>
            <p style={{ color: '#64748B', fontSize: '14px', margin: 0, fontWeight: '500' }}>
              {(searchTerm || selectedCategory)
                ? 'Try adjusting your search or category filter'
                : 'Please check back later'}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                style={{
                  marginTop: '20px',
                  padding: '10px 22px',
                  background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {filteredProducts.map((product) => {
              const images = getProductImages(product);
              const currentIdx = activeImageIndex[product.id] || 0;
              const currentImg = images[currentIdx];
              const hasDiscount = product.discount > 0;
              const hasMultipleImages = images.length > 1;
              const outOfStock = isOutOfStock(product);

              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: `2px solid ${outOfStock ? '#FCA5A5' : '#D6E4F0'}`,
                    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: outOfStock ? 0.9 : 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(15, 23, 42, 0.14)';
                    e.currentTarget.style.borderColor = outOfStock ? '#EF4444' : '#0099CC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(15, 23, 42, 0.08)';
                    e.currentTarget.style.borderColor = outOfStock ? '#FCA5A5' : '#D6E4F0';
                  }}
                >
                  {/* Image Carousel */}
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#F1F5F9',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {currentImg ? (
                      <img
                        src={currentImg}
                        alt={product.productName}
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          backgroundColor: '#F1F5F9',
                          transition: 'transform 0.5s ease',
                          filter: outOfStock ? 'grayscale(0.6) brightness(0.95)' : 'none'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94A3B8',
                        fontSize: '40px'
                      }}>
                        📷
                      </div>
                    )}

                    {hasMultipleImages && (
                      <button
                        onClick={(e) => handlePrevImage(e, product)}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '10px',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(15, 23, 42, 0.65)',
                          color: '#FFFFFF',
                          border: 'none',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '12px',
                          transition: 'all 0.2s ease',
                          zIndex: 2,
                          backdropFilter: 'blur(4px)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0099CC';
                          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.65)';
                          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                        }}
                        aria-label="Previous image"
                      >
                        <FaChevronLeft />
                      </button>
                    )}

                    {hasMultipleImages && (
                      <button
                        onClick={(e) => handleNextImage(e, product)}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          right: '10px',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(15, 23, 42, 0.65)',
                          color: '#FFFFFF',
                          border: 'none',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '12px',
                          transition: 'all 0.2s ease',
                          zIndex: 2,
                          backdropFilter: 'blur(4px)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0099CC';
                          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.65)';
                          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                        }}
                        aria-label="Next image"
                      >
                        <FaChevronRight />
                      </button>
                    )}

                    {hasMultipleImages && (
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '5px',
                        backgroundColor: 'rgba(15, 23, 42, 0.5)',
                        padding: '5px 9px',
                        borderRadius: '20px',
                        backdropFilter: 'blur(4px)',
                        zIndex: 2
                      }}>
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageIndex(prev => ({ ...prev, [product.id]: idx }));
                            }}
                            style={{
                              width: idx === currentIdx ? '16px' : '6px',
                              height: '6px',
                              borderRadius: '3px',
                              border: 'none',
                              backgroundColor: idx === currentIdx ? '#00D4FF' : 'rgba(255, 255, 255, 0.5)',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              padding: 0
                            }}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Discount badge (only if in stock and has discount) */}
                    {hasDiscount && !outOfStock && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'linear-gradient(135deg, #FF6B35 0%, #E85A24 100%)',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.35)',
                        zIndex: 2
                      }}>
                      {product.discount} % OFF
                      </div>
                    )}

                    {/* OUT OF STOCK badge (replaces discount badge position) */}
                    {outOfStock && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                        color: '#FFFFFF',
                        padding: '5px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '800',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                        zIndex: 3
                      }}>
                        Out of Stock
                      </div>
                    )}

                    {hasMultipleImages && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(15, 23, 42, 0.65)',
                        color: '#FFFFFF',
                        padding: '3px 9px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backdropFilter: 'blur(4px)',
                        zIndex: 2
                      }}>
                        {currentIdx + 1}/{images.length}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{
                    padding: '14px 16px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}>
                    {getCategoryName(product.category) && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: '#0099CC',
                        backgroundColor: 'rgba(0, 153, 204, 0.08)',
                        padding: '3px 9px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 153, 204, 0.2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        alignSelf: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        {getCategoryName(product.category)}
                      </span>
                    )}

                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#0A1628',
                      margin: '0 0 6px 0',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.productName}
                    </h3>

                    {product.description && (
                      <p style={{
                        fontSize: '12px',
                        color: '#64748B',
                        margin: '0 0 12px 0',
                        lineHeight: '1.45',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '34px'
                      }}>
                        {product.description}
                      </p>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px',
                      marginTop: 'auto',
                      marginBottom: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: outOfStock ? '#94A3B8' : '#0A1628',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <FaRupeeSign size={14} style={{ marginRight: '2px' }} />
                        {product.finalPrice || product.price}
                      </span>
                      {hasDiscount && (
                        <span style={{
                          fontSize: '13px',
                          color: '#94A3B8',
                          textDecoration: 'line-through',
                          fontWeight: '600'
                        }}>
                          ₹{product.price}
                        </span>
                      )}
                    </div>

                    {/* Buy Now button — disabled when out of stock */}
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={outOfStock}
                      aria-disabled={outOfStock}
                      style={{
                        width: '100%',
                        background: outOfStock
                          ? 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)'
                          : 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                        color: '#FFFFFF',
                        padding: '11px',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: outOfStock ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '7px',
                        boxShadow: outOfStock ? 'none' : '0 4px 15px rgba(0, 212, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.3px',
                        opacity: outOfStock ? 0.85 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!outOfStock) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!outOfStock) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
                        }
                      }}
                    >
                      <FaShoppingCart /> {outOfStock ? 'Out of Stock' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== Floating WhatsApp + Call Buttons (bottom-right) ===== */}
      <div style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        zIndex: 1500
      }}>
        {/* WhatsApp button */}
        <a
          href="https://wa.me/919353368514"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          className="float-whatsapp-btn"
          style={{
            position: 'relative',
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            textDecoration: 'none',
            boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            animation: 'floatPulseGreen 2.4s ease-in-out infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(37, 211, 102, 0.65)';
            e.currentTarget.style.animation = 'none';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.45)';
            e.currentTarget.style.animation = 'floatPulseGreen 2.4s ease-in-out infinite';
          }}
        >
          <FaWhatsapp />
          <span className="float-ring whatsapp-ring" aria-hidden="true" />
        </a>

        {/* Call button */}
        <a
          href="tel:919353368514"
          aria-label="Call us"
          title="Call 919353368514"
          className="float-call-btn"
          style={{
            position: 'relative',
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF9F43 0%, #E8590C 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            textDecoration: 'none',
            boxShadow: '0 6px 20px rgba(232, 89, 12, 0.45)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            animation: 'floatPulseOrange 2.4s ease-in-out infinite 0.4s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(232, 89, 12, 0.7)';
            e.currentTarget.style.animation = 'none';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(232, 89, 12, 0.45)';
            e.currentTarget.style.animation = 'floatPulseOrange 2.4s ease-in-out infinite 0.4s';
          }}
        >
          <FaPhoneAlt />
          <span className="float-ring call-ring" aria-hidden="true" />
        </a>
      </div>

      {/* Buy Now Popup */}
      {showPopup && selectedProduct && (
        <div
          onClick={handleClosePopup}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(10, 22, 40, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px',
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.2s ease-out',
            overflowY: 'auto'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '0',
              maxWidth: isMobile ? '560px' : '960px',
              width: '100%',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(10, 22, 40, 0.35)',
              animation: 'popIn 0.3s ease-out',
              maxHeight: '92vh',
              overflowY: 'auto',
              margin: 'auto'
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClosePopup}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0F172A',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                zIndex: 10,
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FF6B35';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = '#0F172A';
              }}
            >
              <FaTimes />
            </button>

            {!isSubmitted ? (
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                minHeight: isMobile ? 'auto' : '560px'
              }}>
                {/* ===== LEFT SIDE: Images + Details ===== */}
                <div style={{
                  flex: isMobile ? 'none' : '1 1 55%',
                  minWidth: 0,
                  backgroundColor: '#F8FAFC',
                  borderRadius: isMobile ? '20px 20px 0 0' : '20px 0 0 20px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Image Gallery */}
                  {(() => {
                    const images = getProductImages(selectedProduct);
                    const hasMultiple = images.length > 1;
                    const currentImg = images[popupImageIndex];

                    return (
                      <div style={{
                        width: '100%',
                        height: isMobile ? '260px' : '340px',
                        backgroundColor: '#F1F5F9',
                        borderRadius: isMobile ? '20px 20px 0 0' : '20px 0 0 0',
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0
                      }}>
                        {currentImg ? (
                          <img
                            src={currentImg}
                            alt={selectedProduct.productName}
                            decoding="async"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#94A3B8',
                            fontSize: '48px'
                          }}>
                            📷
                          </div>
                        )}

                        {hasMultiple && (
                          <button
                            onClick={handlePopupPrevImage}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '14px',
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(15, 23, 42, 0.65)',
                              color: '#FFFFFF',
                              border: 'none',
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '14px',
                              backdropFilter: 'blur(4px)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#0099CC';
                              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.65)';
                              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            }}
                            aria-label="Previous image"
                          >
                            <FaChevronLeft />
                          </button>
                        )}

                        {hasMultiple && (
                          <button
                            onClick={handlePopupNextImage}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              right: '14px',
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(15, 23, 42, 0.65)',
                              color: '#FFFFFF',
                              border: 'none',
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '14px',
                              backdropFilter: 'blur(4px)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#0099CC';
                              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.65)';
                              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            }}
                            aria-label="Next image"
                          >
                            <FaChevronRight />
                          </button>
                        )}

                        {hasMultiple && (
                          <div style={{
                            position: 'absolute',
                            bottom: '14px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '6px',
                            backgroundColor: 'rgba(15, 23, 42, 0.55)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(4px)'
                          }}>
                            {images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setPopupImageIndex(idx)}
                                style={{
                                  width: idx === popupImageIndex ? '20px' : '7px',
                                  height: '7px',
                                  borderRadius: '4px',
                                  border: 'none',
                                  backgroundColor: idx === popupImageIndex ? '#00D4FF' : 'rgba(255, 255, 255, 0.5)',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  padding: 0
                                }}
                                aria-label={`Go to image ${idx + 1}`}
                              />
                            ))}
                          </div>
                        )}

                        {hasMultiple && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            backgroundColor: 'rgba(15, 23, 42, 0.65)',
                            color: '#FFFFFF',
                            padding: '5px 12px',
                            borderRadius: '10px',
                            fontSize: '12px',
                            fontWeight: '700',
                            backdropFilter: 'blur(4px)'
                          }}>
                            {popupImageIndex + 1}/{images.length}
                          </div>
                        )}

                        {hasMultiple && (
                          <div style={{
                            position: 'absolute',
                            bottom: '60px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '6px',
                            backgroundColor: 'rgba(15, 23, 42, 0.55)',
                            padding: '6px',
                            borderRadius: '10px',
                            backdropFilter: 'blur(4px)',
                            maxWidth: '90%',
                            overflowX: 'auto'
                          }}>
                            {images.map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setPopupImageIndex(idx)}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '6px',
                                  overflow: 'hidden',
                                  border: idx === popupImageIndex ? '2px solid #00D4FF' : '2px solid transparent',
                                  cursor: 'pointer',
                                  padding: 0,
                                  backgroundColor: 'transparent',
                                  flexShrink: 0,
                                  opacity: idx === popupImageIndex ? 1 : 0.6,
                                  transition: 'all 0.2s ease'
                                }}
                                aria-label={`Show image ${idx + 1}`}
                              >
                                <img
                                  src={img}
                                  alt={`thumb-${idx}`}
                                  loading="lazy"
                                  decoding="async"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Product Details */}
                  <div style={{
                    padding: '24px 28px 28px',
                    overflowY: 'auto'
                  }}>
                    {getCategoryName(selectedProduct.category) && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#0099CC',
                        backgroundColor: 'rgba(0, 153, 204, 0.08)',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 153, 204, 0.2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'inline-block',
                        marginBottom: '10px'
                      }}>
                        {getCategoryName(selectedProduct.category)}
                      </span>
                    )}

                    <h2 style={{
                      margin: '0 0 8px 0',
                      fontSize: '22px',
                      fontWeight: '800',
                      color: '#0A1628',
                      letterSpacing: '-0.3px',
                      lineHeight: '1.3'
                    }}>
                      {selectedProduct.productName}
                    </h2>

                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '10px',
                      marginBottom: '16px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: '#0A1628',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <FaRupeeSign size={18} style={{ marginRight: '2px' }} />
                        {selectedProduct.finalPrice || selectedProduct.price}
                      </span>
                      {selectedProduct.discount > 0 && (
                        <>
                          <span style={{
                            fontSize: '15px',
                            color: '#94A3B8',
                            textDecoration: 'line-through',
                            fontWeight: '600'
                          }}>
                            ₹{selectedProduct.price}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '800',
                            color: '#FFFFFF',
                            background: 'linear-gradient(135deg, #FF6B35 0%, #E85A24 100%)',
                            padding: '3px 10px',
                            borderRadius: '10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            <FaPercent size={9} /> {selectedProduct.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {selectedProduct.description && (
                      <div style={{
                        padding: '16px 18px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0'
                      }}>
                        <p style={{
                          margin: '0 0 6px 0',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#64748B',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Description
                        </p>
                        <p style={{
                          margin: 0,
                          fontSize: '14px',
                          color: '#334155',
                          lineHeight: '1.7',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {selectedProduct.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ===== RIGHT SIDE: Form ===== */}
                <div style={{
                  flex: isMobile ? 'none' : '1 1 45%',
                  minWidth: 0,
                  backgroundColor: '#FFFFFF',
                  borderRadius: isMobile ? '0 0 20px 20px' : '0 20px 20px 0',
                  padding: '32px 32px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '22px',
                    marginBottom: '18px'
                  }}>
                    <FaShoppingCart />
                  </div>

                  <h3 style={{
                    margin: '0 0 6px 0',
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#0A1628',
                    letterSpacing: '-0.3px'
                  }}>
                    Confirm Your Interest
                  </h3>
                  <p style={{
                    margin: '0 0 24px 0',
                    fontSize: '14px',
                    color: '#64748B',
                    lineHeight: '1.5'
                  }}>
                    Enter your details and our team will contact you shortly.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#0F172A',
                        marginBottom: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <FaUser style={{ color: '#0099CC', fontSize: '11px' }} />
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="Enter your full name"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1.5px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#0F172A',
                          outline: 'none',
                          backgroundColor: isSubmitting ? '#F1F5F9' : '#FFFFFF',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.borderColor = '#0099CC';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 153, 204, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#CBD5E1';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#0F172A',
                        marginBottom: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <FaPhoneAlt style={{ color: '#0099CC', fontSize: '11px' }} />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setCustomerPhone(val);
                        }}
                        disabled={isSubmitting}
                        placeholder="Enter your 10-digit phone number"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1.5px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#0F172A',
                          outline: 'none',
                          backgroundColor: isSubmitting ? '#F1F5F9' : '#FFFFFF',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.borderColor = '#0099CC';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 153, 204, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#CBD5E1';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {formError && (
                      <div style={{
                        backgroundColor: '#FEF2F2',
                        color: '#B91C1C',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        border: '1.5px solid #FECACA',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {formError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        background: isSubmitting
                          ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)'
                          : 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                        color: '#FFFFFF',
                        padding: '14px',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '15px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: isSubmitting ? 'none' : '0 6px 20px rgba(0, 212, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: isSubmitting ? 0.85 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmitting) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.3)';
                        }
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                          Submitting...
                        </>
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              // Success message (full width)
              <div style={{
                textAlign: 'center',
                padding: '60px 40px'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <FaCheckCircle style={{ fontSize: '40px', color: '#059669' }} />
                </div>

                <h2 style={{
                  margin: '0 0 12px 0',
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#0A1628',
                  letterSpacing: '-0.3px'
                }}>
                  Thank You!
                </h2>

                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '15px',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontWeight: '600'
                }}>
                  Thank you for choosing <span style={{ color: '#0099CC' }}>Patil Brothers</span>!
                </p>
                <p style={{
                  margin: '0 0 24px 0',
                  fontSize: '14px',
                  color: '#64748B',
                  lineHeight: '1.6'
                }}>
                  Our staff will contact you soon on <strong style={{ color: '#0F172A' }}>{customerPhone}</strong>.
                </p>

                <button
                  onClick={handleClosePopup}
                  style={{
                    width: '100%',
                    maxWidth: '320px',
                    background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                    color: '#FFFFFF',
                    padding: '14px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(0, 212, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    margin: '0 auto',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.3)';
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes floatPulseGreen {
          0%, 100% {
            box-shadow:
              0 6px 20px rgba(37, 211, 102, 0.45),
              0 0 0 0 rgba(37, 211, 102, 0.5);
          }
          50% {
            box-shadow:
              0 6px 20px rgba(37, 211, 102, 0.55),
              0 0 0 10px rgba(37, 211, 102, 0);
          }
        }

        @keyframes floatPulseOrange {
          0%, 100% {
            box-shadow:
              0 6px 20px rgba(232, 89, 12, 0.45),
              0 0 0 0 rgba(232, 89, 12, 0.55);
          }
          50% {
            box-shadow:
              0 6px 20px rgba(232, 89, 12, 0.55),
              0 0 0 10px rgba(232, 89, 12, 0);
          }
        }

        @keyframes ringPing {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }

        .float-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          animation: ringPing 2.4s ease-out infinite;
        }

        .whatsapp-ring {
          background: rgba(37, 211, 102, 0.35);
        }

        .call-ring {
          background: rgba(232, 89, 12, 0.35);
          animation-delay: 0.4s;
        }

        .float-whatsapp-btn:hover .float-ring,
        .float-call-btn:hover .float-ring {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .float-whatsapp-btn,
          .float-call-btn {
            animation: none !important;
          }
          .float-ring {
            animation: none !important;
            display: none;
          }
        }
      `}</style>
    </div>
  );
}