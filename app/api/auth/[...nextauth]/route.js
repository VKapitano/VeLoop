// app/api/auth/[...nextauth]/route.js
{/*import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// Import your db functions if needed for credentials validation

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // This is where you would validate the credentials
        // Example with fake user:
        if (
          credentials.email === 'user@example.com' &&
          credentials.password === 'password'
        ) {
          return { id: '1', name: 'User', email: 'user@example.com' };
        }

        // In a real app, you would check against your database
        // const user = await db.user.findUnique({ where: { email: credentials.email } });
        // if (user && validatePassword(credentials.password, user.password)) {
        //   return { id: user.id, name: user.name, email: user.email };
        // }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
*/}