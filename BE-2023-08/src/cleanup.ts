// src/cleanup.ts
import { Lot, sequelize } from './models';
import { Op } from 'sequelize'; // Import Op from sequelize
import cron from 'node-cron';

// Define a function to perform the cleanup
export const performCleanup = async () => {
  try {
    const currentTime = new Date();

    // Delete expired lots from the database
    await Lot.destroy({
      where: {
        expiry: {
          [Op.lt]: currentTime, // Use Op.lt here
        },
      },
    });

    console.log('Database cleanup task executed successfully.');
  } catch (error) {
    console.error('An error occurred during database cleanup:', error);
  }
};

export const clearTableData = async () => {
  try {
    const currentTime = new Date();

    // Delete expired lots from the database
    await Lot.truncate();

    console.log('Database cleanup task executed successfully.');
  } catch (error) {
    console.error('An error occurred during database cleanup:', error);
  }
};

// Schedule the cleanup task to run daily at midnight
cron.schedule('0 0 * * *', performCleanup);
