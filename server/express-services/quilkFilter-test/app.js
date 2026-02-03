const express = require('express');
const cors = require('cors');

const quilkFilterRoutes = require('./routes/quilkFilter');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use('/api/quilkFilter', quilkFilterRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
