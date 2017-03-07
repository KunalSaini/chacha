import * as d3 from 'd3';
import _ from 'lodash';
import trace from './trace';

let nodeRep = [];
function dragstarted() {
  d3.select(this).attr('transform', d => `translate(${d.x},${d.y})`);
  d3.select(this).raise().classed('active', true);
}

function dragged(d) {
  d.x = d3.event.x; // eslint-disable-line no-param-reassign
  d.y = d3.event.y; // eslint-disable-line no-param-reassign
  d3.select(this).attr('transform', `translate(${d3.event.x},${d3.event.y})`);
  trace(nodeRep);
}

function dragended() {
  d3.select(this).classed('active', false);
}

const dragBehavior = d3.drag()
  .on('start', dragstarted)
  .on('drag', dragged)
  .on('end', dragended);

function generateNodesOn(editor, nodes) {
  nodeRep = nodes;
  const groups = editor.selectAll('g').data(nodes).enter().append('g')
  .attr('id', d => `node_${d.id}`)
  .attr('transform', d => `translate(${d.x},${d.y})`)
  .call(dragBehavior);
  nodeRep.forEach((node) => {
    const nodeContainer = d3.select(`#node_${node.id}`);
    const tex = nodeContainer.selectAll('text').data([node]).enter().append('text')
          .attr('text-anchor', 'start')
          .style('fill', 'steelblue')
          .text(() => node.name);

    const dim = tex.node().getBBox();
    nodeContainer.selectAll('rect').data([node]).enter().append('rect')
        .attr('height', dim.height)
        .attr('width', dim.width)
        .style('fill', 'none')
        .attr('stroke', 'black');

    nodeContainer.selectAll('.inputPorts').data(d3.range(1, parseInt(node.inputs, 10) + 1, 1)).enter()
    .append('rect')
      .attr('class', 'inputPorts')
      .attr('x', 5)
      .attr('y', d => (d + 1) * 10)
      .attr('width', 5)
      .attr('height', 5)
      .style('fill', 'black')
      .style('cursor', 'crosshair')
      .attr('stroke', 'black');

    node.outputPorts = // eslint-disable-line no-param-reassign
      _.range(1, parseInt(node.outputs, 10) + 1, 1)
      .map(x => ({ id: node.id, nodeX: node.x, nodeY: node.y, port: x }));

    nodeContainer.selectAll('.outputPorts').data(node.outputPorts).enter().append('circle')
      .attr('class', 'outputPorts')
      .attr('id', d => `outputPort_${d.id}_${d.port}`)
      .attr('cx', dim.width)
      .attr('cy', d => (d.port + 1) * 10)
      .attr('r', 5)
      .style('fill', 'red')
      .style('cursor', 'crosshair')
      .attr('stroke', 'red');
  });
  return groups;
}

export { generateNodesOn as default };
