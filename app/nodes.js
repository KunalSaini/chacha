import * as d3 from 'd3';
import _ from 'lodash';
import trace from './trace';

let nodeRep = [];
function dragstarted() {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).attr('transform', d => `translate(${d.x},${d.y})`);
  d3.select(this).raise().classed('active', true);
}

function getNodeIdFromGroup(g) {
  return g.attr('id').split('_')[1];
}

function updateLines(g) {
  d3.selectAll('line').each((lineData) => {
    if (lineData) {
      const svg = d3.select('svg').node();
      let pt = svg.createSVGPoint();
      const line = d3.select(`#line_${lineData.startNode.id}_${lineData.startNode.port}_${lineData.endNode.id}_${lineData.endNode.port}`);
      if (lineData.startNode.id === getNodeIdFromGroup(g)) {
        const outport = g.select(`#outputPort_${lineData.startNode.id}_${lineData.startNode.port}`);
        pt.x = parseInt(outport.attr('cx'), 10);
        pt.y = parseInt(outport.attr('cy'), 10);
        pt = pt.matrixTransform(g.node().getCTM());
        line.attr('x1', pt.x).attr('y1', pt.y);
      } else if (lineData.endNode.id === getNodeIdFromGroup(g)) {
        const inport = g.select(`#inputPort_${lineData.endNode.id}_${lineData.endNode.port}`);
        pt.x = parseInt(inport.attr('x'), 10);
        pt.y = parseInt(inport.attr('y'), 10);
        pt = pt.matrixTransform(g.node().getCTM());
        line.attr('x2', pt.x).attr('y2', pt.y);
      }
    }
  });
}

function dragged(d) {
  const g = d3.select(this);
  d.x = d3.event.x; // eslint-disable-line no-param-reassign
  d.y = d3.event.y; // eslint-disable-line no-param-reassign
  g.attr('transform', `translate(${d3.event.x},${d3.event.y})`);
  trace(nodeRep);
  updateLines(g);
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

    node.inputPorts = // eslint-disable-line no-param-reassign
          _.range(1, parseInt(node.inputs, 10) + 1, 1)
          .map(x => ({ id: node.id, port: x }));

    nodeContainer.selectAll('.inputPorts').data(node.inputPorts).enter()
    .append('rect')
      .attr('class', 'inputPorts')
      .attr('id', d => `inputPort_${d.id}_${d.port}`)
      .attr('x', 5)
      .attr('y', d => (d.port + 1) * 10)
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
