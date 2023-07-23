import React from 'react';
import { useForm } from 'react-hook-form';

const Calculator = () => {
  const { register, handleSubmit, setValue, watch, formState } = useForm({
    mode: 'onChange'
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  // Function to calculate the final price based on the price and additional costs
  const calculateFinalPrice = (price: string, additionalCosts: string[]) => {
    let total = parseFloat(price);
    additionalCosts.forEach((cost) => {
      total += parseFloat(cost);
    });
    return total.toFixed(2);
  };

  // Watch the additional costs to automatically update the final price
  const additionalCosts = watch('additionalCosts', []);

  React.useEffect(() => {
    setValue('finalPrice', calculateFinalPrice(watch('price'), additionalCosts));
  }, [additionalCosts]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-gray-200 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="price" className="block mb-1 font-semibold">
          Product listing price:
        </label>
        <input
          type="number"
          {...register('price', { required: true, min: 0 })}
          className="w-full px-3 py-2 border rounded-md bg-slate-300"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="additionalCosts" className="block mb-1 font-semibold">
          Additional Costs:
        </label>
        <input
          type="number"
          {...register('additionalCosts[0]')}
          className="w-full px-3 py-2 border rounded-md bg-slate-300"
        />
        <input
          type="number"
          {...register('additionalCosts[1]')}
          className="w-full mt-2 px-3 py-2 border rounded-md bg-slate-300"
        />
        {/* You can add more input fields for additional costs as needed */}
      </div>

      <div className="mb-4">
        <label htmlFor="finalPrice" className="block mb-1 font-semibold">
          Final Price:
        </label>
        <input
          type="number"
          {...register('finalPrice')}
          disabled
          className="w-full px-3 py-2 border rounded-md bg-gray-300"
        />
      </div>

      <button type="submit" disabled={!formState.isValid} className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Calculate
      </button>
    </form>
  );
};

export default Calculator;
