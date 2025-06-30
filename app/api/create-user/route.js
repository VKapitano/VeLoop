// app/api/create-user/route.js
/*
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // Parse the request body
        const { email, password } = await request.json();

        // Basic validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }
        const client = await clerkClient();
        // Create the user in Clerk
        const newUser = await client.users.createUser({
            emailAddress: [email],
            password: password // This will be hashed automatically by Clerk
            // You can add other properties here, like publicMetadata
        });

        // You can optionally do something with the newUser object here,
        // like adding them to your own database.

        // Return a success response
        return NextResponse.json(
            { message: "User created successfully", user: newUser },
            { status: 201 } // 201 Created
        );

    } catch (error) {
        console.log(error)
        // Log the full error for debugging
        console.error("Error creating user:", JSON.stringify(error, null, 2));

        // Handle specific Clerk errors
        if (error.errors) {
            const clerkError = error.errors[0];
            // e.g., "Email address is taken."
            return NextResponse.json({ error: clerkError.longMessage || "An error occurred." }, { status: 422 }); // 422 Unprocessable Entity
        }

        // Handle generic errors
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
    */