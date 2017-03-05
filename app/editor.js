import * as d3 from 'd3';

const editor = d3.select('body').append('svg')
.attr('id', 'editor')
.attr('width', 50)
.attr('height', 50);

export default editor;
