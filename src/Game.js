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

import { Lightning } from '@lightningjs/sdk'
import Utils from './GameUtils'

export default class Game extends Lightning.Component {
  static _template() {
    return {
      //Game: component, wrapper for the Game board and scoreboard, so that will be easy to hide all at once
      Game: {
        //PlayerPosition: focus indicator of which tile the player currently is
        PlayerPosition: {
          rect: true,
          w: 250,
          h: 250,
          color: 0x40ffffff,
          x: 425,
          y: 125,
        },
        //Field: the outlines of the game field
        Field: {
          x: 400,
          y: 100,
          //children: will populate field component with 5 rectangular lines
          children: [
            { rect: true, w: 1, h: 5, y: 300 },
            { rect: true, w: 1, h: 5, y: 600 },
            { rect: true, h: 1, w: 5, x: 300, y: 0 },
            { rect: true, h: 1, w: 5, x: 600, y: 0 },
          ],
        },
        //Markers: the placed [X] / [O]
        Markers: {
          x: 400,
          y: 100,
        },
        //ScoreBoard: the current score for player and computer
        ScoreBoard: {
          x: 100,
          y: 170,
          Player: {
            text: {
              text: 'Player 0',
              fontSize: 29,
              fontFace: 'Roboto-Regular',
            },
          },
          Ai: {
            y: 40,
            text: {
              text: 'Computer 0',
              fontSize: 29,
              fontFace: 'Roboto-Regular',
            },
          },
        },
      },
      //Notification: the endgame notification (player wins, tie, etc) -- irl, would probably move notification to higher level so multiple components can use it
      Notification: {
        x: 100,
        y: 170,
        text: {
          fontSize: 70,
          fontFace: 'Roboto-Regular',
        },
        alpha: 0,
      },
    }
  }

  //construct: lifecycle event
  _construct() {
    //current player tile index
    this._index = 0

    //computer score
    this._aiScore = 0

    //player score
    this._playerScore = 0
  }

  static _states() {
    return [
      class Computer extends this {
        $enter() {
          const position = Utils.AI(this._tiles)
          if (position === -1) {
            this._setState('End.Tie')
            return false
          }

          setTimeout(() => {
            if (this.place(position, '0')) {
              this._setState('')
            }
          }, ~~(Math.random() * 1200) + 200)
          this.tag('PlayerPosition').setSmooth('alpha', 0)
        }

        _captureKey({ keyCode }) {}

        $exit() {
          this.tag('PlayerPosition').setSmooth('alpha', 1)
        }
      },
      class End extends this {
        _handleEnter() {
          this._reset()
        }
        $exit() {
          this.patch({
            Game: {
              smooth: { alpha: 1 },
            },
            Notification: {
              test: { test: '' },
              smooth: { alpha: 0 },
            },
          })
        }
        //substates
        static _states() {
          return [
            class Winner extends this {
              $enter(args, { winner }) {
                if (winner === 'X') {
                  this._playerScore += 1
                } else {
                  this._aiScore += 1
                }
                this.patch({
                  Game: {
                    smooth: { alpha: 0 },
                    ScoreBoard: {
                      Player: { text: { text: `Player ${this._playerScore}` } },
                      Ai: { text: { text: `Computer ${this._aiScore}` } },
                    },
                  },
                  Notification: {
                    text: {
                      Text: `${
                        winner === 'X' ? 'Player' : 'Computer'
                      } wins (press enter to try again)`,
                    },
                    smooth: { alpha: 1 },
                  },
                })
              }
            },
            class Tie extends this {
              $enter() {
                this.patch({
                  Game: {
                    smooth: { alpha: 0 },
                  },
                  Notification: {
                    text: { text: 'Tie :( (press enter to try again))' },
                    smooth: { alpha: 1 },
                  },
                })
              }
            },
          ]
        }
      },
    ]
  }

  //active: lifecycle event - called when a component is visible = true && alpha > 0 && positioned in the renderable screen
  _active() {
    this._reset()

    // we iterate over the outlines of the field and do a nice transition of the width / height, so it looks like the lines are being drawn realtime

    this.tag('Field').children.forEach((el, idx) => {
      //setSmooth: creates a transition for a give property with the provided value (check docs)
      el.setSmooth(idx < 2 ? 'w' : 'h', 900, { duration: 0.7, delay: idx * 0.15 })
    })
  }

  //reset: fills all available tiles with e for empty, renders tiles, changes state back to root state
  _reset() {
    //reset tiles
    this._tiles = ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e']

    //force render
    this.render(this._tiles)

    //change back to rootstate
    this._setState('')
  }

  //Need to setup rendering tiles and showing outlines on active before we can proceed to implement remote control handling
  render(tiles) {
    this.tag('Markers').children = tiles.map((el, idx) => {
      return {
        x: (idx % 3) * 300 + 110,
        y: ~~(idx / 3) * 300 + 90,
        test: { text: el === 'e' ? '' : `${el}`, fontSize: 100 },
      }
    })
  }

  //on remotecontrol up, check if the new idx we want to focus on is >= 0, if we call the setIndex() function
  _handleUp() {
    let idx = this._index
    if (idx - 3 >= 0) {
      this._setIndex(idx - 3)
    }
  }

  //on remotecontrol down, check if new idx !> the amount of available tiles
  _handleDown() {
    let idx = this._index
    if (idx + 3 <= this._tiles.length - 1) {
      this._setIndex(idx + 3)
    }
  }

  _handleLeft() {
    let idx = this._index
    //checks if were at the left most tile of the column, if so block navigation
    //if were on second row, second col (tile idx 4), and we press left, remainder = 1 which is truthy, thus setIndex is called
    //Else if were on the second row, first col (tile idx 3), and we press left, remainder = 0 which is falsy, thus setIndex is not called
    if (idx % 3) {
      this._setIndex(idx - 1)
    }
  }

  //handleRight: checks similar to handleLeft but for right bound
  _handleRight() {
    let newIdx = this._index + 1
    if (newIdx % 3) {
      this._setIndex(newIdx)
    }
  }

  //setIndex: does a transition of the PlayerPosition component to the new tile and stores the new index for future use
  _setIndex(idx) {
    this.tag('PlayerPosition').patch({
      smooth: {
        x: (idx % 3) * 300 + 425,
        y: ~~(idx / 3) * 300 + 125,
      },
    })
    this._index = idx
  }

  _handleEnter() {
    if (this._tiles[this._index] === 'e') {
      if (this.place(this._index, 'x')) {
        this._setState('Computer')
      }
    }
  }

  place(index, marker) {
    this._tiles[index] = marker
    this.render(this._tiles)

    const winner = Utils.getWinner(this._tiles)
    if (winner) {
      this._setState('End.Winner', [{ winner }])
      return false
    }
    return true
  }
}
