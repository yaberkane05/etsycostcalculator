import { useState } from 'react';

const Calculator = () => {

	const initialValues = {
		initialPrice: 0,
		fee1: 0,
		fee2: 0,
		total: 0
	};

	const [state, setState] = useState(initialValues);
	
	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		const floatValue = !isNaN(parseFloat(value)) ? parseFloat(value): 0;
		const newState = {
			...state,
			[name]: floatValue,
		};
		setState(newState);
	};
	
	return (
		<form>
			<p>prix de fabrication</p>
			<input name='initialPrice' onChange={handleInputChange} type="number" min={0} step={0.01} defaultValue={state.initialPrice}></input>
			<p>frais 1</p>
			<input name='fee1' onChange={handleInputChange} type="number" min={0} step={0.01} defaultValue={state.fee1}></input>
			<p>frais 2</p>
			<input name='fee2' onChange={handleInputChange} type="number" min={0} step={0.01} defaultValue={state.fee2}></input>
			<p>total</p>
			<input name='total' type="number" min={0} value={(state.initialPrice + state.fee1 + state.fee2).toPrecision(2)} disabled></input>
		</form>
	);
};

export default Calculator;
