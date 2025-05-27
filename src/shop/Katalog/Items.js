import { useEffect, useState } from "react";
import axios from "axios";

const usePlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get(
          "https://bonzaishop-server.onrender.com/plants"
        );
        setPlants(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setError(
          "Не удалось загрузить растения. Пожалуйста, попробуйте позже."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  return { plants, loading, error };
};

export default usePlants;
