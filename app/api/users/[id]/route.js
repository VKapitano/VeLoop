import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb'; // We need this to convert the string ID back to a MongoDB ObjectId

export async function PUT(request, { params }) {
    // 1. Security Check: User must be authenticated.
    // In a real app, you might add another check here to see if the user is an 'Admin'.
    const { userId } = auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // 2. Get the user ID from the URL and the new data from the request body.
        const { id } = params;
        const { role, status } = await request.json();

        if (!id || !role || !status) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // 3. Connect to the database.
        const usersCollection = await getCollection('users');
        if (!usersCollection) {
            return new NextResponse("Database connection failed", { status: 500 });
        }

        // 4. Find the user by their ID and update their role and status.
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) }, // Find the document with this ID
            { $set: { role: role, status: status } } // Set the new values
        );

        if (result.matchedCount === 0) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json({ message: "User updated successfully" });

    } catch (error) {
        console.error("Failed to update user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}