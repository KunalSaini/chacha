import * as d3 from 'd3';

const availabeNodes = [
  'first item',
  'second item',
];

const draggables = d3.select('.pallet').append('ul');
draggables.selectAll('li').data(availabeNodes).enter()
.append('li')
.text(d => d);
