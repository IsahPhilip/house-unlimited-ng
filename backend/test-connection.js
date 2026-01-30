// test-connection.mjs (or keep as .js but use import)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const testConnection = async () => {
  console.log('Testing MongoDB connection...');
  
  // Use your actual connection string from .env or test directly
  const uri = process.env.MONGODB_URI || 'mongodb+srv://isahphilip50_db_user:v11Sk9o9p96gXdXS@cluster0.ocfhkcc.mongodb.net/?appName=Cluster0&tls=true';
  
  console.log('Connecting to:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      tls: true,
      tlsAllowInvalidCertificates: false,
    });
    
    console.log('✅ Connection successful!');
    console.log('Connected to database:', mongoose.connection.name || 'Unknown');
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    console.log('Ready state:', mongoose.connection.readyState);
    
    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Try alternative connection options
    console.log('\nTrying alternative connection method...');
    
    try {
      // Try without tls
      await mongoose.connect(uri.replace('mongodb+srv://', 'mongodb://'), {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        tls: false,
        directConnection: true,
      });
      console.log('✅ Alternative connection successful (without TLS)!');
      await mongoose.disconnect();
      process.exit(0);
    } catch (error2) {
      console.error('❌ Alternative connection also failed:', error2.message);
    }
    
    process.exit(1);
  }
};

testConnection();