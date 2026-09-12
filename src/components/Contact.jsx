import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaInstagram, 
  FaFacebookF,
  FaYoutube,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaAward,
  FaClock,
  FaDirections,
  FaArrowLeft
} from 'react-icons/fa';

export default function Contact() {
  const navigate = useNavigate();

  // ===== SCROLL TO TOP ON MOUNT =====
  // Ensures the page always opens from the top even if the previous
  // route/page was scrolled down.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, []);
  // ==================================

  const contactCards = [
    {
      icon: <FaPhoneAlt />,
      label: 'Call Us',
      value: '083102 05800',
      link: 'tel:08310205800',
      color: '#0099CC',
      bg: 'rgba(0, 153, 204, 0.08)'
    },
    {
      icon: <FaWhatsapp />,
      label: 'WhatsApp',
      value: '083102 05800',
      link: 'https://wa.me/918310205800',
      color: '#25D366',
      bg: 'rgba(37, 211, 102, 0.08)'
    },
    {
      icon: <FaInstagram />,
      label: 'Instagram',
      value: '@patilbrothers',
      link: 'https://www.instagram.com/patil_brothers_855?utm_source=qr&igsi=MXBvYXR6MDM1ZXZ6eQ==',
      color: '#E1306C',
      bg: 'rgba(225, 48, 108, 0.08)'
    },
    {
      icon: <FaFacebookF />,
      label: 'Facebook',
      value: 'Patil Brothers',
      link: 'https://www.facebook.com/share/19K8uSbZKD/',
      color: '#1877F2',
      bg: 'rgba(24, 119, 242, 0.08)'
    },
    {
      icon: <FaYoutube />,
      label: 'YouTube',
      value: '@patil_brothers_855',
      link: 'https://youtube.com/@patil_brothers_855?si=JcJomK-e_Ro9bbup',
      color: '#FF0000',
      bg: 'rgba(255, 0, 0, 0.08)'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      paddingBottom: '60px'
    }}>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)',
        padding: '70px 24px 90px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'rgba(0, 212, 255, 0.08)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 107, 53, 0.06)'
        }} />

        {/* ===== Back Button — top-left ===== */}
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

        <div style={{ position: 'relative', zIndex: 1 }}>
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
            Get In Touch
          </span>

          <h1 style={{
            color: '#FFFFFF',
            fontSize: '42px',
            fontWeight: '800',
            margin: '0 0 16px 0',
            letterSpacing: '-0.5px',
            lineHeight: '1.2'
          }}>
            Contact <span style={{ color: '#00D4FF' }}>Patil Brothers</span>
          </h1>

          <p style={{
            color: '#CBD5E1',
            fontSize: '17px',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Have questions about our Borewell Cameras or Borewell Locks? We're here to help you 24/7.
          </p>
        </div>
      </div>

      {/* Contact Cards + Address Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '-50px auto 0',
        padding: '0 24px',
        position: 'relative',
        zIndex: 2
      }}>
        <div
          className="contact-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}
        >
          {/* 4 contact cards (Call, WhatsApp, Instagram, Facebook) */}
          {contactCards.slice(0, 4).map((card, idx) => (
            <a
              key={idx}
              href={card.link}
              target={card.link.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '28px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                border: '1px solid #E2E8F0',
                boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(15, 23, 42, 0.12)';
                e.currentTarget.style.borderColor = card.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(15, 23, 42, 0.08)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: card.bg,
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '16px'
              }}>
                {card.icon}
              </div>
              <p style={{
                fontSize: '13px',
                color: '#64748B',
                fontWeight: '600',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {card.label}
              </p>
              <p style={{
                fontSize: '16px',
                color: '#0A1628',
                fontWeight: '700',
                margin: 0,
                letterSpacing: '0.2px',
                wordBreak: 'break-word'
              }}>
                {card.value}
              </p>
            </a>
          ))}

          {/* ===== YouTube Card (5th contact card) ===== */}
          {(() => {
            const card = contactCards[4];
            return (
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '28px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(15, 23, 42, 0.12)';
                  e.currentTarget.style.borderColor = card.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(15, 23, 42, 0.08)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: card.bg,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginBottom: '16px'
                }}>
                  {card.icon}
                </div>
                <p style={{
                  fontSize: '13px',
                  color: '#64748B',
                  fontWeight: '600',
                  margin: '0 0 6px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {card.label}
                </p>
                <p style={{
                  fontSize: '16px',
                  color: '#0A1628',
                  fontWeight: '700',
                  margin: 0,
                  letterSpacing: '0.2px',
                  wordBreak: 'break-word'
                }}>
                  {card.value}
                </p>
              </a>
            );
          })()}

          {/* ===== Visit Our Store Card — placed beside YouTube ===== */}
          <div
            className="visit-store-card"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px 22px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '14px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '18px',
                flexShrink: 0
              }}>
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0A1628',
                  lineHeight: '1.2'
                }}>
                  Visit Our Store
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>
                  Come see us in person
                </p>
              </div>
            </div>

            <div style={{
              padding: '12px 14px',
              backgroundColor: '#F8FAFC',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              marginBottom: '14px',
              flex: 1,
              display: 'flex',
              alignItems: 'center'
            }}>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#0F172A',
                fontWeight: '600',
                lineHeight: '1.5'
              }}>
                Varchgal, Naduvin Road,<br />
                Varchagal, Karnataka 587122
              </p>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Varchagal+Naduvin+Road+Karnataka+587122"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '11px 16px',
                background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                color: '#FFFFFF',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '13px',
                boxShadow: '0 4px 15px rgba(0, 212, 255, 0.25)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.3px',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.25)';
              }}
            >
              <FaDirections /> Get Directions
            </a>
          </div>
        </div>
      </div>

      {/* Why Choose Us Card (now full-width below) */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        padding: '0 24px'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #E85A24 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '18px'
            }}>
              <FaAward />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '700',
                color: '#0A1628'
              }}>
                Why Choose Us?
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>
                Trusted by customers across India
              </p>
            </div>
          </div>

          <div
            className="why-choose-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '14px'
            }}
          >
            {[
              { icon: <FaAward />, text: 'Best Quality Products', color: '#F59E0B' },
              { icon: <FaShieldAlt />, text: 'Strong & Durable', color: '#0099CC' },
              { icon: <FaClock />, text: '24/7 Customer Support', color: '#25D366' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 18px',
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '17px',
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <span style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#0F172A'
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        padding: '0 24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)',
          borderRadius: '16px',
          padding: '40px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          boxShadow: '0 10px 30px rgba(10, 22, 40, 0.15)'
        }}>
          <div>
            <h3 style={{
              margin: '0 0 6px 0',
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: '700'
            }}>
              Need Immediate Assistance?
            </h3>
            <p style={{
              margin: 0,
              color: '#CBD5E1',
              fontSize: '15px'
            }}>
              Call us directly — we're available for you
            </p>
          </div>
          <a
            href="tel:08310205800"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #E85A24 100%)',
              color: '#FFFFFF',
              padding: '16px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '18px',
              boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
              transition: 'all 0.3s ease',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 107, 53, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.3)';
            }}
          >
            <FaPhoneAlt style={{ fontSize: '22px' }} />
            083102 05800
          </a>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1100px) {
          .contact-cards-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 900px) {
          .contact-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .why-choose-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          h1 {
            font-size: 30px !important;
          }
          .contact-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}