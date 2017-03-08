import * as d3 from 'd3';
import _ from 'lodash';
import appEvents from './appEvents';
import trace from './trace';
import nodeStyle from './styles/nodes.css';  // eslint-disable-line no-unused-vars

let nodeRep = [];
function dragstarted() {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).attr('transform', d => `translate(${d.x},${d.y})`);
  d3.select(this).raise().classed('active', true);
}

function getNodeIdFromGroup(g) {
  return g.attr('id').split('_')[1];
}

function dragged(d) {
  const g = d3.select(this);
  d.x = d3.event.x; // eslint-disable-line no-param-reassign
  d.y = d3.event.y; // eslint-disable-line no-param-reassign
  g.attr('transform', `translate(${d3.event.x},${d3.event.y})`);
  trace(nodeRep);
  appEvents.emit(appEvents.nodeMoved, getNodeIdFromGroup(g), g.node().getCTM());
  // updateLines(g);
}

function dragended() {
  d3.select(this).classed('active', false);
}

const dragBehavior = d3.drag()
  .on('start', dragstarted)
  .on('drag', dragged)
  .on('end', dragended);

function getLength(name) {
  return name.length * 8;
}

function generateNodesOn(editor, nodes) {
  nodeRep = nodes;
  _.map(nodeRep, (node) => {
    node.inputPorts = // eslint-disable-line no-param-reassign
    _.range(1, parseInt(node.inputs, 10) + 1, 1)
          .map(x => ({ id: node.id, name: node.name, port: x }));

    node.outputPorts = // eslint-disable-line no-param-reassign
    _.range(1, parseInt(node.outputs, 10) + 1, 1)
          .map(x => ({ id: node.id, name: node.name, port: x }));
  });
  const groupSelection = editor.selectAll('g').data(nodes, d => d.id).enter();
  const groups = groupSelection.append('g')
  .attr('id', d => `node_${d.id}`)
  .attr('transform', d => `translate(${d.x},${d.y})`)
  .call(dragBehavior);

  groups.append('text')
  .attr('text-anchor', 'start')
  .attr('class', 'nodeText')
  .text(d => d.name);

  groups.append('rect')
  .attr('class', 'node')
  .attr('width', d => getLength(d.name));

  groups.selectAll('rect.inputPorts').data(d => d.inputPorts).enter().append('rect')
  .attr('class', 'inputPorts')
  .attr('id', d => `inputPort_${d.id}_${d.port}`)
  .attr('x', 5)
  .attr('y', d => (d.port + 1) * 10);

  groups.selectAll('circle.outputPorts').data(d => d.inputPorts).enter().append('circle')
  .attr('class', 'outputPorts')
  .attr('id', d => `outputPort_${d.id}_${d.port}`)
  .attr('cx', d => getLength(d.name))
  .attr('cy', d => (d.port + 1) * 10)
  .attr('r', 5);

  editor.selectAll('g').data(nodes, d => d.id).exit().remove();
  return groups;
}

appEvents.on(appEvents.nodesConnected, (startNode, endNode) => {
  const node = _.find(nodeRep, { id: startNode.id });
  const wirePort = node.wires[startNode.port - 1];
  if (wirePort) {
    wirePort.push({ node: endNode.id, port: endNode.port });
  } else {
    node.wires[startNode.port - 1] = [{ node: endNode.id, port: endNode.port }];
  }
  trace(nodeRep);
});

export { generateNodesOn as default };
