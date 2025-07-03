import { MongoClient } from 'mongodb'

if (!process.env.DB_URI) {
  throw new Error('Invalid/Missing environment variable: "DB_URI"')
}

const uri = process.env.DB_URI
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  // U development modu, koristimo globalnu varijablu da se vrijednost
  // sačuva između "hot reloads" koje Next.js radi.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // U produkciji, nema hot reloads.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Izvozimo MongoClient promise. Ovo je ključna promjena!
export default clientPromise