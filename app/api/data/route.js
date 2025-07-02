// app/api/data/route.js

import { NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';
import { ObjectId } from 'mongodb'; // IMPORTANT: To convert string IDs back to MongoDB ObjectIDs

export async function POST(request) {
    try {
        const { idsToDelete, collectionName } = await request.json();

        // 1. Validation
        if (!idsToDelete || !Array.isArray(idsToDelete) || idsToDelete.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid or empty list of IDs provided.' }, { status: 400 });
        }
        if (collectionName !== 'products' && collectionName !== 'stores') {
            return NextResponse.json({ success: false, message: 'Invalid collection name.' }, { status: 400 });
        }

        // 2. Convert string IDs to MongoDB ObjectId type
        const objectIds = idsToDelete.map(id => new ObjectId(id));

        // 3. Get the collection and perform deletion
        const collection = await getCollection(collectionName);
        if (!collection) {
            return NextResponse.json({ success: false, message: 'Database collection not found.' }, { status: 500 });
        }

        const result = await collection.deleteMany({
            _id: { $in: objectIds } // Use the $in operator to delete all matching documents
        });

        // 4. Send success response
        return NextResponse.json({
            success: true,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('API Deletion Error:', error);
        // Check if the error is due to an invalid ObjectId format
        if (error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters')) {
            return NextResponse.json({ success: false, message: 'One or more provided IDs are invalid.' }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: 'An internal server error occurred.' }, { status: 500 });
    }
}