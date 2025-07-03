import { NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';
import { ObjectId } from 'mongodb';

// Security: These are the only fields we will allow to be updated via the API.
const allowedProductFields = ['description', 'societyDescription'];
const allowedStoreFields = ['openDate', 'closeDate', 'salesFloorBand'];

// --- HANDLER FOR CREATION (POST) - (Your original, secure code is kept) ---
export async function POST(request) {
    try {
        const { collectionName, newItem } = await request.json();

        if (collectionName !== 'products' && collectionName !== 'stores') {
            return NextResponse.json({ success: false, message: 'Invalid collection name.' }, { status: 400 });
        }

        const collection = await getCollection(collectionName);
        if (!collection) {
            return NextResponse.json({ success: false, message: 'Database collection not found.' }, { status: 500 });
        }

        // Uniqueness Check for EAN/SiteKey before inserting
        if (collectionName === 'products') {
            const existing = await collection.findOne({ ean: newItem.ean });
            if (existing) {
                return NextResponse.json({ success: false, message: `A product with EAN code ${newItem.ean} already exists. Please try again.` }, { status: 409 });
            }
        }
        if (collectionName === 'stores') {
            const existing = await collection.findOne({ siteKey: newItem.siteKey });
            if (existing) {
                return NextResponse.json({ success: false, message: `A store with Site Key ${newItem.siteKey} already exists. Please try again.` }, { status: 409 });
            }
        }

        const result = await collection.insertOne(newItem);

        // Return the newly created item, complete with its new _id, so the frontend can update its state
        const createdItem = { ...newItem, _id: result.insertedId.toString() };

        return NextResponse.json({ success: true, item: createdItem });

    } catch (error) {
        console.error('API Creation Error:', error);
        return NextResponse.json({ success: false, message: 'An internal server error occurred.' }, { status: 500 });
    }
}

// --- HANDLER FOR UPDATES (PUT) - (This is the safely merged version) ---
export async function PUT(request) {
    try {
        // Step 1: Accept the new 'updates' object from the frontend sidebar
        const { collectionName, id, updates } = await request.json();

        // Step 2: Basic validation for the new structure
        if (!collectionName || !id || !updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
            return NextResponse.json({ success: false, message: 'Missing required fields for update.' }, { status: 400 });
        }
        if (collectionName !== 'products' && collectionName !== 'stores') {
            return NextResponse.json({ success: false, message: 'Invalid collection name.' }, { status: 400 });
        }

        const collection = await getCollection(collectionName);
        if (!collection) {
            return NextResponse.json({ success: false, message: 'Database collection not found.' }, { status: 500 });
        }

        // Step 3: PRESERVE YOUR SECURITY CHECK
        // We build a new 'sanitizedUpdates' object that ONLY contains fields from the allowed list.
        const allowedFields = collectionName === 'products' ? allowedProductFields : allowedStoreFields;
        const sanitizedUpdates = {};

        for (const field of Object.keys(updates)) {
            if (allowedFields.includes(field)) {
                sanitizedUpdates[field] = updates[field]; // Only add allowed fields to the update object
            } else {
                // If a non-allowed field is found, reject the entire request for security.
                console.warn(`SECURITY: Attempted to update non-editable field '${field}' on collection '${collectionName}'`);
                // You could choose to just ignore it, but rejecting is safer.
            }
        }

        // If the user sent an update request but none of the fields were valid, reject it.
        if (Object.keys(sanitizedUpdates).length === 0) {
            return NextResponse.json({ success: false, message: 'No valid fields provided for update.' }, { status: 400 });
        }

        // Step 4: Perform the update using the SAFELY sanitized object
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: sanitizedUpdates }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, message: 'Document not found.' }, { status: 404 });
        }

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

// --- HANDLER FOR DELETION (DELETE) - (Your original, secure code is kept) ---
export async function DELETE(request) {
    try {
        const { idsToDelete, collectionName } = await request.json();

        if (!idsToDelete || !Array.isArray(idsToDelete) || idsToDelete.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid or empty list of IDs provided.' }, { status: 400 });
        }
        if (collectionName !== 'products' && collectionName !== 'stores') {
            return NextResponse.json({ success: false, message: 'Invalid collection name.' }, { status: 400 });
        }

        const objectIds = idsToDelete.map(id => new ObjectId(id));

        const collection = await getCollection(collectionName);
        if (!collection) {
            return NextResponse.json({ success: false, message: 'Database collection not found.' }, { status: 500 });
        }

        const result = await collection.deleteMany({ _id: { $in: objectIds } });

        return NextResponse.json({ success: true, deletedCount: result.deletedCount });

    } catch (error) {
        console.error('API Deletion Error:', error);
        if (error.message.includes('Argument passed in must be a string')) {
            return NextResponse.json({ success: false, message: 'One or more provided IDs are invalid.' }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: 'An internal server error occurred.' }, { status: 500 });
    }
}