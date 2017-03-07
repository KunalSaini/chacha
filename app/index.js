import editor from './editor';
import nodeGenerator from './nodes';
import * as links from './links';

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

nodeGenerator(editor, testNodes);
links.init(editor);
