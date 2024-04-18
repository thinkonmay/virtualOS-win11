
import './index.scss';


export function RightFuncButton(props) {
	const { Touch, name, className, size, ...rest } = props;

	const buttonSize = {
		width: size,
		height: size
	}
	return (
		<div
			className={`rightFuncBtn ${className}`}
			{...rest}
		>
			<div

				className='defaultButton'
				style={{ ...buttonSize }}
				onTouchStart={(e) => Touch(7, 'down')}
				onTouchEnd={(e) => Touch(7, 'up')}
			>RT</div>
			<div

				className='defaultButton'
				style={{ ...buttonSize }}
				onTouchStart={(e) => Touch(5, 'down')}
				onTouchEnd={(e) => Touch(5, 'up')}
			>RB</div>
		</div>
	);
}

export function LeftFuncButton(props) {
	const { Touch, size = 50, className } = props;
	const buttonSize = {
		width: size,
		height: size
	}
	return (
		<div
			className={`leftFuncBtn ${className}`}
		>
			<div
				className='defaultButton'
				style={{ ...buttonSize }}
				onTouchStart={(e) => Touch(6, 'down')}
				onTouchEnd={(e) => Touch(6, 'up')}
			>LT</div>
			<div
				className='defaultButton'
				style={{ ...buttonSize }}
				onTouchStart={(e) => Touch(4, 'down')}
				onTouchEnd={(e) => Touch(4, 'up')}
			>LB</div>
		</div>
	);
}
