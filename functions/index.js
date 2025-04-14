const functions = require("firebase-functions");
const axios = require("axios");
const admin = require("firebase-admin");

// Инициализация Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Управление постами в Telegram
exports.manageTelegramPost = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Требуется авторизация");
  }

  const { botToken, chatId, text, messageId, action } = data;

  try {
    if (action === "publish") {
      // Новая публикация
      const response = await axios.post(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          chat_id: chatId,
          text: text,
          parse_mode: "HTML"
        }
      );
      
      // Сохраняем пост в Firestore
      await db.collection("posts").add({
        userId: context.auth.uid,
        chatId,
        messageId: response.data.result.message_id,
        text,
        views: 0,
        clicks: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return { success: true, messageId: response.data.result.message_id };

    } else if (action === "edit" && messageId) {
      // Редактирование существующего
      await axios.post(
        `https://api.telegram.org/bot${botToken}/editMessageText`,
        {
          chat_id: chatId,
          message_id: messageId,
          text: text,
          parse_mode: "HTML"
        }
      );
      
      // Обновляем пост в Firestore
      const postSnapshot = await db.collection("posts")
        .where("messageId", "==", messageId)
        .limit(1)
        .get();

      if (!postSnapshot.empty) {
        await postSnapshot.docs[0].ref.update({
          text,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      return { success: true };
    }

    throw new functions.https.HttpsError("invalid-argument", "Неверное действие");
  } catch (error) {
    console.error("Ошибка:", error.response?.data);
    throw new functions.https.HttpsError("internal", "Ошибка Telegram API");
  }
});

// Получение статистики поста
exports.getPostStats = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Требуется авторизация");
  }

  const { postId } = data;

  const postDoc = await db.collection("posts").doc(postId).get();
  if (!postDoc.exists || postDoc.data().userId !== context.auth.uid) {
    throw new functions.https.HttpsError("not-found", "Пост не найден");
  }

  return {
    views: postDoc.data().views,
    clicks: postDoc.data().clicks,
    createdAt: postDoc.data().createdAt.toDate().toISOString(),
    updatedAt: postDoc.data().updatedAt.toDate().toISOString()
  };
});
