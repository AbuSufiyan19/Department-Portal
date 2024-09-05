const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Schedule = require('../models/AcademicScheduleModel');

// Create a storage engine with Multer to specify the destination and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'academic_schedules/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const fileName = `${req.body.group}_${req.body.semester}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
});

// File filter to ensure only PDFs are uploaded
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

router.post('/upload-academicschedule', multer({ storage: storage, fileFilter: fileFilter }).single('pdf'), async (req, res) => {
    try {
        const { group, semester } = req.body;

        // Validation
        if (!group || !semester) {
            return res.status(400).json({ error: 'Group and semester are required.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file.' });
        }

        // Check if the combination of group and semester already exists
        let schedule = await Schedule.findOne({ group, semester });

        if (schedule) {
            // Delete the old file
            const oldFilePath = path.join('academic_schedules/', schedule.pdfFileName);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            // Update the existing schedule with the new file
            schedule.pdfFileName = req.file.filename;
            schedule.uploadDate = new Date();
        } else {
            // Create a new schedule
            schedule = new Schedule({
                group,
                semester,
                pdfFileName: req.file.filename,
                uploadDate: new Date()
            });
        }

        await schedule.save();

        res.status(200).json({
            message: 'Academic schedule uploaded successfully!',
            file: req.file.filename,
            group,
            semester
        });
    } catch (err) {
        console.error('Error uploading academic schedule:', err);
        res.status(500).json({ error: 'An error occurred while uploading the academic schedule.' });
    }
});

router.get('/view-academicschedule', async (req, res) => {
    try {
        const schedules = await Schedule.find(); // Fetch all schedules from the database
        res.json(schedules); // Send schedules data as JSON response
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: 'Server error. Could not fetch schedules.' });
    }
});

module.exports = router;