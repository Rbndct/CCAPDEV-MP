require('dotenv').config();
const mongoose = require('mongoose');

const cleanupCollections = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsplex';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        console.log('Current collections:', collectionNames);

        // 1. Rename collections to snake_case if they exist in camelCase/PascalCase
        const renames = {
            'sportfacilities': 'sport_facilities',
            'facilityoperatingschedules': 'facility_operating_schedules',
            'facilityreviews': 'facility_reviews',
            'reservations': 'reservations', // Already fine, but just in case
            'users': 'users'                // Already fine
        };

        for (const [oldName, newName] of Object.entries(renames)) {
            if (collectionNames.includes(oldName) && !collectionNames.includes(newName)) {
                console.log(`Renaming ${oldName} -> ${newName}...`);
                await db.collection(oldName).rename(newName);
            }
        }

        // 2. Drop the old 'facilities' collection if it exists and is not the current one
        if (collectionNames.includes('facilities')) {
            console.log('Dropping old unused "facilities" collection...');
            await db.collection('facilities').drop();
        }

        // 3. Drop any other old/weirdly named collections? 
        // We will just stick to dropping 'facilities' for now as requested.

        console.log('Cleanup complete. Current collections:');
        const updatedCollections = await db.listCollections().toArray();
        console.log(updatedCollections.map(c => c.name));

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        await mongoose.disconnect();
        process.exit(1);
    }
};

cleanupCollections();
