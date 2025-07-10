const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');
const userRouter = require('./routes/userRoutes.js');
const writerRouter = require('./routes/writerRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');
const resourceRouter = require('./routes/resourceRoutes.js');
const createAdminIfNotExists = require('./scripts/adminSeed.js');
const multer = require('multer');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

require('dotenv').config();
const app = express();
const upload = multer();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Base route
app.get('/', (req, res) => res.send('API is running...'));

// End points
app.use("/easyPro/user", userRouter);
app.use("/easyPro/writer", writerRouter);
app.use("/easyPro/order", orderRouter);
app.use("/easyPro/review", reviewRouter);
app.use("/easyPro/resource", resourceRouter);
app.post('/api/plagiarism', upload.single('file'), async (req, res) => {
  console.log("body",req);
  
  try {
    let textToAnalyze = '';
    let fileUrl = null;

    const inputText = req.body.text?.trim();
    if (inputText) {
      textToAnalyze = inputText;
    }

    if (req.file) {
      try {
        if (req.file.mimetype === 'application/pdf') {
          console.log('Uploading PDF to Cloudinary:', req.file.originalname);
          
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                resource_type: 'raw', 
                folder: 'plagiarism_files',
                public_id: `${Date.now()}_${req.file.originalname.replace(/\.[^/.]+$/, "")}`,
                format: 'pdf'
              },
              (error, result) => {
                if (error) {
                  console.error('Cloudinary upload error:', error);
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            ).end(req.file.buffer);
          });

          fileUrl = uploadResult.secure_url;
          console.log('PDF uploaded to Cloudinary:', fileUrl);

          const requestData = {
            file: fileUrl,
            language: req.body.language || 'en',
            country: req.body.country || 'us'
          };

          if (inputText) {
            requestData.text = inputText;
          }

          console.log('Sending PDF URL to Winston:', fileUrl);
          console.log('Request data:', requestData);

          const response = await axios.post(
            'https://api.gowinston.ai/v2/plagiarism',
            requestData,
            {
              headers: {
                Authorization: `Bearer ${process.env.WINSTON_API_KEY}`,
                'Content-Type': 'application/json',
              },
            }
          );

          return res.status(response.status).json(response.data);
          
        } else if (req.file.mimetype.startsWith('text/')) {
          const fileText = req.file.buffer.toString('utf-8').trim();
          textToAnalyze = inputText 
            ? `${inputText}\n\n${fileText}` 
            : fileText;
        } else {
          return res.status(400).json({
            error: 'Unsupported file type. Please upload PDF or text files only.'
          });
        }
      } catch (fileError) {
        console.error('File processing error:', fileError);
        return res.status(400).json({
          error: 'Failed to process uploaded file. Please ensure it\'s a valid PDF or text file.'
        });
      }
    }

    if (!textToAnalyze && !req.file) {
      return res.status(400).json({
        error: 'No text provided. Please enter text or upload a file containing text.'
      });
    }

    if (textToAnalyze) {
      const requestData = {
        text: textToAnalyze,
        language: req.body.language || 'en',
        country: req.body.country || 'us'
      };

      console.log('Sending text to Winston with length:', textToAnalyze.length);
      console.log('Text preview:', textToAnalyze.slice(0, 100) + '...');
      console.log('Request data:', requestData);

      const response = await axios.post(
        'https://api.gowinston.ai/v2/plagiarism',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${process.env.WINSTON_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error('Plagiarism API Error:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      error: error?.response?.data || error.message,
    });
  }
});
const PORT = process.env.PORT || 5555;

app.listen(PORT, async () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port number ${PORT}`)
    await connectDB();
    await createAdminIfNotExists();
});
