import React from 'react'
import { Users } from './Users'
import { users, connectors, colors, dataUsageMultiLines, topApps, dataTree } from './data.json'
import { Connectors } from './Connectors'
import { SpotterMultiLines } from './SpotterPlot/SpotterMultiLines'
import { BubbleChart } from './BubbleChart'
import TreeChart from './TreeChart'


export const HomePage = () => {

  return (
    <div>
      <Users users={users} colors={colors}/> 
      <Connectors connectors={connectors} colors={colors}/>     
      <SpotterMultiLines dataUsageMultiLines={dataUsageMultiLines} colors={colors} />
      <BubbleChart topApps={topApps} /> 
      <TreeChart dataTree={dataTree}/>      
    </div>
  )
}

