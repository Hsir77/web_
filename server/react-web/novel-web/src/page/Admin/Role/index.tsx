import { useState, useEffect } from "react";
import { Table, Card, Typography, Button, Select, message, Empty } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { getRoleList } from "../../../api/admin/admin";
import { changeUserRole } from "../../../api/admin/admin";

const { Title } = Typography;

interface UserItem {
  user_id: number;
  username: string;
  role_id: number;
  role_name: string;
}

export default function RoleManager() {
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getRoleList();
      setUserList(res || []);
    } catch (error) {
      message.error("获取列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChangeRole = async (username: string, role_name: string) => {
    try {
      await changeUserRole({
        username,
        role_name
      });
      message.success("角色修改成功");
      loadData();
    } catch (err) {
      message.error("角色修改失败");
    }
  };

  const columns = [
    {
      title: "角色ID",
      dataIndex: "role_id",
      key: "role_id",
      width: 100,
    },
    {
      title: "角色名称",
      dataIndex: "role_name",
      key: "role_name",
    },
    {
      title: "用户id",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "修改角色",
      key: "action",
      width: 180,
      render: (_, record: UserItem) => (
        <Select
          value={record.role_name}
          style={{ width: "100%" }}
          onChange={(val) => handleChangeRole(record.username, val)}
        >
          <Select.Option value="管理员">管理员</Select.Option>
          <Select.Option value="登录用户">登录用户</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={4} style={{ margin: 0 }}>角色管理</Title>
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
            刷新
          </Button>
        </div>

        <Table
          rowKey="user_id"
          loading={loading}
          columns={columns}
          dataSource={userList}
          pagination={false}
          bordered
          style={{ marginTop: 16 }}
          locale={{
            emptyText: (
              <Empty
                description={
                  <div style={{ color: "#666" }}>
                    <div>暂无数据</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      请查看您的权限，是否有权限去修改用户角色
                    </div>
                  </div>
                }
              />
            )
          }}
        />
      </Card>
    </div>
  );
}