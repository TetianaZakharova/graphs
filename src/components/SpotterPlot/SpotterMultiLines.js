import {scaleTime, extent, scaleLinear, select, timeParse, line, scaleOrdinal} from "d3";
import { axisLeft, axisBottom } from "d3-axis";
import { useEffect } from "react";

import './SpotterMultiLines.css';

const width = 960;
const height = 500;
const margin = { top:20, right: 30, bottom: 65, left: 100 }

const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;

const allGroup = ["Download", "Upload"]

export const SpotterMultiLines = ({dataUsageMultiLines: data, colors}) => {


const graphColors = scaleOrdinal()
.domain(allGroup)
.range(colors);

  const dataReady = allGroup.map((grpName) => {
    return {
      name: grpName,
      values: data.map((d) => {
        return {
          time: timeParse("%Y-%m-%d")(d.date),
          value: +d[grpName]
        }
      })
    }
  }); 
// console.log(dataReady)

  const allValuesArrs = dataReady.map( d => d.values.map(val => +val.value))
  // console.log(allValuesArrs)
  const concatAllValues = allValuesArrs[0].concat(allValuesArrs[1])
  // console.log(concatAllValues)
  const maxOfAllValues = Math.max(...concatAllValues)
  // console.log(maxOfAllValues)

  const xValue = d => timeParse("%Y-%m-%d")(d.date);
  const yValue = (maxOfAllValues * 1.1)
 
  const xScale = scaleTime()
  .domain(extent(data, xValue))
  .range([ 0, innerWidth ]);
  
  const yScale = scaleLinear()
   .domain([0, yValue])
   .range([ innerHeight, 0 ]);
  
  const lineChart = line()
    .x(d => xScale(+d.time))
    .y(d => yScale(+d.value))
  
  useEffect(()=> {
    select(".spotterChart").selectAll("g").remove()
    select(".spotterChart").selectAll("path").remove()
    select(".spotterChart").selectAll("text").remove()

    const xAxis = axisBottom(xScale);
      select(".spotterChart")
      .append("g")
      .attr("transform", "translate(0," + innerHeight + ")")
      .call(xAxis)

    const yAxis = axisLeft(yScale);
      select(".spotterChart")
      .append("g") 
      .attr("class", "yAxis")
      .call(yAxis) 

      select(".spotterChart")
        .selectAll("myLines")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", d => graphColors(d.name))
        .attr("stroke-width", 4)
        .attr("d", d => lineChart(d.values))

      select(".spotterChart")
        .selectAll("myDots")
        .data(dataReady)
        .enter()
        .append("g")
        .style("fill", d => graphColors(d.name))
        .selectAll("myPoints")
        .data(d => d.values)
        .enter()
        .append("circle")
          .attr("cx", (d=>xScale(d.time)) )
          .attr("cy", (d=>yScale(d.value)) )
          .attr("r", 5)
          .attr("stroke", "white")
          
      select(".spotterChart")
        .selectAll("myLabels")
        .data(dataReady)
        .enter()
          .append('g')
          .append("text")
            .datum(d => {
              return {name: d.name, value: d.values};
            })
            .text(d => d.name)
            .attr("x", (d, i) => (12 + i*115))
            .style("fill", d => graphColors(d.name))
            .style("font-size", 20)   
            .style("display", "block")   

        select(".spotterChart")
          .append("text")
          .attr("class", "spotterLabel")
          .text("Day")
          .attr("transform", "translate(0," + innerHeight + ")")
          .attr("x", innerWidth / 2)
          .attr("y", 50) 
          .attr("class", "spotterLabel")
        
        select(".spotterChart")
          .append("text")
          .attr("class", "spotterLabel yLabel")
          .text("MB")
          .attr("transform", "translate(-50," + innerHeight/2 + "), rotate(-90)")
       },[data])

  return (
      <svg width={width} height={height}>
        <g className="spotterChart" transform={`translate(${margin.left},${margin.top})`} />
      </svg>
    );
  }
