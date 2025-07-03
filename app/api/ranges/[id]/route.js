// app/api/ranges/[id]/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb'; // KLJUČAN IMPORT za rad s _id

// --- GET (Dohvati jedan unos po ID-u) ---
export async function GET(request, { params }) {
    try {
        const { id } = params; // Dohvaćamo id iz URL-a (npr. '652f...')

        // Validacija: provjeri je li ID u ispravnom MongoDB formatu
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("next_blog_db");

        // ISPRAVAK: Koristimo 'id' iz URL-a za pretragu
        const range = await db.collection("ranges").findOne({
            _id: new ObjectId(id)
        });

        // Ako unos nije pronađen, vrati 404
        if (!range) {
            return NextResponse.json({ error: 'Range not found' }, { status: 404 });
        }

        return NextResponse.json(range);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Error fetching range' }, { status: 500 });
    }
}

// --- PUT (Ažuriraj jedan unos po ID-u) ---
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const updatedData = await request.json(); // Novi podaci iz tijela zahtjeva

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }
        
        // Uklanjamo _id iz tijela zahtjeva ako postoji, jer se on ne smije mijenjati
        delete updatedData._id;

        // POBOLJŠANJE: Obradi `items` niz prije spremanja
        if (updatedData.items && Array.isArray(updatedData.items)) {
            updatedData.items.forEach(item => {
                // Ako item ima _id koji je string (s klijenta) ili nema _id, daj mu novi ObjectId.
                // Ako već ima ObjectId, ne diraj ga.
                if (!item._id || typeof item._id === 'string') {
                    item._id = new ObjectId();
                    item.ean = parseInt(item.ean, 10) || 0;
                }
            });
        }

        const client = await clientPromise;
        const db = client.db("next_blog_db");

        const result = await db.collection("ranges").updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData } // $set ažurira samo poslana polja, ne dira ostala
        );
        
        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Range not found to update' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Range updated successfully' }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Error updating range' }, { status: 500 });
    }
}

// --- DELETE (Obriši jedan unos po ID-u) ---
export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("next_blog_db");

        const result = await db.collection("ranges").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Range not found to delete' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Range deleted successfully' }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Error deleting range' }, { status: 500 });
    }
}