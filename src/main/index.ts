import {app, BrowserWindow, protocol} from 'electron';
import * as path from 'path';
import createProtocol from './createProtocol';

const isDevelopment = process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow;

protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}},
]);

let allowQuitting = false;
// 隐藏主窗口
const hideWindow = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.hide()
    }
}

// 展示主窗口
const showWindow = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.show()
    }
}


function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        center: true,
        resizable: false,
        title: '口算生成器v1.0.0 By Wan9J1n',
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    mainWindow.on('close', (event) => {
        // 如果此时，应用并没有被退出，则终止默认行为，并且隐藏主窗口
        if (!allowQuitting) {
            event.preventDefault()
            hideWindow()
        } else {
            mainWindow = undefined
        }
    });

    if (isDevelopment) {
        mainWindow.loadURL('http://localhost:8000');
    } else {
        createProtocol('app');
        mainWindow.loadURL('app://./index.html');
    }
}

app.on('ready', async () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // 修改激活应用操作
    if (mainWindow === null) {
        createWindow()
    } else {
        showWindow()
    }
});
app.on('before-quit', () => (allowQuitting = true))

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
