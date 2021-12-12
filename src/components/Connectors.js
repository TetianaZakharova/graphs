import React from 'react'
import { DonutChart } from './DonutChart'

export const Connectors = ({connectors: data, colors}) => {

    return (
        <DonutChart data={data} colors={colors} />
    )
}
