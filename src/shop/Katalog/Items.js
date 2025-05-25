import { useEffect, useState } from "react";
import axios from "axios";

const usePlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true); // Состояние для отслеживания загрузки
  const [error, setError] = useState(null); // Состояние для хранения ошибок

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/plants");
        setPlants(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setError(
          "Не удалось загрузить растения. Пожалуйста, попробуйте позже."
        ); // Устанавливаем сообщение об ошибке
      } finally {
        setLoading(false); // Устанавливаем состояние загрузки в false после завершения
      }
    };

    fetchPlants();
  }, []);

  return { plants, loading, error }; // Возвращаем объекты с данными, состоянием загрузки и ошибками
};

export default usePlants;
