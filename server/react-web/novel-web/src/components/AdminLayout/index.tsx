import { Layout, Menu, Button } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { adminRoutes } from "../../router/admin";
import useUserStore from "../../store/user";
import { AppRoute } from "../../types/route";
import type { MenuProps } from "antd";

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const permissions = useUserStore((s) => s.permissions);

  // 生成菜单
  const generateMenu = (
    routes: AppRoute[],
    parentPath = ""
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

  const menuItems = generateMenu(adminRoutes);

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#fff",
          fontSize: 18,
          padding: "0 24px",
        }}
      >
        <div>管理员后台</div>

        {/* 右侧返回首页按钮 */}
        <Button
          style={{
            fontSize: 16,
            padding: "8px 20px",
            borderRadius: 8,
            backgroundColor: "#1890ff",
            color: "#fff",
            border: "none",
            fontWeight: 500,
          }}
          onClick={() => navigate("/home")}
        >
          返回首页
        </Button>
      </Header>

      <Layout>
        <Sider width={200} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={(e) => navigate(`/admin/${e.key}`)}
            style={{ height: "100%", borderRight: 0 }}
          />
        </Sider>

        <Layout>
          <Content style={{ background: "#fff", minHeight: 360 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}