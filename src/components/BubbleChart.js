import React from 'react'
import { selectAll, scaleOrdinal, scaleSqrt, schemeSet1, select, forceSimulation, forceCenter, forceCollide } from "d3"
import { useEffect } from 'react';

const width = 960;
const height = 800;
const centerX = width / 2;
const centerY = height / 2;

export const BubbleChart = ({ topApps: data }) => {
// console.log(data)

  const simulation = forceSimulation()
   .force("center", forceCenter().x(centerX).y(centerY))
   .force("collide", 
      forceCollide()
      .strength(.1)
      .radius((d) => (radiusScale(d.value)+1.5))//outter r
      .iterations(1)) // Force that avoids circle overlapping
  
  const valuesArr = data.map(d=>(d.value))
  const maxValue = Math.max(...valuesArr)
  const minValue = Math.min(...valuesArr) 

  const bubbleColors = scaleOrdinal()
    .domain([0, 140000])
    .range(schemeSet1)

  const radiusScale = scaleSqrt()
    .domain([minValue, maxValue])
    .range  ([60, 120]) //circles d from... to...

  useEffect(() => {
    select(".bubbleChart").selectAll("g").remove()
  
    const node = select(".bubbleChart")
      .selectAll("bubbleItem")
      .data(data)
      .enter().append("g")
      .attr("class","bubbleGroup")
      // .style("width", d=>radiusScale(d.value)*2)
      .style("overflow", "hidden")
      .append("circle")
        .attr("class", "bubbleItem")
        .attr("id", d => d.name)//for Clip-Path
        .attr("r", d=>radiusScale(d.value))
        .attr("fill", d => bubbleColors(d.name)) 
        
    const defs = selectAll(".bubbleGroup")
    defs.append("clipPath")
     .data(data)
      .attr("id", (d => "clip-" +d.name))
      .append("use")
      .attr("xlink:href", (d => "#" + d.name))

    const label = selectAll(".bubbleGroup")
      label.append("text")
      .data(data)
      .attr("class","bubbleText")
      .text(d => (`${d.name} : ${d.value}`))
      // .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'start')
      .style('font-size', '14px')
      .attr("clip-path", (d => "url(#clip-" + d.name +")")) //for Clip-Path
      
      // .append("tspan")
      //   .attr("class","textspan")
      //   .text(d => d.value)
      //   .attr("dy", 24)

    const ticked = (d) => {
      node
        .attr("cx", d=> d.x)
        .attr("cy", d=> d.y) 

      selectAll(".bubbleText")  
        .attr("dx", d => d.x)
        .attr("dy", d => d.y)

      // selectAll(".textspan")
      //   .attr("dx", d => d.x /-10)
    }

    simulation
      .nodes(data) 
      .on("tick", ticked)  

  },[data])


  return (
    <svg id="bubbleChart" width={width} height={height}>
      <g className="bubbleChart" />    
    </svg>
  )
}
