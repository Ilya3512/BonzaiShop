import { useState } from "react";
import "./Header.css";
import { NavLink, Outlet } from "react-router-dom";
import { useCart } from "../../basket/CartContext";
import Footer from "../Footer/Footer";

function MainLayout() {
  const { cartItems } = useCart();
  const itemCount = cartItems.length;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="header-container">
      <div className="header">
        <nav>
          <div className="container">
            <div className="burger" onClick={toggleMenu}>
              ☰
            </div>
            <div className="logo_item">
              <NavLink to="." end>
                <img src="/logo/2.jpg" alt="Логотип" className="logo" />
              </NavLink>
            </div>
            <div className={`menu ${menuOpen ? "open" : ""}`}>
              <button className="close-menu" onClick={closeMenu}>
                &times;
              </button>
              <div className="menu_item">
                <NavLink to="history" end onClick={closeMenu}>
                  Искусство бонсай
                </NavLink>
              </div>
              <div className="menu_item">
                <NavLink to="." end onClick={closeMenu}>
                  Магазин
                </NavLink>
              </div>
              <div className="menu_item">
                <NavLink to="delivery" onClick={closeMenu}>
                  Доставка
                </NavLink>
              </div>
              <div className="menu_item">
                <NavLink to="contacts" onClick={closeMenu}>
                  Контакты
                </NavLink>
              </div>
              <div className="menu_item">
                <NavLink to="Whatisit" onClick={closeMenu}>
                  Что это за растение?
                </NavLink>
              </div>
            </div>
            <div className="basket_item">
              <NavLink to="basket">
                <img
                  src="/logo/Cart.png"
                  alt="Корзина"
                  className="basket-icon"
                />
              </NavLink>
              {itemCount > 0 && (
                <span className="basket-count">{itemCount}</span>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

function Header() {
  return (
    <>
      <MainLayout />
      <Outlet />
      <Footer />
    </>
  );
}

export default Header;
