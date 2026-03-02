功能模块	超级管理员	管理员	登录用户	游客
查看所有用户列表	✅	✅	❌	❌
创建账号	✅	✅	❌	❌
删除账号	✅	❌	❌	❌
分配 / 修改用户角色	✅	❌	❌	❌

小说数据 —— 新增	✅	✅	❌	❌
小说数据 —— 删除	✅	❌	❌	❌
查看数据分析、可视化、AI 分析	✅	✅	✅	❌
修改 Prompt 配置	✅	❌	❌	❌
书库全部接口	✅	✅	✅	✅
书架全部接口	✅	✅	✅	✅

一、登录 / 注册相关（必须）
POST /api/register
注册（可限制只有管理员 / 超管能创建）

POST /api/login
登录，返回 token

GET /api/current-user(验证token)
获取当前登录用户信息 + 角色 + 权限列表

二、用户管理接口（有权限控制）
GET /api/user
查看所有用户列表
→ 权限：user:list
POST /api/user
创建用户
→ 权限：user:create
DELETE /api/user/:id
删除用户
→ 权限：user:delete


三、角色 & 权限接口（超管专用）
GET /api/role
查看所有角色
POST /api/user/assign-role
给用户修改角色
→ 权限：role:assign
GET /api/permission
查看所有权限（可选）


四、小说数据管理接口
POST /api/novel
新增小说数据
→ 权限：novel:add
DELETE /api/novel/:id
删除小说数据
→ 权限：novel:delete


五、分析 & AI 相关接口
GET /api/analysis
查看数据分析、可视化、AI 分析
→ 权限：analysis:view
POST /api/prompt
修改 Prompt 配置
→ 权限：prompt:edit


六、不需要权限校验的（你说过全部开放）
书库所有接口
书架所有接口
这些直接放行，不判断角色、不判断权限。
最简总结（你后端照着开发就行）
需要权限控制的接口一共 10 个：
用户列表
创建用户
删除用户
分配角色
新增小说
删除小说
查看分析
修改 Prompt
当前用户信息
角色列表



1173772198282130
sk-8589b7a3608d4eb6b2f6f71f72890683