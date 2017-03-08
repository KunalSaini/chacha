import * as d3 from 'd3';
import trace from './trace';

const availableWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

const availableHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

const svgWidth = availableWidth * 0.73;
const traceWidth = availableWidth * 0.20;
const height = availableHeight * 0.95;
const viewBox = `0 0 ${svgWidth} ${height}`;

trace({
  svgWidth,
  viewBox,
  height,
  traceWidth,
});

document.getElementById('output').style.width = traceWidth;
document.getElementById('output').style.height = height;

const editor = d3.select('body').append('svg')
.attr('id', 'editor')
.attr('viewBox', viewBox)
.attr('width', svgWidth)
.attr('height', height)
.attr('style', 'float:right');

editor.append('rect')
.attr('x', 0)
.attr('y', 0)
.attr('height', height)
.attr('width', svgWidth)
.style('stroke', 'black')
.style('fill', 'none')
.style('stroke-width', 5);

export default editor;
