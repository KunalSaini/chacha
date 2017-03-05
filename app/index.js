import * as d3 from 'd3';
// import Account from './Account';

function component() {
  const element = document.createElement('div');

  element.innerHTML = 'hello world';
  return element;
}

console.log(d3);
d3.select('body').append('svg')
.attr('width', 50)
.attr('height', 50)
.append('circle')
.attr('cx', 25)
.attr('cy', 25)
.attr('r', 25)
.style('fill', 'purple');
document.body.appendChild(component());
