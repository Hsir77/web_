import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCount((prev) => prev - 1), 1000);
    const redirect = setTimeout(() => navigate("/home"), 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f5f5f5",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "#fff",
          padding: "60px 40px",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          maxWidth: 400,
          width: "90%",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ff4d4f",
            marginBottom: 16,
          }}
        >
          403
        </div>
        <div style={{ fontSize: 20, color: "#333", marginBottom: 24 }}>
          当前没有权限访问该页面
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#888",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>将于</span>
          <span
            style={{
              fontWeight: 600,
              color: "#1890ff",
            }}
          >
            {count}
          </span>
          <span>秒后返回首页</span>
        </div>

        {/* 圆点动画 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20,
            gap: 6,
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: i < count ? "#1890ff" : "#d9d9d9",
                transition: "background-color 0.3s",
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}