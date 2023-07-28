/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ToggleVAT from './toggle-vat';

interface IPrice {
    price: number;
    vat: number;
    isVat: boolean;
};

interface IFormInputs {
    globalVat: number;
    manufacturingCost: number;
    manufacturingCostRes: number;
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
    transactionCostRes: number;
    transactionShippingCost: number;
    transactionShippingCostRes: number;
    total: number;
    totalOrder: number;
    profit: number;
    vatTrigger: any;
}

const globalVat = 21;
const currency = '€';

const RealtimeValues: { [name: string]: IPrice } = {
    initialCost: { price: 0.0, vat: 0.0, isVat: false },
    shippingCost: { price: 0.0, vat: 0.0, isVat: false },
    listingCost: { price: 0.18, vat: 0.0, isVat: true },
    relistingAfterSaleCost: { price: 0.18, vat: 0.0, isVat: true },
    processingCost: { price: 0.3, vat: 0.0, isVat: true },
    countryTax: { price: 0, vat: 0, isVat: false },
    transactionCost: { price: 0.0, vat: 0.0, isVat: true },
    transactionShippingCost: { price: 0.0, vat: 0.0, isVat: true },
    total: { price: 0.0, vat: 0.0, isVat: false },
    totalOrder: { price: 0.0, vat: 0.0, isVat: false },
    manufacturingCost: { price: 0.0, vat: 0.0, isVat: false },
    profit: { price: 0.0, vat: 0.0, isVat: false }
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
    const watchManufacturingCost = watch('manufacturingCost', RealtimeValues.manufacturingCost.price);
    const watchGlobalVat = watch('globalVat', globalVat);
    const watchVatTrigger = watch('vatTrigger');

    useEffect(() => {
        setValue('initialCostRes', getResult(RealtimeValues.initialCost));
        setValue('manufacturingCostRes', getResult(RealtimeValues.manufacturingCost));
        setValue('shippingCostRes', getResult(RealtimeValues.shippingCost));
        setValue('countryTaxRes', getResult(RealtimeValues.countryTax));
        setValue('listingCostRes', getResult(RealtimeValues.listingCost));
        setValue('relistingAfterSaleCostRes', getResult(RealtimeValues.relistingAfterSaleCost));
        setValue('processingCostRes', getResult(RealtimeValues.processingCost));
        setValue('transactionCostRes', getResult(RealtimeValues.transactionCost));
        setValue('transactionShippingCostRes', getResult(RealtimeValues.transactionShippingCost));

        //total
        const total = calculateAndSetTotal();
        //cost total
        const costTotal = getValues('totalOrder') - total - getValues('manufacturingCost');
        setValue('profit', +(!isNaN(costTotal) ? costTotal : 0).toPrecision(4));
    }, [watchVatTrigger]);

    useEffect(() => {
        const values = getValues();
        const initialCost: number = values.initialCost;
        const manufacturingCost: number = values.manufacturingCost;
        const shippingCost: number = values.shippingCost;
        const countryTax: number = values.countryTax;
        
        RealtimeValues['initialCost'] = { price: initialCost, vat: RealtimeValues.initialCost.isVat ? calculateVAT(initialCost): 0, isVat: RealtimeValues.initialCost.isVat };
        setValue('initialCostRes', getResult(RealtimeValues.initialCost));
        RealtimeValues['manufacturingCost'] = { price: manufacturingCost, vat: RealtimeValues.manufacturingCost.isVat ? calculateVAT(manufacturingCost): 0, isVat: RealtimeValues.manufacturingCost.isVat };
        setValue('manufacturingCostRes', getResult(RealtimeValues.manufacturingCost));
        RealtimeValues['shippingCost'] = { price: shippingCost, vat: RealtimeValues.shippingCost.isVat ? calculateVAT(shippingCost): 0, isVat: RealtimeValues.shippingCost.isVat };
        setValue('shippingCostRes', getResult(RealtimeValues.shippingCost));

        const countryTaxDecimal = (countryTax / 100);
        const countryTaxCalculated = +(countryTaxDecimal * (+initialCost + +shippingCost)).toPrecision(4);
        RealtimeValues['countryTax'] = { price: countryTaxCalculated, vat: RealtimeValues.countryTax.isVat ? calculateVAT(countryTaxCalculated): 0, isVat: RealtimeValues.countryTax.isVat };
        setValue('countryTaxRes', getResult(RealtimeValues.countryTax));

        //TODO: refactor to do it once
        RealtimeValues['listingCost'] = { price: RealtimeValues.listingCost.price, vat: RealtimeValues.listingCost.isVat ? calculateVAT(RealtimeValues.listingCost.price): 0, isVat: RealtimeValues.listingCost.isVat };
        setValue('listingCostRes', getResult(RealtimeValues.listingCost));
        RealtimeValues['relistingAfterSaleCost'] = { price: RealtimeValues.relistingAfterSaleCost.price, vat: RealtimeValues.relistingAfterSaleCost.isVat ? calculateVAT(RealtimeValues.relistingAfterSaleCost.price): 0, isVat: RealtimeValues.relistingAfterSaleCost.isVat };
        setValue('relistingAfterSaleCostRes', getResult(RealtimeValues.relistingAfterSaleCost));
        //

        const totalOrder: number = +(+initialCost + +shippingCost + +countryTaxCalculated).toPrecision(4);

        const processingCost = (0.04 * totalOrder) + 0.3;
        RealtimeValues['processingCost'] = { price: processingCost, vat: RealtimeValues.processingCost.isVat ? calculateVAT(processingCost): 0, isVat: RealtimeValues.processingCost.isVat };
        setValue('processingCostRes', getResult(RealtimeValues.processingCost));

        const transactionCost = 0.065 * initialCost;
        RealtimeValues['transactionCost'] = { price: transactionCost, vat: RealtimeValues.transactionCost.isVat ? calculateVAT(transactionCost): 0, isVat: RealtimeValues.transactionCost.isVat };
        setValue('transactionCostRes', getResult(RealtimeValues.transactionCost));

        const transactionShippingCost = 0.065 * shippingCost;
        RealtimeValues['transactionShippingCost'] = { price: transactionShippingCost, vat: RealtimeValues.transactionShippingCost.isVat ? calculateVAT(transactionShippingCost): 0, isVat: RealtimeValues.transactionShippingCost.isVat };
        setValue('transactionShippingCostRes', getResult(RealtimeValues.transactionShippingCost));

        //total
        const total = calculateAndSetTotal();
        //sell total
        setValue('totalOrder', totalOrder);
        //cost total
        setValue('profit', +(totalOrder - total - manufacturingCost).toPrecision(4));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchInitialCost, watchShippingCost, watchCountryTax, watchManufacturingCost, watchGlobalVat]);

    const calculateVAT = (cost: number): number => cost * (getValues('globalVat') / 100);

    const setVAT = (truthy: boolean, field: string): void => {
        let t = RealtimeValues[field];
        t.isVat = truthy;
        truthy ? t.vat = calculateVAT(RealtimeValues[field].price): t.vat = 0;
        delete RealtimeValues[field];
        RealtimeValues[field] = t;
    };

    const getResult = (value: IPrice): number => +(+value.price + +value.vat).toPrecision(4);

    const calculateAndSetTotal = (): number => {
        const values = getValues();
        const listingCostRes: number = values.listingCostRes;
        const relistingAfterSaleCostRes: number = values.relistingAfterSaleCostRes;
        const countryTaxRes: number = values.countryTaxRes;
        const transactionCostRes: number = values.transactionCostRes;
        const transactionShippingCostRes: number = values.transactionShippingCostRes;
        const processingCostRes: number = values.processingCostRes;

        const total = +listingCostRes + +relistingAfterSaleCostRes + +countryTaxRes + +transactionCostRes + +transactionShippingCostRes + +processingCostRes;
        RealtimeValues['total'] = { price: total, vat: RealtimeValues.total.isVat ? calculateVAT(total): 0, isVat: RealtimeValues.total.isVat };
        const result = getResult(RealtimeValues.total);
        setValue('total', result);
        return result;
    }

	return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-xs text-left sm:text-sm text-slate-500 dark:text-slate-400">
                <thead className="uppercase bg-blue-200 text-slate-700 dark:bg-blue-700 dark:text-slate-400">
                    <tr>
                        <th scope="col" className="px-1 py-3 sm:px-6">
                            Nom du frais/taxe
                        </th>
                        <th scope="col" className="px-1 py-3 sm:px-6">
                            Prix ({currency})
                        </th>
                        <th scope="col" className="px-1 py-3 sm:px-6">
                            Résultat ({currency})
                        </th>
                        <th scope="col" className="px-1 py-3 sm:px-6">
                            <span>TVA Pays/état Vendeur</span>
                            <div className="whitespace-nowrap">
                                <input
                                    className="w-20 mx-2 border-1 invalid:border-red-500"
					    	        type="number"
					    	        min={0}
                                    max={100}
					    	        step={0.1}
                	                defaultValue={globalVat}
                	                {...register("globalVat", { required: true })}
					            />
                                <span>%</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b dark:bg-blue-800 dark:border-blue-700">
                        <th scope="row" className="px-1 py-4 font-medium sm:px-6 text-slate-900 dark:text-white">
                            Coût de fabrication de l'article
                        </th>
                        <td className="px-1 py-4 sm:px-6">
                            <input
					    	    type="number" className="w-24 sm:w-32"
					    	    min={0}
					    	    step={0.1}
                	            defaultValue={RealtimeValues.manufacturingCost.price}
                	            {...register("manufacturingCost", { required: true })}
					        />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <input
                                type="number" className="w-24 border-0 sm:w-32"
                                disabled
                                {...register("manufacturingCostRes")}
                            />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            /
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-blue-800 dark:border-blue-700">
                        <th scope="row" className="px-1 py-4 font-medium sm:px-6 text-slate-900 dark:text-white">
                            Prix de vente de l'article
                        </th>
                        <td className="px-1 py-4 sm:px-6">
                            <input
					    	    type="number" className="w-24 sm:w-32"
					    	    min={0}
					    	    step={0.1}
                	            defaultValue={RealtimeValues.initialCost.price}
                	            {...register("initialCost", { required: true })}
					        />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <input
                                className="w-24 border-0 sm:w-32"
                                type="number"
                                disabled
                                {...register("initialCostRes")}
                            />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            /
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-blue-800 dark:border-blue-700">
                        <th scope="row" className="px-1 py-4 font-medium sm:px-6 text-slate-900 dark:text-white">
                            Prix de livraison de l'article
                        </th>
                        <td className="px-1 py-4 sm:px-6">
                            <input
					    	    type="number" className="w-24 sm:w-32"
					    	    min={0}
					    	    step={0.1}
                	            defaultValue={RealtimeValues.shippingCost.price}
                	            {...register("shippingCost", { required: true })}
					        />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <input
                                className="w-24 border-0 sm:w-32"
                                type="number"
                                disabled
                                {...register("shippingCostRes")}
                            />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            /
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-blue-800 dark:border-blue-700">
                        <th scope="row" className="px-1 py-4 font-medium sm:px-6 text-slate-900 dark:text-white">
                            <p>TVA de l'acheteur (dépend du pays/état de l'acheteur) = x% de (article + livraison)</p>
                            <p>Exemple Belgique: 21%, Royaume-Uni: 20%, USA: entre 2.9% and 7.25%</p>
                        </th>
                        <td className="px-1 py-4 sm:px-6">
                            <div className="whitespace-nowrap">
                                <input
                                    className="w-24 border-1 invalid:border-red-500 sm:w-32"
					    	        type="number"
					    	        min={0}
                                    max={100}
					    	        step={0.1}
                	                defaultValue={RealtimeValues.countryTax.price}
                	                {...register("countryTax", { required: true })}
					            />
                                <span className="ml-2">%</span>
                            </div>
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <input
                                className="w-24 border-0 sm:w-32"
                                type="number"
                                disabled
                                {...register("countryTaxRes")}
                            />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            /
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-blue-800 dark:border-blue-700">
                        <th scope="row" className="px-1 py-4 font-medium sm:px-6 text-slate-900 dark:text-white">
                            Frais de mise en vente initial
                        </th>
                        <td className="px-1 py-4 sm:px-6">
                            <input
                                className="w-24 border-0 sm:w-32"
					    	    type="number"
                                disabled
					    	    min={0}
					    	    step={0.1}
                	            defaultValue={RealtimeValues.listingCost.price}
                	            {...register("listingCost", { required: true })}
					        />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <input
                                className="w-24 border-0 sm:w-32"
                                type="number"
                                disabled
                                {...register("listingCostRes")}
                            />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <ToggleVAT
                                    defaultChecked={RealtimeValues.listingCost.isVat}
                                    changed={(x) => {
                                        setVAT(x.target.checked, 'listingCost');
                                        setValue('vatTrigger', Math.random());
                                    }}
                                />
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-blue-800 dark:border-blue-700">
                        <th scope="row" className="px-1 py-4 font-medium sm:px-6 text-slate-900 dark:text-white">
                            Frais de renouvellement automatique d'article vendu
                        </th>
                        <td className="px-1 py-4 sm:px-6">
                            <input
                                className="w-24 border-0 sm:w-32"
					    	    type="number"
                                disabled
					    	    min={0}
					    	    step={0.1}
                	            defaultValue={RealtimeValues.relistingAfterSaleCost.price}
                	            {...register("relistingAfterSaleCost", { required: true })}
					        />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <input
                                className="w-24 border-0 sm:w-32"
                                type="number"
                                disabled
                                {...register("relistingAfterSaleCostRes")}
                            />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <ToggleVAT
                                    defaultChecked={RealtimeValues.relistingAfterSaleCost.isVat}
                                    changed={(x) => {
                                        setVAT(x.target.checked, 'relistingAfterSaleCost');
                                        setValue('vatTrigger', Math.random());
                                    }}
                                />
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-blue-800 dark:border-blue-700">
                        <th scope="row" className="px-1 py-4 font-medium sm:px-6 text-slate-900 dark:text-white">
                            Frais de traitement (4% du total de la commande + 30c)
                        </th>
                        <td className="px-1 py-4 sm:px-6">
                            /
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <input
                                className="w-24 border-0 sm:w-32"
                                type="number"
                                disabled
                                {...register("processingCostRes")}
                            />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <ToggleVAT
                                    defaultChecked={RealtimeValues.processingCost.isVat}
                                    changed={(x) => {
                                        setVAT(x.target.checked, 'processingCost');
                                        setValue('vatTrigger', Math.random());
                                    }}
                                />
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-blue-800 dark:border-blue-700">
                        <th scope="row" className="px-1 py-4 font-medium sm:px-6 text-slate-900 dark:text-white">
                            Frais de transaction (6.5% du total des articles)
                        </th>
                        <td className="px-1 py-4 sm:px-6">
                            /
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <input
                                className="w-24 border-0 sm:w-32"
                                type="number"
                                disabled
                                {...register("transactionCostRes")}
                            />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <ToggleVAT
                                    defaultChecked={RealtimeValues.transactionCost.isVat}
                                    changed={(x) => {
                                        setVAT(x.target.checked, 'transactionCost');
                                        setValue('vatTrigger', Math.random());
                                    }}
                                />
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-blue-800 dark:border-blue-700">
                        <th scope="row" className="px-1 py-4 font-medium sm:px-6 text-slate-900 dark:text-white">
                            Frais de transaction livraison (6.5% du total des frais de livraison)
                        </th>
                        <td className="px-1 py-4 sm:px-6">
                            /
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <input
                                className="w-24 border-0 sm:w-32"
                                type="number"
                                disabled
                                {...register("transactionShippingCostRes")}
                            />
                        </td>
                        <td className="px-1 py-4 sm:px-6">
                            <ToggleVAT
                                    defaultChecked={RealtimeValues.transactionShippingCost.isVat}
                                    changed={(x) => {
                                        setVAT(x.target.checked, 'transactionShippingCost');
                                        setValue('vatTrigger', Math.random());
                                    }}
                                />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className="font-semibold bg-blue-100 text-slate-900 dark:text-white">
                        <th scope="row" className="px-1 py-3 sm:px-6">
                            Total du prix de vente (article + livraison + TVA de l'acheteur)
                        </th>
                        <td></td>
                        <td className="px-1 py-3 sm:px-6">
                            <div className="whitespace-nowrap">
                                <span>{currency}</span>
                                <input
                                    className="w-24 bg-blue-100 border-0 sm:w-32"
                                    type="number"
                                    disabled
                                    {...register("totalOrder")}
                                />
                            </div>
                        </td>
                        <td></td>
                    </tr>
                    <tr className="font-semibold bg-blue-200 text-slate-900 dark:text-white">
                        <th scope="row" className="px-1 py-3 sm:px-6">Total des frais Etsy</th>
                        <td></td>
                        <td className="px-1 py-3 sm:px-6">
                            <div className="whitespace-nowrap">
                                <span>{currency}</span>
                                <input
                                    className="w-24 bg-blue-200 border-0 sm:w-32"
                                    type="number"
                                    disabled
                                    {...register("total")}
                                />
                            </div>
                        </td>
                        <td></td>
                    </tr>
                    <tr className="font-semibold bg-blue-100 text-slate-900 dark:text-white">
                        <th scope="row" className="px-1 py-3 sm:px-6">
                            Bénéfice (Total du prix de vente - Total des frais Etsy - Coût de fabrication de l'article)
                        </th>
                        <td></td>
                        <td className="px-1 py-3 sm:px-6">
                            <div className="whitespace-nowrap">
                                <span>{currency}</span>
                                <input
                                    className="w-24 bg-blue-100 border-0 sm:w-32"
                                    type="number"
                                    disabled
                                    {...register("profit")}
                                />
                            </div>
                        </td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            <input hidden {...register("vatTrigger")} />
        </div>
	);
};

export default Calculator;
