import api from "../index";
import useAiStore from "../../store/ai";

interface AiChatResult {
  userQuestion: string;
  sql: string;
  dbData: any;
  finalAnswer: string;
}

export async function sendAiChatMessage(
  messages: { role: "user"; content: string }[],
) {
  if (!messages.length) return null;

  const aiStore = useAiStore.getState();

  // 生成消息序号
  const lastIndex = aiStore.messages.length
    ? Math.max(...aiStore.messages.map((m) => m.questionIndex || 0))
    : 0;
  const questionIndex = lastIndex + 1;
  const timestamp = Date.now();

  try {
    // 1. 存储用户消息
    messages.forEach((msg) => {
      aiStore.addMessage({
        role: "user",
        content: msg.content,
        timestamp,
        questionIndex,
      });
    });

    // 2. 发送请求
    const res = await api.post("/qwen/chat/answer", { messages }, {
      timeout: 600000,
    });

    // 3. 解析数据
    const data = res.data as AiChatResult;

    // 4. 只存储 AI 回答 ✅
    aiStore.addMessage({
      role: "assistant",
      content: data.finalAnswer,
      timestamp,
      questionIndex,
    });

    // ==============================
    // SQL 相关代码 已全部删除 ✅
    // ==============================

    return data;
  } catch (err: any) {
    console.error("AI 请求失败：", err);

    const errorText = err.code === "ECONNABORTED"
      ? "AI 响应超时，请稍后重试"
      : "AI 消息发送失败，请检查服务";

    // 错误也不展示，只打印控制台
    console.log(errorText);

    throw err;
  }
}