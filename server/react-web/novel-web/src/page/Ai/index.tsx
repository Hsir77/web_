import { useState } from "react";
import styles from "./index.module.css";
import useAiStore from "../../store/ai";
import { sendAiChatMessage } from "../../api/ai";

export default function AIChat() {
  const [value, setValue] = useState("");
  const aiStore = useAiStore();

  const exampleQuestions = [
    "网络小说近一年的题材和类型趋势是什么？",
    "如果我想写一部玄幻小说，该怎么安排章节和剧情？",
    "最近热门历史小说在人物刻画和情节设计上有什么规律？",
    "网络小说整体的章节安排和常用套路是什么？",
  ];

  const handleConfirm = async () => {
    const userInput = value.trim();
    if (!userInput) return;
    setValue("");

    try {
      await sendAiChatMessage([{ role: "user", content: userInput }]);
    } catch (err) {
      console.error("发送失败", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleConfirm();
  };

  return (
    <div className={styles.container}>
      {/* 左侧使用说明 */}
      <div className={styles.leftPanel}>
        <div className={styles.title}>使用说明示例</div>

        <div className={styles.chatBubbleUser}>
          用户问题：最近热门小说的写作模板和结构是怎样的？
        </div>

        <div className={styles.chatBubbleAI}>
          <p>
            热门小说整体呈现“长篇化+强标签化+多线并行”写作模板，
            玄幻奇幻类占据绝对主流（共37部，占比超60%），平均字数达715万字，
            远超其他品类。
          </p>
          <p>
            结构上普遍采用“低开高走、阶段跃迁”式章节安排，
            以修炼体系或权力进阶为主线，并辅以身份反转（如“逆袭”“扮猪吃虎”）。
          </p>
          <p>
            常用写作手法高度依赖标签组合，例如：
            “开局流+九封婚书”“重生+八零”“血脉+逆天邪神”等。
          </p>
        </div>
      </div>

      {/* 中间聊天区 */}
      <div className={styles.chatArea}>
        <div className={styles.messageWrapper}>
          {aiStore.messages.length === 0 && (
            <div className={styles.tipText}>
              请输入你的问题，我会为你解答
            </div>
          )}

          {aiStore.messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.role === "user"
                  ? styles.chatBubbleUser
                  : styles.chatBubbleAI2
              }
            >
              {msg.content.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.inputBar}>
          <input
            className={styles.inputField}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入问题..."
          />
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            发送
          </button>
        </div>
      </div>

      {/* 右侧问题示例 */}
      <div className={styles.rightPanel}>
        <div className={styles.title}>问题示例</div>
        {exampleQuestions.map((item, index) => (
          <div
            key={index}
            className={styles.exampleItem}
            onClick={() => setValue(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}