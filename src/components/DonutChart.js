import React from 'react'
import { arc, pie } from "d3";

const width = 960;
const height = 500;
const centerX = width / 2;
const centerY = height / 2;
const radius = width / 4

const pieArc = arc()
  .innerRadius(radius / 2)
  .outerRadius(radius)

const outerArc = arc()
  .innerRadius(radius * 1.1)
  .outerRadius(radius * 1.1)

const colorPie = pie()
  .value(d => d.value)
  .sort(null);

export const DonutChart = ({data, colors}) => {

  const polylines = (d) => {
    let posA = pieArc.centroid(d);
    let posB = outerArc.centroid(d);
    let posC = outerArc.centroid(d);
    let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
    
    return [posA, posB, posC]
  }

  const textTransform = (d) => {
    let pos = outerArc.centroid(d);
    let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
    return 'translate(' + pos + ')';
  }

  const textStyle = (d) => {
    let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
    return (midangle < Math.PI ? 'start' : 'end')
  }

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${centerX},${centerY})`}>
          {
            colorPie(data).map(d => (
              <g key={d.index}>
            <path
              fill={colors[d.index] }
              d={pieArc(d)}
            />
            <text
              transform ={textTransform(d)}
              style={{textAnchor: textStyle(d), alignmentBaseline: "middle", fill: "black", fontSize:"18" }}
            >
              {`${d.data.name}: ${d.data.value}`}
            </text>
            <polyline className="test"
              points={polylines(d)}
              style={{fill: "none", stroke: "black", strokeWidth: "1"}} />
            </g>
            ))
          }        
        </g>
      </svg>
    )
}
