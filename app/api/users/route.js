import { NextResponse } from 'next/server';

import { auth, clerkClient } from '@clerk/nextjs/server';

// Add this line to ensure the route is always dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
    // 1. Security Check: Ensure the user is authenticated.
    const { userId } = await auth();
    if (!userId) {
        // We are hitting this line right now
        return NextResponse("Unauthorized", { status: 401 });
    }
    /* const user = await client.users.getUser(userId);
    console.log(user); */
    try {
        const client = await clerkClient();
        const users = await client.users.getUserList();
        console.log(users);
        return NextResponse.json(users, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(err, { status: 500 })
    }
}