import { Lightning } from '@lightningjs/sdk'

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      //Component added to render-tree with reference name Logo
      //Components must always start with an uppercase character
      //Inside are components properties
      //Mount property sets component to exactly align in center, no matter future dimensions of property
      Logo: {
        x: 960,
        y: 540,
        mount: 0.5,
        //by setting the text property, force the LOGO component to be of type Lightning.texture.TextTexture (can start adding text properties -- see docs)
        text: { text: 'LOADING..', fontFace: 'Roboto-Regular' },
      },
    }
  }

  //init: first lifecycle event (see docs)
  //init hook will  be called when component is attached for the first time
  //inside, will start defining our animation (see docs)
  _init() {
    //create animation and store a reference, so we can start / stop / pause
    this._pulse = this.tag('Logo').animation({
      duration: 4,
      repeat: 0,
      actions: [{ p: 'alpha', v: { 0: 0, 1: 0.5, 1: 0 } }],
    })

    // add a finish eventlistener, so we can send a signal to the parent when the animation is completed
    this._pulse.on('finish', () => {
      this.signal('loaded')
    })

    //start the animation
    this._pulse.start()
  }

  //Active: hook that will be called when a component is activated && visible && on screen
  //inside active hook we start our animation
  _active() {
    this._pulse.start()
  }
}
