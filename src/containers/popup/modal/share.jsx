import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { appDispatch, popup_close } from '../../../backend/reducers';

export function share() {
    const close = () => appDispatch(popup_close(true));

    return (
        <Modal
            show={true}
            onClose={close}
            style={{
                backdropFilter: 'blur(3px) brightness(0.5)',
                padding: '0px'
            }}
        >
            <div className="bg-gray-600">
                <ModalHeader>Share Thinkmay to your friends</ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            Share this code to your friends
                        </p>
                    </div>
                    <div className="space-y-6 mt-10">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            How do you rate your experience at thinkmay
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter className="justify-between">
                    <div class="flex items-center">
                        <Button className="text-black" onClick={close}>
                            Copy coupon code: {`abc`}
                        </Button>
                        <RatingSection />
                    </div>
                    <Button className="relative bg-gray-700" onClick={close}>
                        Decline
                    </Button>
                </ModalFooter>
            </div>
        </Modal>
    );
}

const RatingSection = () => {
    const elements = [];
    for (let index = 1; index <= 6; index++) elements.push(index);
    const [rating, setRating] = useState(0);
    const [consider, setConsider] = useState(0);

    useEffect(() => {
        console.log(rating);
    }, [rating]);

    return (
        <div class="flex items-center" onMouseLeave={() => setConsider(0)}>
            {elements.map((val) => (
                <svg
                    key={val}
                    class={`w-6 h-6 ms-1 cursor-pointer ${
                        rating >= val
                            ? 'text-yellow-300'
                            : consider >= val
                              ? 'text-yellow-100'
                              : 'text-gray-300'
                    }`}
                    onMouseEnter={() => setConsider(val)}
                    onClick={() => setRating(val)}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
            ))}
        </div>
    );
};
