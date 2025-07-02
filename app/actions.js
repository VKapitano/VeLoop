// app/actions.js
'use server'; // <-- Ključna direktiva koja ovo čini Server Action datotekom

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
  // Brisanje kolačića
  cookies().delete('auth-test');

  // Preusmjeravanje na login stranicu
  redirect('/login');
}