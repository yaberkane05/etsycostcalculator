import Calculator from '@/components/calculator';
import Head from 'next/head';

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
            </div>
        </main>
    </div>
  );
};

export default Home;
