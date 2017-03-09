import * as d3 from 'd3';
import * as style from './styles/editor.css';  // eslint-disable-line no-unused-vars

const canvas = d3.select('.canvas').append('svg')
.attr('id', 'editor');
canvas.append('rect')
.attr('class', 'border');

export default canvas;
