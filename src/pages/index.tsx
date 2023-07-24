import Calculator from '@/components/calculator';
import Head from 'next/head';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Etsy Cost Calculator</title>
      </Head>

      <main className="flex items-center justify-center min-h-screen bg-slate-50">
        <div>
          <h1 className="mb-6 text-3xl font-semibold">Etsy Cost Calculator</h1>
          <Calculator />
        </div>
      </main>
    </div>
  );
};

export default Home;
