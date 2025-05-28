import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "../../basket/CartContext";
import "./SingleItem.css";
import Footer from "../Footer/Footer";
import usePlants from "./Items";

const SingleItem = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { plants, loading, error } = usePlants(); // Предполагается, что usePlants возвращает loading и error
  const item = plants.find((item) => item.slug === params.slug);
  const { addToCart } = useCart();

  console.log("Slug из параметров:", params.slug);
  console.log("Найденный элемент:", item);
  console.log("Данные растений:", plants);

  useEffect(() => {
    if (!loading && !item) {
      navigate("..", { relative: "path" });
    }
  }, [item, loading, navigate]);

  const handleAddToCart = () => {
    if (item) {
      addToCart(item); // Добавляем товар в корзину, только если item существует
    }
  };

  if (loading) {
    return <div>Загрузка...</div>; // Показываем индикатор загрузки
  }

  if (error) {
    return <div>Ошибка: {error}</div>; // Обработка ошибок
  }

  return (
    <>
      <div className="main-container">
        <div className="main-container_iner">
          <div className="button-container-single">
            <Link to=".." relative="path" className="back-button">
              Все товары
            </Link>
            <Link to="/basket" className="back-basket">
              Перейти в корзину
            </Link>
          </div>
          <div className="card">
            <div className="item">
              <img className="item-image" src={item?.img} alt={item?.title} />
              <div className="item-title">
                <p>
                  Растение: <strong>{item?.title}</strong>
                </p>
                <p>
                  Тип: <strong>{item?.type}</strong>
                </p>
                <p>
                  Высота: <strong>{item?.height} см</strong>
                </p>
                <p>
                  Возраст: <strong>{item?.age} лет</strong>
                </p>
                <p>
                  Цена: <strong>{item?.price} ₽</strong>
                </p>
                <button onClick={handleAddToCart} className="styled-button">
                  Добавить в корзину
                </button>
              </div>
            </div>
            <div className="rules-care">
              <h2>Правила ухода за растением</h2>

              <div
                className="rules-content"
                dangerouslySetInnerHTML={{
                  __html:
                    item?.rules_of_care || "Правила ухода за растением - НЕТ.",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleItem;
