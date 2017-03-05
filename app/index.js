import Account from './Account';

function component() {
  const element = document.createElement('div');

  element.innerHTML = 'hello world'; // _.join(['Hello t','webpack'], ' ');
  return element;
}

// const myAccount = new Account();
Account.deposit(50);
Account.widraw(10);

document.body.appendChild(component());
