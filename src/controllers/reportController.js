const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }); // Explicit adapter for Prisma 7

// Create a new pothole report
const createReport = async (req, res) => {
  try {
    const { latitude, longitude, severity, imageUrl } = req.body;

    // Basic validation
    if (!latitude || !longitude || !severity) {
      return res.status(400).json({ error: 'Latitude, longitude, and severity are required.' });
    }

    const report = await prisma.potholeReport.create({
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        severity,
        imageUrl: imageUrl || null,
      },
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ success: false, error: 'Failed to create report' });
  }
};

// Get all reports (with optional filtering)
const getReports = async (req, res) => {
  try {
    const { severity, status } = req.query;
    
    // Build filter object dynamically
    const filter = {};
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const reports = await prisma.potholeReport.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reports' });
  }
};

// Update report status or severity (For Admin Dashboard)
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, severity } = req.body;

    const updatedReport = await prisma.potholeReport.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(severity && { severity }),
      },
    });

    res.status(200).json({ success: true, data: updatedReport });
  } catch (error) {
    console.error('Error updating report:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    res.status(500).json({ success: false, error: 'Failed to update report' });
  }
};

// Delete a false/duplicate report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.potholeReport.delete({
      where: { id },
    });

    res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ success: false, error: 'Failed to delete report' });
  }
};

module.exports = {
  createReport,
  getReports,
  updateReport,
  deleteReport
};