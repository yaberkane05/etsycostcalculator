import Calculator from '@/components/calculator';
import Head from 'next/head';

const Home = () => {
  return (
    <div>
      <Head>
        <title>EtsyCostCalculator</title>
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div>
          {/* <h1 className="text-3xl font-semibold mb-6">Etsy Cost Calculator</h1> */}
          <Calculator />
        </div>
      </main>
    </div>
  );
};

export default Home;
