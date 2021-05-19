const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const url = require("url");
const isDev = process.env.NODE_ENV === "development";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Restarts Electron when there is a change in this file
try {
  require("electron-reloader")(module, {
    watchRenderer: false, // We setup HMR with Webpack, so electron-reloader only reloads the Electron process
  });
} catch (err) {
  console.error(err);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      disableBlinkFeatures: "Auxclick",
    },
  });

  // Load app
  if (isDev) {
    mainWindow.loadURL(`http://localhost:${process.env.WDS_PORT}`);
  } else {
    mainWindow.loadURL(
      url.pathToFileURL(path.join(__dirname, "../renderer/", "index.html")).href
    );
  }

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Prevent window.open() from creating a new window, instead open
  // links in the browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
