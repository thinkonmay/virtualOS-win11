import React from 'react';
import './index.scss';

import { useAppSelector } from '../../backend/reducers';
import { isGreenList } from '../../backend/utils/checking';

function AvailableCluster({ isBootScreen }) {
    const availableCluster = useAppSelector(
        (state) => state.globals.hasAvailableCluster
    );

    return (
        <>
            {!isBootScreen && isGreenList() ? (
                <div className="clusterInfo">
                    {availableCluster ? (
                        <>
                            <div className="pointer green"></div>
                            <span className="text-[16px]">Còn máy</span>
                        </>
                    ) : (
                        <>
                            <div className="pointer orange"></div>
                            <span className="text-[16px]">Đang hết máy</span>
                        </>
                    )}
                </div>
            ) : null}
        </>
    );
}

export default AvailableCluster;
