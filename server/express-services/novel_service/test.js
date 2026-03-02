const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const execAsync = util.promisify(exec);

async function testPythonCall(req, res) {
  try {
    // 1. 基础参数
    const testArgs = ["https://test-url.com", "男", "test_source"];
    const pythonWorkDir = "D:\\桌面文件\\web_\\server\\python-services\\novel_spider";
    const baseCmd = "poetry run python -m novel_spider.node_spider.test";
    const cmd = `${baseCmd} ${testArgs.map(arg => `"${arg}"`).join(' ')}`;

    // 2. 打印调试信息（关键：看命令/目录是否正确）
    console.log("【调试】执行命令：", cmd);
    console.log("【调试】工作目录：", pythonWorkDir);

    // 3. 执行命令（方案1：Python已输出UTF-8，直接用utf8编码接收）
    const { stdout, stderr } = await execAsync(cmd, {
      cwd: pythonWorkDir,
      encoding: 'utf8', // 方案1核心：和Python输出编码一致
      windowsHide: true
    });

    // 4. 打印原始输出（看Python返回的内容）
    console.log("【调试】Python stdout：", stdout);
    console.log("【调试】Python stderr：", stderr);

    // 5. 解析Python返回的JSON（过滤打印日志，取最后一行）
    const stdoutLines = stdout.trim().split('\n');
    const jsonLine = stdoutLines.pop(); // 最后一行是JSON
    const dummyData = JSON.parse(jsonLine); // 这里报错会进catch

    // 6. 返回成功结果
    return res.json({
      code: 200,
      message: "调用Python成功",
      python_print_log: stdoutLines.join('\n'),
      python_dummy_data: dummyData,
      python_stderr: stderr || "无错误"
    });

  } catch (err) {
    // ========== 核心：暴露完整错误信息 ==========
    console.error("【详细错误】", err); // 控制台打印完整错误栈
    return res.status(500).json({
      code: 500,
      message: "服务器内部错误",
      // 返回具体错误信息，方便排查
      detail_error: {
        message: err.message, // 错误描述
        stack: err.stack.slice(0, 200), // 错误栈（截取前200字符）
        cmd: cmd || "未拼接", // 执行的命令
        cwd: pythonWorkDir || "未设置" // 工作目录
      }
    });
  }
}

module.exports = { testPythonCall };