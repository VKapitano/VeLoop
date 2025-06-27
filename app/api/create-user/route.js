import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db'; // Make sure the path to your db.js is correct
import { auth } from '@clerk/nextjs/server';

export async function POST(request) {
    // 1. Check if the request is coming from an authenticated user.
    // This is a crucial security check. The user must have just signed up
    // and have an active session to create their DB record.
    const { userId, getToken } = auth();
    if (!userId) {
        return new NextResponse("Unauthorized: No user ID found.", { status: 401 });
    }

    // 2. Get the data sent from the registration page.
    const { email, name, clerkId } = await request.json();

    // 3. A second security check: Does the clerkId from the request body
    //    match the clerkId of the authenticated user making this request?
    if (userId !== clerkId) {
        return new NextResponse("Forbidden: Mismatched user ID.", { status: 403 });
    }

    // 4. Connect to the database and insert the new user.
    try {
        const usersCollection = await getCollection('users');
        if (!usersCollection) {
            return new NextResponse("Database connection failed.", { status: 500 });
        }

        // Check if user already exists in our DB to prevent duplicates
        const existingUser = await usersCollection.findOne({ clerkId: clerkId });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists in DB." }, { status: 200 });
        }

        const newUserDocument = {
            clerkId: clerkId,
            email: email,
            name: name,
            role: 'Viewer', // Set a default role for all new users
            status: 'Active', // Set a default status
            lastLogin: new Date(),
        };

        const result = await usersCollection.insertOne(newUserDocument);

        console.log(`Successfully created user in MongoDB with ID: ${result.insertedId}`);
        return NextResponse.json({ message: "User created successfully in DB", user: newUserDocument }, { status: 201 });

    } catch (err) {
        console.error("Error creating user in MongoDB:", err);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}