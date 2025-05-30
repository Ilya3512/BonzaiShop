import "./Delivery.css";

function Delivery() {
  return (
    <div>
      <div className="delivery-container1">
        <div className="delivery-container">
          <h1>Информация о доставке</h1>
          <p>
            Мы рады предложить вам быструю и надежную доставку наших товаров!
            Вот несколько ключевых моментов, которые стоит знать:
          </p>
          <h2>Способы доставки</h2>
          <ul>
            <li>
              <strong>Курьерская доставка:</strong> Мы предлагаем курьерскую
              доставку по городу. Заказы, оформленные до 15:00, будут доставлены
              в тот же день. Стоимость доставки составляет 300 ₽.
            </li>
            <li>
              <strong>Почтовая доставка:</strong> Мы также отправляем заказы
              через почту. Срок доставки составляет от 3 до 7 рабочих дней в
              зависимости от вашего региона. Стоимость зависит от веса посылки и
              начинается от 150 ₽.
            </li>
            <li>
              <strong>Самовывоз:</strong> Вы можете забрать свой заказ в нашем
              магазине. Мы находимся по адресу: ул. Цветочная, д. 10. Часы
              работы: Пн-Пт с 10:00 до 19:00, Сб-Вс с 11:00 до 17:00.
            </li>
          </ul>
          <h2>Отслеживание заказа</h2>
          <p>
            После оформления заказа вы получите номер для отслеживания, который
            позволит вам следить за статусом доставки. Мы отправим вам
            уведомление, как только ваш заказ будет отправлен.
          </p>
          <h2>Условия возврата</h2>
          <p>
            Если вам не подошел товар, вы можете вернуть его в течение 14 дней с
            момента получения. Мы принимаем возвраты при условии, что товар не
            использовался и сохранен в оригинальной упаковке. Для возврата
            свяжитесь с нашей службой поддержки.
          </p>
          <h2>Контактная информация</h2>
          <p>
            Если у вас есть вопросы по доставке, вы можете обратиться в нашу
            службу поддержки:
          </p>
          <ul>
            <li>Телефон: +7 (999) 123-45-67</li>
            <li>Email: support@example.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Delivery;
