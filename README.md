# Project spec: https://docs.google.com/document/d/1DYFNF4qMnKHWzg9bjq9-UBKJQMeK1BrhIH_c-saexHI/edit?usp=sharing

## LIGHTNINGJS
The syntax of this framework is similar to React, but I just can't quite get a handle on how state is being managed and how to communicate state changes. Specifically having trouble with:
State Machine: https://rdkcentral.github.io/Lightning/docs/components/statemachine/statemachine
Signals: https://rdkcentral.github.io/Lightning/docs/components/communication/signal
Fire Ancestors (signals sent to distant parent components) https://rdkcentral.github.io/Lightning/docs/components/communication/fireancestors
Focus: https://rdkcentral.github.io/Lightning/docs/focus/focus
Key Handling: https://rdkcentral.github.io/Lightning/docs/focus/keyhandler

## Essentially, what we are coming up against is:

- Tutorial in the docs (https://rdkcentral.github.io/Lightning/docs/gettingStarted/start-development) for a Tic Tac Toe game was the basis of the repo, however that tutorial was not fully functional, resulting in having to play with it to get the appropriate starter screen to render. (also, now I cannot get it to initialize the gameplay - the docs are awful just prepare yourself.)
- Now, it is rendering the Splash.js view and the Menu.js/Main.js view and you are able to move up and down (up/down key handlers are functional), however you can't select any of the Item options in the menu because there was no enterHandler originally
- So, I am trying to implement an enterHandler that will send a signal to the App.js state handlers and switch the current state from Menu to Game. With the idea that perhaps the game state will allow me to initialize a game for the user.
- From this, getting gameplay to work, including ai play, evaluating wins/losses, and recording score, etc


## testLightning REPO (sent an invite to your github - let me know if you have any access issues)
I have added FIXME's and notes relating to what I am attempting to do. I'm not sure if my conceptual plan even makes sense. Honestly any advice would be appreciated.

## GOALS
Ideally, I'd like to get this toy app running by 11/9/21 evening so that we can begin to implement the framework for the actual mock we are supposed to be creating. At this point, that seems unlikely and I am ready to pull my hair out.

## PROJECT SPEC
Here is a link to the full project spec I've created to give you an idea of what were working towards: https://docs.google.com/document/d/1DYFNF4qMnKHWzg9bjq9-UBKJQMeK1BrhIH_c-saexHI/edit?usp=sharing

There are all the LightningJS resources within that doc, so look for those links.

## CONTEXT ABOUT LIGHTNINGJS
Below I've reproduced the informational email I sent to our team in India for the UI mock of the tv app, some general notes about the framework to quickly get you up to speed.

### Load a JSON object to memory - A sample JSON has been provided. How easy is it to load this and use as a variable
See Alavi's response

### Build a UI bound to the JSON data. This can be a grid, ribbon-tiles, etc. Evaluate how easy it is to construct UI components using a JSON source (similar to React)
Below is an overview of how components handle rendering etc to give you an idea of how they will function once the UI has been created. The handling of component creation and state management is very different from React, and will take some time to become accustomed to. Because there are no resources (tutorials/videos) beyond the official docs, figuring out how to construct this specific UI will take more time than we have had thus far. We spoke to Pavan last Thursday, who seemed to be fine with a more relaxed time frame in relation to that, so taking the extra time needed to learn the framework well enough to produce the UI may not be a problem. Please let us know what y'all decide in your upcoming meeting so we can cater to that timeline. Once we have more information on what it takes to produce nested, functional components, we will send another update.

### Since the documentation says the framework does not use state (which React does), how are updates to the JSON data handled? Does the UI update automatically?
LightningJS does in fact use state -- utilize 'signals' and 'fireAncestors' to communicate through the render tree what needs to be updated. Please see point 6 for notes about how rendering is handled in lightningJS
Signals tell the parent component that some event happened not his child component
_setState() is used to force a state change
Within _states(), add in $enter(), $exit(), loaded(), to mark actions on entering and exiting that state (to allow for state specific operations and clean up) — examples of signals
Prop handling is done through signals and fireAncestors (which handle sending signals to distant parents
View state machine docs for reference on this
###  Overview of Lightning render tree:
Render tree in lightning conceptually similar with HTML DOM render tree, but is also used to define the elements shown and how they are positioned and rendered
Elements have properties that can be set to change the way they appear
Is different from HTML DOM in that it is completely JS based and has a more basic API
Is defined vie templates defined within class components
Render tree is composed of elements, render primitives of the lng.Element type set with texture or not
Texture can be anything from solid color to gradient/text/image and are defined with properties that set position and appearance
Each new frame, render tree is checked for branches in render tree tagged with hasUpdates (any time child is added or removed, etc)
Frame is drawn in following order:
1st, branches that contain updates, coordinates are recalculated and re rendered
Any branches without updates are skipped, keeping large apps with many sections from running slow
Does not render invisible parts (alpha:0 or visible: false)
Detects when branches are guaranteed to be out of screen and prevents render (allows for near infinite scrolling lists with good performance)
Traverses all visible and on screen branches and gathers the textures/coordinates to be drown
These are uploaded to the GPU in a memory buffer
Finally, textures are drawn using WebGL commands resulting in an updated canvas filled with the current state of your render tree


### Handle keyboard navigation: Does Lightning provide an inbuilt tile-navigation component? If not, how easy is it to handle events and perform tasks like activating and selecting a tile.
Lightning uses the “focus path” — render tree of components, defaults to app components and continues recursively calling until it finds the active “focus” component, ie components may delegate focus to descendants
Focus path is recalculated:
When any component’s state is changed
When a key has been pressed
When _refocus() has been called on any component
Common ways to delegate focus is to use States, ie Overriding _getFocused() method within each state class
If you have a state named based on your components you can use a generic method to control it
For dynamically generated components, create an index variable to delegate focus, and bind keys for the user to change focus to a different component
Lightning fires _focus() and _unfocus() events on Components when the “focus” changes — these methods can be used to change the appearance or state of the component
Has some example keyboard nav functionality, not necessarily “inbuilt tile-navigation”, but through the focus tree and state handling, can easily use keyboard navigation to set active component and navigate

 ###  What kind of styling options are available? The documentation says that a flexbox kind of layout is provided. Does it match up to all the spec of the CSS flexbox?
“Lightning layout engine has some smart performance optimizations. However, it is still rather cpu-intensive so it is best used for situations in which the flex items do not often change dimensions” -docs:Flexbox
Flex and flexItem props define flex/related layout settings
Possible to nest flex containers,  making them both flex containers and flex items
Links to css flex box resources in docs because is so similar to LightningJS flexbox; only a few things differ, and are listed in two tables in docs. Mostly prop name differences, only a handful of actual property characteristic difference
Animation: how easy? What's the language?
Animation is handled within Lightningjs, in an animations library
Also has a lightning-based transitions library
It is controlled by life cycle hooks to manage start/stop
WebGL based
Difficulty is currently undetermined -- once our components are effectively rendering, we can begin implementing animation and report back with more accurate findings.





# Test

## com.metrological.app.myawesomeapp

### Getting started

> Before you follow the steps below, make sure you have the
[Lightning-CLI](https://rdkcentral.github.io/Lightning-CLI/#/) installed _globally_ only your system

```
npm install -g @lightningjs/cli
```

#### Running the App

1. Install the NPM dependencies by running `npm install`

2. Build the App using the _Lightning-CLI_ by running `lng build` inside the root of your project

3. Fire up a local webserver and open the App in a browser by running `lng serve` inside the root of your project

#### Developing the App

During development you can use the **watcher** functionality of the _Lightning-CLI_.

- use `lng watch` to automatically _rebuild_ your App whenever you make a change in the `src` or  `static` folder
- use `lng dev` to start the watcher and run a local webserver / open the App in a browser _at the same time_

#### Documentation

Use `lng docs` to open up the Lightning-SDK documentation.
