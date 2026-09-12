import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaShieldAlt, 
  FaAward, 
  FaUsers,
  FaTools,
  FaEye,
  FaBolt,
  FaHandshake,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';
import Footer from './Footer';

// The secret key sequence — typing this while on the About page
// navigates to /adminlogin. Case-insensitive.
const SECRET_CODE = 'admin';

export default function About() {
  const navigate = useNavigate();
  const keyBufferRef = useRef('');

  // ===== SCROLL TO TOP ON MOUNT =====
  // Ensures the page always opens from the top even if the previous
  // route/page was scrolled down.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // 'auto' = instant; use 'smooth' for animated
    });
  }, []);
  // ==================================

  // ===== SECRET KEYBOARD SHORTCUT =====
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }
      if (e.key.length !== 1) return;

      keyBufferRef.current = (keyBufferRef.current + e.key.toLowerCase())
        .slice(-SECRET_CODE.length);

      if (keyBufferRef.current === SECRET_CODE) {
        keyBufferRef.current = '';
        navigate('/adminlogin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
  // ===================================

  const features = [
    {
      icon: <FaAward />,
      title: 'Best Quality',
      description: 'Premium-grade Borewell Cameras & Locks built to last.',
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.08)'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Strong & Durable',
      description: 'Heavy-duty materials engineered for tough conditions.',
      color: '#0099CC',
      bg: 'rgba(0, 153, 204, 0.08)'
    },
    {
      icon: <FaUsers />,
      title: 'Customer First',
      description: 'Dedicated support team available for all your needs.',
      color: '#25D366',
      bg: 'rgba(37, 211, 102, 0.08)'
    }
  ];

  const services = [
    {
      icon: <FaEye />,
      title: 'Borewell Camera Inspection',
      description: 'HD CCTV inspection to detect cracks, blockages, and water sources inside borewells.',
    },
    {
      icon: <FaTools />,
      title: 'Stuck Motor Removal',
      description: 'Expert removal of jammed or stuck motors with minimal damage to the borewell.',
    },
    {
      icon: <FaBolt />,
      title: 'Borewell Cleaning',
      description: 'Complete cleaning and maintenance service to restore your borewell performance.',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Borewell Lock Installation',
      description: 'Secure, durable borewell locks to protect your water source from theft and damage.',
    },
    {
      icon: <FaHandshake />,
      title: 'Inner Casing Installation',
      description: 'Professional inner casing installation for damaged or collapsed borewells.',
    },
    {
      icon: <FaCheckCircle />,
      title: 'Live Video Report',
      description: 'Get real-time video inspection with a detailed report of your borewell condition.',
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)',
        padding: '80px 24px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(0, 212, 255, 0.06)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-120px',
          left: '-120px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(255, 107, 53, 0.05)'
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

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center'
        }}>
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
            About Us
          </span>

          <h1 style={{
            color: '#FFFFFF',
            fontSize: '44px',
            fontWeight: '800',
            margin: '0 0 20px 0',
            letterSpacing: '-0.5px',
            lineHeight: '1.2'
          }}>
            Welcome to <span style={{ color: '#00D4FF' }}>Patil Brothers</span>
          </h1>

          <p style={{
            color: '#CBD5E1',
            fontSize: '17px',
            maxWidth: '750px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            Your trusted partner for high-quality Borewell Cameras and Borewell Locks. 
            We combine years of expertise with cutting-edge technology to deliver 
            reliable solutions for every borewell challenge across India.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '70px auto 0',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'center'
      }} className="story-grid">
        <div>
          <span style={{
            display: 'inline-block',
            color: '#0099CC',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            Our Story
          </span>
          <h2 style={{
            fontSize: '34px',
            fontWeight: '800',
            color: '#0A1628',
            margin: '0 0 20px 0',
            letterSpacing: '-0.5px',
            lineHeight: '1.2'
          }}>
            Built on Trust, <br />
            <span style={{ color: '#0099CC' }}>Powered by Innovation</span>
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: '1.8',
            marginBottom: '16px'
          }}>
            Patil Brothers was founded with a simple mission — to make borewell 
            inspection and protection simple, reliable, and affordable for every 
            farmer, homeowner, and business across India.
          </p>
          <p style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: '1.8',
            marginBottom: '24px'
          }}>
            From high-precision HD Borewell Cameras to strong, tamper-proof 
            Borewell Locks, our products are designed and tested to perform 
            in the toughest conditions. Our commitment to quality and customer 
            satisfaction has made us a trusted name in the industry.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'Manufactured with premium-grade materials',
              'Tested for durability and reliability',
              'Backed by responsive customer support'
            ].map((point, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaCheckCircle style={{ color: '#0099CC', fontSize: '16px', flexShrink: 0 }} />
                <span style={{
                  fontSize: '14px',
                  color: '#0F172A',
                  fontWeight: '600'
                }}>
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Trust Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)',
          borderRadius: '20px',
          padding: '40px 32px',
          boxShadow: '0 20px 50px rgba(10, 22, 40, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(0, 212, 255, 0.08)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '26px',
              marginBottom: '20px'
            }}>
              <FaAward />
            </div>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: '700',
              margin: '0 0 14px 0',
              lineHeight: '1.3'
            }}>
              Trusted by Thousands Across India
            </h3>
            <p style={{
              color: '#CBD5E1',
              fontSize: '15px',
              lineHeight: '1.7',
              margin: '0 0 24px 0'
            }}>
              Our products power borewells in farms, factories, and homes across 
              the country. When you choose Patil Brothers, you choose reliability.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: 'rgba(0, 212, 255, 0.08)',
                borderRadius: '10px',
                border: '1px solid rgba(0, 212, 255, 0.2)'
              }}>
                <FaMapMarkerAlt style={{ color: '#00D4FF', fontSize: '16px' }} />
                <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
                  Varchagal, Karnataka — 587122
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 107, 53, 0.08)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 107, 53, 0.2)'
              }}>
                <FaPhoneAlt style={{ color: '#FF6B35', fontSize: '16px' }} />
                <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
                  083102 05800
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '80px auto 0',
        padding: '0 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{
            display: 'inline-block',
            color: '#0099CC',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            Why Choose Us
          </span>
          <h2 style={{
            fontSize: '34px',
            fontWeight: '800',
            color: '#0A1628',
            margin: '0 0 14px 0',
            letterSpacing: '-0.5px',
            lineHeight: '1.2'
          }}>
            What Sets Us Apart
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#64748B',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            We don't just sell products — we deliver solutions built on quality, 
            trust, and commitment to our customers.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '32px 26px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(15, 23, 42, 0.1)';
                e.currentTarget.style.borderColor = feature.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(15, 23, 42, 0.04)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div style={{
                width: '58px',
                height: '58px',
                borderRadius: '14px',
                backgroundColor: feature.bg,
                color: feature.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '18px'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#0A1628',
                margin: '0 0 10px 0'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748B',
                margin: 0,
                lineHeight: '1.6'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '80px auto 0',
        padding: '0 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{
            display: 'inline-block',
            color: '#0099CC',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            Our Services
          </span>
          <h2 style={{
            fontSize: '34px',
            fontWeight: '800',
            color: '#0A1628',
            margin: '0 0 14px 0',
            letterSpacing: '-0.5px',
            lineHeight: '1.2'
          }}>
            Complete Borewell Solutions
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#64748B',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            From inspection to installation — we handle every aspect of your borewell needs.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '22px'
        }}>
          {services.map((service, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '26px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                transition: 'all 0.3s ease',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0099CC';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 153, 204, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(15, 23, 42, 0.03)';
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
              }}>
                {service.icon}
              </div>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0A1628',
                  margin: '0 0 8px 0'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#64748B',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '80px auto 60px',
        padding: '0 24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)',
          borderRadius: '20px',
          padding: '50px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(10, 22, 40, 0.2)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '250px',
            height: '250px',
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

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              color: '#FFFFFF',
              fontSize: '32px',
              fontWeight: '800',
              margin: '0 0 14px 0',
              letterSpacing: '-0.5px'
            }}>
              Ready to Get Started?
            </h2>
            <p style={{
              color: '#CBD5E1',
              fontSize: '16px',
              maxWidth: '600px',
              margin: '0 auto 30px',
              lineHeight: '1.6'
            }}>
              Explore our range of Borewell Cameras and Locks, or get in touch 
              with our team for personalized assistance.
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                  color: '#FFFFFF',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(0, 212, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.3px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 212, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.3)';
                }}
              >
                Shop Now <FaArrowRight />
              </button>

              <button
                onClick={() => navigate('/contact')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'transparent',
                  color: '#FFFFFF',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.3px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = '#00D4FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          .story-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          h1 {
            font-size: 32px !important;
          }
          h2 {
            font-size: 26px !important;
          }
        }
      `}</style>
    </div>
  );
}