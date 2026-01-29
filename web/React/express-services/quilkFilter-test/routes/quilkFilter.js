const express = require('express');
const quilkFilterData = require('../data/quilkFilterData');

const quilkFilterRoutes = express.Router();


quilkFilterRoutes.get('/quickFilterOption', (req, res) => {
  res.json({
    code: 0,
    data: quilkFilterData.quickFilterOption,
  });
});

quilkFilterRoutes.get('/integrationInfo', (req, res) => {
  res.json({
    code: 0,
    data: quilkFilterData.integrationInfo,
  });
});


// POST /api/users
// quilkFilterRoutes.post('/', (req, res) => {
//   const user = req.body;

//   users.push(user);

//   res.json({ code: 0, data: user });
// });

module.exports = quilkFilterRoutes;
