import React, { useState } from "react";
import style from "./index.module.css";
import { login } from "../../api/login";
import { Toast } from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";
import  useUserStore  from "../../store/user";

interface UserInfoResult {
  data: {
    permissions: string[];
  };
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const loginStore = useUserStore((s) => s.login);

  const handleLogin = async () => {
    try {
      const result = await login(username, password);
      const res = result as UserInfoResult;

      // 写入权限到 store

      Toast.success("登录成功");
      navigate("/");
      console.log("权限：", res);
    } catch (error) {
      Toast.error("登录失败");
      console.error(error);
    }
  };

    const handleGuestLogin = () => {
    loginStore({
      userInfo: { username: "游客" ,id:0 ,role:"guest" }, // 可以写默认游客信息
      permissions: [], // 权限置空
    });

    Toast.success("游客身份登录");
    navigate('/'); // 登录后跳到首页
  };

  return (
    <div className={style.container}>
      <div className={style.loginBox}>
        {/* 左侧艺术块 */}
        <div className={style.artGrid}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={style.art}></div>
          ))}
        </div>

        {/* 右侧登录 */}
        <div className={style.formArea}>
          <div className={style.logo}></div>

          <h2 className={style.title}>
            欢迎来到
            <br />
            <span className={style.subTitle}>网络小说数据分析与可视化</span>
          </h2>

          <input
            className={style.input}
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className={style.input}
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className={style.loginBtn} onClick={handleLogin}>
            登录
          </button>
          <div
          className={style.registerRow}
          >
            <div className={style.register}>
              没有账号？<span>立即注册</span>
            </div>

            {/* 游客按钮，我用 inline 样式，不碰你的 CSS */}
            <button
              className={style.guestBtn}
                          onClick={handleGuestLogin}

            >
              游客登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
