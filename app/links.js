import * as d3 from 'd3';

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
    d3.select('svg')
        .append('line')
        .attr('class', 'line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2);
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
function update() {
  // editor.selectAll('g').each(d => console.log(d));
}

export { update, init };
