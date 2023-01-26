import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPC_KEYS, NATIVE_API } from "./constants";

contextBridge.exposeInMainWorld(NATIVE_API, {
    requestOpenDir: (numberOfDigits: number, listener: (webmPath: string | null, error: string | null) => void) => {
        ipcRenderer.addListener(IPC_KEYS.CREATE_WEBM_RESPONSE, (event: IpcRendererEvent, webmPath: string | null, error: string | null) => {
            listener(webmPath, error);
          });
          ipcRenderer.invoke(IPC_KEYS.REQUEST_OPEN_DIR, numberOfDigits);
          return () => {
            ipcRenderer.removeAllListeners(IPC_KEYS.CREATE_WEBM_RESPONSE);
          }
    },
    requestOpenFilePlace: (filePath: string) => {
      ipcRenderer.invoke(IPC_KEYS.REQUEST_OPEN_FILE_PLACE, filePath);
    }
});