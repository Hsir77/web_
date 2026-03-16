import api from "../index";

// 新增小说
export async function addBook(data: {
  url: string;
  source: "zongheng" | "qimao" | "shuqi";
  gender: string;
}) {
  const res = await api.post("/book/add", data, { timeout: 15000 });
  return res.data;
}

// 删除小说
export async function deleteBook(data: {
  source: "zongheng" | "qimao" | "shuqi";
  url?: string;
  book_name?: string;
}) {
  const res = await api.post("/book/delete", data, { timeout: 15000 });
  return res.data;
}