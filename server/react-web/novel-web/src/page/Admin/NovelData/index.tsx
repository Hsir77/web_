import { useState } from "react";
import useUserStore from "../../../store/user";
import { addBook, deleteBook } from "../../../api/admin/book";

export default function BookManager() {
  // 新增小说
  const [url, setUrl] = useState("");
  const [source, setSource] = useState<"zongheng" | "qimao" | "shuqi">("zongheng");
  const [gender, setGender] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // 删除小说
  const [delSource, setDelSource] = useState<"zongheng" | "qimao" | "shuqi">("zongheng");
  const [delUrl, setDelUrl] = useState("");
  const [bookName, setBookName] = useState("");
  const [delLoading, setDelLoading] = useState(false);

  // 从用户权限判断
  const { permissions } = useUserStore();
  const canAdd = permissions.includes("novel:add");
  const canDelete = permissions.includes("novel:delete");

  // 新增提交
  const handleAdd = async () => {
    if (!url) return alert("请输入URL");
    if (!gender) return alert("请输入gender");

    setAddLoading(true);
    try {
      await addBook({ url, source, gender });
      alert("添加成功");
      setUrl("");
      setGender("");
    } catch (err) {
      console.error(err);
      alert("添加失败");
    } finally {
      setAddLoading(false);
    }
  };

  // 删除提交
  const handleDelete = async () => {
    const hasUrl = !!delUrl;
    const hasName = !!bookName;
    if (!hasUrl && !hasName) return alert("必须提供 URL 或 书名");

    setDelLoading(true);
    try {
      await deleteBook({
        source: delSource,
        url: delUrl || undefined,
        book_name: bookName || undefined,
      });
      alert("删除成功");
      setDelUrl("");
      setBookName("");
    } catch (err) {
      console.error(err);
      alert("删除失败");
    } finally {
      setDelLoading(false);
    }
  };

  return (
    <div style={{
      padding: "16px",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    }}>
      <div style={{ marginBottom: 12 }}>
        <h2>小说管理</h2>
        <div style={{ fontSize: 14, color: "#666" }}>
          添加权限：{canAdd ? "✅ 已授权" : "❌ 未授权"} &nbsp;&nbsp;
          删除权限：{canDelete ? "✅ 已授权" : "❌ 未授权"}
        </div>
      </div>

      {/* 左右两栏 */}
      <div style={{
        display: "flex",
        gap: "16px",
        flex: 1,
        minHeight: 0,
      }}>
        {/* 左侧：添加小说 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4>➕ 添加小说</h4>

          <div>
            <label>来源 source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as any)}
              style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 6 }}
              disabled={!canAdd || addLoading}
            >
              <option value="zongheng">纵横 zongheng</option>
              <option value="qimao">七猫 qimao</option>
              <option value="shuqi">书旗 shuqi</option>
            </select>
          </div>

          <div>
            <label>URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 6 }}
              disabled={!canAdd || addLoading}
              placeholder="请输入书籍URL"
            />
          </div>

          <div>
            <label>性别频道 gender</label>
            <input
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 6 }}
              disabled={!canAdd || addLoading}
              placeholder="男频/女频"
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={!canAdd || addLoading}
            style={{
              padding: 10,
              backgroundColor: "#1677ff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
            }}
          >
            {addLoading ? "提交中..." : "添加小说"}
          </button>
        </div>

        {/* 右侧：删除小说 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4>🗑️ 删除小说</h4>

          <div>
            <label>来源 source</label>
            <select
              value={delSource}
              onChange={(e) => setDelSource(e.target.value as any)}
              style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 6 }}
              disabled={!canDelete || delLoading}
            >
              <option value="zongheng">纵横 zongheng</option>
              <option value="qimao">七猫 qimao</option>
              <option value="shuqi">书旗 shuqi</option>
            </select>
          </div>

          <div>
            <label>URL（选填）</label>
            <input
              value={delUrl}
              onChange={(e) => setDelUrl(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 6 }}
              disabled={!canDelete || delLoading}
              placeholder="URL 删除优先"
            />
          </div>

          <div>
            <label>书名 book_name（选填）</label>
            <input
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 6 }}
              disabled={!canDelete || delLoading}
              placeholder="书名删除"
            />
          </div>

          <button
            onClick={handleDelete}
            disabled={!canDelete || delLoading}
            style={{
              padding: 10,
              backgroundColor: "#ff4d4f",
              color: "#fff",
              border: "none",
              borderRadius: 6,
            }}
          >
            {delLoading ? "删除中..." : "删除小说"}
          </button>
        </div>
      </div>
    </div>
  );
}