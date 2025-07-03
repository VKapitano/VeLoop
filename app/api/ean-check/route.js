import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/db';

export async function POST(request) {
    try {
        const { items } = await request.json();

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid request body. "items" array is required.' }, { status: 400 });
        }

        const eansToCheck = items.map(item => Number(item.ean)).filter(ean => ean > 0);
        if (eansToCheck.length === 0) {
            return NextResponse.json({ duplicates: {} });
        }
        
        const client = await clientPromise;
        const db = client.db("next_blog_db");
        const eansCollection = db.collection("eans");

        // Pretraga ostaje ista: pronađi sve dokumente koji imaju tražene EAN kodove.
        const foundDocuments = await eansCollection.find({
            ean: { $in: eansToCheck }
        }).toArray();

        // --- KLJUČNA IZMJENA OVDJE ---
        // Kreiramo Mapu gdje je ključ EAN kod, a vrijednost je VAŠ originalni string ID iz polja "id".
        const foundEanMap = new Map(foundDocuments.map(doc => [
            doc.ean,
            doc.id // <-- Koristimo polje "id" (string), a ne "doc._id" (ObjectId)
        ]));

        const duplicateStatuses = {};
        items.forEach(item => {
            const itemEan = Number(item.ean);
            
            if (foundEanMap.has(itemEan)) {
                // EAN je pronađen. Dohvati originalni ID iz baze.
                const dbItemId = foundEanMap.get(itemEan); // Ovo je sada string, npr. "a1b2c3d4-..."
                
                // Usporedi ID s klijenta (koji je također string) s ID-jem iz baze.
                // Smatramo ga duplikatom samo ako ID-jevi NISU isti.
                if (item._id !== dbItemId) {
                    duplicateStatuses[item._id] = true; // Duplikat
                } else {
                    duplicateStatuses[item._id] = false; // Isti item, nije duplikat
                }
            } else {
                duplicateStatuses[item._id] = false; // Nije pronađen, nije duplikat
            }
        });
        
        return NextResponse.json({ duplicates: duplicateStatuses });

    } catch (error) {
        console.error('EAN Check API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error while checking EANs' }, { status: 500 });
    }
}