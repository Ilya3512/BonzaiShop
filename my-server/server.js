const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 5000; // Используем переменную окружения

// Настройка CORS и парсинга JSON
app.use(cors());
app.use(express.json());

// Подключение к базе данных PostgreSQL с использованием переменных окружения
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "plants_db",
  password: process.env.DB_PASSWORD || "123",
  port: process.env.DB_PORT || 5432,
});

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Корневой маршрут
app.get("/", (req, res) => {
  res.send("Welcome to the Plants API!");
});

// Получение всех растений
app.get("/plants", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM plants");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

// Получение растения по ID
app.get("/plants/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM plants WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).send("Растение не найдено");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

// Обновление статуса растения по ID
app.put("/plants/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`Обновление растения с ID: ${id}, новый статус: ${status}`);

  try {
    const result = await pool.query(
      "UPDATE plants SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Растение не найдено");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

// Настройка multer для загрузки изображений
const upload = multer({ dest: "uploads/" });

// Маршрут для распознавания растения по изображению
app.post("/identify-plant", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Изображение не загружено" });
  }

  const imagePath = req.file.path;

  try {
    const image = fs.readFileSync(imagePath, { encoding: "base64" });

    const response = await axios.post(
      "https://plant.id/api/v3/identification",
      {
        images: [image],
        latitude: 49.207,
        longitude: 16.608,
        similar_images: true,
      },
      {
        headers: {
          "Api-Key": process.env.PLANT_ID_API_KEY, // Используем переменную окружения
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status !== "COMPLETED") {
      return res.status(400).json({ error: "Обработка не завершена" });
    }

    // Возвращаем весь ответ, если статус COMPLETED
    return res.json(response.data);
  } catch (error) {
    console.error(
      "Ошибка при распознавании растения:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ error: "Внутренняя ошибка сервера", details: error.message });
  } finally {
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Ошибка при удалении файла:", err);
    });
  }
});

// Настройка nodemailer для отправки почты
const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Используем переменную окружения
    pass: process.env.EMAIL_PASSWORD, // Используем переменную окружения
  },
  logger: true,
  debug: true,
});

// Маршрут для отправки письма
app.post("/send-email", async (req, res) => {
  console.log("Получены данные для отправки email:", req.body);
  const {
    fullName,
    email,
    phone,
    address,
    deliveryMethod,
    cartItems,
    totalAmount,
    deliveryDate,
    transactionId,
  } = req.body;

  const itemsText = cartItems
    .map((item) => `${item.name}: ${item.quantity} шт. по ${item.price} руб. `)
    .join("\n");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO orders
        (fullName, email, phone, address, deliveryMethod, cartItems, totalAmount, deliveryDate, orderStatus, transactionId)
      VALUES
        (\\$1, \\$2, \\$3, \\$4, \\$5, \\$6::json, \\$7, \\$8, 'в обработке', \\$9)
      RETURNING id
    `;
    const insertValues = [
      fullName,
      email,
      phone,
      address,
      deliveryMethod,
      JSON.stringify(cartItems),
      totalAmount,
      deliveryDate,
      transactionId || "",
    ];

    const result = await client.query(insertQuery, insertValues);
    const orderId = result.rows[0].id;

    const mailOptions = {
      from: process.env.EMAIL_USER, // Используем переменную окружения
      to: email,
      subject: `Подтверждение вашего заказа №${orderId}`,
      text:
        `Здравствуйте, ${fullName}!\n\n` +
        `Спасибо за ваш заказ! Мы рады сообщить, что ваш заказ №${orderId} принят и находится в обработке.\n\n` +
        `Детали вашего заказа:\n\n` +
        `${itemsText}\n` +
        `Итоговая сумма: ${totalAmount} руб. (включая налоги и доставку)\n\n` +
        `Адрес доставки:\n` +
        `${address}\n\n` +
        `Способ доставки: ${deliveryMethod}\n` +
        `Ожидаемая дата доставки: ${deliveryDate}\n\n` +
        `Если у вас есть вопросы, не стесняйтесь обращаться к нам по телефону +7 (918) 35-10-789 или по электронной почте ${process.env.EMAIL_USER}.\n\n` +
        `Спасибо за ваш выбор!\n` +
        `С уважением,\n` +
        `Bonzaishop.ru`,
    };

    await transporter.sendMail(mailOptions);

    await client.query("COMMIT");

    res
      .status(200)
      .send(`Email успешно отправлен и заказ №${orderId} сохранён в базе`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Ошибка при обработке заказа:", error);
    res.status(500).send("Ошибка при обработке заказа");
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Сервер запущен на http://0.0.0.0:${PORT}`);
});
