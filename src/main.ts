import path from 'node:path';
import { BrowserWindow, app, ipcMain, IpcMainInvokeEvent, dialog, shell } from 'electron';
import { IPC_KEYS } from './constants';
import { serialImageToWebm } from './ffmpeg';
import util from "util";

let mainWindow: BrowserWindow | null;

ipcMain.handle(IPC_KEYS.REQUEST_OPEN_DIR, async (event: IpcMainInvokeEvent, numberOfDigits: number) => {
    if (mainWindow === null) {
        event.sender.send(IPC_KEYS.CREATE_WEBM_RESPONSE, null, "準備がまだ出来ていません。");
        return;
    }
    const paths = dialog.showOpenDialogSync(mainWindow, {
        buttonLabel: '開く',  // 確認ボタンのラベル
        properties:[
            'openDirectory',
        ]
    });
    
      // キャンセルで閉じた場合
      if (paths === undefined) {
        event.sender.send(IPC_KEYS.CREATE_WEBM_RESPONSE, null, "動画作成がキャンセルされました。");
        return;
      }
      const dirPath = paths[0];
      const target = dialog.showSaveDialogSync(mainWindow, {
        buttonLabel: '保存先',
        filters: [
            { name: '動画', extensions: ['webm'] },
        ],
        properties:[
            'showOverwriteConfirmation',
            'createDirectory',
        ]
      })
      if (target === undefined) {
        event.sender.send(IPC_KEYS.CREATE_WEBM_RESPONSE, null, "動画作成がキャンセルされました。");
        return;
      }
      try {
        await serialImageToWebm(numberOfDigits, dirPath, target);
        shell.beep()
        event.sender.send(IPC_KEYS.CREATE_WEBM_RESPONSE, target, null)
      } catch (error) {
        shell.beep()
        console.warn(error);
        event.sender.send(IPC_KEYS.CREATE_WEBM_RESPONSE, null, "動画作成に失敗しました。");
      }
      
  });

ipcMain.handle(IPC_KEYS.REQUEST_OPEN_FILE_PLACE, (event: IpcMainInvokeEvent, path: string) => {
  shell.showItemInFolder(path); // TODO ファイルマネージャーが開かない！！！
})

app.whenReady().then(() => {
  // アプリの起動イベント発火で BrowserWindow インスタンスを作成
  mainWindow = new BrowserWindow({
    webPreferences: {
      // webpack が出力したプリロードスクリプトを読み込み
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // レンダラープロセスをロード
  mainWindow.loadFile('dist/index.html');
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());