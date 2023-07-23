import Calculator from '@/components/calculator';
import Head from 'next/head';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Etsy fees & product cost price calculator</title>
      </Head>

      <main className="min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-3xl font-semibold mb-6">Etsy fees & product cost price calculator</h1>
          <Calculator />
        </div>
      </main>

      <footer className="text-center py-4 bg-gray-200">
        <p>Powered by Next.js</p>
      </footer>
    </div>
  );
};

export default Home;
