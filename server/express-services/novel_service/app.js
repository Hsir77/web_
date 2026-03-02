const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const novelRoutes = require('./routes/novelRoutes');
app.use('/api/novel', novelRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    code: 500,
    message: '服务器内部错误'
  });
});

app.listen(PORT, () => {
  console.log(`✅ 服务器已启动：http://localhost:${PORT}`);
});