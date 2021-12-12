import React from 'react'
import { DonutChart } from './DonutChart'

export const Users = ({users: data, colors}) => {

    return (
        <DonutChart data={data} colors={colors} />
    )
}
