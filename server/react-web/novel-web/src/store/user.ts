import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { UserStoreState, UserInfo } from '../types/store';
// ---- 安全读取 localStorage ----
let initialUserInfo: UserInfo | null = null;
let initialPermissions: string[] = [];

try {
  const storedUserInfo = localStorage.getItem("userInfo");
  const storedPermissions = localStorage.getItem("permissions");

  if (storedUserInfo && storedUserInfo !== "undefined") {
    initialUserInfo = JSON.parse(storedUserInfo);
  }

  if (storedPermissions && storedPermissions !== "undefined") {
    initialPermissions = JSON.parse(storedPermissions);
  }
} catch (error) {
  console.warn("恢复 localStorage 用户信息失败，已清理:", error);
  localStorage.removeItem("userInfo");
  localStorage.removeItem("permissions");
}

// ---- 创建 store ----
const useUserStore = create(
  immer<UserStoreState>((set) => ({
    userInfo: initialUserInfo,
    permissions: initialPermissions,
    isLogin: initialUserInfo !== null && initialPermissions.length > 0,

    // 登录
    login: (data: { userInfo: UserInfo; permissions: string[] }) => {
      set((state) => {
        state.userInfo = data.userInfo;
        state.permissions = data.permissions;
        state.isLogin = true;
      });
      // 持久化
      localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
      localStorage.setItem("permissions", JSON.stringify(data.permissions));
    },

    // 登出 / 切换账号
    logout: () => {
      set((state) => {
        state.userInfo = null;
        state.permissions = [];
        state.isLogin = false;
      });
      // 清理 localStorage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("permissions");
    },
  }))
);

export default useUserStore;