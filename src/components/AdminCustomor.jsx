import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSearch, 
  FaSpinner, 
  FaPhoneAlt, 
  FaUser, 
  FaBox,
  FaCheckCircle,
  FaExclamationCircle,
  FaCalendarAlt,
  FaTimes,
  FaFilter,
  FaRupeeSign,
  FaClock,
  FaHourglassHalf,
  FaImage,
  FaChevronDown
} from 'react-icons/fa';
import API_BASE_URL from './ApiConfig';

// Inquiry statuses — used in the dropdown for each inquiry
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', icon: <FaHourglassHalf /> },
  { value: 'approached', label: 'Approached', color: '#0099CC', bg: 'rgba(0, 153, 204, 0.1)', icon: <FaPhoneAlt /> },
  { value: 'on_going', label: 'On Going', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)', icon: <FaClock /> },
  { value: 'delivered', label: 'Delivered', color: '#166534', bg: 'rgba(22, 101, 52, 0.1)', icon: <FaCheckCircle /> },
];

export default function AdminCustomer() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch inquiries on mount
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsFetching(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries`);
      if (!res.ok) throw new Error('Failed to fetch inquiries');
      const data = await res.json();
      if (data.success) {
        const arr = Object.keys(data.data).map(key => ({
          id: key,
          ...data.data[key]
        }));
        // Sort newest first
        arr.sort((a, b) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tB - tA;
        });
        setInquiries(arr);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load inquiries');
    } finally {
      setIsFetching(false);
    }
  };

  const getStatusInfo = (status) => {
    return STATUS_OPTIONS.find(s => s.value === (status || 'pending')) || STATUS_OPTIONS[0];
  };

  // Format a date string as yyyy-mm-dd for comparison with the date input
  const toDateKey = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

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

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    let result = [...inquiries];

    // Search by name or phone
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(inq =>
        (inq.customerName || '').toLowerCase().includes(q) ||
        (inq.customerPhone || '').toString().toLowerCase().includes(q)
      );
    }

    // Filter by date
    if (selectedDate) {
      result = result.filter(inq => toDateKey(inq.createdAt) === selectedDate);
    }

    // Filter by status
    if (statusFilter) {
      result = result.filter(inq => (inq.status || 'pending') === statusFilter);
    }

    return result;
  }, [inquiries, searchTerm, selectedDate, statusFilter]);

  // ===== Update status of an inquiry via PUT API =====
  const handleStatusChange = async (inquiryId, newStatus) => {
    setUpdatingId(inquiryId);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update status');
      }

      // Optimistic update on local list
      setInquiries(prev =>
        prev.map(inq =>
          inq.id === inquiryId
            ? { ...inq, status: newStatus, updatedAt: new Date().toISOString() }
            : inq
        )
      );

      setSuccess(`Status updated to "${getStatusInfo(newStatus).label}"`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update status');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDate('');
    setStatusFilter('');
  };

  const hasActiveFilters = searchTerm || selectedDate || statusFilter;

  // Counts per status (from all inquiries, not filtered)
  const statusCounts = useMemo(() => {
    const counts = {};
    STATUS_OPTIONS.forEach(s => { counts[s.value] = 0; });
    inquiries.forEach(inq => {
      const st = inq.status || 'pending';
      if (counts[st] !== undefined) counts[st]++;
      else counts[st] = (counts[st] || 0) + 1;
    });
    return counts;
  }, [inquiries]);

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
          <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '0.3px' }}>
            Customer Inquiries
          </h2>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Status Summary Pills */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setStatusFilter('')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: statusFilter === '' ? '2px solid #0099CC' : '1.5px solid #CBD5E1',
              backgroundColor: statusFilter === '' ? 'rgba(0, 153, 204, 0.08)' : '#FFFFFF',
              color: statusFilter === '' ? '#007A99' : '#475569',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <FaFilter style={{ fontSize: '11px' }} />
            All <span style={{ opacity: 0.7 }}>({inquiries.length})</span>
          </button>

          {STATUS_OPTIONS.map(st => (
            <button
              key={st.value}
              onClick={() => setStatusFilter(st.value)}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: statusFilter === st.value ? `2px solid ${st.color}` : '1.5px solid #CBD5E1',
                backgroundColor: statusFilter === st.value ? st.bg : '#FFFFFF',
                color: statusFilter === st.value ? st.color : '#475569',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ color: st.color }}>{st.icon}</span>
              {st.label}
              <span style={{ opacity: 0.7 }}>({statusCounts[st.value] || 0})</span>
            </button>
          ))}
        </div>

        {/* Search & Date Filter */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 25px',
          marginBottom: '25px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Search input */}
          <div style={{
            flex: 1,
            minWidth: '260px',
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid #CBD5E1',
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
            e.currentTarget.style.borderColor = '#CBD5E1';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <FaSearch style={{ color: '#64748B', marginRight: '10px' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or phone number..."
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
                  color: '#64748B',
                  fontSize: '14px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Date filter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid #CBD5E1',
            borderRadius: '10px',
            padding: '0 14px',
            backgroundColor: '#FFFFFF',
            minWidth: '200px',
            transition: 'all 0.2s ease'
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = '#0099CC';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 153, 204, 0.1)';
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = '#CBD5E1';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <FaCalendarAlt style={{ color: '#64748B', marginRight: '10px', fontSize: '14px' }} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: '600',
                color: selectedDate ? '#0F172A' : '#64748B',
                padding: '11px 0',
                cursor: 'pointer',
                width: '100%',
                fontFamily: 'inherit'
              }}
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  fontSize: '13px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                padding: '11px 18px',
                backgroundColor: '#FEF2F2',
                color: '#B91C1C',
                border: '1.5px solid #FECACA',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
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
              <FaTimes size={11} /> Clear
            </button>
          )}

          {/* Result count */}
          <div style={{
            fontSize: '13px',
            color: '#0F172A',
            fontWeight: '600',
            backgroundColor: 'rgba(0, 153, 204, 0.08)',
            padding: '10px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(0, 153, 204, 0.2)',
            whiteSpace: 'nowrap',
            marginLeft: 'auto'
          }}>
            {filteredInquiries.length} {filteredInquiries.length === 1 ? 'inquiry' : 'inquiries'}
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

        {/* Inquiries List */}
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
            <p style={{ color: '#475569', marginTop: '15px', fontWeight: '600' }}>Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
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
              <FaSearch style={{ fontSize: '32px', color: '#0099CC' }} />
            </div>
            <h3 style={{ color: '#0F172A', margin: '15px 0 8px', fontSize: '18px', fontWeight: '700' }}>
              No Inquiries Found
            </h3>
            <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
              {hasActiveFilters
                ? 'Try adjusting your search, date, or status filter'
                : 'No customer inquiries yet'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredInquiries.map((inq) => {
              const st = getStatusInfo(inq.status);
              const isUpdating = updatingId === inq.id;

              return (
                <div
                  key={inq.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '20px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Product Image */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F1F5F9'
                  }}>
                    {inq.productImageUrl ? (
                      <img
                        src={inq.productImageUrl}
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
                        <FaImage size={26} />
                      </div>
                    )}
                  </div>

                  {/* Customer + Product Details */}
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#0A1628'
                      }}>
                        <FaUser style={{ color: '#0099CC', fontSize: '12px' }} />
                        {inq.customerName}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#475569',
                        backgroundColor: '#F1F5F9',
                        padding: '4px 10px',
                        borderRadius: '10px'
                      }}>
                        <FaPhoneAlt style={{ fontSize: '10px', color: '#64748B' }} />
                        {inq.customerPhone}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#334155'
                      }}>
                        <FaBox style={{ color: '#0099CC', fontSize: '12px' }} />
                        {inq.productName || 'Unknown product'}
                      </span>
                      {inq.productFinalPrice ? (
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#007A99',
                          backgroundColor: 'rgba(0, 153, 204, 0.08)',
                          padding: '3px 10px',
                          borderRadius: '10px'
                        }}>
                          <FaRupeeSign size={10} style={{ marginRight: '2px' }} />
                          {inq.productFinalPrice}
                          {inq.productDiscount > 0 && (
                            <span style={{
                              marginLeft: '6px',
                              fontSize: '10px',
                              fontWeight: '700',
                              color: '#C2410C'
                            }}>
                              ({inq.productDiscount}% off)
                            </span>
                          )}
                        </span>
                      ) : null}
                    </div>

                    <div style={{
                      fontSize: '12px',
                      color: '#64748B',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FaCalendarAlt style={{ fontSize: '11px' }} />
                      {formatDateTime(inq.createdAt)}
                    </div>
                  </div>

                  {/* Status Dropdown with caret icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: `1.5px solid ${st.color}`,
                      backgroundColor: st.bg,
                      color: st.color,
                      borderRadius: '10px',
                      padding: '0 10px 0 12px',
                      height: '42px',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}>
                      <span style={{ display: 'flex', fontSize: '13px' }}>{st.icon}</span>

                      {/* Custom select wrapper to control the caret */}
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <select
                          value={inq.status || 'pending'}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          disabled={isUpdating}
                          style={{
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            fontSize: '13px',
                            fontWeight: '700',
                            color: st.color,
                            cursor: isUpdating ? 'not-allowed' : 'pointer',
                            paddingRight: '20px',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            fontFamily: 'inherit'
                          }}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value} style={{ color: '#0F172A' }}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        {/* Caret icon overlay - indicates dropdown */}
                        <FaChevronDown
                          style={{
                            position: 'absolute',
                            right: '0px',
                            fontSize: '10px',
                            color: st.color,
                            pointerEvents: 'none',
                            transition: 'transform 0.2s ease'
                          }}
                        />
                      </div>

                      {isUpdating && (
                        <FaSpinner
                          style={{
                            fontSize: '12px',
                            color: st.color,
                            animation: 'spin 1s linear infinite'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0.6;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
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