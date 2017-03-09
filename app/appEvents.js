import EventEmitter from 'events';

class AppEvents extends EventEmitter {}

const applicationEvents = new AppEvents();
applicationEvents.nodesConnected = 'nodesConnected';
applicationEvents.nodeMoved = 'nodeMoved';
applicationEvents.nodeRemove = 'nodeRemove';
applicationEvents.nodeAdd = 'nodeAdd';

export default applicationEvents;
