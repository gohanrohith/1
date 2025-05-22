const mongoose = require('mongoose');
const StudentProgressDetails = require('../models/studentProgressDetails');

// Create or update a student's progress
const createOrUpdateStudentProgress = async (req, res) => {
  const { studentId, chapterId, level, progress, totalTimeInSeconds } = req.body;

  try {
    const updatedProgress = await StudentProgressDetails.findOneAndUpdate(
      { studentId, chapterId, level },
      {
        $set: {
          progress,
          totalTimeInSeconds
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    await updatedProgress.save(); // triggers pre-save score calc

    res.status(200).json({
      message: 'Progress updated or created successfully',
      data: updatedProgress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error saving progress',
      error: error.message
    });
  }
};

// Get progress by studentId, chapterId, and level
const getStudentProgress = async (req, res) => {
  const { studentId, chapterId, level } = req.params;

  try {
    const progress = await StudentProgressDetails.findOne({ studentId, chapterId, level })
      .populate('chapterId', 'name');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    return res.status(200).json({ message: 'Progress found', data: progress });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
};

// Get all progress for a student
const getProgressByStudentId = async (req, res) => {
  const { studentId } = req.params;

  try {
    const progress = await StudentProgressDetails.find({ studentId })
      .populate('chapterId', 'chapterName'); // Just include the chapterName field

    if (!progress.length) {
      return res.status(404).json({ message: 'No progress found for this student' });
    }

    res.status(200).json({ message: 'Progress found', data: progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
};


// Get all levels of progress for a specific student and chapter
const getProgressByStudentAndChapter = async (req, res) => {
  const { studentId, chapterId } = req.params;

  try {
    const progress = await StudentProgressDetails.find({ studentId, chapterId })
      .populate('chapterId', 'name');

    if (!progress || progress.length === 0) {
      return res.status(404).json({ message: 'No progress found for this student in this chapter' });
    }

    return res.status(200).json({ message: 'Progress found', data: progress });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
};
// Get top 5 most recent progress records for a student
const getRecentProgressByStudentId = async (req, res) => {
  const { studentId } = req.params;
  const limit = parseInt(req.query.limit) || 5; // Default to 5 if not specified

  try {
    const progress = await StudentProgressDetails.find({ studentId })
      .sort({ updatedAt: -1 }) // Sort by most recent first
      .limit(limit) // Limit to specified number of records
      .populate('chapterId', 'chapterName'); // Include chapter name

    if (!progress.length) {
      return res.status(404).json({ message: 'No progress found for this student' });
    }

    res.status(200).json({ 
      message: `Found ${progress.length} most recent progress records`,
      data: progress 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Error fetching recent progress', 
      error: error.message 
    });
  }
};
module.exports = {
  createOrUpdateStudentProgress,
  getStudentProgress,
  getProgressByStudentId,
  getProgressByStudentAndChapter,
  getRecentProgressByStudentId
};