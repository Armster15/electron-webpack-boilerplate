const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("versions", process.versions);
