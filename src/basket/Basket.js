import { useState } from "react";
import { useCart } from "./CartContext";
import "./Basket.css";
import { Link } from "react-router-dom";
import OrderForm from "./OrderForm";
import axios from "axios";
import usePlants from "../shop/Katalog/Items";

function Basket() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { plants, loading, error } = usePlants();
  const [deliveryMethod, setDeliveryMethod] = useState("courier"); // Состояние для способа доставки

  const handleRemove = (slug) => {
    removeFromCart(slug);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const calculateTotalAmount = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return total + price * quantity;
    }, 0);

    // Добавляем стоимость доставки
    const deliveryPrice = getDeliveryPrice(deliveryMethod);
    return subtotal + deliveryPrice;
  };

  const getDeliveryPrice = (method) => {
    switch (method) {
      case "courier":
        return 300;
      case "pickup":
        return 0;
      case "postal":
        return 200;
      default:
        return 0;
    }
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString("ru-RU") + " ₽";
  };

  const totalAmount = formatAmount(calculateTotalAmount());

  const formatCartItems = (cartItems) => {
    return cartItems.map((item) => ({
      name: item.title,
      price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")), // Преобразуем цену в число
      quantity: item.quantity, // Количество товара
    }));
  };

  const handleOrderSubmit = async (formData) => {
    try {
      const formattedCartItems = formatCartItems(cartItems); // Форматируем товары
      const totalAmountValue = calculateTotalAmount(); // Получаем итоговую сумму

      // Вычисляем дату доставки: сегодня + 3 дня
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      const formattedDeliveryDate = deliveryDate.toISOString().split("T")[0]; // Форматируем дату в формате YYYY-MM-DD

      // 1. Отправляем email через backend
      const emailResponse = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cartItems: formattedCartItems,
          totalAmount: totalAmountValue, // Добавляем сумму заказа
          deliveryMethod: deliveryMethod, // Добавляем способ доставки
          deliveryDate: formattedDeliveryDate, // Передаем дату доставки
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("Ошибка при отправке письма");
      }

      // 2. Обновляем статус товаров
      await Promise.all(
        cartItems.map(async (item) => {
          const itemToUpdate = plants.find((i) => i.id === item.id);
          if (itemToUpdate) {
            console.log(`Обновляем товар: ${itemToUpdate.id}, статус: false`);
            const response = await axios.put(
              `http://localhost:5000/plants/${itemToUpdate.id}`,
              { status: false }
            );
            console.log("Ответ от сервера:", response.data);
          } else {
            console.warn(`Товар с ID ${item.id} не найден в массиве растений.`);
          }
        })
      );

      // 3. Очищаем корзину и закрываем форму
      clearCart();
      setIsFormVisible(false);
      console.log("Заказ оформлен:", formData);
      alert("Заказ успешно оформлен и отправлен на почту!");
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      alert("Не удалось оформить заказ. Пожалуйста, попробуйте позже.");
    }
  };

  if (loading) {
    return <p>Загрузка растений...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="basket-container">
        <h1>Корзина</h1>
        {cartItems.length === 0 ? (
          <p>Корзина пуста. Добавьте товары для покупки!</p>
        ) : (
          <div className="basket-items">
            <ul>
              {cartItems.map((item) => (
                <li key={item.slug} className="basket-item">
                  <Link to={`/${item.slug}`} className="itemLink">
                    <img
                      className="basket-item-image"
                      src={item.img}
                      alt={item.title}
                    />
                  </Link>
                  <div className="basket-item-info">
                    <p className="item-title">
                      {item.title} - {item.price} ₽
                    </p>
                    <p className="item-quantity">Количество: {item.quantity}</p>
                  </div>
                  <div className="button-container">
                    <button
                      onClick={() => handleRemove(item.slug)}
                      className="remove-button"
                    >
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={handleClearCart} className="clear-cart-button">
              Очистить корзину
            </button>
          </div>
        )}
      </div>

      <div className="amount-items">
        <div className="delivery-and-amount">
          <div className="delivery-method">
            <label htmlFor="delivery-select">Способ доставки: </label>
            <select
              id="delivery-select"
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            >
              <option value="Сourier">Курьерская доставка (300 ₽)</option>
              <option value="Pickup">Самовывоз (бесплатно)</option>
              <option value="Postal">Почта (200 ₽)</option>
            </select>
          </div>

          <div className="amount">Сумма заказа: {totalAmount}</div>
        </div>

        <div>
          <button
            className="checkout-button"
            onClick={() => {
              if (cartItems.length > 0) {
                setIsFormVisible(true);
              } else {
                alert(
                  "Корзина пуста! Пожалуйста, добавьте товары в корзину перед оформлением заказа."
                );
              }
            }}
            disabled={cartItems.length === 0}
          >
            Оформить заказ
          </button>
        </div>
      </div>

      {isFormVisible && (
        <OrderForm
          onClose={() => setIsFormVisible(false)}
          onSubmit={handleOrderSubmit}
          cartItems={cartItems}
        />
      )}
    </div>
  );
}

export default Basket;
