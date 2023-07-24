import { useEffect, useRef, useState } from 'react';

const Calculator = () => {

	let total = useRef(0);

	const initialValues = {
		initialCost: 0,
		shippingCost: 0,
		listingCost: 0.2,
		relestingAfterSaleCost: 0.2,
		processingCost: 0.3
	};

	const [state, setState] = useState(initialValues);
	
	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		const floatValue = !isNaN(parseFloat(value)) ? parseFloat(value): 0;
		const newState = {
			...state,
			[name]: floatValue,
		};
		newState.processingCost = (0.04 * state.initialCost) + 0.3;
		setState(newState);
	};

	useEffect(() => {
		total.current = +(state.initialCost + state.shippingCost + state.listingCost + state.relestingAfterSaleCost + state.processingCost).toPrecision(4);
	}, [state]);
	
	return (
		<form>
			<div>
				<span className="mr-2">Fabrication</span>
				<input
					name='initialCost'
					type='number'
					min={0}
					step={0.01}
					required
					className='invalid:border border-red-500'
					defaultValue={state.initialCost}
					onChange={handleInputChange}
				></input>
			</div>
			<div>
				<span className="mr-2">Livraison</span>
				<input
					name='shippingCost'
					type='number'
					min={0}
					step={0.01}
					required
					className='invalid:border border-red-500'
					defaultValue={state.shippingCost}
					onChange={handleInputChange}
				></input>
			</div>
			<div>
				<span className="mr-2">Mise en vente</span>
				<input
					name='listingCost'
					type='number'
					min={0}
					step={0.01}
					disabled
					defaultValue={state.listingCost}
				></input>
			</div>
			<div>
				<span className='mr-2'>Remise en vente après vente</span>
				<input
					name='relestingAfterSaleCost'
					type='number'
					min={0}
					step={0.01}
					disabled
					defaultValue={state.relestingAfterSaleCost}
				></input>
			</div>
			<div>
				<span className='mr-2'>Frais de traitement (4% + total de la commande + 30c)</span>
				<input
					name='processingCost'
					type='number'
					min={0}
					step={0.01}
					disabled
					value={state.processingCost}
				></input>
			</div>
			<div>
				<span className='mr-2'>Total</span>
				<input
					name='total'
					type='number'
					min={0}
					disabled
					value={total.current}
				></input>
			</div>
		</form>
	);
};

export default Calculator;
