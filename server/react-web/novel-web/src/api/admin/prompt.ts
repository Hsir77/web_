import api from "../index";

// 接口返回的 Prompt 类型
export interface PromptConfig {
  id?: number;
  sql_prompt: string;   // Prompt 内容
  text_prompt: string;   // Prompt 内容
  updateTime?: string;     // 更新时间
  updateUser?: string;     // 更新人
}

/**
 * 获取最新的 Prompt 配置（查看权限：admin）
 */
export async function getLatestPromptConfig() {
  const res = await api.get("/prompt/search", {
    timeout: 15000,
  });
  return res.data as PromptConfig;
}

/**
 * 更新 Prompt 配置（编辑权限：superadmin）
 */
export async function updatePromptConfig(data: {
  sql_prompt: string;
  text_prompt: string;
}) {
  const res = await api.post(
    "/prompt/edit",
    data,  // 直接传递完整对象
    { timeout: 15000 }
  );
  return res.data;
}