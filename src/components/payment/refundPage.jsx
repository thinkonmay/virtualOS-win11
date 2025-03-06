export const RefundPage = () => {
    return (
        <div className="refundPage">
            <div className="title">
                <h2 className="title">Chính sách hoàn 80% tiền</h2>
                <p className="m d:max-w-[80% text-xs lg:max-w-[60%] lg:text-base">
                    Do tính chất đặc thù của dịch vụ CloudPC là có độ trễ về
                    đường truyền và mong muốn mọi người có trải nghiệm tốt nhất
                    khi sử dụng, Thinkmay khuyến khích bạn liên hệ qua Fanpage
                    để được hỗ trợ xử lý hoặc hoàn tiền nếu sau khi sử dụng, bạn
                    cảm thấy không hài lòng vì bất kỳ lý do nào.
                </p>
            </div>

            <div className="pl-2 lg:pl-20">
                <h3>Điều kiện áp dụng</h3>

                <div className="flex gap-16 mb-5">
                    <div>
                        <h4>Với gói tháng:</h4>
                        <ul>
                            <li>Thời gian: 5 ngày kể từ khi được cấp máy.</li>
                            <li>Số giờ sử dụng: không quá 12h.</li>
                        </ul>
                    </div>

                    <div>
                        <h4>Với gói tuần:</h4>
                        <ul>
                            <li>Thời gian: 2 ngày kể từ khi được cấp máy.</li>
                            <li>Số giờ sử dụng: không quá 3h.</li>
                        </ul>
                    </div>
                </div>

                <h3 className="mt-8">Quy trình yêu cầu hoàn tiền:</h3>
                <ul className="list-decimal">
                    <li> Liên hệ qua Fanpage chính thức của Thinkmay.</li>
                    <li>
                        {' '}
                        Cung cấp thông tin tài khoản, lý do yêu cầu hoàn tiền
                    </li>
                    <li> Yêu cầu sẽ được xử lý trong vòng 1 ngày làm việc.</li>
                </ul>

                <h3 className="mt-8">Lưu ý:</h3>
                <ul className="list-decimal">
                    <li>
                        Chính sách không áp dụng cho các trường hợp vi phạm điều
                        khoản sử dụng dịch vụ hoặc cố ý gây lỗi.
                    </li>
                    <li>
                        Hãy trải nghiệm dịch vụ miễn phí trước khi đưa ra quyết
                        định mua!
                    </li>
                </ul>
            </div>
        </div>
    );
};
