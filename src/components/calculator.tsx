/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { ChangeEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const globalVat = 0.21;
const currency = '€';

interface IPrice {
    price: number;
    vat: number;
    isVat: boolean;
};

interface IFormInputs {
    initialCost: number;
    initialCostRes: number;
    shippingCost: number;
    shippingCostRes: number;
    listingCost: number;
    relistingAfterSaleCost: number;
    processingCost: number;
    countryTax: number;
    transactionCost: number;
    transactionShippingCost: number;
    total: number;
    vatTrigger: any;
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

const RealtimeValues: { [name: string]: IPrice } = {
    initialCost: { price: 0.0, vat: 0.0, isVat: true },
    shippingCost: { price: 0.0, vat: 0.0, isVat: true },
    listingCost: { price: 0.2, vat: 0.0, isVat: false },
    relistingAfterSaleCost: { price: 0.2, vat: 0.0, isVat: false },
    processingCost: { price: 0.3, vat: 0.0, isVat: false },
    countryTax: { price: 0.0, vat: 0.0, isVat: false },
    transactionCost: { price: 0.0, vat: 0.0, isVat: false },
    transactionShippingCost: { price: 0.0, vat: 0.0, isVat: false },
};


const Calculator = () => {

    const {
        register,
        watch,
        getValues,
        setValue,
    } = useForm<IFormInputs>();

    const watchInitialCost = watch('initialCost', initialValues.initialCost);
    const watchShippingCost = watch('shippingCost', RealtimeValues.shippingCost.price);
    const watchCountryTax = watch('countryTax', initialValues.countryTax);
    const watchVatTrigger = watch('vatTrigger');

    useEffect(() => {
        setValue('initialCostRes', getResult(RealtimeValues.initialCost));
        setValue('shippingCostRes', getResult(RealtimeValues.shippingCost));
    }, [watchVatTrigger]);

    useEffect(() => {
        const values = getValues();
        const initialCost: number = values.initialCost;
        const shippingCost: number = values.shippingCost;
        const countryTax: number = values.countryTax;

        RealtimeValues['initialCost'] = { price: initialCost, vat: RealtimeValues.initialCost.isVat ? calculateVAT(initialCost): 0, isVat: RealtimeValues.initialCost.isVat };
        setValue('initialCostRes', getResult(RealtimeValues.initialCost));
        RealtimeValues['shippingCost'] = { price: shippingCost, vat: RealtimeValues.shippingCost.isVat ? calculateVAT(shippingCost): 0, isVat: RealtimeValues.shippingCost.isVat };
        setValue('shippingCostRes', getResult(RealtimeValues.shippingCost));

        // const totalOrder: number = +initialCost + +shippingCost + +countryTax;

        // const processingCost = (0.04 * totalOrder) + 0.3;
        // setValue('processingCost.price', +processingCost.toPrecision(4));

        // const transactionCost = 0.065 * initialCost;
        // setValue('transactionCost.price', +transactionCost.toPrecision(4));

        // const transactionShippingCost = 0.065 * shippingCost?.price;
        // setValue('transactionShippingCost.price', +transactionShippingCost.toPrecision(4));

        // const total = +RealtimeValues.listingCost.price + +RealtimeValues.relistingAfterSaleCost.price + +countryTax + +transactionCost + +transactionShippingCost + +processingCost;
        // setValue('total.price', +total.toPrecision(4));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchInitialCost, watchShippingCost, watchCountryTax]);

	return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Nom du frais/taxe
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Prix
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Résultat
                        </th>
                        <th scope="col" className="px-6 py-3">
                            TVA ({globalVat * 100} %)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Fabrication
                        </th>
                        <td className="px-6 py-4">
                            <input
					    	    type='number'
					    	    min={0}
					    	    step={0.1}
                	            defaultValue={0.0}
                	            {...register("initialCost", { required: true })}
					        />
                        </td>
                        <td className="px-6 py-4">
                            <input
                                className="border-0"
                                type="number"
                                disabled
                                {...register("initialCostRes")}
                            />
                        </td>
                        <td className="px-6 py-4">
                            <ToggleVAT
                                defaultChecked={RealtimeValues.initialCost.isVat}
                                changed={(x) => {
                                    setVAT(x.target.checked, 'initialCost');
                                    setValue('vatTrigger', Math.random());
                                }}
                            />
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Livraison
                        </th>
                        <td className="px-6 py-4">
                            <input
					    	    type='number'
					    	    min={0}
					    	    step={0.1}
                	            defaultValue={0.0}
                	            {...register("shippingCost", { required: true })}
					        />
                        </td>
                        <td className="px-6 py-4">
                            <input
                                className="border-0"
                                type="number"
                                disabled
                                {...register("shippingCostRes")}
                            />
                        </td>
                        <td className="px-6 py-4">
                            <ToggleVAT
                                defaultChecked={RealtimeValues.shippingCost.isVat}
                                changed={(x) => {
                                    setVAT(x.target.checked, 'shippingCost');
                                    setValue('vatTrigger', Math.random());
                                }}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <input hidden {...register("vatTrigger")} />
        </div>
	);

	return (
		<form>
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

// functions
const calculateVAT = (cost: number): number => cost * globalVat;

const setVAT = (truthy: boolean, field: string): void => {
    let t = RealtimeValues[field];
    t.isVat = truthy;
    truthy ? t.vat = calculateVAT(RealtimeValues[field].price): t.vat = 0;
    delete RealtimeValues[field];
    RealtimeValues[field] = t;
};

const getResult = (value: IPrice): number => +value.price + +value.vat;

// components
const ToggleVAT = (defaultChecked: boolean, {changed = (c: ChangeEvent<HTMLInputElement>) => {}}) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            className="sr-only peer"
            defaultChecked={defaultChecked}
            onChange={c => changed(c)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"/>
    </label>
);

export default Calculator;
