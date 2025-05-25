import "./Contacts.css";

function Contacts() {
  return (
    <div>
      <div className="contacts-page">
        <div className="contacts-container">
          <h1>Контакты</h1>
          <p>
            Если у вас есть вопросы, не стесняйтесь обращаться к нам по
            следующим контактам:
          </p>
          <ul>
            <li>Телефон: +7 (999) 123-45-67</li>
            <li>Email: support@example.com</li>
            <li>Адрес: ул. Цветочная, д. 10, г. Москва</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
