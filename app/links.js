import * as d3 from 'd3';
import appEvents from './appEvents';
import linksStyle from './styles/links.css'; // eslint-disable-line no-unused-vars

function updateLines(nodeId, ctm) {
  d3.selectAll('line').each((lineData) => {
    if (lineData) {
      const svg = d3.select('svg').node();
      let pt = svg.createSVGPoint();
      const line = d3.select(`#line_${lineData.startNode.id}_${lineData.startNode.port}_${lineData.endNode.id}_${lineData.endNode.port}`);
      if (lineData.startNode.id === nodeId) {
        const outport = d3.select(`#outputPort_${lineData.startNode.id}_${lineData.startNode.port}`);
        pt.x = parseInt(outport.attr('cx'), 10);
        pt.y = parseInt(outport.attr('cy'), 10);
        pt = pt.matrixTransform(ctm);
        line.attr('x1', pt.x).attr('y1', pt.y);
      } else if (lineData.endNode.id === nodeId) {
        const inport = d3.select(`#inputPort_${lineData.endNode.id}_${lineData.endNode.port}`);
        pt.x = parseInt(inport.attr('x'), 10);
        pt.y = parseInt(inport.attr('y'), 10);
        pt = pt.matrixTransform(ctm);
        line.attr('x2', pt.x).attr('y2', pt.y);
      }
    }
  });
}
function removeLines(nodeId) {
  d3.selectAll('line').each((lineData) => {
    if (lineData) {
      if (lineData.startNode.id === nodeId || lineData.endNode.id === nodeId) {
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
function dragstarted() {
  d3.event.sourceEvent.stopPropagation();
  const x = d3.mouse(d3.select('#editor').node())[0];
  const y = d3.mouse(d3.select('#editor').node())[1];
  d3.select('#dummyPath')
    .attr('x1', x)
    .attr('y1', y)
    .attr('x2', x)
    .attr('y2', y)
    .style('display', 'block');
  startNode = getNodeAndPort(d3.event.sourceEvent.target.id);
}

function dragged() {
  const x = d3.mouse(d3.select('#editor').node())[0];
  const y = d3.mouse(d3.select('#editor').node())[1];
  d3.select('#dummyPath').attr('x2', x).attr('y2', y);
}

function dragended() {
  if (d3.event.sourceEvent.target.tagName === 'rect' && this !== d3.event.sourceEvent.target) {
    const x1 = d3.select('#dummyPath').attr('x1');
    const y1 = d3.select('#dummyPath').attr('y1');
    const x2 = d3.mouse(d3.select('#editor').node())[0];
    const y2 = d3.mouse(d3.select('#editor').node())[1];
    const endNode = getNodeAndPort(d3.event.sourceEvent.target.id);
    d3.select('svg')
        .append('line')
        .datum({
          endNode,
          startNode,
        })
        .attr('id', `line_${startNode.id}_${startNode.port}_${endNode.id}_${endNode.port}`)
        .attr('class', 'line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2);
    appEvents.emit(appEvents.nodesConnected, startNode, endNode);
  }
  d3.select('#dummyPath')
  .style('display', 'none')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', 0);
}

const portDragBehavior = d3.drag()
  .on('start', dragstarted)
  .on('drag', dragged)
  .on('end', dragended);


function init(editor) {
  editor.append('line')
    .style('stroke', 'black')
    .attr('id', 'dummyPath')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', 0);

  editor.selectAll('.outputPorts').call(portDragBehavior);
}
function update(editor) {
  // editor.selectAll('g').each(d => console.log(d));
  editor.selectAll('.outputPorts').call(portDragBehavior);
}

export { update, init };
