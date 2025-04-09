import { useEffect, useState } from 'react';
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import log from '../utils/logger';


export function useDocumentManager() {
  const [doc, setDoc] = useState<string>('');

  useEffect(() => {
    loadDocument();
  }, []);

  async function loadDocument() {
    try {
      const contents = await readTextFile("Documents/Home/ai-workspace/data/document.md", {
        baseDir: BaseDirectory.Home,
      });
      setDoc(contents);
    } catch (err) {
      log.error('Error loading doc:', err);
      setDoc('');
    }
  }

  async function saveDocument() {
    try {
      await writeTextFile("Documents/Home/ai-workspace/data/document.md", doc, {
        baseDir: BaseDirectory.Home,
      });
    } catch (err) {
      log.error('Error saving doc:', err);
    }
  }

  return {
    doc,
    setDoc,
    loadDocument,
    saveDocument,
  };
}