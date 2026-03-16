import { lazy } from "react";
import { AppRoute } from "../types/route";
import PermissionGuard from "../router/AuthGuard";

// 管理员页面四个子页面
const Admin = lazy(() => import("../page/Admin/index"));
const Prompt = lazy(() => import("../page/Admin/Prompt/index"));
const NovaData = lazy(() => import("../page/Admin/NovelData/index"));
const Role = lazy(() => import("../page/Admin/Role/index"));

export const adminRoutes: AppRoute[] = [

      {
        path: "admin",
        element: (
          <PermissionGuard permission="user:list">
            <Admin />
          </PermissionGuard>
        ),
        meta: { title: "用户管理", permission: "user:list" },
      },
      {
        path: "prompt",
        element: (
          <PermissionGuard permission="prompt:search">
            <Prompt />
          </PermissionGuard>
        ),
        meta: { title: "Prompt调试", permission: "prompt:search" },
      },
      {
        path: "novadata",
        element: (
          <PermissionGuard permission="novel:add">
            <NovaData />
          </PermissionGuard>
        ),
        meta: { title: "小说增删", permission: "novel:add" },
      },
      {
        path: "user",
        element: (
          <PermissionGuard permission="user:list">
            <Role />
          </PermissionGuard>
        ),
        meta: { title: "角色管理", permission: "user:list" },
      },
    
  
];