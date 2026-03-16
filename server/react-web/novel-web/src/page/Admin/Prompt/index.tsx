import { useState, useEffect } from "react";
import useUserStore from "../../../store/user";
import { getLatestPromptConfig, updatePromptConfig } from "../../../api/admin/prompt";

export default function PromptManager() {
  const [sqlPrompt, setSqlPrompt] = useState("");
  const [textPrompt, setTextPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const { permissions } = useUserStore();
  const canSearch = permissions.includes("prompt:search");
  const canEdit = permissions.includes("prompt:edit");

  const loadConfig = async () => {
    if (!canSearch) return;
    setLoading(true);
    try {
      const data = await getLatestPromptConfig();
      setSqlPrompt(data.sql_prompt ?? "");
      setTextPrompt(data.text_prompt ?? "");
    } catch (err) {
      console.error("加载失败", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!canEdit) return;
    setSaveLoading(true);
    try {
      await updatePromptConfig({ sql_prompt: sqlPrompt, text_prompt: textPrompt });
      alert("保存成功");
    } catch (err) {
      console.error("保存失败", err);
      alert("保存失败");
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, [canSearch]);

  return (
    <div style={{
      padding: "16px",
      height: "92vh",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    }}>
      <div style={{ marginBottom: 12 }}>
        <h2>Prompt 配置管理</h2>
        <div style={{ fontSize: 14, color: "#666" }}>
          {canSearch ? "✅ 可查看" : "❌ 无查看权限"} &nbsp;&nbsp;
          {canEdit ? "✅ 可编辑" : "❌ 无编辑权限"}
        </div>
      </div>

      {/* 两列编辑器 · 占满剩余屏幕 */}
      <div style={{
        display: "flex",
        gap: "16px",
        flex: 1,
        minHeight: 0,
      }}>
        {/* SQL Prompt */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h4 style={{ marginBottom: 8 }}>🧾 SQL Prompt</h4>
          <textarea
            value={sqlPrompt}
            onChange={(e) => setSqlPrompt(e.target.value)}
            disabled={!canEdit}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: 13,
              border: "1px solid #dcdfe6",
              borderRadius: "8px",
              resize: "none",
              backgroundColor: canEdit ? "#fff" : "#f5f7fa",
              overflowY: "auto",
            }}
          />
        </div>

        {/* Text Prompt */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h4 style={{ marginBottom: 8 }}>📝 Text Prompt</h4>
          <textarea
            value={textPrompt}
            onChange={(e) => setTextPrompt(e.target.value)}
            disabled={!canEdit}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: 13,
              border: "1px solid #dcdfe6",
              borderRadius: "8px",
              resize: "none",
              backgroundColor: canEdit ? "#fff" : "#f5f7fa",
              overflowY: "auto",
            }}
          />
        </div>
      </div>

      {/* 按钮栏 */}
      <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
        <button
          onClick={loadConfig}
          disabled={loading || !canSearch}
          style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd" }}
        >
          {loading ? "加载中..." : "刷新"}
        </button>

        {canEdit && (
          <button
            onClick={handleSave}
            disabled={saveLoading}
            style={{ padding: "8px 20px", backgroundColor: "#1677ff", color: "#fff", border: "none", borderRadius: 6 }}
          >
            {saveLoading ? "保存中..." : "保存"}
          </button>
        )}
      </div>
    </div>
  );
}