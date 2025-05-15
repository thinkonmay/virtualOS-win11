import { useEffect, useState } from 'react';
import {
    appDispatch,
    change_node,
    useAppSelector
} from '../../../../backend/reducers';
import { ChangeNode } from '../../../../../src-tauri/api';

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

    const updateNode = (e) => appDispatch(change_node(e.target.value));

    return (
        <div className="langSwitcher langSwitcherTile">
            <select value={current} onChange={updateNode} className="w-28">
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
