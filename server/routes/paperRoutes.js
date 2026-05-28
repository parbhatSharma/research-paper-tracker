const express = require("express");

const router = express.Router();
const Paper = require("../models/Paper");

router.post("/", async (req, res) => {
  try {
    const paper = await Paper.create(req.body);

    res.status(201).json({
      success: true,
      data: paper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
    try {
      const papers = await Paper.find().sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        count: papers.length,
        data: papers,
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  //analytics for all
router.get("/analytics", async (req, res) => {
    try {
  
      const papers = await Paper.find();
  
      const totalPapers = papers.length;
  
      const fullyRead = papers.filter(
        p => p.readingStage === "Fully Read"
      ).length;
  
      const completionRate =
        totalPapers === 0
          ? 0
          : ((fullyRead / totalPapers) * 100).toFixed(1);
  
      const stageCounts = {};
  
      papers.forEach((paper) => {
        stageCounts[paper.readingStage] =
          (stageCounts[paper.readingStage] || 0) + 1;
      });
  
      const avgCitationsByDomain = {};
  
      papers.forEach((paper) => {
  
        if (!avgCitationsByDomain[paper.domain]) {
          avgCitationsByDomain[paper.domain] = {
            total: 0,
            count: 0,
          };
        }
  
        avgCitationsByDomain[paper.domain].total +=
          paper.citationCount;
  
        avgCitationsByDomain[paper.domain].count += 1;
      });
  
      const averages = Object.keys(avgCitationsByDomain).map(
        (domain) => ({
          domain,
  
          average:
            avgCitationsByDomain[domain].total /
            avgCitationsByDomain[domain].count,
        })
      );
  
      res.json({
        success: true,
  
        summary: {
          totalPapers,
          fullyRead,
          completionRate,
        },
  
        stageCounts,
  
        averages,
  
        scatterData: papers.map((paper) => ({
          title: paper.title,
          citations: paper.citationCount,
          impact: paper.impactScore,
        })),
  
        stackedData: papers.map((paper) => ({
          domain: paper.domain,
          stage: paper.readingStage,
        })),
      });
  
    } catch (error) {
  
      res.status(500).json({
        success: false,
        message: error.message,
      });
  
    }
  });

  router.delete("/:id", async (req, res) => {

    try {
  
      const deletedPaper = await Paper.findByIdAndDelete(
        req.params.id
      );
  
      if (!deletedPaper) {
  
        return res.status(404).json({
          success: false,
          message: "Paper not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Paper deleted successfully",
      });
  
    } catch (error) {
  
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
module.exports = router;