import dotenv from 'dotenv';
import { testEmailConfig } from './config/email.js';

dotenv.config();

console.log('Testing email configuration...');
testEmailConfig()
    .then(success => {
        if (success) {
            console.log('Email configuration is working correctly!');
        } else {
            console.log('Email configuration failed. Please check your settings.');
        }
        process.exit();
    })
    .catch(error => {
        console.error('Error:', error);
        process.exit(1);
    }); 