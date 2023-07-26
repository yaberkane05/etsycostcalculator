/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ToggleVAT from './toggle-vat';

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
    countryTax: number;
    countryTaxRes: number;
    listingCost: number;
    listingCostRes: number;
    relistingAfterSaleCost: number;
    relistingAfterSaleCostRes: number;
    processingCost: number;
    processingCostRes: number;
    transactionCost: number;
    transactionShippingCost: number;
    total: number;
    vatTrigger: any;
}

const RealtimeValues: { [name: string]: IPrice } = {
    initialCost: { price: 0.0, vat: 0.0, isVat: true },
    shippingCost: { price: 0.0, vat: 0.0, isVat: true },
    listingCost: { price: 0.2, vat: 0.0, isVat: true },
    relistingAfterSaleCost: { price: 0.2, vat: 0.0, isVat: true },
    processingCost: { price: 0.3, vat: 0.0, isVat: true },
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

    const watchInitialCost = watch('initialCost', RealtimeValues.initialCost.price);
    const watchShippingCost = watch('shippingCost', RealtimeValues.shippingCost.price);
    const watchCountryTax = watch('countryTax', RealtimeValues.countryTax.price);
    const watchVatTrigger = watch('vatTrigger');

    useEffect(() => {
        setValue('initialCostRes', getResult(RealtimeValues.initialCost));
        setValue('shippingCostRes', getResult(RealtimeValues.shippingCost));
        setValue('countryTaxRes', getResult(RealtimeValues.countryTax));
        setValue('listingCostRes', getResult(RealtimeValues.listingCost));
        setValue('relistingAfterSaleCostRes', getResult(RealtimeValues.relistingAfterSaleCost));
        setValue('processingCostRes', getResult(RealtimeValues.processingCost));
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
        RealtimeValues['countryTax'] = { price: countryTax, vat: RealtimeValues.countryTax.isVat ? calculateVAT(countryTax): 0, isVat: RealtimeValues.countryTax.isVat };
        setValue('countryTaxRes', getResult(RealtimeValues.countryTax));
        //refactor to do it once
        RealtimeValues['listingCost'] = { price: RealtimeValues.listingCost.price, vat: RealtimeValues.listingCost.isVat ? calculateVAT(RealtimeValues.listingCost.price): 0, isVat: RealtimeValues.listingCost.isVat };
        setValue('listingCostRes', getResult(RealtimeValues.listingCost));
        RealtimeValues['relistingAfterSaleCost'] = { price: RealtimeValues.relistingAfterSaleCost.price, vat: RealtimeValues.relistingAfterSaleCost.isVat ? calculateVAT(RealtimeValues.relistingAfterSaleCost.price): 0, isVat: RealtimeValues.relistingAfterSaleCost.isVat };
        setValue('relistingAfterSaleCostRes', getResult(RealtimeValues.relistingAfterSaleCost));
        //

        const totalOrder: number = +initialCost + +shippingCost + +countryTax;

        const processingCost = (0.04 * totalOrder) + 0.3;
        RealtimeValues['processingCost'] = { price: processingCost, vat: RealtimeValues.processingCost.isVat ? calculateVAT(processingCost): 0, isVat: RealtimeValues.processingCost.isVat };
        setValue('processingCostRes', getResult(RealtimeValues.processingCost));

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
                	            defaultValue={RealtimeValues.initialCost.price}
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
                	            defaultValue={RealtimeValues.shippingCost.price}
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
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Taxe de vente payée par l'acheteur
                        </th>
                        <td className="px-6 py-4">
                            <input
					    	    type="number"
					    	    min={0}
					    	    step={0.1}
                	            defaultValue={RealtimeValues.countryTax.price}
                	            {...register("countryTax", { required: true })}
					        />
                        </td>
                        <td className="px-6 py-4">
                            <input
                                className="border-0"
                                type="number"
                                disabled
                                {...register("countryTaxRes")}
                            />
                        </td>
                        <td className="px-6 py-4">
                            /
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Frais de mise en vente
                        </th>
                        <td className="px-6 py-4">
                            <input
                                className="border-0"
					    	    type="number"
                                disabled
					    	    min={0}
					    	    step={0.1}
                	            defaultValue={RealtimeValues.listingCost.price}
                	            {...register("listingCost", { required: true })}
					        />
                        </td>
                        <td className="px-6 py-4">
                            <input
                                className="border-0"
                                type="number"
                                disabled
                                {...register("listingCostRes")}
                            />
                        </td>
                        <td className="px-6 py-4">
                            <ToggleVAT
                                    defaultChecked={RealtimeValues.shippingCost.isVat}
                                    changed={(x) => {
                                        setVAT(x.target.checked, 'listingCost');
                                        setValue('vatTrigger', Math.random());
                                    }}
                                />
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Frais de remise en vente
                        </th>
                        <td className="px-6 py-4">
                            <input
                                className="border-0"
					    	    type="number"
                                disabled
					    	    min={0}
					    	    step={0.1}
                	            defaultValue={RealtimeValues.relistingAfterSaleCost.price}
                	            {...register("relistingAfterSaleCost", { required: true })}
					        />
                        </td>
                        <td className="px-6 py-4">
                            <input
                                className="border-0"
                                type="number"
                                disabled
                                {...register("relistingAfterSaleCostRes")}
                            />
                        </td>
                        <td className="px-6 py-4">
                            <ToggleVAT
                                    defaultChecked={RealtimeValues.relistingAfterSaleCost.isVat}
                                    changed={(x) => {
                                        setVAT(x.target.checked, 'relistingAfterSaleCost');
                                        setValue('vatTrigger', Math.random());
                                    }}
                                />
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Frais de traitement (4% du total de la commande + 30c)
                        </th>
                        <td className="px-6 py-4">
                            /
                        </td>
                        <td className="px-6 py-4">
                            <input
                                className="border-0"
                                type="number"
                                disabled
                                {...register("processingCostRes")}
                            />
                        </td>
                        <td className="px-6 py-4">
                            <ToggleVAT
                                    defaultChecked={RealtimeValues.processingCost.isVat}
                                    changed={(x) => {
                                        setVAT(x.target.checked, 'processingCost');
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

const getResult = (value: IPrice): number => +(+value.price + +value.vat).toPrecision(4);

export default Calculator;
