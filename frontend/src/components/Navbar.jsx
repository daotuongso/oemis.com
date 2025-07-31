import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function AppNavbar() {
  const { token, roles, logout } = useAuth();
  const { cart } = useCart();
  const itemCount = cart?.items?.length || 0;
  const nav = useNavigate();

  const isAdmin      = roles.includes("Admin");
  const isSales      = roles.includes("Sales")   || isAdmin;   // ➜ mới
  const isWarehouse  = roles.includes("Warehouse") || isAdmin;
  const isPurchasing = roles.includes("Purchasing") || isAdmin;
  const isAcc        = roles.includes("Accountant") || isAdmin;
  const isCustomer   = roles.includes("Customer");

  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">Orchid Store</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>

            {isCustomer && (
              <>
                <Nav.Link as={Link} to="/cart">
                  Giỏ hàng{" "}
                  {itemCount > 0 && <Badge bg="secondary">{itemCount}</Badge>}
                </Nav.Link>
                <Nav.Link as={Link} to="/myorders">Đơn hàng của tôi</Nav.Link>
              </>
            )}

            {(isAdmin || isWarehouse || isPurchasing || isSales || isAcc) && (
              <NavDropdown title="Quản trị" id="admin-menu">
                {isAdmin && (
                  <>
                    <NavDropdown.Item as={Link} to="/admin/categories">Danh mục</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/products">Sản phẩm</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/users">Người dùng</NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}

                {isWarehouse && (
                  <>
                    <NavDropdown.Item as={Link} to="/admin/stock">Kho hàng</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/stock/report">Báo cáo kho</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/stock/count">Kiểm kê kho</NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}

                {isPurchasing && (
                  <>
                    <NavDropdown.Item as={Link} to="/admin/suppliers">Nhà CC</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/pr">PR</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/po">PO</NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}

                {(isAdmin || isSales) && (   /* ➜ cho Admin & Sales */
                  <>
                    <NavDropdown.Item as={Link} to="/admin/orders">Đơn hàng</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/customers">Khách hàng</NavDropdown.Item>
                    {isAdmin && <NavDropdown.Item as={Link} to="/admin/reports">Báo cáo</NavDropdown.Item>}
                    <NavDropdown.Divider />
                  </>
                )}

                {isAcc && (
                  <>
                    <NavDropdown.Item as={Link} to="/admin/coas">Danh mục TK</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/journals">Nhật ký</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/ledger">Sổ cái</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/ledger/1">Sổ cái TK #1</NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            )}
          </Nav>

          <Nav>
            {token ? (
              <Nav.Link onClick={() => { logout(); nav("/login"); }}>Đăng xuất</Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
                <Nav.Link as={Link} to="/register">Đăng ký</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
