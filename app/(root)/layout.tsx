import MobileNavBar from '@/components/MobileNavBar';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = {
    $id: '1',
    email: 'test@test.com',
    userId: '2',
    dwollaCustomerUrl: 'https://api-sandbox.dwolla.com/customers/2',
    dwollaCustomerId: '2',
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main St',
    city: 'Anytown',
    state: 'NY',
    postalCode: '12345',
    dateOfBirth: '1990-01-01',
    ssn: '5135',
  };
  return (
    <main className='flex h-screen w-full font-inter'>
      <Sidebar user={loggedIn} />
      <div className='flex size-full flex-col'>
        <div className='root-layout'>
          <Image
            src={'/icons/logo.svg'}
            width={30}
            height={30}
            alt='menu icon'
          />
          <MobileNavBar user={loggedIn} />
        </div>
        {children}
      </div>
    </main>
  );
}
