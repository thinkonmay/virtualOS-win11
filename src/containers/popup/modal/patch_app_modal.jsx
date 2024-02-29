import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    patch_app,
    popup_close
} from '../../../backend/reducers';

export function patch_app_modal(props) {
    const { data } = props;

    return (
        <div className="subscription w-[320px] bg-slate-500">
            <PatchApp></PatchApp>
        </div>
    );
}

const initPatch = {
    app_id: 0,
    desc: ''
};
const PatchApp = () => {
    const [formData, setFormData] = useState(initPatch);
    const [err, setErr] = useState();
    const dispatch = useDispatch();

    const handleChange = (event) => {
        setErr(false);

        setFormData({
            ...formData,
            [event.target.name]:
                event.target.type === 'checkbox'
                    ? event.target.checked
                    : event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        if (formData.app_id == '' || formData.desc == '') {
            setErr(true);
        }

        const formatData = {
            app_id: formData.app_id,
            desc: formData.desc,

        };

        await dispatch(patch_app(formatData));
        setFormData(initAddSub);
        dispatch(popup_close());
    };

    return (
        <div className=" updateSub p-6">
            <h4 className="mb-8 text-center text-[20px]">Patch App</h4>
            {err ? (
                <h4 className="mb-8 text-center text-[20px] text-red-400">
                    MISS DATA
                </h4>
            ) : null}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="flex gap-4">
                    <span>APP ID</span>
                    <input
                        id="app_id"
                        type="text"
                        name="app_id"
                        value={formData.app_id}
                        onChange={handleChange}
                    />
                </label>
                <label className="flex gap-4 items-start">
                    <span>DESC</span>
                    <textarea
                        id="desc"
                        type="text"
                        name="desc"
                        value={formData.desc}
                        onChange={handleChange}
                        className='w-full min-h-[120px]'

                    />
                </label>

                <div className='flex gap-4 items-center'>
                    <button className="instbtn w-2/3 " type="submit">
                        Patch
                    </button>
                    <button onClick={() => {
                        dispatch(popup_close());

                    }} className="w-1/3 rounded-sm" type="button">
                        Close
                    </button>

                </div>
            </form>
        </div>
    );
};
