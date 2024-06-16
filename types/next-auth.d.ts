// Ref: https://authjs.dev/getting-started/typescript#module-augmentation
import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: string;
  }
}
