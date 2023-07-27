import Calculator from '@/components/calculator';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
        <Head>
            <title>Etsy Cost Calculator</title>
        </Head>
        <main className="h-auto p-12 m-auto antialiased">
            <div>
                <h1 className="mb-6 text-3xl font-semibold">Etsy Cost Calculator</h1>
                <Calculator />
                <Link className="absolute bottom-1" href={"https://github.com/yaberkane05/etsycostcalculator"}>https://github.com/yaberkane05/etsycostcalculator</Link>
            </div>
            <Analytics />
        </main>
    </div>
  );
};

export default Home;
