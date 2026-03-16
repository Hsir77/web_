import api from "../index";

// 注册用户
export async function register(data: {
  username: string;
  password: string;
  role_name:string
}) {
  const res = await api.post("/register", data, { timeout: 15000 });
  return res.data;
}

// 删除用户
export async function deleteUser(data: { username: number }) {
  const res = await api.post("/deleteUser", data, { timeout: 15000 });
  return res.data;
}

// 获取用户列表
export async function getUserList() {
  const res = await api.get("/user", { timeout: 15000 });
  return res.data;
}

// ============== 超管角色接口 ==============
// 获取角色列表
export async function getRoleList() {
  const res = await api.get("/roleList", { timeout: 15000 });
  return res.data;
}

// 修改用户角色
export async function changeUserRole(data: {
  username: string;
  role_name: string;
}) {
  const res = await api.post("/roleChange", data, { timeout: 15000 });
  return res.data;
}