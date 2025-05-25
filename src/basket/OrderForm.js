import "./OrderForm.css";
import React, { useEffect, useState } from "react";
import $ from "jquery";
import "jquery-validation";
import "jquery-mask-plugin";

const OrderForm = ({ onClose, onSubmit, cartItems }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    $("input[name='phone']").mask("+7 (999) 999-99-99");

    $(".order-form").validate({
      rules: {
        fullName: {
          required: true,
          minlength: 2,
        },
        email: {
          required: true,
          email: true,
        },
        phone: {
          required: true,
        },
        address: {
          required: true,
          minlength: 5,
        },
      },
      messages: {
        fullName: {
          required: "Пожалуйста, введите ваше имя",
          minlength: "Имя должно содержать как минимум 2 символа",
        },
        email: {
          required: "Пожалуйста, введите ваш email",
          email: "Пожалуйста, введите корректный email",
        },
        phone: "Пожалуйста, введите номер телефона",
        address: {
          required: "Пожалуйста, введите адрес доставки",
          minlength: "Адрес должен содержать как минимум 5 символов",
        },
      },
      submitHandler: function (form) {
        const formData = {
          fullName: form.fullName.value,
          email: form.email.value,
          phone: form.phone.value,
          address: form.address.value,
        };

        if (typeof onSubmit === "function") {
          onSubmit(formData, cartItems);
        } else {
          console.error("onSubmit не является функцией");
        }
      },
    });

    setIsVisible(true);

    return () => {
      setIsVisible(false);
    };
  }, [onSubmit, cartItems]);

  return (
    <div className={`modal-overlay ${isVisible ? "show" : ""}`}>
      <div className="modal-content">
        <form className="order-form">
          <h2 style={{ marginBottom: "20px" }}>Оформление заказа</h2>
          <input type="text" name="fullName" placeholder="Имя" required />
          <input type="email" name="email" placeholder="Email" required />
          <input
            type="tel"
            name="phone"
            placeholder="Номер телефона"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Адрес доставки"
            required
          />

          <div className="form-buttons">
            <button type="submit">Подтвердить заказ</button>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
