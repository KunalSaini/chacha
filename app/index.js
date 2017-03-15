import _ from 'lodash';
import editor from './editor';
import nodeGenerator from './nodes';
import * as links from './links';
import style from './styles/index.css';// eslint-disable-line no-unused-vars
import pallet from './pallet';// eslint-disable-line no-unused-vars
import appEvents from './appEvents';

const testNodes = [
  {
    id: '850',
    z: 'auto.flow346',
    name: 'GreaterThenEqual',
    topic: '',
    x: 200,
    y: 200,
    inputs: '2',
    outputs: '2',
    type: 'debug',
    active: true,
    wires: [[{
      node: '851',
      port: 1,
    }, {
      node: '852',
      port: 1,
    }], [{
      node: '851',
      port: 2,
    }]],
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

function getNextId() {
  if (testNodes.length === 0) {
    return '100';
  }
  const maxId = _.maxBy(testNodes, n => parseInt(n.id, 10)).id;
  return `${parseInt(maxId, 10) + 1}`;
}

nodeGenerator(editor, testNodes);
links.init(editor, testNodes);

// simulate dynamically adding and removing nodes

// testNodes.push({
//   id: '855',
//   z: 'auto.flow346',
//   name: 'NewNode',
//   topic: '',
//   x: 100,
//   y: 200,
//   inputs: '2',
//   outputs: '2',
//   type: 'debug',
//   active: true,
//   wires: [],
// });
//
// nodeGenerator(editor, testNodes);
// _.remove(testNodes, n => n.id === '851');
// nodeGenerator(editor, testNodes);
// links.update(editor);

appEvents.on(appEvents.nodeAdd, (node) => {
  node.id = getNextId(); // eslint-disable-line no-param-reassign
  node.wires = []; // eslint-disable-line no-param-reassign
  testNodes.push(node);
  nodeGenerator(editor, testNodes);
  links.update(editor);
});
