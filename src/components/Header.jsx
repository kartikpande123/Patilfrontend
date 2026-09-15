import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight, 
  FaWhatsapp, 
  FaPhoneAlt,
  FaSpinner
} from 'react-icons/fa';
import logo from "../assets/logo-main.png";
import API_BASE_URL from './ApiConfig';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [ads, setAds] = useState([]);
  const [isFetchingAds, setIsFetchingAds] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showAdControls, setShowAdControls] = useState(false);
  const autoScrollTimerRef = useRef(null);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Our Products', path: '/', scrollTo: 'our-products' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Order Status', path: '/orderstatus' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
        autoScrollTimerRef.current = null;
      }
      return;
    }
    autoScrollTimerRef.current = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % ads.length);
    }, 5000);
    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [ads.length]);

  const fetchAds = async () => {
    setIsFetchingAds(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ads`);
      if (!res.ok) throw new Error('Failed to fetch ads');
      const data = await res.json();
      if (data.success && data.data) {
        const arr = Object.keys(data.data)
          .map(key => ({ id: key, ...data.data[key] }))
          .sort((a, b) => {
            const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return tB - tA;
          });
        setAds(arr);
      }
    } catch (err) {
      console.error('Failed to load ads:', err);
    } finally {
      setIsFetchingAds(false);
    }
  };

  const goToPrevAd = (e) => {
    if (e) e.stopPropagation();
    setCurrentAdIndex(prev => (prev - 1 + ads.length) % ads.length);
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    autoScrollTimerRef.current = setInterval(() => {
      setCurrentAdIndex(p => (p + 1) % ads.length);
    }, 8000);
  };

  const goToNextAd = (e) => {
    if (e) e.stopPropagation();
    setCurrentAdIndex(prev => (prev + 1) % ads.length);
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    autoScrollTimerRef.current = setInterval(() => {
      setCurrentAdIndex(p => (p + 1) % ads.length);
    }, 5000);
  };

  const handleNavClick = (item) => {
    if (item.scrollTo) {
      if (location.pathname === item.path) {
        const el = document.getElementById(item.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(item.path);
        setTimeout(() => {
          const el = document.getElementById(item.scrollTo);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } else {
      navigate(item.path);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <header style={{
          background: scrolled
            ? 'linear-gradient(180deg, #0A1628 0%, #0C1B30 100%)'
            : 'linear-gradient(180deg, #0A1628 0%, #101F38 100%)',
          boxShadow: scrolled
            ? '0 4px 24px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 212, 255, 0.06)'
            : '0 2px 10px rgba(0, 0, 0, 0.15)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.12)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}>
          <div
            className="pb-header-inner"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: scrolled ? '14px 40px' : '20px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              transition: 'padding 0.3s ease',
              boxSizing: 'border-box',
              width: '100%'
            }}
          >

            {/* Logo & Brand */}
            <div
              onClick={() => handleNavClick({ label: 'Home', path: '/' })}
              className="pb-logo-group"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                flexShrink: 1,
                minWidth: 0,
                overflow: 'hidden'
              }}
            >
              <div className="pb-logo-wrap" style={{
                position: 'relative',
                width: scrolled ? '56px' : '68px',
                height: scrolled ? '56px' : '68px',
                borderRadius: '50%',
                padding: '3px',
                background: 'linear-gradient(135deg, #00D4FF, #0099CC, #00D4FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img
                  src={logo}
                  alt="Patil Brothers Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    display: 'block'
                  }}
                />
              </div>
              <div
                className="pb-brand-text"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: '1.2',
                  minWidth: 0,
                  overflow: 'hidden'
                }}
              >
                <span style={{
                  color: '#FFFFFF',
                  fontSize: '24px',
                  fontWeight: '800',
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Patil Brothers
                </span>
                <span style={{
                  color: '#00D4FF',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Borewell Camera & Borewell Lock
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '6px',
              borderRadius: '16px',
              flexShrink: 0
            }} className="desktop-nav">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path && !item.scrollTo;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className="pb-nav-btn"
                    style={{
                      backgroundColor: isActive ? 'rgba(0, 212, 255, 0.14)' : 'transparent',
                      color: isActive ? '#00D4FF' : '#FFFFFF',
                      border: 'none',
                      padding: '11px 22px',
                      borderRadius: '11px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      letterSpacing: '0.2px',
                      whiteSpace: 'nowrap',
                      boxShadow: isActive ? '0 0 0 1px rgba(0, 212, 255, 0.35), 0 4px 14px rgba(0, 212, 255, 0.15)' : 'none'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                display: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                padding: '10px 14px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '22px',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.15)';
                e.currentTarget.style.borderColor = '#00D4FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div
              className="mobile-menu"
              style={{
                backgroundColor: '#0F1E33',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px 24px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                animation: 'slideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path && !item.scrollTo;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    style={{
                      backgroundColor: isActive ? 'rgba(0, 212, 255, 0.12)' : 'transparent',
                      color: isActive ? '#00D4FF' : '#FFFFFF',
                      border: 'none',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </header>
      </div>

      {/* Ad Banner */}
      {isFetchingAds && (
        <div style={{
          backgroundColor: '#0F1E33',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          color: '#94A3B8',
          borderBottom: '1px solid rgba(0, 212, 255, 0.2)'
        }}>
          <FaSpinner style={{ animation: 'spin 1s linear infinite', color: '#00D4FF' }} />
          <span style={{ fontSize: '13px', fontWeight: '600' }}>Loading advertisements...</span>
        </div>
      )}

      {!isFetchingAds && ads.length > 0 && (
        <div
          onMouseEnter={() => setShowAdControls(true)}
          onMouseLeave={() => setShowAdControls(false)}
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(210px, 33vw, 480px)',
            overflow: 'hidden',
            backgroundColor: '#0F1E33',
            borderBottom: '2px solid rgba(0, 212, 255, 0.25)',
            cursor: 'pointer'
          }}
        >
          {ads.map((ad, idx) => (
            <div
              key={ad.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: idx === currentAdIndex ? 1 : 0,
                transform: idx === currentAdIndex ? 'scale(1)' : 'scale(1.06)',
                transition: 'opacity 0.9s ease-in-out, transform 6s ease-out',
                pointerEvents: idx === currentAdIndex ? 'auto' : 'none'
              }}
            >
              <img
                src={ad.imageUrl}
                alt={`Advertisement ${idx + 1}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                className={idx === currentAdIndex ? 'pb-ad-kenburns' : ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.05) 30%, rgba(10,22,40,0.15) 60%, rgba(10, 22, 40, 0.65) 100%)',
                pointerEvents: 'none'
              }} />
            </div>
          ))}

          {ads.length > 1 && (
            <button
              onClick={goToPrevAd}
              aria-label="Previous ad"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(10, 22, 40, 0.7)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                zIndex: 5,
                opacity: showAdControls ? 1 : 0,
                transition: 'all 0.3s ease',
                pointerEvents: showAdControls ? 'auto' : 'none'
              }}
            >
              <FaChevronLeft />
            </button>
          )}

          {ads.length > 1 && (
            <button
              onClick={goToNextAd}
              aria-label="Next ad"
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(10, 22, 40, 0.7)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                zIndex: 5,
                opacity: showAdControls ? 1 : 0,
                transition: 'all 0.3s ease',
                pointerEvents: showAdControls ? 'auto' : 'none'
              }}
            >
              <FaChevronRight />
            </button>
          )}

          {/* Ad action buttons */}
          <div className="pb-ad-action-btns" style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            display: 'flex',
            gap: '12px',
            zIndex: 5,
            flexWrap: 'wrap'
          }}>
             <a
              href="tel:919353368514"
              className="pb-pulse-btn pb-ad-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                padding: '13px 24px',
                background: 'linear-gradient(135deg, #FF9F43 0%, #E8590C 100%)',
                color: '#FFFFFF',
                borderRadius: '32px',
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '14.5px',
                boxShadow: '0 6px 20px rgba(0, 102, 204, 0.55)',
                border: '1.5px solid rgba(255, 255, 255, 0.4)',
                whiteSpace: 'nowrap'
              }}
            >
              <FaPhoneAlt style={{ fontSize: '15px' }} />
              Call Now
            </a>
            <a
              href="https://wa.me/919353368514"
              target="_blank"
              rel="noopener noreferrer"
              className="pb-pulse-btn pb-ad-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                padding: '13px 24px',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#FFFFFF',
                borderRadius: '32px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '14.5px',
                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.5)',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                whiteSpace: 'nowrap'
              }}
            >
              <FaWhatsapp style={{ fontSize: '18px' }} />
              WhatsApp
            </a>

           
          </div>

          {ads.length > 1 && (
            <div
              className="pb-ad-dots"
              style={{
                position: 'absolute',
                bottom: '26px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                padding: '9px 16px',
                backgroundColor: 'rgba(10, 22, 40, 0.65)',
                borderRadius: '22px',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                zIndex: 5
              }}
            >
              {ads.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentAdIndex(idx);
                    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
                    autoScrollTimerRef.current = setInterval(() => {
                      setCurrentAdIndex(p => (p + 1) % ads.length);
                    }, 5000);
                  }}
                  aria-label={`Go to ad ${idx + 1}`}
                  style={{
                    width: idx === currentAdIndex ? '26px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: idx === currentAdIndex ? '#00D4FF' : 'rgba(255, 255, 255, 0.45)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0
                  }}
                />
              ))}
            </div>
          )}

          {ads.length > 1 && (
            <div style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              padding: '6px 14px',
              backgroundColor: 'rgba(10, 22, 40, 0.7)',
              color: '#FFFFFF',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: '700',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              zIndex: 5
            }}>
              {currentAdIndex + 1} / {ads.length}
            </div>
          )}
        </div>
      )}

      <style>{`
        .pb-logo-wrap {
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease;
        }
        .pb-logo-group:hover .pb-logo-wrap {
          transform: rotate(-3deg) scale(1.04);
          box-shadow: 0 6px 18px rgba(0, 212, 255, 0.45);
        }
        .pb-nav-btn {
          position: relative;
        }
        .pb-nav-btn::after {
          content: '';
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 6px;
          height: 2px;
          background: #00D4FF;
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.25s ease;
        }
        .pb-nav-btn:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: #00D4FF !important;
        }
        .pb-nav-btn:hover::after {
          transform: scaleX(1);
        }
        .pb-pulse-btn {
          position: relative;
        }
        .pb-pulse-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 32px;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5);
          animation: pbPulse 2.6s ease-out infinite;
          pointer-events: none;
        }

        /* ===== TABLET / MOBILE ===== */
        @media (max-width: 1050px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 1051px) {
          .mobile-menu { display: none !important; }
        }

        /* ===== MOBILE TWEAKS (bigger navbar height) ===== */
        @media (max-width: 600px) {
          .pb-header-inner {
            padding: 18px 16px !important;
            gap: 10px !important;
          }
          .pb-logo-wrap {
            width: 60px !important;
            height: 60px !important;
          }
          .pb-logo-group {
            gap: 12px !important;
          }
          .pb-brand-text span:first-child {
            font-size: 19px !important;
          }
          .pb-brand-text span:last-child {
            font-size: 11.5px !important;
          }
          .mobile-toggle {
            padding: 11px 14px !important;
            font-size: 22px !important;
          }
          .pb-ad-dots {
            display: none !important;
          }
          .pb-ad-action-btns {
            bottom: 14px !important;
            left: 14px !important;
            gap: 8px !important;
          }
          .pb-ad-btn {
            padding: 8px 14px !important;
            font-size: 12px !important;
            gap: 6px !important;
            border-radius: 24px !important;
          }
          .pb-ad-btn svg {
            font-size: 13px !important;
          }
        }

        @media (max-width: 420px) {
          .pb-header-inner {
            padding: 16px 14px !important;
          }
          .pb-logo-wrap {
            width: 54px !important;
            height: 54px !important;
          }
          .pb-brand-text span:first-child {
            font-size: 17px !important;
          }
          .pb-brand-text span:last-child {
            font-size: 10.5px !important;
          }
          .pb-ad-btn {
            padding: 7px 12px !important;
            font-size: 11px !important;
          }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pbPulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.35); }
          70% { box-shadow: 0 0 0 12px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        .pb-ad-kenburns {
          animation: pbKenBurns 6.5s ease-in-out forwards;
        }
        @keyframes pbKenBurns {
          from { transform: scale(1.08); }
          to { transform: scale(1); }
        }
      `}</style>
    </>
  );
}