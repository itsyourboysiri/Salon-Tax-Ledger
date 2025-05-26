const express = require('express');
const router = express.Router();
const TaxForm = require('../../taxForm/taxForm Modal/TaxFormModal'); // Adjust path as needed

// Get yearly tax report data with aggregations
router.get('/yearly-tax-report', async (req, res) => {
  try {
    // Aggregate data by year using MongoDB aggregation pipeline
    const yearlyData = await TaxForm.aggregate([
      {
        // Add a year field extracted from submittedAt date
        $addFields: {
          year: { $year: "$submittedAt" }
        }
      },
      {
        // Group by year and calculate statistics
        $group: {
          _id: "$year",
          totalSubmissions: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [
                { $eq: ["$status", "confirmed"] }, // Use "confirmed" as it matches your frontend
                1,
                0
              ]
            }
          },
          declined: {
            $sum: {
              $cond: [
                { $eq: ["$status", "declined"] },
                1,
                0
              ]
            }
          },
          pending: {
            $sum: {
              $cond: [
                { 
                  $or: [
                    { $eq: ["$status", null] },
                    { $eq: ["$status", "pending"] },
                    { $not: { $in: ["$status", ["confirmed", "declined"]] } }
                  ]
                },
                1,
                0
              ]
            }
          },
          // Calculate total tax collected (only from confirmed submissions)
          taxCollected: {
            $sum: {
              $cond: [
                { $eq: ["$status", "confirmed"] },
                { $ifNull: ["$balancePayable", 0] }, // Use balancePayable as tax amount
                0
              ]
            }
          },
          // Calculate average tax per submission
          avgTaxPerSubmission: {
            $avg: { $ifNull: ["$balancePayable", 0] }
          },
          // Get total taxable income for the year
          totalTaxableIncome: {
            $sum: { $ifNull: ["$taxableIncome", 0] }
          }
        }
      },
      {
        // Sort by year in descending order
        $sort: { _id: -1 }
      },
      {
        // Reshape the output to match frontend expectations
        $project: {
          year: "$_id",
          totalSubmissions: 1,
          approved: 1,
          declined: 1,
          pending: 1,
          taxCollected: { $round: ["$taxCollected", 2] },
          avgTaxPerSubmission: { $round: ["$avgTaxPerSubmission", 2] },
          totalTaxableIncome: { $round: ["$totalTaxableIncome", 2] },
          approvalRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$approved", "$totalSubmissions"] },
                  100
                ]
              },
              1
            ]
          },
          _id: 0
        }
      }
    ]);

    // If no data found, return empty array
    if (!yearlyData || yearlyData.length === 0) {
      return res.json([]);
    }

    // Add additional calculated fields
    const enhancedData = yearlyData.map(item => ({
      ...item,
      declineRate: Math.round(((item.declined / item.totalSubmissions) * 100) * 10) / 10,
      pendingRate: Math.round(((item.pending / item.totalSubmissions) * 100) * 10) / 10
    }));

    res.json(enhancedData);

  } catch (error) {
    console.error('Error fetching yearly tax report:', error);
    res.status(500).json({ 
      error: 'Failed to fetch yearly tax report',
      details: error.message 
    });
  }
});

// Get detailed breakdown for a specific year
router.get('/yearly-tax-report/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const yearInt = parseInt(year);

    const yearData = await TaxForm.aggregate([
      {
        $addFields: {
          year: { $year: "$submittedAt" }
        }
      },
      {
        $match: { year: yearInt }
      },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0]
            }
          },
          declined: {
            $sum: {
              $cond: [{ $eq: ["$status", "declined"] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [
                { 
                  $or: [
                    { $eq: ["$status", null] },
                    { $eq: ["$status", "pending"] },
                    { $not: { $in: ["$status", ["confirmed", "declined"]] } }
                  ]
                },
                1,
                0
              ]
            }
          },
          taxCollected: {
            $sum: {
              $cond: [
                { $eq: ["$status", "confirmed"] },
                { $ifNull: ["$balancePayable", 0] },
                0
              ]
            }
          },
          submissions: {
            $push: {
              name: "$name",
              salonName: "$salonName",
              status: "$status",
              balancePayable: "$balancePayable",
              submittedAt: "$submittedAt"
            }
          }
        }
      }
    ]);

    if (!yearData || yearData.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified year' });
    }

    res.json({
      year: yearInt,
      ...yearData[0],
      _id: undefined
    });

  } catch (error) {
    console.error('Error fetching year-specific tax report:', error);
    res.status(500).json({ 
      error: 'Failed to fetch year-specific tax report',
      details: error.message 
    });
  }
});

// Get monthly breakdown for a specific year
router.get('/monthly-tax-report/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const yearInt = parseInt(year);

    const monthlyData = await TaxForm.aggregate([
      {
        $addFields: {
          year: { $year: "$submittedAt" },
          month: { $month: "$submittedAt" }
        }
      },
      {
        $match: { year: yearInt }
      },
      {
        $group: {
          _id: "$month",
          totalSubmissions: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0]
            }
          },
          declined: {
            $sum: {
              $cond: [{ $eq: ["$status", "declined"] }, 1, 0]
            }
          },
          taxCollected: {
            $sum: {
              $cond: [
                { $eq: ["$status", "confirmed"] },
                { $ifNull: ["$balancePayable", 0] },
                0
              ]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          month: "$_id",
          totalSubmissions: 1,
          approved: 1,
          declined: 1,
          taxCollected: { $round: ["$taxCollected", 2] },
          _id: 0
        }
      }
    ]);

    res.json(monthlyData);

  } catch (error) {
    console.error('Error fetching monthly tax report:', error);
    res.status(500).json({ 
      error: 'Failed to fetch monthly tax report',
      details: error.message 
    });
  }
});

module.exports = router;