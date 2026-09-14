import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import UserDashboard from "./components/UserDashboard";
import AdminAddProducts from "./components/AdminAddProducts";
import AdminManageProducts from "./components/AdminManageProducts";
import AdminCustomor from "./components/AdminCustomor";
import AdminCategory from "./components/AdminCategory";
import Contact from "./components/Contact";
import About from "./components/About";
import OrderStatus from "./components/OrderStatus";
import AdminAdd from "./components/AdminAdd";

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }) => {
  // Check for both PatilAdminLogin and adminLoggedIn flags
  const isAdminLoggedIn = 
    localStorage.getItem("PatilAdminLogin") === "True" || 
    localStorage.getItem("adminLoggedIn") === "true";

  if (!isAdminLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<UserDashboard />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/orderstatus" element={<OrderStatus />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admindashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/add-products"
            element={
              <ProtectedAdminRoute>
                <AdminAddProducts />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/manage-products"
            element={
              <ProtectedAdminRoute>
                <AdminManageProducts />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/customer-inquiries"
            element={
              <ProtectedAdminRoute>
                <AdminCustomor />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/addcategory"
            element={
              <ProtectedAdminRoute>
                <AdminCategory />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedAdminRoute>
                <AdminAdd />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;