import { useEffect, useState } from 'react';
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

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
      console.error('Error loading doc:', err);
      setDoc(''); // fallback to blank if not found
    }
  }

  async function saveDocument() {
    try {
      await writeTextFile("Documents/Home/ai-workspace/data/document.md", doc, {
        baseDir: BaseDirectory.Home,
      });
    } catch (err) {
      console.error('Error saving doc:', err);
    }
  }

  return {
    doc,
    setDoc,
    loadDocument,
    saveDocument,
  };
}