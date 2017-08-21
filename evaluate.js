window.evaluate = initEvaluate();

function initEvaluate() {
	const PRECEDENCE = {
		'*': 2,
		'/': 2,
		'+': 1,
		'-': 1
	};

	const OPS = {
		'*': (a, b) => a * b,
		'/': (a, b) => a / b,
		'+': (a, b) => a + b,
		'-': (a, b) => a - b,
	};

	return evaluate;

	function evaluate(str, from = 0) {
		const strLen = str.length;
		let num1 = null;
		let op1 = null;
		let num2 = null;
		let op2 = null;
		let numBuffer = '';

		for (let i = from; i < strLen; i++) {
			const char = str[i];
			
			if (char === ' ') {
				continue;
			}

			if (char === '(') {
				const [result, to] = evaluate(str, i + 1);
				submitNumber(result);
				i = to;
			}
			else if (char === ')') {
				finishNumber();
				return [getResult(), i];
			}
			else if (OPS[char]) {
				finishNumber();
				if (op1 === null) {
					op1 = char;
				} else {
					op2 = char;
				}
			}
			else {
				numBuffer += str[i];
			}
		}
		
		finishNumber();
		return getResult();

		function finishNumber() {
			if (!numBuffer.length) {
				return;
			}
			const number = Number(numBuffer);
			numBuffer = '';
			submitNumber(number);
		}

		function submitNumber(num) {
			if (num1 === null) {
				num1 = num;
				return;
			}
			if (num2 === null) {
				num2 = num;
				return;
			}
			
			if (!op2 || !op1) {
				throw new Error(`Unexpected number (${num}), expected an operator`);
			}

			if (PRECEDENCE[op2] > PRECEDENCE[op1]) {
				num2 = OPS[op2](num2, num);
				op2 = null;
			} else {
				num1 = OPS[op1](num1, num2);
				num2 = num;
				op1 = op2;
				op2 = null;
			}
		}

		function getResult() {
			if (num2 === null || op1 === null) {
				return num1 || 0;
			}

			return OPS[op1](num1, num2);
		}
	}
}