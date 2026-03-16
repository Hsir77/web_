import { Navigate, Outlet } from "react-router-dom";
import { lazy } from "react";
import {
  HomeOutlined,
  BookOutlined,
  TrophyOutlined,
  RobotOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
} from "@ant-design/icons";

import { AppRoute } from "../types/route";
import PermissionGuard from "./AuthGuard.tsx";
import { adminRoutes } from "./admin.tsx";

const Layout = lazy(() => import("../components/Layout"));
const Home = lazy(() => import("../page/Home"));
const BookShelf = lazy(() => import("../page/BookShelf"));
const Ranking = lazy(() => import("../page/Ranking"));
const Ai = lazy(() => import("../page/Ai"));
const Login = lazy(() => import("../page/Login"));
const NotFound = lazy(() => import("../page/NotFound"));
const Forbidden = lazy(() => import("../page/403/index.tsx"));
const Detail = lazy(() => import("../page/Detail"));
const Read = lazy(()=>import("../page/Read"))
/* 分类分析 */
const CategoryZongheng = lazy(
  () => import("../page/Analysis/Category/Zongheng"),
);
const CategoryQimao = lazy(() => import("../page/Analysis/Category/Qimao"));
const CategoryShuqi = lazy(() => import("../page/Analysis/Category/Shuqi"));

/* 内容分析 */
const ContentWordCount = lazy(
  () => import("../page/Analysis/Content/WordCount"),
);
const ContentStatus = lazy(() => import("../page/Analysis/Content/Status"));
const ContentGender = lazy(() => import("../page/Analysis/Content/Gender"));
const ContentChapter = lazy(() => import("../page/Analysis/Content/Chapter"));

/* 纵横热度 */
const PopularityZongheng1 = lazy(
  () => import("../page/Analysis/Popularity/Zongheng/WeeklySubscribe"),
);
const PopularityZongheng2 = lazy(
  () => import("../page/Analysis/Popularity/Zongheng/TotalSubscribe"),
);
const PopularityZongheng3 = lazy(
  () => import("../page/Analysis/Popularity/Zongheng/ClickSubscribe"),
);
const PopularityZongheng4 = lazy(
  () => import("../page/Analysis/Popularity/Zongheng/Top10"),
);

/* 七猫热度 */
const PopularityQimao1 = lazy(
  () => import("../page/Analysis/Popularity/Qimao/ReadCount"),
);
const PopularityQimao2 = lazy(
  () => import("../page/Analysis/Popularity/Qimao/Score"),
);
const PopularityQimao3 = lazy(
  () => import("../page/Analysis/Popularity/Qimao/ReadCountScore"),
);
const PopularityQimao4 = lazy(
  () => import("../page/Analysis/Popularity/Qimao/Top10"),
);

/* 书旗热度 */
const PopularityShuqi1 = lazy(
  () => import("../page/Analysis/Popularity/Shuqi/PopularityValue"),
);
const PopularityShuqi2 = lazy(
  () => import("../page/Analysis/Popularity/Shuqi/Top10"),
);

const AdminLayout = lazy(() => import("../components/AdminLayout"));

