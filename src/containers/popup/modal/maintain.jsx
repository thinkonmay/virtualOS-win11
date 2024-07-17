import { MdInfoOutline } from "react-icons/md";

export function maintain({ data: { content } }) {
	return (
		<div className="w-[348px] h-auto p-[24px] rounded-lg">
			<div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
				<MdInfoOutline className="text-3xl"></MdInfoOutline>
				{/*<h3 className="text-xl">Dịch vụ sắp hết hạn</h3>*/}
				<h3 className="text-xl">THÔNG TIN BẢO TRÌ</h3>
			</div>

			<div className="flex flex-col items-start gap-2 mt-4 text-[1.125rem]">
				<p>Từ: <b>5h 18/7</b></p>
				<p>Kết thúc dự kiến: <b>9h 18/7</b></p>
			</div>
		</div>
	);
}

