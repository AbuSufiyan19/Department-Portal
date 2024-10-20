const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  // origin: 'http://localhost:3000', 
  origin: 'https://departmentportal.onrender.com', 
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));


// MongoDB Connection
mongoose.connect('mongodb+srv://abusufiyan3147:fZXqtDNnTVdexiDj@cluster0.dp7wy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// Serve static files from the 'uploads' folder 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/Resources', express.static(path.join(__dirname, 'Resources')));
app.use('/academic_schedules', express.static(path.join(__dirname, 'academic_schedules')));


// Routes
const studentRoutes = require('./routes/student');
app.use('/api/student', studentRoutes);
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
const scheduleRoutes = require('./routes/scheduleRoutes'); 
app.use('/api/admin', scheduleRoutes);
const folderRoutes = require('./routes/folders');
app.use('/api/folders', folderRoutes);
const resourceRoutes = require('./routes/resourcesRoutes');
app.use('/api/resources', resourceRoutes); // Use resource routes



app.post('/api/check-admin-session', async (req, res) => {
  const { userId } = req.body;

  // Replace with your actual database check logic
  const admin = await database.findAdminById(userId);

  if (admin) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});


const nodemailer = require('nodemailer');
const Student = require('./models/Student');
const Reminder = require('./models/ReminderSchema');
const cron = require('node-cron');



// Email setup using Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service provider
  auth: {
    user: '23mx101@psgtech.ac.in',
    pass: 'Abu@3147'
  }
});

async function sendReminderEmails(reminder) {
  try {
    let students;

    // Check if reminder is for both groups
    if (reminder.group === 'G1 & G2') {
      // Find students in both G1 and G2
      students = await Student.find({
        group: { $in: ['G1', 'G2'] },
        rollNumber: { $regex: `^${reminder.year.toString().slice(-2)}` } // Match roll number starting with last 2 digits of reminder year
      });
    } else {
      // Find students based on the group specified in the reminder and the roll number check
      students = await Student.find({
        group: reminder.group,
        rollNumber: { $regex: `^${reminder.year.toString().slice(-2)}` } // Match roll number starting with last 2 digits of reminder year
      });
    }

    if (students.length === 0) {
      console.log('No students found for the given group and year.');
      return;
    }

    // Compose email
    const mailOptions = {
      from: '23mx101@psgtech.ac.in',
      to: students.map(student => student.email), 
      subject: `Reminder: ${reminder.title} for ${reminder.subject}`,
      text: `Dear Students,\n\nThis is a reminder for the upcoming "${reminder.title}" of ${reminder.subject}, scheduled on ${reminder.date.toDateString()} at ${reminder.time}.\n\nPrepare accordingly.\n\nBest Regards,\nDepartment of Computer Application`
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Reminder email sent successfully');
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
}

// Function to check reminders for the next day and send emails
async function checkAndSendEmails() {
  try {
    const currentDate = new Date();
    const nextDay = new Date();
    nextDay.setDate(currentDate.getDate() + 1); // Get next day's date

    // Find reminders that are scheduled for the next day
    const reminders = await Reminder.find({
      date: {
        $gte: new Date(nextDay.setHours(0, 0, 0, 0)), // Start of next day
        $lt: new Date(nextDay.setHours(23, 59, 59, 999)) // End of next day
      }
    });

    // Send emails for each reminder
    for (const reminder of reminders) {
      await sendReminderEmails(reminder);
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}
async function deletePastReminders() {
  try {
    const currentDate = new Date();
    // Delete reminders that are before today
    const deletedReminders = await Reminder.deleteMany({
      date: { $lt: new Date(currentDate.setHours(0, 0, 0, 0)) }
    });
    console.log(`${deletedReminders.deletedCount} past reminders deleted`);
  } catch (error) {
    console.error('Error deleting past reminders:', error);
  }
}

// Schedule a daily check at midnight (00:00) to look for reminders for the next day
cron.schedule('00 10 * * *', async () => {
  await checkAndSendEmails();
  console.log('Running daily reminder check');
  await deletePastReminders();
  console.log('Running daily reminder deletion');
});



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

  
  // Function to send emails
  // async function sendReminderEmails(reminder) {
  //   try {
  //     let students;
  
  //     // Check if reminder is for both groups
  //     if (reminder.group === 'G1 & G2') {
  //       // Find students in both G1 and G2
  //       students = await Student.find({ group: { $in: ['G1', 'G2'] } });
  //     } else {
  //       // Find students based on the group specified in the reminder
  //       students = await Student.find({ group: reminder.group });
  //     }
  
  //     // Compose email
  //     const mailOptions = {
  //       from: '23mx101@psgtech.ac.in',
  //       to: students.map(student => student.email), 
  //       subject: `Reminder: ${reminder.title} for ${reminder.subject}`,
  //       text: `Dear Students,\n\nThis is a reminder for the upcoming "${reminder.title}" of ${reminder.subject}, scheduled on ${reminder.date.toDateString()} at ${reminder.time}.\n\nPrepare accordingly.\n\nBest Regards,\nDepartment of Computer Application`
  //     };
  
  //     // Send the email
  //     await transporter.sendMail(mailOptions);
  //     console.log('Reminder email sent successfully');
  //   } catch (error) {
  //     console.error('Error sending reminder email:', error);
  //   }
  // }