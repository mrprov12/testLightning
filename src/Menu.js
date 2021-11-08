import { Lightning } from '@lightningjs/sdk'
import Item from './Item.js'

export default class Menu extends Lightning.Component {
  static _template() {
    return {
      //we define an empty holder for our items && position it 40px relative to the component position so we have some space for our focus indicator
      Items: {
        x: 40,
      },

      //Create a text component that indicates which item has focus
      FocusIndicator: {
        y: 5,
        text: { text: '>', fontFace: 'Roboto-Regular' },
      },
    }
  }

  //init, active, inactive: hooks in which we create and start our animation
  //index property is also created which holds the index of the focused menu item
  _init() {
    //create a blinking animation
    this._blink = this.tag('FocusIndicator').animation({
      duration: 0.5,
      repeat: -1,
      actions: [{ p: 'x', v: { 0: 0, 0.5: -40, 1: 0 } }],
    })

    //the current focused menu index
    this._index = 0
  }

  _active() {
    this._blink.start()
  }

  _inactive() {
    this._blink.stop()
  }

  //children accessor is one type of creating and adding components to the template; here using children accessor and feeding with an array of objects which will automatically be created by Lightning
  //items setter will be automatically called, so can map to return new array of objects while specifying type
  set items(v) {
    this.tag('Items').children = v.map((el, idx) => {
      return { type: Item, action: el.action, label: el.label, y: idx * 90 }
    })
  }

  //accessor to get the children inside the items wrapper
  get items() {
    return this.tag('Items').children
  }

  //accessor to quickly grab the active (focused) item
  get activeItem() {
    return this.items[this._index]
  }

  //setIndex: accept index arg, changes position of focus indeicator, stors new index
  _setIndex(idx) {
    //since it's a one time transition, we use smooth
    this.tag('FocusIndicator').setSmooth('y', idx * 90 + 5)

    //store the new index
    this._index = idx
  }

  _handleUp() {
    this._setIndex(Math.max(0, --this._index))
  }

  _handleDown() {
    this._setIndex(Math.min(++this._index, this.items.length - 1))
  }

  _handleEnter() {
    console.log('Menu -> handle enter')
    // let activeItem = activeItem()
    console.log('Menu -> handle enter -> activeItem-> action', this.items[this._index])
    let el = this.items[this._index].action
    this._pulse.on(el, () => {
      if (el === 'start') {
        this.signal('start')
      }
    })
  }

  _getFocused() {
    return this.tag('Menu')
  }
}
