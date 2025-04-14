// Тестовый скрипт для проверки функций без Firebase CLI
const admin = require('firebase-admin');
const axios = require('axios');

// Мок авторизации
const context = {
  auth: {
    uid: 'test-user'
  }
};

// Мок данных
const testData = {
  action: "publish",
  botToken: "test-token",
  chatId: "@test-channel",
  text: "Test message from local script"
};

// Инициализация Firebase Admin (мок)
admin.initializeApp({
  projectId: 'test-project'
});

// Импорт функции
const { manageTelegramPost } = require('./index');

// Тестирование
(async () => {
  console.log("Testing manageTelegramPost...");
  
  try {
    const result = await manageTelegramPost(testData, context);
    console.log("✅ Success:", result);
  } catch (error) {
    console.log("❌ Error:", error.message);
    console.log("Stack:", error.stack);
  }
  
  console.log("Test completed");
})();
