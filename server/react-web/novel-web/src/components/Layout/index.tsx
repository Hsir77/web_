import { Layout, Menu, Button, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { routes } from "../../router/routes";
import { AppRoute } from "../../types/route";
import type { MenuProps } from "antd";
import { Outlet } from "react-router-dom";
import useUserStore from "../../store/user";

const { Header, Content, Sider } = Layout;

export default function AppLayout() {
  const permissions = useUserStore((s) => s.permissions);
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = useUserStore((s) => s.userInfo);
  const isAdmin = permissions.includes("user:list");

  const generateMenu = (
    routes: AppRoute[],
    parentPath = "",
  ): MenuProps["items"] => {
    return routes
      .filter((r) => {
        if (r.meta?.hide) return false;

        const permission = r.meta?.permission;

        if (permission && !permissions.includes(permission)) {
          return false;
        }

        return true;
      })
      .map((r) => {
        const path = r.path ?? "";
        const fullPath = parentPath ? `${parentPath}/${path}` : `/${path}`;

        return {
          key: fullPath.replace("//", "/"),
          icon: r.meta?.icon,
          label: r.meta?.title,
          children: r.children ? generateMenu(r.children, fullPath) : undefined,
        };
      });
  };

  const menuRoutes =
    routes
      .find((r) => r.path === "/")
      ?.children?.filter((r) => !r.meta?.hide) || [];

  const menuItems = generateMenu(menuRoutes);

  return (
    <Layout style={{ height: "100vh", background: "#f5f7fa" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 24,
          background: "#1677ff",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          网络小说数据分析与可视化平台
        </div>

        <Space size={24}>
          {isAdmin && (
            <Button
              style={{
                borderRadius: 20,
                color: "#1677ff",
                background: "#fff",
                border: "1px solid #1677ff",
              }}
              onClick={() => navigate("/admin")}
            >
              管理员操作
            </Button>
          )}

          <Button
            style={{
              borderRadius: 20,
              color: "#fff",
              background: "#52c41a",
              border: "none",
            }}
            onClick={() => {
              const logout = useUserStore.getState().logout;
              logout();
              setTimeout(() => {
                navigate("/login");
              }, 0);
            }}
          >
            切换账号
          </Button>

          <div
            style={{
              color: "#fff",
              background: "linear-gradient(120deg, #444, #222)",
              padding: "0 16px",
              height: 36,
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
              borderRadius: "8px 16px 8px 16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            {userInfo?.username || "未登录"}
          </div>
        </Space>
      </Header>

      <Layout>
        <Sider
          width={210}
          style={{
            background: "#fff",
            height: "calc(100vh - 64px)",
            position: "fixed",
            left: 0,
            top: 64,
            borderRight: "1px solid #f0f0f0",
            overflowY: "auto",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={(e) => navigate(e.key)}
            style={{
              height: "100%",
              borderRight: 0,
              paddingTop: 10,
            }}
          />
        </Sider>

        <Layout
          style={{
            marginLeft: 210,
            height: "calc(100vh - 64px)",
          }}
        >
          <Content
            style={{
              background: "#fff",
              padding: 24,
              height: "100%",
              overflow: "auto",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
