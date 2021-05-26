import { contextBridge } from "electron";

declare global {
  interface Window { versions: NodeJS.ProcessVersions }
}

contextBridge.exposeInMainWorld("versions", process.versions);

export {};