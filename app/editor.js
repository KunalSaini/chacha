import * as d3 from 'd3';

const width = screen.availWidth - 650;
const height = screen.availHeight - 500;
const viewBox = `0 0 ${width} ${height}`;

const editor = d3.select('body').append('svg')
.attr('id', 'editor')
.attr('viewBox', viewBox)
.attr('width', width)
.attr('height', height)
.attr('style', 'float:right');

editor.append('rect')
.attr('x', 0)
.attr('y', 0)
.attr('height', height)
.attr('width', width)
.style('stroke', 'black')
.style('fill', 'none')
.style('stroke-width', 5);

export default editor;
