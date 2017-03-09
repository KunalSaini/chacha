import * as d3 from 'd3';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import canvas from './editor';
import appEvents from './appEvents';
import trace from './trace';

const drag = {
  data: null,
  inProgress: false,
};

canvas.on('mouseup', () => {
  if (drag.inProgress) {
    const eventData = {};
    Object.assign(eventData, drag.data, { x: d3.event.offsetX, y: d3.event.offsetY });
    appEvents.emit(appEvents.nodeAdd, eventData);
  }
});

const availabeNodes = [
  {
    id: '900',
    name: 'And Block',
    topic: '',
    inputs: '2',
    outputs: '1',
    type: 'debug',
    active: true,
    wires: [],
  },
  {
    id: '901',
    name: 'OR Block',
    topic: '',
    inputs: '2',
    outputs: '1',
    type: 'debug',
    active: true,
    wires: [],
  },
];

const draggables = d3.select('.pallet').append('ul');
draggables.selectAll('li').data(availabeNodes).enter()
.append('li')
.text(d => d.name);

$('.pallet li').draggable({
  revert: true,
  cursorAt: { left: -2, top: -2 },
  start: (e) => {
    drag.inProgress = true;
    drag.data = d3.select(e.target).datum();
    trace(drag);
  },
  drag: (e) => {
    $(e.target).draggable('option', 'revertDuration', 0);
  },
  stop: () => {
    drag.inProgress = false;
  },
});
