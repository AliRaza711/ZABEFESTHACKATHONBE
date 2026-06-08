// src/routes/reportRoutes.js

const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  updateReport,
  deleteReport
} = require('../controllers/reportController');

router.route('/')
  .post(createReport)
  .get(getReports);

router.route('/:id')
  .patch(updateReport)
  .delete(deleteReport);

module.exports = router;
