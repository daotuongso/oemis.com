import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import Navbar from "./components/Navbar";
import PrivateRoute        from "./components/PrivateRoute";
import CategoryMasterDetail from "./components/CategoryMasterDetail";
import LoginPage            from "./components/LoginPage";
import RegisterPage         from "./components/RegisterPage";
import ForgotPasswordPage   from "./components/ForgotPasswordPage";
import ResetPasswordPage    from "./components/ResetPasswordPage";
import CartPage             from "./components/CartPage";
import CheckoutPage         from "./components/CheckoutPage";
import MyOrdersPage         from "./components/MyOrdersPage";

import CategoryListAdmin from "./components/CategoryListAdmin";
import CategoryForm      from "./components/CategoryForm";
import ProductListAdmin  from "./components/ProductListAdmin";
import ProductForm       from "./components/ProductForm";

import OrderListAdmin    from "./components/OrderListAdmin";
import OrderDetailAdmin  from "./components/OrderDetailAdmin";
import CustomerListAdmin from "./components/CustomerListAdmin";
import CustomerDetailAdmin from "./components/CustomerDetailAdmin";
import CustomerAddAdmin    from "./components/CustomerAddAdmin";
import CustomerGroupAdmin  from "./components/CustomerGroupAdmin";
import CustomerLogAdmin    from "./components/CustomerLogAdmin";

import UserListAdmin     from "./components/UserListAdmin";
import UserDetailAdmin   from "./components/UserDetailAdmin";

import WarehouseStockList from "./pages/admin/StockListAdmin";
import StockReport        from "./pages/admin/StockReport";
import StockCountPage     from "./pages/admin/StockCountPage";
import SupplierList       from "./pages/procurement/SupplierList";
import PrList             from "./pages/procurement/PrList";
import PoList             from "./pages/procurement/PoList";

import ChartOfAccountsPage from "./pages/admin/ChartOfAccountsPage";
import JournalList         from "./pages/admin/JournalList";
import LedgerReport        from "./pages/admin/LedgerReport";
import LedgerPage          from "./pages/admin/LedgerPage";
import ReportPage          from "./pages/admin/ReportPage";

import StockNotifier  from "./components/StockNotifier";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <StockNotifier />

        <div className="container my-4">
          <Routes>
            {/* ---------- Public ---------- */}
            <Route path="/" element={<CategoryMasterDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={
              <PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/myorders" element={
              <PrivateRoute><MyOrdersPage /></PrivateRoute>} />

            {/* ---------- CRM: Orders & Customers ---------- */}
            <Route path="/admin/orders" element={
              <PrivateRoute roles={["Admin","Sales"]}><OrderListAdmin/></PrivateRoute>} />
            <Route path="/admin/orders/:id" element={
              <PrivateRoute roles={["Admin","Sales"]}><OrderDetailAdmin/></PrivateRoute>} />

            <Route path="/admin/customers" element={
              <PrivateRoute roles={["Admin","Sales"]}><CustomerListAdmin/></PrivateRoute>} />
            <Route path="/admin/customers/new" element={
              <PrivateRoute roles={["Admin","Sales"]}><CustomerAddAdmin/></PrivateRoute>} />
            <Route path="/admin/customers/:id" element={
              <PrivateRoute roles={["Admin","Sales"]}><CustomerDetailAdmin/></PrivateRoute>} />
            <Route path="/admin/customers/groups" element={
              <PrivateRoute roles={["Admin","Sales"]}><CustomerGroupAdmin/></PrivateRoute>} />
            <Route path="/admin/customers/:id/logs" element={
              <PrivateRoute roles={["Admin","Sales"]}><CustomerLogAdmin/></PrivateRoute>} />

            {/* ---------- Admin-only (Catalog) ---------- */}
            <Route path="/admin/categories" element={
              <PrivateRoute roles={["Admin"]}><CategoryListAdmin/></PrivateRoute>} />
            <Route path="/admin/categories/new" element={
              <PrivateRoute roles={["Admin"]}><CategoryForm/></PrivateRoute>} />
            <Route path="/admin/categories/:id/edit" element={
              <PrivateRoute roles={["Admin"]}><CategoryForm/></PrivateRoute>} />

            <Route path="/admin/products" element={
              <PrivateRoute roles={["Admin"]}><ProductListAdmin/></PrivateRoute>} />
            <Route path="/admin/products/new" element={
              <PrivateRoute roles={["Admin"]}><ProductForm/></PrivateRoute>} />
            <Route path="/admin/products/:id/edit" element={
              <PrivateRoute roles={["Admin"]}><ProductForm/></PrivateRoute>} />

            <Route path="/admin/users" element={
              <PrivateRoute roles={["Admin"]}><UserListAdmin /></PrivateRoute>} />
            <Route path="/admin/users/:id" element={
              <PrivateRoute roles={["Admin"]}><UserDetailAdmin /></PrivateRoute>} />
            <Route path="/admin/reports" element={
              <PrivateRoute roles={["Admin"]}><ReportPage /></PrivateRoute>} />

            {/* ---------- Warehouse ---------- */}
            <Route path="/admin/stock" element={
              <PrivateRoute roles={["Warehouse","Admin"]}><WarehouseStockList/></PrivateRoute>} />
            <Route path="/admin/stock/report" element={
              <PrivateRoute roles={["Warehouse","Admin"]}><StockReport/></PrivateRoute>} />
            <Route path="/admin/stock/count" element={
              <PrivateRoute roles={["Warehouse","Admin"]}><StockCountPage/></PrivateRoute>} />

            {/* ---------- Purchasing ---------- */}
            <Route path="/admin/suppliers" element={
              <PrivateRoute roles={["Purchasing","Admin"]}><SupplierList/></PrivateRoute>} />
            <Route path="/admin/pr" element={
              <PrivateRoute roles={["Purchasing","Admin"]}><PrList/></PrivateRoute>} />
            <Route path="/admin/po" element={
              <PrivateRoute roles={["Purchasing","Admin"]}><PoList/></PrivateRoute>} />

            {/* ---------- Accounting ---------- */}
            <Route path="/admin/coas" element={
              <PrivateRoute roles={["Accountant","Admin"]}><ChartOfAccountsPage/></PrivateRoute>} />
            <Route path="/admin/journals" element={
              <PrivateRoute roles={["Accountant","Admin"]}><JournalList/></PrivateRoute>} />
            <Route path="/admin/ledger" element={
              <PrivateRoute roles={["Accountant","Admin"]}><LedgerReport/></PrivateRoute>} />
            <Route path="/admin/ledger/:accId" element={
              <PrivateRoute roles={["Accountant","Admin"]}><LedgerPage/></PrivateRoute>} />

            {/* ---------- Fallback ---------- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <ToastContainer position="top-center" autoClose={1800} />
      </CartProvider>
    </AuthProvider>
  );
}
