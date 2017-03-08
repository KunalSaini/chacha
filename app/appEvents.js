import EventEmitter from 'events';

const nodesConnected = 'nodesConnected';

class AppEvents extends EventEmitter {
  static get nodesConnected() {
    return nodesConnected;
  }
}

const applicationEvents = new AppEvents();

export default applicationEvents;
