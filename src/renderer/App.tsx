import React from 'react';
import styles from './App.css';

const App = () => (
  <div className={styles.App}>
    <h1>Hello World!</h1>
    <p>You are running 
      Electron {window.api.versions.electron} and 
      Node {window.api.versions.node} and 
      Chromium {window.api.versions.chrome}
    </p>
  </div>
)

export default App;