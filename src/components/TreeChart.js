import { select, tree, hierarchy, linkHorizontal } from "d3";
import { useEffect } from 'react';


// const width = document.body.clientWidth;
// const height = document.body.clientHeight;
const width = 1200;
const height = 500;
// const dx = 10;
// const dy = width / 6;

const margin = { top: 0, right: 250, bottom: 10, left: 180};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const treeLayout = tree().size([innerHeight, innerWidth]); // рабочий вариант
// const treeLayout = tree().size([dx, dy]);

const TreeChart = ({dataTree}) => {
  useEffect(() => {
    // const svg = select('.treeChart');  
    let data = dataTree[0];  

    const root = hierarchy(data);
      root.x0 = height / 2; // рабочий вариант
      // root.x0 = dy / 2;
      root.y0 = 0;
      root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
      });

    const svg = select('#treeChart')
      .attr("viewBox", [-margin.left, -margin.top, width, height])
      // .style("font", "10px sans-serif")
      .style("user-select", "none");

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    function update(source) {      
      const duration = 750;
      const nodes = root.descendants().reverse();
      const links = root.links();
      // Compute the new tree layout.
      treeLayout(root); 

      // Update the nodes…
      const node = gNode.selectAll('g.node').data(nodes, d => d.id)
      const nodeEnter = node.enter().append('g')
        .attr('class', 'node') //в коде нет этого класса (пробовать c ним и без)
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .attr('cursor', 'pointer')
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

      nodeEnter.append('circle')
        .attr('class', 'node')
        .attr("r", 6)
        .attr ("stroke", "black")
  
      nodeEnter.append('text')
        .attr('dy', '0.35em')
        .attr("x", d => d._children ? -13 : 13)
        .attr('text-anchor', d => d._children ? 'end' : 'start')
        .attr('font-size', d => d._children ? "1.3em" : "1em")
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 13)
        .attr("stroke", "white");
 
    // UPDATE
      const nodeUpdate = nodeEnter.merge(node); //рабочий вариант - переключить на него потом!!!
      // const nodeUpdate = nodeEnter.merge(nodeEnter); //работает не совсем корректно
      
      // Transition to the proper position for the node 
      nodeUpdate.transition()
        .duration(duration)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      // Update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", d => d._children ? "lightsteelblue" : "#56c2a3")
      
      // Remove any exiting nodes
      var nodeExit = node.exit().transition().remove()
        .duration(duration)
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);    

      // Update the links…
      const link = gLink.selectAll('path')
      .data(links, d => d.target.id)

      const diagonal = linkHorizontal()
        .x(d => d.y).y(d => d.x)  

      var linkEnter = link.enter().append('path')
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        })
        .attr("fill","none")
        .attr("class", "link")
        .attr ("stroke", "#56c2a3");
  
      // Transition links to their new position.
      link.merge(linkEnter).transition()
       .attr("d", diagonal)
       .duration(duration)
    
      // Transition exiting nodes to the parent's new position.
      link.exit().transition().remove()
        .duration(duration)
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }  
    update(root);
  }, [])  

    return (
      <svg id="treeChart" width={width} height={height} />
    )
}

export default TreeChart

// <svg id="treeChart" width={width} height={height} viewBox={`(${margin.left} ${-margin.top} width dx)`} />
