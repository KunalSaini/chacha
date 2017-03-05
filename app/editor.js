import * as d3 from 'd3';

console.log(screen.availHeight);
const viewBox = `0 0 ${screen.availWidth} ${screen.availHeight}`;
const width = screen.availWidth;
const height = screen.availHeight;

const editor = d3.select('body').append('svg')
.attr('id', 'editor')
.attr('viewBox', viewBox)
.attr('width', width)
.attr('height', height);

editor.append('rect')
.attr('x', 0)
.attr('y', 0)
.attr('height', height)
.attr('width', width)
.style('stroke', 'black')
.style('fill', 'none')
.style('stroke-width', 5);

export default editor;
