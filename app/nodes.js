import * as d3 from 'd3';

const testNodes = [
  {
    id: '850',
    z: 'auto.flow346',
    name: 'GreaterThenEqual',
    topic: '',
    x: 300,
    y: 300,
    inputs: '2',
    outputs: '1',
    type: 'debug',
    active: true,
    wires: [],
  }, {
    id: '851',
    z: 'auto.flow346',
    name: 'LessThenEqual',
    topic: '',
    x: 100,
    y: 200,
    inputs: '2',
    outputs: '1',
    type: 'debug',
    active: true,
    wires: [],
  }, {
    id: '852',
    z: 'auto.flow346',
    name: 'JustEqual',
    topic: '',
    x: 100,
    y: 250,
    inputs: '2',
    outputs: '1',
    type: 'debug',
    active: true,
    wires: [],
  },
];

function dragstarted() {
  d3.select(this).attr('transform', d => `translate(${d.x},${d.y})`);
  d3.select(this).raise().classed('active', true);
}

function dragged(d) {
  const textArea = document.getElementById('output');
  textArea.value = JSON.stringify(testNodes, null, 4);
  d.x = d3.event.x; // eslint-disable-line no-param-reassign
  d.y = d3.event.y; // eslint-disable-line no-param-reassign
  d3.select(this).attr('transform', `translate(${d3.event.x},${d3.event.y})`);
}

function dragended() {
  d3.select(this).classed('active', false);
}

const dragBehavior = d3.drag()
  .on('start', dragstarted)
  .on('drag', dragged)
  .on('end', dragended);

function generateNodesOn(editor, nodes = testNodes) {
  const groups = editor.selectAll('g').data(nodes).enter().append('g')
  .attr('id', d => `node_${d.id}`)
  .attr('transform', d => `translate(${d.x},${d.y})`)
  .call(dragBehavior);
  testNodes.forEach((node) => {
    const nodeContainer = d3.select(`#node_${node.id}`);
    const tex = nodeContainer.selectAll('text').data([node]).enter().append('text')
        // .attr('x', function(d) { return node.x; })
        // .attr('y', function(d) { return node.y; })
          .attr('text-anchor', 'start')
          .style('fill', 'steelblue')
          .text(() => node.name);

    const dim = tex.node().getBBox();
    nodeContainer.selectAll('rect').data([node]).enter().append('rect')
        // .attr('x', dim.x)
        // .attr('y', dim.y)
        .attr('height', dim.height)
        .attr('width', dim.width)
        .style('fill', 'none')
        .attr('stroke', 'black');

    nodeContainer.selectAll('.inputPorts').data(d3.range(1, parseInt(node.inputs, 10) + 1, 1)).enter().append('rect')
      .attr('class', 'inputPorts')
      .attr('x', 5)
      .attr('y', d => (d + 1) * 10)
      .attr('height', 5)
      .attr('width', 5)
      .style('fill', 'black')
      .attr('stroke', 'black');

    nodeContainer.selectAll('.outputPorts').data(d3.range(1, parseInt(node.outputs, 10) + 1, 1)).enter().append('rect')
      .attr('class', 'outputPorts')
      .attr('x', dim.width)
      .attr('y', d => (d + 1) * 10)
      .attr('height', 5)
      .attr('width', 5)
      .style('fill', 'red')
      .attr('stroke', 'red');
  });
  return groups;
}

export { generateNodesOn as default };
