import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../backend/reducers';

function NodeSwitch() {
    const worker = useAppSelector((state) => state.worker);
    const [nodes, setNodes] = useState([]);
    const [current, setCurrent] = useState('');

    useEffect(() => {
        const { currentAddress, data } = worker;
        const volumes = data[currentAddress]?.Volumes;
        const nodemaps = [];
        volumes?.forEach((volume) => {
            const node = volume.node;
            if (nodemaps.find((item) => item == node) == undefined)
                nodemaps.push(node);
        });

        setCurrent(currentAddress);
        setNodes(nodemaps);
    }, [worker]);

    const updateLanguage = (e) => {
        const value = e.target.value;
    };

    return (
        <div className="langSwitcher langSwitcherTile">
            <select value={current} onChange={updateLanguage} className="w-28">
                {nodes.map((node, index) => (
                    <option key={index} value={node}>
                        {node}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default NodeSwitch;
