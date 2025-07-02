// app/api/data/route.js

import { NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';
import { ObjectId } from 'mongodb';

// These are the only fields we will allow to be updated via the API for security.
const allowedProductFields = ['description', 'societyDescription'];
const allowedStoreFields = ['openDate', 'closeDate', 'salesFloorBand'];

// POST handler for deletion (no changes here)
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

// --- NEW ---
// PUT handler for updating a single document field
export async function PUT(request) {
    try {
        const { collectionName, id, field, value } = await request.json();

        // 1. Validation
        if (!collectionName || !id || !field || value === undefined) {
            return NextResponse.json({ success: false, message: 'Missing required fields for update.' }, { status: 400 });
        }
        if (collectionName !== 'products' && collectionName !== 'stores') {
            return NextResponse.json({ success: false, message: 'Invalid collection name.' }, { status: 400 });
        }

        // 2. Security Check: Ensure the field is allowed to be edited
        const allowedFields = collectionName === 'products' ? allowedProductFields : allowedStoreFields;
        if (!allowedFields.includes(field)) {
            return NextResponse.json({ success: false, message: `Field '${field}' is not editable.` }, { status: 403 }); // 403 Forbidden
        }

        // 3. Convert string ID to MongoDB ObjectId
        const objectId = new ObjectId(id);

        // 4. Get the collection and perform the update
        const collection = await getCollection(collectionName);
        if (!collection) {
            return NextResponse.json({ success: false, message: 'Database collection not found.' }, { status: 500 });
        }

        const result = await collection.updateOne(
            { _id: objectId }, // Filter to find the correct document
            { $set: { [field]: value } } // Use $set to update only the specified field
        );

        // 5. Check if the update was successful
        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, message: 'Document not found.' }, { status: 404 });
        }

        // 6. Send success response
        return NextResponse.json({
            success: true,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('API Update Error:', error);
        if (error.message.includes('Argument passed in must be a string')) {
            return NextResponse.json({ success: false, message: 'The provided ID is invalid.' }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: 'An internal server error occurred.' }, { status: 500 });
    }
}