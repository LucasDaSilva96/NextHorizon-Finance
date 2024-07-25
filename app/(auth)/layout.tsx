import { getLoggedInUser } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();

  if (loggedIn) {
    return redirect('/');
  }

  return (
    <main className='flex min-h-screen w-full justify-between font-inter'>
      {children}
      <div className='auth-asset'>
        <Image
          src={'/icons/auth-image.svg'}
          alt='Auth image'
          width={500}
          height={500}
        />
      </div>
      <ToastContainer />
    </main>
  );
}
