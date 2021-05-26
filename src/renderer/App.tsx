/// <reference path="../main/preload.ts" />

import React from 'react';

const App = () => (
  <div className="App">
    <h1>Hello World!</h1>
    <p>You are running 
      Electron {window.versions.electron} and 
      Node {window.versions.node} and 
      Chromium {window.versions.chrome}
    </p>
  </div>
)

export default App;