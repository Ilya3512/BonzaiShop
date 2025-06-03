import "./Whatisit.css";
import { useState, useRef } from "react";

function Whatisit() {
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = async () => {
    if (!file) {
      const botMessage = {
        sender: "bot",
        text: "Пожалуйста, загрузите изображение.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      return;
    }

    const fileType = file.type.split("/")[0];
    if (fileType !== "image") {
      const botMessage = {
        sender: "bot",
        text: "Пожалуйста, загрузите изображение.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      return;
    }

    // Создаем URL для файла
    const fileURL = URL.createObjectURL(file);
    const userMessage = { sender: "user", fileURL, fileName: file.name };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://bonzaishop-server.onrender.com/identify-plant",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        const suggestions = data.result.classification.suggestions || [];
        const plantName =
          suggestions.length > 0 ? suggestions[0].name : "Неизвестное растение";
        const probability = (data.result.is_plant.probability * 100).toFixed(2);
        const status = data.status;

        const similarImages = suggestions.flatMap((suggestion) =>
          suggestion.similar_images
            ? suggestion.similar_images.map((image) => image.url)
            : []
        );

        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Месяцы с 0
        const year = now.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;

        const botMessage = {
          sender: "bot",
          status,
          probability,
          plantName,
          similarImages,
          text: `Сегодня ${formattedDate} и вот результаты:\n=====================\n- Статус: ${status}\n- Вероятность, что это растение: ${probability}%\n- Имя растения: ${plantName}\n- Похожие изображения:`,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        const botMessage = {
          sender: "bot",
          text: data.message || "Произошла ошибка при распознавании растения.",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error("Ошибка при отправке изображения:", error);
      const botMessage = {
        sender: "bot",
        text: "Ошибка при отправке изображения на сервер. Попробуйте еще раз.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } finally {
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  return (
    <div>
      <div className="chat-page">
        <div className="chat-container">
          <h1>Чат для отправки изображений</h1>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text && (
                  <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>
                )}

                {msg.sender === "bot" &&
                  msg.similarImages &&
                  msg.similarImages.length > 0 && (
                    <div className="similar-images">
                      {msg.similarImages.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Похожее изображение ${i + 1}`}
                          className="similar-image"
                        />
                      ))}
                    </div>
                  )}

                {msg.sender === "user" && msg.fileURL && (
                  <img
                    src={msg.fileURL}
                    alt={msg.fileName}
                    className="attachment"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*"
              className="file-input"
              ref={fileInputRef}
            />
            <button onClick={handleSend} className="send-button">
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Whatisit;
