//"use client"
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input'; 
import { authenticateUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get('logged-in');
  if (isLoggedIn) {
    redirect('/');
  }

  async function handleLogin(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
 
    const login_response = await authenticateUser(email, password); 
    if(!login_response.status){
      //alert(login_response.message)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Please enter your credentials to log in.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <form action={handleLogin} className="w-full space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
