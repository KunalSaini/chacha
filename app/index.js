import editor from './editor';

function component() {
  const element = document.createElement('div');

  element.innerHTML = 'hello world';
  return element;
}

editor.append('circle')
.attr('cx', 25)
.attr('cy', 25)
.attr('r', 25)
.style('fill', 'purple');
document.body.appendChild(component());
