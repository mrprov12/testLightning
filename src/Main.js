import { Lightning } from '@lightningjs/sdk'
import Menu from './Menu.js'

//Main: Main component will be shown at the moment the Splash component sends the loaded signal
//Main's responsibility will be showing a Menu component in its template && accepting remote control presses so user can navigate through menu items
export default class Main extends Lightning.Component {
  static _template() {
    return {
      Menu: {
        x: 600,
        y: 400,
        type: Menu,
        //adding non-lightning properties (like items) will make that property directly available in Component definition this.items
        //if you define a setter (set items(v){}) the setter will be automatically called upon initialization FIXME: what is a setter?
        items: [
          { label: 'START A NEW GAME', action: 'start' },
          { label: 'CONTINUE', action: 'continue' },
          { label: 'ABOUT', action: 'about' },
          { label: 'EXIT', action: 'exit' },
        ],
        passSignals: {
          start: 'start',
          continue: 'continue',
          about: 'about',
          exit: 'exit',
        },
      },
    }
  }

  _getFocused() {
    return this.tag('Menu')
  }
}
