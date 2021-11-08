/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Lightning, Utils } from '@lightningjs/sdk'
import Splash from './Splash.js'
import Main from './Main.js'
import Game from './Game.js'

export default class App extends Lightning.Component {
  static getFonts() {
    return [
      { family: 'Roboto-Regular', url: Utils.asset('fonts/Roboto-Regular.ttf'), descriptor: {} },
    ]
  }

  static _template() {
    return {
      rect: true,
      color: 0xff000000,
      w: 1920,
      h: 10808,
      //can yse type attribute to determine component type in template definition
      //signals property: a Signal (see docs) tells the parent component that some event happened on this component
      Splash: { type: Splash, signals: { loaded: true }, alpha: 0 },
      Main: { type: Main, alpha: 0 },
      Game: { type: Game, alpha: 0 },
    }
  }

  _setup() {
    this._setState('Splash')
    console.log('setup state -> Splash')
  }

  static _states() {
    //$enter() && $exit() will be automatically called upon when a component enters that state or exits that state so you can do some proper clean up if needed (ie. make something show/hide)
    return [
      class Splash extends this {
        $enter() {
          this.tag('Splash').setSmooth('alpha', 1)
          console.log('enter state -> Splash')
        }
        $exit() {
          this.tag('Splash').setSmooth('alpha', 0)
          console.log('exit state -> Splash')
        }

        //because we have defined 'loaded'
        //because nested in the Splash state, will only be called when Splash fired the loaded signal while app is in Splash state
        //If not in Splash state, will not be called unless there is a loaded function in a different state or root state
        //Meant to prevent excessive conditionals
        loaded() {
          this._setState('Main')
          console.log('loaded setState state -> Splash')
        }
      },
      class Main extends this {
        //$enter/$exit defined to show/hide Main component
        $enter() {
          console.log('enter state -> Main')

          this.tag('Main').patch({
            smooth: { alpha: 1, y: 0 },
          })
        }
        $exit() {
          console.log('exit state -> Main')

          this.tag('Main').patch({
            smooth: { alpha: 0, y: 0 },
          })
        }

        start() {
          this._setState('Game')
        }

        //change focus path to main
        //component which handles the remotecontrol
        //the focus path is determined by calling the _getFocused() method of the app object
        //By default/if returned undefined, ends at app as active component ( with focus path only containing the app itself)
        //when _getFocused() returns a child component, it is added to the focus path, and the child's _getFocused() is invoked
        //Process repeats recursively until the active component is found
        //ie components may delegate focus to descendants
        //delegating focus tells lightning which component is the active component and should handle key events
        _getFocused() {
          console.log('Focused -> Main')
          return this.tag('Main')
        }
      },
      class Game extends this {
        $enter() {
          console.log('enter state -> Game')

          this.tag('Game').setSmooth('alpha', 1)
        }
        $exit() {
          console.log('exit state -> Game')

          this.tag('Game').setSmooth('alpha', 0)
        }

        _getFocused() {
          console.log('focused  -> Game')

          return this.tag('Game')
        }
      },
    ]
  }
}
