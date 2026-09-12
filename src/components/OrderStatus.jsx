import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPhoneAlt, 
  FaSearch, 
  FaSpinner, 
  FaBox, 
  FaRupeeSign, 
  FaPercent, 
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaHourglassHalf,
  FaTimesCircle,
  FaArrowLeft,
  FaImage,
  FaShoppingBag
} from 'react-icons/fa';
import Header from './Header';
import API_BASE_URL from './ApiConfig';

// Same statuses used in the admin panel — mapped for customer-friendly display
const STATUS_INFO = {
  pending: { label: 'Pending', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', icon: <FaHourglassHalf /> },
  approached: { label: 'Approached', color: '#0099CC', bg: 'rgba(0, 153, 204, 0.1)', icon: <FaPhoneAlt /> },
  on_going: { label: 'On Going', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)', icon: <FaClock /> },
  delivered: { label: 'Delivered', color: '#166534', bg: 'rgba(22, 101, 52, 0.1)', icon: <FaCheckCircle /> },
};

export default function OrderStatus() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  // Format date
  const formatDateTime = (isoString) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusInfo = (status) => {
    return STATUS_INFO[status] || STATUS_INFO.pending;
  };

  // Get primary image for a product
  const getProductImage = (inq) => {
    return inq.productImageUrl || null;
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    // Validate
    const trimmed = phone.trim();
    if (!trimmed) {
      setError('Please enter your phone number');
      return;
    }
    if (!/^[0-9]{10}$/.test(trimmed)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSearching(true);
    setHasSearched(false);
    setInquiries([]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries`);
      if (!res.ok) throw new Error('Failed to fetch inquiries');
      const data = await res.json();

      if (data.success && data.data) {
        const arr = Object.keys(data.data)
          .map(key => ({ id: key, ...data.data[key] }))
          // Match by phone number (exact match after trimming)
          .filter(inq => (inq.customerPhone || '').toString().trim() === trimmed);

        // Sort newest first
        arr.sort((a, b) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tB - tA;
        });

        setInquiries(arr);
      }
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch your inquiries. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Hero / Search Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)',
        padding: '60px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'rgba(0, 212, 255, 0.06)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'rgba(255, 107, 53, 0.05)'
        }} />

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 5,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.15)';
            e.currentTarget.style.borderColor = '#00D4FF';
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <FaArrowLeft /> Back
        </button>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block',
            backgroundColor: 'rgba(0, 212, 255, 0.12)',
            color: '#00D4FF',
            padding: '6px 18px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '20px',
            border: '1px solid rgba(0, 212, 255, 0.3)'
          }}>
            Order Tracking
          </span>

          <h1 style={{
            color: '#FFFFFF',
            fontSize: '40px',
            fontWeight: '800',
            margin: '0 0 14px 0',
            letterSpacing: '-0.5px',
            lineHeight: '1.2'
          }}>
            Track Your <span style={{ color: '#00D4FF' }}>Order Status</span>
          </h1>

          <p style={{
            color: '#CBD5E1',
            fontSize: '16px',
            margin: '0 0 30px',
            lineHeight: '1.6'
          }}>
            Enter your phone number to see your inquiries and their current status
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            gap: '12px',
            maxWidth: '560px',
            margin: '0 auto',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: 1,
              minWidth: '220px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '0 16px',
              border: '2px solid #FFFFFF',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s ease'
            }}>
              <FaPhoneAlt style={{ color: '#64748B', fontSize: '14px', marginRight: '10px' }} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(val);
                  if (error) setError('');
                }}
                placeholder="Enter your 10-digit phone number"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#0F172A',
                  padding: '14px 0',
                  width: '100%'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              style={{
                background: isSearching
                  ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)'
                  : 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                color: '#FFFFFF',
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '800',
                fontSize: '15px',
                cursor: isSearching ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isSearching ? 'none' : '0 8px 25px rgba(0, 212, 255, 0.4)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.3px',
                minWidth: '130px'
              }}
              onMouseEnter={(e) => {
                if (!isSearching) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 212, 255, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSearching) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.4)';
                }
              }}
            >
              {isSearching ? (
                <>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch />
                  Search
                </>
              )}
            </button>
          </form>

          {/* Error message */}
          {error && (
            <div style={{
              marginTop: '20px',
              backgroundColor: 'rgba(254, 226, 226, 0.95)',
              color: '#B91C1C',
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1.5px solid #FECACA',
              fontSize: '13px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              maxWidth: '560px'
            }}>
              <FaExclamationCircle />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div style={{
        maxWidth: '900px',
        margin: '-40px auto 60px',
        padding: '0 24px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Loading state */}
        {isSearching && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            border: '2px solid #CBD5E1'
          }}>
            <FaSpinner style={{ fontSize: '38px', color: '#0099CC', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#475569', marginTop: '14px', fontWeight: '600' }}>
              Looking up your inquiries...
            </p>
          </div>
        )}

        {/* No search yet */}
        {!isSearching && !hasSearched && (
          <div style={{
            textAlign: 'center',
            padding: '50px 30px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            border: '2px solid #CBD5E1'
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
              <FaShoppingBag style={{ fontSize: '28px', color: '#0099CC' }} />
            </div>
            <h3 style={{
              color: '#0F172A',
              margin: '0 0 8px',
              fontSize: '18px',
              fontWeight: '700'
            }}>
              Enter Your Phone Number
            </h3>
            <p style={{
              color: '#64748B',
              fontSize: '14px',
              margin: 0,
              lineHeight: '1.6'
            }}>
              We'll find all inquiries linked to your phone number and show their status
            </p>
          </div>
        )}

        {/* Searched but nothing found */}
        {!isSearching && hasSearched && inquiries.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '50px 30px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            border: '2px solid #CBD5E1'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FaExclamationCircle style={{ fontSize: '28px', color: '#F59E0B' }} />
            </div>
            <h3 style={{
              color: '#0F172A',
              margin: '0 0 8px',
              fontSize: '18px',
              fontWeight: '700'
            }}>
              No Inquiries Found
            </h3>
            <p style={{
              color: '#64748B',
              fontSize: '14px',
              margin: '0 0 6px',
              lineHeight: '1.6'
            }}>
              We couldn't find any inquiries for <strong style={{ color: '#0F172A' }}>{phone}</strong>
            </p>
            <p style={{
              color: '#64748B',
              fontSize: '13px',
              margin: 0,
              lineHeight: '1.6'
            }}>
              Please check the number or contact our support team for assistance
            </p>
          </div>
        )}

        {/* Results list */}
        {!isSearching && hasSearched && inquiries.length > 0 && (
          <div>
            {/* Result count header */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '16px 22px',
              marginBottom: '18px',
              boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
              border: '2px solid #CBD5E1',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaCheckCircle style={{ color: '#25D366', fontSize: '18px' }} />
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#0F172A'
                }}>
                  Found {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'}
                </span>
              </div>
              <span style={{
                fontSize: '13px',
                color: '#64748B',
                fontWeight: '600'
              }}>
                for {phone}
              </span>
            </div>

            {/* Inquiries */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {inquiries.map((inq) => {
                const st = getStatusInfo(inq.status);
                const img = getProductImage(inq);

                return (
                  <div
                    key={inq.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.05)',
                      border: '2px solid #CBD5E1',
                      display: 'flex',
                      gap: '18px',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.12)';
                      e.currentTarget.style.borderColor = st.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.05)';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                    }}
                  >
                    {/* Product Image */}
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1.5px solid #CBD5E1',
                      backgroundColor: '#F1F5F9'
                    }}>
                      {img ? (
                        <img
                          src={img}
                          alt={inq.productName}
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94A3B8'
                        }}>
                          <FaImage size={28} />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      {/* Product Name */}
                      <h3 style={{
                        margin: '0 0 10px 0',
                        fontSize: '17px',
                        fontWeight: '800',
                        color: '#0A1628',
                        letterSpacing: '-0.2px',
                        lineHeight: '1.3'
                      }}>
                        {inq.productName || 'Product'}
                      </h3>

                      {/* Price row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        flexWrap: 'wrap',
                        marginBottom: '12px'
                      }}>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: '800',
                          color: '#007A99',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <FaRupeeSign size={14} style={{ marginRight: '2px' }} />
                          {inq.productFinalPrice || inq.productPrice || 0}
                        </span>

                        {inq.productDiscount > 0 && (
                          <>
                            <span style={{
                              fontSize: '13px',
                              color: '#94A3B8',
                              textDecoration: 'line-through',
                              fontWeight: '600'
                            }}>
                              ₹{inq.productPrice}
                            </span>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              color: '#FFFFFF',
                              background: 'linear-gradient(135deg, #FF6B35 0%, #E85A24 100%)',
                              padding: '3px 8px',
                              borderRadius: '8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}>
                              <FaPercent size={8} /> {inq.productDiscount}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* Date */}
                      <div style={{
                        fontSize: '12px',
                        color: '#64748B',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '4px'
                      }}>
                        <FaCalendarAlt style={{ fontSize: '11px' }} />
                        Inquiry Date: {formatDateTime(inq.createdAt)}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      backgroundColor: st.bg,
                      border: `2px solid ${st.color}`,
                      color: st.color,
                      fontWeight: '800',
                      fontSize: '13px',
                      letterSpacing: '0.3px',
                      flexShrink: 0,
                      alignSelf: 'center'
                    }}>
                      <span style={{ display: 'flex', fontSize: '14px' }}>{st.icon}</span>
                      {st.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Help footer */}
            <div style={{
              marginTop: '28px',
              padding: '18px 22px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '2px dashed #CBD5E1',
              textAlign: 'center'
            }}>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#64748B',
                fontWeight: '600',
                lineHeight: '1.6'
              }}>
                Need help with your inquiry? Call us at{' '}
                <a
                  href="tel:08310205800"
                  style={{
                    color: '#0099CC',
                    fontWeight: '800',
                    textDecoration: 'none'
                  }}
                >
                  083102 05800
                </a>{' '}
                or{' '}
                <a
                  href="https://wa.me/918310205800"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#25D366',
                    fontWeight: '800',
                    textDecoration: 'none'
                  }}
                >
                  WhatsApp us
                </a>
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}