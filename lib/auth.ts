import { redirect } from 'next/navigation'; // or use your router
import { cookies } from 'next/headers'; 

export async function authenticateUser(email: string, password: string) {
  const STATIC_EMAIL = 'metztlitaquerias@gmail.com';
  const STATIC_PASSWORD = 'metztlitaquerias123@#';
  if (email === STATIC_EMAIL && password === STATIC_PASSWORD) {
    console.log('Login successful!');
    const cookieStore = await cookies();
      cookieStore.set('logged-in', 'true', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
    });
    redirect('/');
  } else {
    return {
      status : false,
      message : 'Invalid email or password'
    } 
  }
}

export const handlers = {
  GET: async (req: Request) => { /* logic here */ },
  POST: async (req: Request) => { /* logic here */ },
};