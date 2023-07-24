/* eslint-disable react/no-unescaped-entities */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface IFormInputs {
    initialCost: number;
    shippingCost: number;
    listingCost: number;
    relistingAfterSaleCost: number;
    processingCost: number;
    countryTax: number;
    transactionCost: number;
    transactionShippingCost: number;
    total: number;
}

const initialValues = {
    initialCost: 0.0,
    shippingCost: 0.0,
    listingCost: 0.2,
    relistingAfterSaleCost: 0.2,
    processingCost: 0.3,
    countryTax: 0.0,
    transactionCost: 0.0,
    transactionShippingCost: 0.0,
};

const currency = '€';


const Calculator = () => {

    const {
        register,
        watch,
        getValues,
        setValue
    } = useForm<IFormInputs>();

    const watchInitialCost = watch('initialCost');
    const watchShippingCost = watch('shippingCost');
    const watchCountryTax = watch('countryTax');

    useEffect(() => {
        const values = getValues();
        const initialCost = values.initialCost;
        const shippingCost = values.shippingCost;
        const countryTax = values.countryTax;

        const totalOrder = +initialCost + +shippingCost + +countryTax;

        const processingCost = (0.04 * totalOrder) + 0.3;
        setValue('processingCost', +processingCost.toPrecision(4));
        const transactionCost = 0.065 * initialCost;
        setValue('transactionCost', +transactionCost.toPrecision(4));
        const transactionShippingCost = 0.065 * shippingCost;
        setValue('transactionShippingCost', +transactionShippingCost.toPrecision(4));

        const total = +initialValues.listingCost + +initialValues.relistingAfterSaleCost + +countryTax + +transactionCost + +transactionShippingCost + +processingCost;
        setValue('total', +total.toPrecision(4));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchInitialCost, watchShippingCost, watchCountryTax]);

	return (
		<form>
			<div>
				<span className="mr-2">Fabrication</span>
				<input
					type='number'
					min={0}
					step={0.01}
					className='border-red-500 invalid:border'
                    defaultValue={0.0}
                    {...register("initialCost", { required: true })}
				></input>
			</div>
			<div>
				<span className="mr-2">Livraison</span>
				<input
					type='number'
					min={0}
					step={0.01}
                    defaultValue={0.0}
					className='border-red-500 invalid:border'
                    {...register("shippingCost", { required: true })}
				></input>
			</div>
			<div>
				<span className='mr-2'>Taxe de vente payée par l'acheteur</span>
				<input
					type='number'
					min={0}
					step={0.01}
                    defaultValue={initialValues.countryTax}
                    {...register("countryTax")}
				></input>
			</div>
			<div>
				<span className="mr-2">Mise en vente</span>
				<input
					type='number'
					min={0}
					step={0.01}
					disabled
					defaultValue={initialValues.listingCost}
                    {...register("listingCost")}
				></input>
			</div>
			<div>
				<span className='mr-2'>Remise en vente après vente</span>
				<input
					type='number'
					min={0}
					step={0.01}
					disabled
                    defaultValue={initialValues.relistingAfterSaleCost}
                    {...register("relistingAfterSaleCost")}
				></input>
			</div>
			<div>
				<span className='mr-2'>Frais de traitement (4% du total de la commande + 30c)</span>
				<input
					type='number'
					min={0}
					step={0.01}
					disabled
                    defaultValue={initialValues.processingCost}
                    {...register("processingCost")}
				></input>
			</div>
			<div>
				<span className='mr-2'>Frais de transaction (6.5% du total des articles)</span>
				<input
					type='number'
					min={0}
					step={0.01}
                    disabled
                    defaultValue={initialValues.transactionCost}
                    {...register("transactionCost")}
				></input>
			</div>
			<div>
				<span className='mr-2'>Frais de transaction livraison (6.5% du total des articles)</span>
				<input
					type='number'
					min={0}
					step={0.01}
                    disabled
                    defaultValue={initialValues.transactionShippingCost}
                    {...register("transactionShippingCost")}
				></input>
			</div>
			<div>
				<span className='mr-2'>Total</span>
				<input
					type='number'
					min={0}
					disabled
                    {...register("total")}
				></input>
                {currency}
			</div>
		</form>
	);
};

export default Calculator;