export const routes: AppRoute[] = [
  {
    path: "/login",
    element: <Login />,
    meta: {
      title: "登录",
      hide: true,
      public: true,
    },
  },
  {
    path: "/403",
    element: <Forbidden />,
    meta: {
      hide: true,
      public: true,
    },
  },
  {
    path: "/admin",
    element: (
      <PermissionGuard permission="user:list">
        <AdminLayout />
      </PermissionGuard>
    ),
    meta: { title: "管理员后台", permission: "user:list" },
    children: [
      ...adminRoutes,
      {
        index: true,
        element: <Navigate to="admin" replace />,
      },
    ],
  },

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
        meta: { hide: true },
      },

      {
        path: "home",
        element: <Home />,
        meta: { title: "首页", icon: <HomeOutlined /> },
      },
      {
        path: "bookShelf",
        element: <BookShelf />,
        meta: { title: "书架", icon: <BookOutlined /> },
      },
      {
        path: "ranking",
        element: <Ranking />,
        meta: { title: "排行榜", icon: <TrophyOutlined /> },
      },
      {
        path: "detail",
        element: <Detail />,
        meta: {
          hide: true, // 左侧菜单不显示
          public: false, // 需要登录（和你项目保持一致）
        },
      },
       {
        path: "read",
        element: <Read />,
        meta: {
          hide: true, // 左侧菜单不显示
          public: false, // 需要登录（和你项目保持一致）
        },
      },
      {
        path: "ai",
        element: (
          <PermissionGuard permission="analysis:view">
            <Ai />
          </PermissionGuard>
        ),
        meta: {
          title: "AI分析",
          icon: <RobotOutlined />,
          permission: "analysis:view",
        },
      },

      // Analysis 路由
      {
        path: "analysis",
        element: (
          <PermissionGuard permission="analysis:view">
            <Outlet />
          </PermissionGuard>
        ),
        meta: {
          title: "图表分析",
          icon: <PieChartOutlined />,
          permission: "analysis:view",
        },

        children: [
          /* 分类 */
          {
            path: "category",
            element: <Outlet />,
            meta: { title: "分类分析", icon: <BarChartOutlined /> },

            children: [
              {
                path: "zongheng",
                element: <CategoryZongheng />,
                meta: { title: "纵横分类" },
              },
              {
                path: "qimao",
                element: <CategoryQimao />,
                meta: { title: "七猫分类" },
              },
              {
                path: "shuqi",
                element: <CategoryShuqi />,
                meta: { title: "书旗分类" },
              },
            ],
          },

          /* 内容 */
          {
            path: "content",
            element: <Outlet />,
            meta: { title: "内容分析", icon: <LineChartOutlined /> },

            children: [
              {
                path: "wordCount",
                element: <ContentWordCount />,
                meta: { title: "字数分布" },
              },
              {
                path: "status",
                element: <ContentStatus />,
                meta: { title: "连载状态" },
              },
              {
                path: "gender",
                element: <ContentGender />,
                meta: { title: "男女频分布" },
              },
              {
                path: "chapter",
                element: <ContentChapter />,
                meta: { title: "章节数量" },
              },
            ],
          },

          /* 热度 */
          {
            path: "popularity",
            element: <Outlet />,
            meta: { title: "热度分析", icon: <LineChartOutlined /> },

            children: [
              {
                path: "zongheng",
                element: <Outlet />,
                meta: { title: "纵横平台" },

                children: [
                  {
                    path: "weekly",
                    element: <PopularityZongheng1 />,
                    meta: { title: "周订阅" },
                  },
                  {
                    path: "total",
                    element: <PopularityZongheng2 />,
                    meta: { title: "总订阅" },
                  },
                  {
                    path: "click",
                    element: <PopularityZongheng3 />,
                    meta: { title: "点击订阅" },
                  },
                  {
                    path: "top10",
                    element: <PopularityZongheng4 />,
                    meta: { title: "Top10榜单" },
                  },
                ],
              },

              {
                path: "qimao",
                element: <Outlet />,
                meta: { title: "七猫平台" },

                children: [
                  {
                    path: "read",
                    element: <PopularityQimao1 />,
                    meta: { title: "阅读量" },
                  },
                  {
                    path: "score",
                    element: <PopularityQimao2 />,
                    meta: { title: "评分" },
                  },
                  {
                    path: "readScore",
                    element: <PopularityQimao3 />,
                    meta: { title: "阅读评分" },
                  },
                  {
                    path: "top10",
                    element: <PopularityQimao4 />,
                    meta: { title: "Top10榜单" },
                  },
                ],
              },

              {
                path: "shuqi",
                element: <Outlet />,
                meta: { title: "书旗平台" },

                children: [
                  {
                    path: "value",
                    element: <PopularityShuqi1 />,
                    meta: { title: "热度值" },
                  },
                  {
                    path: "top10",
                    element: <PopularityShuqi2 />,
                    meta: { title: "Top10榜单" },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
    meta: { hide: true },
  },
];
