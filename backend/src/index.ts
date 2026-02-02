import 'dotenv/config';
import app from './server.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 House Unlimited Nigeria - Real Estate Platform API Server Started!
📍 Running on: http://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 Health Check: http://localhost:${PORT}/api/health
📖 API Docs: http://localhost:${PORT}/api

📧 Email Service: ${process.env.SENDGRID_API_KEY ? 'SendGrid' : process.env.EMAIL_HOST ? 'Gmail SMTP' : 'Not configured'}
🗄️ Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}
☁️ File Storage: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Cloudinary' : 'Not configured'}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default server;
