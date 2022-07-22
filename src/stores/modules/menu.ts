import { makeAutoObservable } from 'mobx';

export default class Menu {
  menus: any[];
  constructor() {
    makeAutoObservable(this);
  }
}
