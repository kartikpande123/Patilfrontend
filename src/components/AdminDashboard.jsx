import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaBoxes, 
  FaComments,
  FaSignOutAlt,
  FaUserShield,
  FaList
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import API_BASE_URL from './ApiConfig';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Get admin info from localStorage
  const adminId = localStorage.getItem('adminId') || 'Admin';

  // Count of pending inquiries (shown as badge on Customer Inquiries card)
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch inquiries on mount → count how many have status "pending"
  useEffect(() => {
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries`);
      if (!res.ok) throw new Error('Failed to fetch inquiries');
      const data = await res.json();
      if (data.success && data.data) {
        const pending = Object.values(data.data).filter(
          (inq) => (inq.status || 'pending') === 'pending'
        ).length;
        setPendingCount(pending);
      }
    } catch (err) {
      console.error('Failed to load pending count:', err);
      // Silent fail — dashboard should still work even if this fails
    }
  };

  // Navigation functions
  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Remove all admin-related localStorage items
    localStorage.removeItem('PatilAdminLogin');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminData');
    
    console.log('Logged out successfully');
    console.log('PatilAdminLogin removed:', localStorage.getItem('PatilAdminLogin'));
    
    // Navigate to login page
    navigate('/');
  };

  // Dashboard cards data
  const dashboardCards = [
    {
      id: 1,
      title: 'Add Category',
      icon: <FaList />,
      path: '/addcategory',
      color: '#7C3AED',
      bgColor: 'rgba(124, 58, 237, 0.1)',
      description: 'Organize your products into categories'
    },
    {
      id: 2,
      title: 'Add Products',
      icon: <FaPlus />,
      path: '/add-products',
      color: '#00D4FF',
      bgColor: 'rgba(0, 212, 255, 0.1)',
      description: 'Add new products to your store'
    },
    {
      id: 3,
      title: 'Manage Products',
      icon: <FaBoxes />,
      path: '/manage-products',
      color: '#FF6B35',
      bgColor: 'rgba(255, 107, 53, 0.1)',
      description: 'Edit, update or remove products'
    },
    {
      id: 4,
      title: 'Customer Inquiries',
      icon: <FaComments />,
      path: '/customer-inquiries',
      color: '#25D366',
      bgColor: 'rgba(37, 211, 102, 0.1)',
      description: 'View and respond to customer queries',
      badge: pendingCount > 0 ? pendingCount : null
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F1F5F9',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Navbar */}
      <nav style={{
        backgroundColor: '#0A1628',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 6px 20px rgba(10, 22, 40, 0.25)',
        borderBottom: '3px solid #00D4FF',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MdDashboard style={{ color: '#00D4FF', fontSize: '28px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.15' }}>
            <span style={{
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '800',
              letterSpacing: '0.3px'
            }}>
              Patil Brothers
            </span>
            <span style={{
              color: '#00D4FF',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              Borewell Camera & Borewell Lock
            </span>
          </div>
          <div style={{
            width: '1px',
            height: '30px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            margin: '0 6px'
          }} />
          <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '16px', fontWeight: '600' }}>
            Admin Dashboard
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            border: '1.5px solid rgba(0, 212, 255, 0.35)',
            padding: '6px 14px',
            borderRadius: '20px'
          }}>
            <FaUserShield style={{ color: '#00D4FF', fontSize: '18px' }} />
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
              {adminId}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.25)',
              color: '#E2E8F0',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.15)';
              e.currentTarget.style.borderColor = '#FF6B35';
              e.currentTarget.style.color = '#FF6B35';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.color = '#E2E8F0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '30px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.05)',
          border: '2px solid #CBD5E1',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Accent bar */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '5px',
            background: 'linear-gradient(180deg, #00D4FF 0%, #0099CC 100%)'
          }} />

          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '800', 
            color: '#0A1628',
            margin: 0,
            letterSpacing: '-0.3px'
          }}>
            Welcome back, {adminId}! 👋
          </h1>
          <p style={{ 
            color: '#475569', 
            margin: '6px 0 0',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Manage your store efficiently from here
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigateTo(card.path)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '30px',
                border: '2px solid #94A3B8',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1), 0 2px 6px rgba(15, 23, 42, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${card.color}30, 0 8px 16px rgba(15, 23, 42, 0.12)`;
                e.currentTarget.style.borderColor = card.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.1), 0 2px 6px rgba(15, 23, 42, 0.06)';
                e.currentTarget.style.borderColor = '#94A3B8';
              }}
            >
              {/* 🔔 Pending count badge */}
              {card.badge && (
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  minWidth: '28px',
                  height: '28px',
                  padding: '0 9px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #E85A24 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '800',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.5)',
                  border: '2.5px solid #FFFFFF',
                  letterSpacing: '0.3px',
                  zIndex: 2
                }}>
                  {card.badge}
                </div>
              )}

              {/* Icon */}
              <div style={{
                backgroundColor: card.bgColor,
                color: card.color,
                width: '64px',
                height: '64px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '18px',
                transition: 'all 0.3s ease',
                border: `1.5px solid ${card.color}35`
              }}>
                {card.icon}
              </div>

              {/* Content */}
              <h3 style={{
                fontSize: '18px',
                fontWeight: '800',
                color: '#0A1628',
                margin: '0 0 8px 0',
                letterSpacing: '-0.2px'
              }}>
                {card.title}
              </h3>
              
              <p style={{
                fontSize: '14px',
                color: '#475569',
                margin: '0 0 18px 0',
                lineHeight: '1.55',
                fontWeight: '500'
              }}>
                {card.description}
              </p>

              {/* Arrow indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: card.color,
                fontSize: '13px',
                fontWeight: '800',
                letterSpacing: '0.3px'
              }}>
                <span>Navigate</span>
                <span style={{ fontSize: '16px' }}>→</span>
              </div>

              {/* Decorative gradient top bar — thicker & more visible */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${card.color}, ${card.color}40)`,
                opacity: 0.85
              }} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '2px solid #CBD5E1',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#64748B',
            fontSize: '13px',
            margin: 0,
            fontWeight: '500'
          }}>
            &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}