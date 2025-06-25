import { useEffect, useState } from 'react';
import { isMobile } from '../../../../src-tauri/core';
import {
    app_external,
    appDispatch,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';


export function versionUpdate() {
    const close = () => appDispatch(popup_close());
    const banners = useAppSelector((state) => state.globals.banner)
    const [currentPage, setCurrentPage] = useState(0);

    const renderStyledContent = (contentStyle) => {
        // Handle string content
        if (typeof contentStyle === 'string') {
            return <span>{contentStyle}</span>;
        }
        
        // Handle array of ContentPart
        if (Array.isArray(contentStyle)) {
            return (
                <>
                    {contentStyle.map((part, index) => {
                        const getStyleClasses = () => {
                            switch (part.type) {
                                case 'bold':
                                    return 'text-blue-400 font-bold';
                                case 'italic':
                                    return 'italic';
                                case 'underscore':
                                    return 'underline';
                                case 'none':
                                default:
                                    return '';
                            }
                        };
    
                        return (
                            <span key={index} className={getStyleClasses()}>
                                {part.content}
                            </span>
                        );
                    })}
                </>
            );
        }
        
        return null;
    };


    if (!banners || banners.length === 0) {
        return null;
    }
    
    const totalPages = banners.length;
    const currentBanner = banners[currentPage];

  
    useEffect(() => {
        if (totalPages <= 1) return;

        const timer = setInterval(() => {
            setCurrentPage(prev => (prev + 1) % totalPages);
        }, 5000);

        return () => clearInterval(timer);
    }, [totalPages]);
    const goToPage = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

 
    return (
        <div
            id="banner-popup"
            tabIndex="-1"
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0 max-h-full"
        >
            <div className="relative max-w-4xl w-full mx-4">
                <div className="relative rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
                    <span className="mb-4 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 dark:bg-green-200 dark:text-green-900">
                        <svg
                            className="-ml-1 mr-1 h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        Thông báo mới {totalPages > 1 && `(${currentPage + 1}/${totalPages})`}
                    </span>

                    {/* Current Banner */}
                    <div className="mb-6">
                        {/* Banner Image */}
                        {!isMobile() && currentBanner.image && (
                            <img
                                src={currentBanner.image}
                                className="mb-4 max-h-[500px] w-full rounded bg-cover object-cover hidden md:block"
                                alt={`banner ${currentPage + 1}`}
                            />
                        )}

                        {/* Banner Content */}
                        <div className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                            {(Array.isArray(currentBanner.text1) && currentBanner.text1.length > 0) || (typeof currentBanner.text1 === 'string' && currentBanner.text1) ? (
                                <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                    {renderStyledContent(currentBanner.text1)}
                                </h3>
                            ) : null}
                            
                            {(Array.isArray(currentBanner.text2) && currentBanner.text2.length > 0) || (typeof currentBanner.text2 === 'string' && currentBanner.text2) ? (
                                <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                    {renderStyledContent(currentBanner.text2)}
                                </h3>
                            ) : null}
                            
                            {(Array.isArray(currentBanner.text3) && currentBanner.text3.length > 0) || (typeof currentBanner.text3 === 'string' && currentBanner.text3) ? (
                                <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                    {renderStyledContent(currentBanner.text3)}
                                </h3>
                            ) : null}

                            {(Array.isArray(currentBanner.detail) && currentBanner.detail.length > 0) || (typeof currentBanner.detail === 'string' && currentBanner.detail) ? (
                                <p className="text-sm mt-3">
                                    {renderStyledContent(currentBanner.detail)}
                                </p>
                            ) : null}
                        </div>

                        {/* Action Button for current banner */}
                        {currentBanner.redirect_link && ((Array.isArray(currentBanner.redirect_text) && currentBanner.redirect_text.length > 0) || (typeof currentBanner.redirect_text === 'string' && currentBanner.redirect_text)) && (
                            <div className="mb-4 flex">
                                <button
                                    onClick={() =>
                                        appDispatch(
                                            app_external(currentBanner.redirect_link)
                                        )
                                    }
                                    type="button"
                                    className="py-2.5 px-5 bg-blue-600 shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit block mx-auto hover:bg-white-200"
                                >
                                    {currentBanner.redirect_text[0].content}
                                </button>
                                 {/* Close Button */}
                        <button
                            onClick={close}
                            type="button"
                            className="py-2.5 px-5 bg-gray-300 shadow-sm rounded-full transition-all duration-500 text-base text-black font-semibold text-center w-fit block mx-auto hover:bg-gray-400"
                        >
                            Đóng
                        </button>
                            </div>
                        )}
                        
                    </div>

                    {/* Page Navigation */}
                    {totalPages > 1 && (
                        <div className="flex flex-col items-center space-y-4 mb-6">
                            {/* Page Dots */}
                            <div className="flex space-x-2">
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToPage(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            index === currentPage
                                                ? 'bg-blue-600'
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Auto-advance Progress Bar */}
                            <div className="w-48 bg-gray-200 rounded-full h-1.5">
                                <div 
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                                    style={{
                                        width: '100%',
                                        animation: 'progress 5s linear infinite'
                                    }}
                                />
                            </div>
                            <style>{`
                                @keyframes progress {
                                    0% { width: 0%; }
                                    100% { width: 100%; }
                                }
                            `}</style>
                        </div>
                    )}

                   
                </div>
            </div>
        </div>
    );

}