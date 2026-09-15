import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaInstagram, 
  FaFacebookF,
  FaYoutube,
  FaMapMarkerAlt,
  FaArrowRight,
  FaChevronRight,
  FaDirections
} from 'react-icons/fa';
import logo from "../assets/logo.jpeg";

// Shared map URL used for both "Visit Our Store" and "Get Directions"
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Varchagal+Naduvin+Road+Karnataka+587122';

export default function Footer() {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Order Status', path: '/orderstatus' },
  ];

  const services = [
    'Borewell Camera Inspection',
    'Stuck Motor Removal',
    'Borewell Cleaning',
    'Borewell Lock Installation',
    'Inner Casing Installation',
    'Live Video Report',
  ];

  const socialLinks = [
    {
      icon: <FaWhatsapp />,
      label: 'WhatsApp',
      url: 'https://wa.me/919353368514',
      color: '#25D366',
    },
    {
      icon: <FaPhoneAlt />,
      label: 'Call',
      url: 'tel:9353368514',
      color: '#00D4FF',
    },
    {
      icon: <FaInstagram />,
      label: 'Instagram',
      url: 'https://www.instagram.com/patil_brothers_855?utm_source=qr&igsi=MXBvYXR6MDM1ZXZ6eQ==',
      color: '#E1306C',
    },
    {
      icon: <FaFacebookF />,
      label: 'Facebook',
      url: 'https://www.facebook.com/share/19K8uSbZKD/',
      color: '#1877F2',
    },
    {
      icon: <FaYoutube />,
      label: 'YouTube',
      url: 'https://youtube.com/@patil_brothers_855?si=JcJomK-e_Ro9bbup',
      color: '#FF0000',
    },
  ];

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)',
      color: '#CBD5E1',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background: 'rgba(0, 212, 255, 0.05)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '260px',
        height: '260px',
        borderRadius: '50%',
        background: 'rgba(255, 107, 53, 0.04)'
      }} />

      {/* Top accent line */}
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #00D4FF 0%, #0099CC 50%, #FF6B35 100%)'
      }} />

      {/* Main content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '60px 24px 30px',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Grid */}
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
            gap: '40px',
            marginBottom: '50px'
          }}
        >
          {/* Column 1: Brand */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '18px'
            }}>
              <img
                src={logo}
                alt="Patil Brothers Logo"
                style={{
                  height: '58px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: '1.2'
              }}>
                <span style={{
                  color: '#FFFFFF',
                  fontSize: '19px',
                  fontWeight: '800',
                  letterSpacing: '0.3px'
                }}>
                  Patil Brothers
                </span>
                <span style={{
                  color: '#00D4FF',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.4px'
                }}>
                  Borewell Camera & Borewell Lock
                </span>
              </div>
            </div>

            <p style={{
              fontSize: '14px',
              lineHeight: '1.7',
              color: '#94A3B8',
              margin: '0 0 22px 0'
            }}>
              Trusted partner for high-quality Borewell Cameras and Locks. 
              Combining years of expertise with cutting-edge technology 
              to serve farmers, homeowners, and businesses across India.
            </p>

            {/* Social icons */}
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '17px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color;
                    e.currentTarget.style.borderColor = social.color;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${social.color}55`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '800',
              margin: '0 0 20px 0',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              position: 'relative',
              paddingBottom: '12px'
            }}>
              Quick Links
              <span style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '36px',
                height: '3px',
                background: 'linear-gradient(90deg, #00D4FF 0%, #0099CC 100%)',
                borderRadius: '2px'
              }} />
            </h4>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => navigate(link.path)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      color: '#CBD5E1',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#00D4FF';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#CBD5E1';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <FaChevronRight style={{ fontSize: '10px', color: '#00D4FF' }} />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 style={{
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '800',
              margin: '0 0 20px 0',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              position: 'relative',
              paddingBottom: '12px'
            }}>
              Our Services
              <span style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '36px',
                height: '3px',
                background: 'linear-gradient(90deg, #00D4FF 0%, #0099CC 100%)',
                borderRadius: '2px'
              }} />
            </h4>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {services.map((service, idx) => (
                <li key={idx} style={{
                  color: '#94A3B8',
                  fontSize: '13.5px',
                  fontWeight: '500',
                  lineHeight: '1.5',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <FaChevronRight style={{
                    fontSize: '9px',
                    color: '#00D4FF',
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 style={{
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '800',
              margin: '0 0 20px 0',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              position: 'relative',
              paddingBottom: '12px'
            }}>
              Get In Touch
              <span style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '36px',
                height: '3px',
                background: 'linear-gradient(90deg, #00D4FF 0%, #0099CC 100%)',
                borderRadius: '2px'
              }} />
            </h4>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Address — clickable → opens Google Maps */}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in Google Maps"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.25)',
                  color: '#00D4FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    letterSpacing: '0.2px'
                  }}>
                    Visit Our Store
                  </p>
                  <p style={{
                    margin: '4px 0 0',
                    fontSize: '13px',
                    color: '#94A3B8',
                    lineHeight: '1.5'
                  }}>
                    Varchgal, Naduvin Road,<br />
                    Varchagal, Karnataka 587122
                  </p>
                </div>
              </a>

              {/* Get Directions button */}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'rgba(0, 212, 255, 0.12)',
                  border: '1.5px solid rgba(0, 212, 255, 0.4)',
                  color: '#00D4FF',
                  borderRadius: '9px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '13px',
                  letterSpacing: '0.3px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#00D4FF';
                  e.currentTarget.style.color = '#0A1628';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 212, 255, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.12)';
                  e.currentTarget.style.color = '#00D4FF';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <FaDirections /> Get Directions
              </a>

              {/* Phone */}
              <a
                href="tel:9353368514"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.25)',
                  color: '#00D4FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  <FaPhoneAlt />
                </div>
                <div>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    letterSpacing: '0.2px'
                  }}>
                    Call Us
                  </p>
                  <p style={{
                    margin: '4px 0 0',
                    fontSize: '13px',
                    color: '#00D4FF',
                    fontWeight: '600'
                  }}>
                    9353368514
                  </p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919353368514"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  backgroundColor: 'rgba(37, 211, 102, 0.1)',
                  border: '1px solid rgba(37, 211, 102, 0.25)',
                  color: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  <FaWhatsapp />
                </div>
                <div>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    letterSpacing: '0.2px'
                  }}>
                    WhatsApp
                  </p>
                  <p style={{
                    margin: '4px 0 0',
                    fontSize: '13px',
                    color: '#25D366',
                    fontWeight: '600'
                  }}>
                    9353368514
                  </p>
                </div>
              </a>
            </div>

            {/* CTA button */}
            <button
              onClick={() => navigate('/orderstatus')}
              style={{
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '11px 18px',
                background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                color: '#0A1628',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0, 212, 255, 0.3)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 212, 255, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.3)';
              }}
            >
              Track Order <FaArrowRight />
            </button>
          </div>
        </div>

        {/* ===== Bottom bar ===== */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#94A3B8',
            fontWeight: '500',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>
              &copy; {currentYear}{' '}
              <span style={{ color: '#FFFFFF', fontWeight: '700' }}>
                Patil Brothers
              </span>. All rights reserved.
            </span>
            <span style={{ color: '#475569', fontWeight: '400' }}>|</span>
            <span style={{ color: '#64748B', fontWeight: '500' }}>
              Developed by{' '}
              <a
                href="https://aksoftwareco.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#00D4FF',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#00D4FF'; }}
              >
                https://aksoftwareco.in/
              </a>
            </span>
          </p>

          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#94A3B8',
            fontWeight: '500'
          }}>
            Borewell Camera & Borewell Lock
          </p>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1000px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 36px !important;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}