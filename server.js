// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const countFile = path.join(__dirname, 'views.json');

// Функция для чтения текущего значения счетчика
function readCount() {
  if (!fs.existsSync(countFile)) {
    fs.writeFileSync(countFile, JSON.stringify({ views: 0 }), 'utf8');
    return 0;
  }
  try {
    const data = fs.readFileSync(countFile, 'utf8');
    const obj = JSON.parse(data);
    return obj.views || 0;
  } catch (err) {
    console.error('Ошибка чтения файла:', err);
    return 0;
  }
}

// Функция для записи нового значения счетчика
function writeCount(count) {
  fs.writeFileSync(countFile, JSON.stringify({ views: count }), 'utf8');
}

// Главная страница — увеличение счетчика и вывод HTML с количеством просмотров
app.get('/', (req, res) => {
  // Проверяем, что запрос пришёл с нужного домена
  const host = req.headers.host;
  if (host !== 'xarmaq-bio.vercel.app') {
    return res.send("Просчёт просмотров доступен только для xarmaq-bio.vercel.app");
  }

  // Если домен корректный, увеличиваем счётчик
  let views = readCount();
  views++;
  writeCount(views);

  res.send(`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Основной сайт</title>
  <style>
    body {
      background: #000;
      color: #fff;
      font-family: sans-serif;
      text-align: center;
      padding: 50px;
    }
    .counter {
      font-size: 2rem;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h1>Добро пожаловать на xarmaq-bio!</h1>
  <p class="counter">Количество просмотров: ${views}</p>
</body>
</html>`);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
