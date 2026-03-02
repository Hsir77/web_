const userBookshelfModel = require("../models/userBookshelfModel");

async function updateLastViewTime(user_id, book_id) {
  if (!user_id || !book_id) return;

  try {
    await userBookshelfModel.updateLastViewTime(user_id, book_id);
  } catch (err) {
    console.error("LRU 更新失败:", err);
  }
}

module.exports = {
  updateLastViewTime,
};