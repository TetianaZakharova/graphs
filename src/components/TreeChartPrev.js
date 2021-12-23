import { select, tree, hierarchy, linkHorizontal } from "d3";
import { useEffect } from 'react';


// const width = document.body.clientWidth;
// const height = document.body.clientHeight;
const width = 1200;
const height = 800;

const margin = { top: 0, right: 250, bottom: 0, left: 180};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const treeLayout = tree().size([innerHeight, innerWidth]);

let i = 0;
let duration = 750;

console.log(i, duration)


const TreeChartPrev = ({networkDNA}) => {
  useEffect(() => {

    const svg = select('.treeChart');
    
    let data2 = networkDNA[0];
    var data =
  {
    "name": "Top Level",
    "children": [
      { 
        "name": "Level 2: A",
        "children": [
          { "name": "Son of A" },
          { "name": "Daughter of A" }
        ]
      },
      { "name": "Level 2: B" }
    ]
  };
    // console.log(data)
    // json('/dataTree.json')
    // .then(data => {
    //   console.log(data)
    const root = hierarchy(data, d => d.children);
      root.x0 = height / 2;
      root.y0 = 0;

    // Collapse after the second level
    root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if(d._children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
    console.log(d)
  }

  // console.log(d.target.__data__.children)
}

  function update(source) {      
      // const root = hierarchy(data);
      // console.log(root)
      const treeData = treeLayout(root);
      const nodes = treeData.descendants();

      const link = treeLayout(root).links();
      const linkPathGenerator = linkHorizontal()
        .x(d => d.y)
        .y(d => d.x);

  

    var linkEnter = svg.selectAll('path').data(link)
      .enter().append('path')
        .attr('d', linkPathGenerator)
        .attr("fill","none")
        .attr("class", "link")
        .attr ("stroke", "#56c2a3");

  //   var link2 = svg.selectAll('path.link').data(link, function(d) { return d.id; })  

  //         // UPDATE
  // var linkUpdate = linkEnter.merge(link2);

  // // Transition back to the parent element position
  // linkUpdate.transition()
  //  .duration(duration)
  //  .attr('d', linkPathGenerator);

  //  var linkExit = link2.exit().transition()
  //  .duration(duration) 
  //  .attr('d', linkPathGenerator)
  //  .remove();

  //  console.log(linkExit)

  //  nodes.forEach(function(d){
  //   d.x = d.y;
  //   d.y = d.x;
  //  });

 var node = svg.selectAll('g.node').data(nodes, function(d) {return d.id || (d.id = ++i); })
var nodeEnter = node.enter().append('g')
.attr('class', 'node')
.attr("transform", function(d) {
  return "translate(" + source.y0 + "," + source.x0 + ")";
})
// .attr("transform", (d =>  d.children ? "translate(" + (d.y + 8 ) + "," + d.x + ")" : "translate(" + (d.y - 8) + "," + d.x + ")"))
.on('click', click);

nodeEnter.append('circle')
  // .attr("transform", (d =>  d.children ? "translate(" + (d.y + 8 ) + "," + d.x + ")" : "translate(" + (d.y - 8) + "," + d.x + ")"))
  .attr('class', 'node')
  .attr("r", 6)
  .attr("fill","#56c2a3")
  .attr ("stroke", "black")
  // .attr("cursor", "pointer")

  nodeEnter.append('text')
    // .attr('x', d => d.y)
    .attr("x", d => d.children || d._children ? -13 : 13)
    // .attr('y', d => d.x)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => d.children ? 'end' : 'start')
    .attr('font-size', "1.5em")
    // .text(d => d.data.data.id);
    .text(d => d.data.name);

    // var circles = svg.selectAll('circle').data(nodes)
    //    .enter().append('circle')
    //    //   .attr("transform", (d => "translate(" + d.y + "," + d.x + ")"))
    //      .attr("transform", (d =>  d.children ? "translate(" + (d.y + 8 ) + "," + d.x + ")" : "translate(" + (d.y - 8) + "," + d.x + ")"))
    //      .attr("r", 6)
    //      .attr("fill","#56c2a3")
    //      .attr ("stroke", "black");
        

    // console.log(circles)

         
  //  var texts = svg.selectAll('text').data(nodes)
  //   .enter().append('text')
  //     .attr('x', d => d.y)
  //     .attr('y', d => d.x)
  //     .attr('dy', '0.32em')
  //     .attr('text-anchor', d => d.children ? 'end' : 'start')
  //   // .attr('text-anchor', 'end')
  //     // .attr('font-size', d => 3.25 - d.depth + 'em')
  //     .attr('font-size', "1.5em")
  //     .text(d => d.data.data.id);
  //   // console.log(texts)
 
  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
    .duration(duration)
    .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", d => d._children ? "lightsteelblue" : "#56c2a3")
    .attr('cursor', 'pointer');

  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", d => "translate(" + source.y + "," + source.x + ")")
      .remove();
      
  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
    .style('fill-opacity', 1e-6);
        
  }

  function click(d) {
    if (d.target.__data__.children) {
      d._children = d.target.__data__.children;
      d.target.__data__.children = null;
      console.log('if children')
    } else {
      d.target.__data__.children = d._children;
      d._children = null;
      console.log('else children')
    }
    // console.log(d._children)
    // console.log(d.children)
    console.log(d)
    // console.log(d.target.__data__.children)
    update(d);
  }

  
  
    // })      
  }, [])  

    return (
      <svg id="treeChart" width={width} height={height} viewBox="0 0 width height">
        <g className="treeChart" transform={`translate(${margin.left}, ${margin.top})`}/>    
      </svg>
      
    )
}

export default TreeChartPrev


