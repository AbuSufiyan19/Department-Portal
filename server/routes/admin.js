  const express = require('express');
  const router = express.Router();
  const bcrypt = require('bcryptjs');

  const multer = require('multer');
  const fs = require('fs'); 
  const path = require('path');
  const Circular = require('../models/Circular'); // Assuming you have a Mongoose model named Circular
  const Admin = require('../models/Admin'); // Assuming you have an Admin model
  const Grievance = require('../models/Grievance');


  // Set up multer for file uploads
  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, 'uploads/'); // Destination folder for uploaded files
      },
      filename: (req, file, cb) => {
          cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
      }
  });

  router.post('/checksession', async (req, res) => {
    const { userId } = req.body;  
    // Replace with your actual database check logic
    const admin = await Admin.findById(userId);
    console.log(admin);

    if (admin) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  });

  router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
      // Check if email already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new admin
      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
      });

      await newAdmin.save();
      res.status(201).json({ message: 'Admin signed up successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ msg: 'Admin not found' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      res.json({
        msg: 'Login successful',
        user: {
          id: admin._id,
          name: admin.name,
          type: 'admin'
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  const upload = multer({ storage: storage });

  router.post('/circulars', upload.single('image'), (req, res) => {
      const { title } = req.body;
      const image = req.file.path;
    
      const newCircular = new Circular({
        title,
        image
      });
    
      newCircular.save()
        .then(circular => res.json(circular))
        .catch(err => res.status(400).json('Error: ' + err));
    });
    
  router.get('/circulars', (req, res) => {
    Circular.find()
          .sort({ createdAt: -1 })  
          .then(circulars => res.json(circulars))
          .catch(err => res.status(400).json('Error: ' + err));
  });

  router.delete('/circularsdelete/:id', async (req, res) => {
    try { 
        const circularId = req.params.id;
        // Find the circular to get the image path
        const circular = await Circular.findById(circularId);
        if (!circular) {
            return res.status(404).json({ message: 'Circular not found' });
        }

        // Delete the circular from the database
        await Circular.findByIdAndDelete(circularId);

        // Construct the path to the image file
        const imagePath = path.join(__dirname, '../', circular.image); // Adjust the path as needed

        // Delete the image file from the uploads folder
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(200).json({ message: 'Circular and associated image deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


  router.get('/viewallgrievances', async (req, res) => {
    try {
        const grievances = await Grievance.find();
        res.json(grievances);
    } catch (error) {
        console.error('Error fetching grievances:', error);
        res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/respondgrievance', async (req, res) => {
    const { grievanceId, response } = req.body;
    console.log(grievanceId);
    try {
        const updatedGrievance = await Grievance.findByIdAndUpdate(
            grievanceId,
            { response },
            { new: true } // Return the updated document
        );
        if (updatedGrievance) {
            res.json(updatedGrievance);
        } else {
            res.status(404).json({ message: 'Grievance not found' });
        }
    } catch (error) {
        console.error('Error updating response:', error);
        res.status(500).json({ message: 'Server error' });
    }
  });

  const Reminder = require('../models/ReminderSchema');

  const convertTimeTo12Hour = (time) => {
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;  
      return `${hours}:${minutes} ${ampm}`;
  };
  router.post('/set-reminder', async (req, res) => {
    const { title, subject, group, date, time, year } = req.body;

    // Basic validation (you can expand this as per your needs)
    if (!title || !subject || !group || !date || !time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Create a new reminder instance
        const formattedTime = convertTimeTo12Hour(time);

        const reminder = new Reminder({
            title,
            subject,
            group,
            date,
            year,
            time: formattedTime 
        });

        // Save reminder to the database
        await reminder.save();

        res.status(201).json({ message: 'Reminder set successfully', reminder });
    } catch (error) {
        console.error('Error setting reminder:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Route to get all reminders up to the current date
router.get('/remindersmarquee', async (req, res) => {
    try {
        // Get the current date to filter reminders
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);  // Set to start of the day in UTC

        // Fetch reminders where the date is greater than or equal to today
        const reminders = await Reminder.find({ date: { $gte: today } });

        res.json(reminders);
    } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


  module.exports = router;
