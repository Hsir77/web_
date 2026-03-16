import { useState, useEffect } from "react";
import { Card, Table, Button, Form, Input, Select, message, Empty } from "antd";
import { ReloadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import useUserStore from "../../store/user";
import { getUserList, register, deleteUser, getRoleList } from "../../api/admin/admin";

interface UserItem {
  user_id: number;
  username: string;
}

interface RoleItem {
  username: string;
  role_name: string;
}

export default function UserManager() {
  const { permissions } = useUserStore();
  const [form] = Form.useForm();

  const [userList, setUserList] = useState<UserItem[]>([]);
  const [roleList, setRoleList] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const canList = permissions.includes("user:list");
  const canCreate = permissions.includes("user:create");
  const canDelete = permissions.includes("user:delete");

  // 获取用户列表
  const loadUserList = async () => {
    if (!canList) return;
    setLoading(true);
    try {
      const res = await getUserList();
      setUserList(res || []);
    } catch (err) {
      message.error("获取用户列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 获取角色列表（用于匹配角色名）
  const loadRoleList = async () => {
    try {
      const res = await getRoleList();
      setRoleList(res || []);
    } catch (err) {
      console.log("获取角色列表失败");
    }
  };

  // 创建用户
  const handleCreate = async (values: { 
    username: string; 
    password: string;
    role_name: string;
  }) => {
    if (!canCreate) return;
    setCreateLoading(true);
    try {
      await register(values);
      message.success("创建成功");
      form.resetFields();
      loadUserList();
    } catch (err) {
      message.error("创建失败");
    } finally {
      setCreateLoading(false);
    }
  };

  // ================== 删除用户：传 username ==================
  const handleDelete = async (username: string) => {
    if (!canDelete) return;
    try {
      await deleteUser({ username });
      message.success("删除成功");
      loadUserList();
    } catch (err) {
      message.error("删除失败");
    }
  };

  useEffect(() => {
    loadUserList();
    loadRoleList();
  }, [permissions]);

  // 根据 username 匹配角色名称
  const getRoleNameByUsername = (username: string) => {
    const item = roleList.find((i) => i.username === username);
    return item?.role_name || "未设置";
  };

  const columns = [
    { title: "用户ID", dataIndex: "user_id", key: "user_id", width: 100 },
    { title: "用户名", dataIndex: "username", key: "username" },
    {
      title: "角色",
      key: "role_name",
      render: (_, record: UserItem) => getRoleNameByUsername(record.username),
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: (_, record: UserItem) => (
        <Button
          type="link"
          danger
          disabled={!canDelete}
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.username)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 列表（查） */}
      {canList && (
        <Card
          title="用户列表"
          extra={
            <Button icon={<ReloadOutlined />} onClick={loadUserList} loading={loading}>
              刷新
            </Button>
          }
        >
          <Table
            rowKey="user_id"
            loading={loading}
            columns={columns}
            dataSource={userList}
            pagination={false}
            bordered
            locale={{
              emptyText: (
                <Empty
                  description={
                    <div style={{ color: "#666" }}>
                      <div>暂无数据</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>
                        请检查您的权限是否足够
                      </div>
                    </div>
                  }
                />
              ),
            }}
          />
        </Card>
      )}

      {/* 创建（增） */}
      {canCreate && (
        <Card title="创建用户">
          <Form form={form} layout="inline" onFinish={handleCreate}>
            <Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
              <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
              <Input.Password placeholder="密码" />
            </Form.Item>

            <Form.Item name="role_name" rules={[{ required: true, message: "请选择角色" }]}>
              <Select placeholder="选择角色" style={{ width: 160 }}>
                <Select.Option value="管理员">管理员</Select.Option>
                <Select.Option value="登录用户">登录用户</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={createLoading} icon={<PlusOutlined />}>
                创建
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* 无权限提示 */}
      {!canList && !canCreate && !canDelete && (
        <Card>
          <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
            您暂无用户管理相关权限
          </div>
        </Card>
      )}
    </div>
  );
}