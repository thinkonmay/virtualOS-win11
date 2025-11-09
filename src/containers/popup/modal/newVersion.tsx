import React, { useState, ReactNode } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { appDispatch, popup_close } from '@/backend/reducers';

interface UpdateFeature {
    emoji: string;
    text: ReactNode;
}

// ============== MOCK DATA (Easy to Modify) ============== //
const updateFeatures: UpdateFeature[] = [
    {
        emoji: '✨',
        text: 'Giao diện mới toanh, nhìn là mê, xài là ghiền. Mọi thứ giờ đây gọn gàng và trực quan hơn, giúp anh em vào game nhanh hơn một nốt nhạc.'
    },
    {
        emoji: '⚡️',
        text: '"Gói Trải Nghiệm" siêu hời ra mắt! Tạm biệt "Gói 2 Tuần", giờ anh em chỉ cần chi phí bằng ly trà sữa là có thể test tẹt ga hiệu năng của Thinkmay trước khi quyết định gắn bó lâu dài.'
    },
    {
        emoji: '💡',
        text: 'Một thay đổi nhỏ về thanh toán: Để mọi thứ đơn giản hơn, tụi mình sẽ không áp dụng hoàn tiền nữa. Vì giờ đây, Gói Trải Nghiệm đã quá tuyệt để anh em có thể tự tin "chốt đơn" mà không cần lăn tăn.'
    }
];

// ============== UI COMPONENT ============== //
export const newVersion: React.FC = () => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-4xl"
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-[#0A1A1A] relative w-full max-w-lg rounded-2xl border border-[#1F3E39]  from-[#112E29]/90 to-[#0A1A1A]/90 shadow-2xl shadow-[#29D69F]/10 backdrop-blur-lg"
                style={{}}
            >
                <button
                    type="button"
                    onClick={() => appDispatch(popup_close())}
                    className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-[#A3A3A3] transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Close modal"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="max-h-[90vh] overflow-y-auto p-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white lg:text-3xl">
                            🔥 Anh em ơi, Thinkmay sắp có một bước chuyển mình CỰC LỚN! 🚀
                        </h2>

                        <p className="mt-4 text-sm leading-relaxed text-[#A3A3A3]">
                            Team Thinkmay đây! Tụi mình có một tin quan trọng và rất hào hứng muốn chia sẻ với mọi người.
                        </p>
                    </div>

                    <div className="my-6 border-t border-white/10"></div>

                    <div className="space-y-4">
                        <p className="font-semibold text-white">
                            Đây là giao diện mới, ngôn ngữ thiết kế mới, và tụi mình sẽ liên tục thử nghiệm, lắng nghe feedback của anh em để hoàn thiện nó cho đến khi thật sự ổn định trước khi chuyển nhà hoàn toàn. Anh em chính là những người đầu tiên được trải nghiệm và góp phần xây dựng nên Thinkmay của tương lai!
                        </p>
                        <p className="text-white">
                            Và điều quan trọng nhất: Đừng lo lắng nhé! Phiên bản hiện tại ở thinkmay.net mà anh em đang dùng sẽ hoạt động hoàn toàn bình thường, không có bất kỳ gián đoạn nào. Tụi mình cam kết trải nghiệm chơi game của anh em sẽ luôn ổn định.
                        </p>
                        <ul className="space-y-3">
                            {updateFeatures.map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-x-3"
                                >
                                    <span className="mt-1">
                                        {feature.emoji}
                                    </span>
                                    <p className="flex-1 text-sm text-[#A3A3A3]">
                                        {feature.text}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="my-6 border-t border-white/10"></div>

                    <div className="space-y-4 text-center">
                        <p className="text-sm text-[#A3A3A3]">
                            Logo và tinh thần "chiến" game của anh em mình vẫn ở
                            đó, chỉ là giờ đây "căn cứ" của chúng ta đã được
                            nâng cấp lên một tầm cao mới.
                        </p>

                        <a
                            href="https://official.thinkmay.net?ref=legacy20"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-x-2 rounded-xl bg-[#0e9384] px-5 py-3 font-semibold text-white shadow-lg shadow-[#29D69F]/10 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#29D69F]/50"
                        >
                            <span>Vào nhà mới chơi với tụi mình</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>

                        <p className="text-sm font-semibold text-white">
                            Anh em vào test thử rồi cho tụi mình xin 500đ
                            feedback nhé!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
