// app/api/ranges/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb'; // ili '@/lib/mongodb'
import { ObjectId } from 'mongodb'; // KLJUČAN IMPORT za rad s _id

export async function GET() {
    try {
        // Čekamo da se Promise koji smo importali riješi.
        // Nakon ove linije, `client` će biti stvarna, spojena MongoClient instanca.
        const client = await clientPromise;

        // Sada `client` ima .db() metodu i sve će raditi kako treba.
        const db = client.db("next_blog_db");

        const ranges = await db.collection("ranges").find({}).toArray();

        return NextResponse.json(ranges);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Error fetching ranges' }, { status: 500 });
    }
}

// POST: Dodaj novi range
export async function POST(request) {
    try {
        const newRange = await request.json();
        
        // POBOLJŠANJE: Dodijeli ObjectId svakom itemu u nizu
        if (newRange.items && Array.isArray(newRange.items)) {
            newRange.items.forEach(item => {
                item._id = new ObjectId();
                item.ean = parseInt(item.ean, 10) || 0;
            });
        }
        
        const client = await clientPromise;
        const db = client.db("next_blog_db");

        const result = await db.collection("ranges").insertOne(newRange);

        return NextResponse.json(result, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Error creating range' }, { status: 500 });
    }
}