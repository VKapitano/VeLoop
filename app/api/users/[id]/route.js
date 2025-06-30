import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb'; // We need this to convert the string ID back to a MongoDB ObjectId

export async function PUT(request, { params }) {
    // 1. Security Check: User must be authenticated.
    // In a real app, you might add another check here to see if the user is an 'Admin'.
    const { userId } = await auth();
    if (!userId) {
        console.log("unauth error")
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // 2. Get the user ID from the URL and the new data from the request body.
        const { id } = params;
        const { role, status } = await request.json();
        console.log(id)
        console.log(role, status)

        if (!id || !role || !status) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        /*    // 3. Connect to the database.
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
   
           return NextResponse.json({ message: "User updated successfully" }); */
        const client = await clerkClient();
        await client.users.updateUser(id, {
            publicMetadata: { status: status, role: role },
            privateMetadata: { status: status, role: role },
        });
        // Return a success response
        return NextResponse.json(
            { message: "User updated successfully" },
            { status: 200 } // 201 Created
        );
    } catch (error) {
        console.error("Failed to update user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    // A security check for an 'admin' role is absolutely necessary for a delete operation.
    const { userId } = await auth();
    const client = await clerkClient();
    const curUser = await client.users.getUser(userId);
    if (curUser?.privateMetadata?.role?.toLowerCase() !== 'admin') {
        return NextResponse.json({ error: "Unauthorized: You don't have permission to perform this action." }, { status: 403 });
    }

    try {
        // Get the user ID from the URL parameters.
        const { id } = params;
        if (userId === id) {
            return NextResponse.json({ error: "You can not delete yoursefl in user managment" }, { status: 405 })
        }
        if (!id) {
            return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
        }

        // Use the Clerk Backend SDK to delete the user.
        await client.users.deleteUser(id);

        // Return a success response.
        return NextResponse.json({ success: true, message: 'User deleted successfully.' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting user from Clerk:', error);
        // Handle specific errors from Clerk, like if the user is not found.
        if (error.status === 404) {
            return NextResponse.json({ error: 'User not found in Clerk.' }, { status: 404 });
        }
        // Return a generic server error for other issues.
        return NextResponse.json({ error: 'An internal server error occurred while deleting the user.' }, { status: 500 });
    }
}