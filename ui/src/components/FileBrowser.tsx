import { open as openDialog, save as saveDialog } from '@tauri-apps/plugin-dialog';
import { open as openFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { writeFile as tauriWriteFile } from '@tauri-apps/plugin-fs';
import React from 'react';

interface FileOpenButtonProps {
  onClick: () => void;
}

export const FileOpenButton: React.FC<FileOpenButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Open File
    </button>
  );
};

export const useFileOpen = (onFileLoaded: (content: string, filePath: string) => void) => {
  const handleOpenFile = async () => {
    const filePath = await openDialog({
      multiple: false,
      directory: false,
      filters: [{ name: 'Markdown', extensions: ['md'] }],
    });
    if (filePath) {
      const file = await openFile(filePath, {
        read: true,
        baseDir: BaseDirectory.AppData,
      });
      const stat = await file.stat();
      const buf = new Uint8Array(stat.size);
      await file.read(buf);
      const textContents = new TextDecoder().decode(buf);
      onFileLoaded(textContents, filePath);
      await file.close();
    }
  };

  return handleOpenFile;
};

export const useFileSave = (filePath: string | null, setFilePath: (path: string) => void) => {
  // Returns a function to save content to file
  const saveToFile = async (content: string, defaultFileName = 'Untitled.md') => {
    let path = filePath;
    if (!path) {
      path = await saveDialog({
        filters: [{ name: 'Markdown', extensions: ['md'] }],
        defaultPath: defaultFileName,
      });
      if (typeof path !== 'string') return false;
      setFilePath(path);
    }
    const data = new TextEncoder().encode(content);
    await tauriWriteFile(path, data);
    return true;
  };
  return saveToFile;
};