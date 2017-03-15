import * as d3 from 'd3';
import _ from 'lodash';
import appEvents from './appEvents';
import './styles/links.css';

const scaleX = 2;
const scaleY = 1.25;
const nodeWidth = 100;
const nodeHeight = 50;

function getLineCoordinates(x1, y1, x2, y2) {
  if (x1 === x2 && y1 === y2) {
    return `M ${x1} ${y1}`;
  }
  const c1 = parseInt(x1 || 0, 10) + (scaleX * nodeWidth);
  const c2 = parseInt(y1 || 0, 10) + (scaleY * nodeHeight);
  const c3 = parseInt(x2 || 0, 10) - (scaleX * nodeWidth);
  const c4 = parseInt(y2 || 0, 10) - (scaleY * nodeHeight);
  return `M ${x1} ${y1} C ${c1} ${c2} ${c3} ${c4} ${x2} ${y2}`;
}

function drawWire(startNode1, endNode) {
  const svg = d3.select('svg').node();
  let startPoint = svg.createSVGPoint();
  let endPoint = svg.createSVGPoint();
  const outport = d3.select(`#outputPort_${startNode1.id}_${startNode1.port}`);
  const inport = d3.select(`#inputPort_${endNode.id}_${endNode.port}`);
  startPoint.x = outport.attr('cx');
  startPoint.y = outport.attr('cy');
  endPoint.x = inport.attr('x');
  endPoint.y = inport.attr('y');
  const targetCTM = d3.select(`#node_${endNode.id}`).node().getCTM();
  endPoint = endPoint.matrixTransform(targetCTM);
  const sourceCTM = d3.select(`#node_${startNode1.id}`).node().getCTM();
  startPoint = startPoint.matrixTransform(sourceCTM);
  const line = d3.select(`#line_${startNode1.id}_${startNode1.port}_${endNode.id}_${endNode.port}`);
  if (line.empty()) {
    d3.select('svg')
        .append('path')
        .datum({
          endNode,
          startNode: startNode1,
        })
        .attr('id', `line_${startNode1.id}_${startNode1.port}_${endNode.id}_${endNode.port}`)
        .attr('class', 'line')
        .attr('d', () => getLineCoordinates(startPoint.x, startPoint.y, endPoint.x, endPoint.y));
  } else {
    line.attr('d', () => getLineCoordinates(startPoint.x, startPoint.y, endPoint.x, endPoint.y));
  }
}

function updateLines(nodeId) {
  d3.selectAll('path').each((lineData) => {
    if (lineData) {
      if (lineData.startNode.id.toString() === nodeId.toString() ||
      lineData.endNode.id.toString() === nodeId.toString()) {
        drawWire(lineData.startNode, lineData.endNode);
      }
    }
  });
}
function removeLines(nodeId) {
  d3.selectAll('path').each((lineData) => {
    if (lineData) {
      if (lineData.startNode.id.toString() === nodeId.toString() ||
      lineData.endNode.id.toString() === nodeId.toString()) {
        d3.select(`#line_${lineData.startNode.id}_${lineData.startNode.port}_${lineData.endNode.id}_${lineData.endNode.port}`).remove();
      }
    }
  });
}

appEvents.on(appEvents.nodeMoved, updateLines);
appEvents.on(appEvents.nodeRemove, removeLines);
function getNodeAndPort(idstring) {
  return {
    id: idstring.split('_')[1],
    port: idstring.split('_')[2],
  };
}

let startNode = {};
const startingCoordinates = {};
function dragstarted() {
  d3.event.sourceEvent.stopPropagation();
  const x = d3.mouse(d3.select('#editor').node())[0];
  const y = d3.mouse(d3.select('#editor').node())[1];
  d3.select('#dummyPath')
    .attr('d', getLineCoordinates(x, y, x, y))
    .style('display', 'block');
  startingCoordinates.x = x;
  startingCoordinates.y = y;
  startNode = getNodeAndPort(d3.event.sourceEvent.target.id);
}

function dragged() {
  const x = d3.mouse(d3.select('#editor').node())[0];
  const y = d3.mouse(d3.select('#editor').node())[1];
  d3.select('#dummyPath')
  .attr('d', getLineCoordinates(startingCoordinates.x, startingCoordinates.y, x, y));
}

function dragended() {
  d3.select('#dummyPath')
  .style('display', 'none')
  .attr('d', getLineCoordinates(0, 0, 0, 0));

  if (d3.event.sourceEvent.target.tagName === 'rect' && this !== d3.event.sourceEvent.target) {
    const x1 = startingCoordinates.x;
    const y1 = startingCoordinates.y;
    const x2 = d3.mouse(d3.select('#editor').node())[0];
    const y2 = d3.mouse(d3.select('#editor').node())[1];
    const endNode = getNodeAndPort(d3.event.sourceEvent.target.id);
    d3.select('svg')
        .append('path')
        .datum({
          endNode,
          startNode,
        })
        .attr('id', `line_${startNode.id}_${startNode.port}_${endNode.id}_${endNode.port}`)
        .attr('class', 'line')
        .attr('d', () => getLineCoordinates(x1, y1, x2, y2));
    appEvents.emit(appEvents.nodesConnected, startNode, endNode);
  }
}

const portDragBehavior = d3.drag()
  .on('start', dragstarted)
  .on('drag', dragged)
  .on('end', dragended);


function init(editor, nodes) {
  editor.append('path')
    .attr('id', 'dummyPath')
    .attr('d', getLineCoordinates(0, 0, 0, 0));

  _.forEach(nodes, (node) => {
    if (node.wires && node.wires.length > 0) {
      _.forEach(node.wires, (wire, index) => {
        if (Array.isArray(wire)) {
          _.forEach(wire, (outlet) => {
            const sourceNode = { id: node.id, port: index + 1 };
            const targetNode = { id: outlet.node, port: outlet.port };
            drawWire(sourceNode, targetNode);
          });
        } else {
          const sourceNode = { id: node.id, port: index + 1 };
          const targetNode = { id: wire.node, port: wire.port };
          drawWire(sourceNode, targetNode);
        }
      });
    }
  });
  editor.selectAll('.outputPorts').call(portDragBehavior);
}
function update(editor) {
  editor.selectAll('.outputPorts').call(portDragBehavior);
}

export { update, init };
