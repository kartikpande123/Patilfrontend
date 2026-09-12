import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from "../assets/logo.jpeg";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Order Status', path: '/orderstatus' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: '#0A1628',
      boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '30px'
      }}>

        {/* Logo & Brand */}
        <div
          onClick={() => handleNavClick('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <img
            src={logo}
            alt="Patil Brothers Logo"
            style={{
              height: '70px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: '1.25'
          }}>
            <span style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '800',
              letterSpacing: '0.3px'
            }}>
              Patil Brothers
            </span>
            <span style={{
              color: '#00D4FF',
              fontSize: '15px',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              Borewell Camera & Borewell Lock
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  backgroundColor: isActive ? 'rgba(0, 212, 255, 0.12)' : 'transparent',
                  color: isActive ? '#00D4FF' : '#FFFFFF',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.2px',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#00D4FF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
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
          style={{
            display: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '22px',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
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
            animation: 'slideDown 0.2s ease-out'
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
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

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1050px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
        @media (min-width: 1051px) {
          .mobile-menu {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          header > div:first-child {
            padding: 16px 20px !important;
          }
          header img {
            height: 55px !important;
          }
          header span:first-child {
            font-size: 20px !important;
          }
          header span:last-child {
            font-size: 12px !important;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}