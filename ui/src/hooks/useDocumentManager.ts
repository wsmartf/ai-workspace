import { useEffect, useState } from 'react';
import log from '../utils/logger';
import { Document } from '../types/Document';
import { getDocumentApi, getDocumentsApi, createDocumentApi, deleteDocumentApi, updateDocumentApi } from '../utils/docsApi';


export function useDocumentManager() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [activeDocId, setActiveDocId] = useState<number | null>(null);

  const [currentDocContent, setCurrentDocContent] = useState<string | null>(null);

  useEffect(() => {
    async function initializeDocs() {
      log.info('Initializing documents...');
      await switchToFirstDoc();
    }
    initializeDocs();
  }, []);

  const updateDocs = async (): Promise<Document[]> => {
    const docsArray: Document[] = await getDocumentsApi();
    setDocs(docsArray);
    if (activeDocId) {
      const currentDoc = docsArray.find(doc => doc.id === activeDocId);
      const content = currentDoc?.content || null;
      setCurrentDocContent(content);
      log.info(`Loaded document content for ID: ${activeDocId}`);
    } else {
      setCurrentDocContent(null);
      log.warn('No active document ID set. Current document content is null.');
    }
    return docsArray;
  }

  const switchToFirstDoc = async () => {
    const updatedDocs = await updateDocs();

    if (updatedDocs.length > 0) {
      setActiveDocId(updatedDocs[0].id);
      setCurrentDocContent(updatedDocs[0].content);
      log.info(`Loaded first document: ${updatedDocs[0].id}`);
    } else {
      log.warn('No documents available. Creating a new document.');
      await createDocumentApi("New Document", "");
      await updateDocs();
      setActiveDocId(updatedDocs[0].id);
      setCurrentDocContent(updatedDocs[0].content);
      // setActiveDocId(null);
    }
  }

  const saveDocumentState = async () => {
    if (currentDocContent && activeDocId) {
      log.info(`Saving document state for ID: ${activeDocId}`);
      updateDocument(activeDocId, currentDocContent);
    } else {
      log.warn('No document content to save or no active document.');
    }
  }

  const updateDocument = async (id: number, content: string) => {
    log.info(`Updating document with ID: ${id}`);
    await updateDocumentApi(id, content);
    await updateDocs();

    // const createDoc = async (name: string = 'New Document', content: string = '') => {
    //   log.info('Creating new document...');
    //   const doc: Document = await createDocumentApi(name, content);
    //   await updateDocs();
    //   setActiveDocId(doc.id);
  }

  return {
    currentDocContent,
    setCurrentDocContent,
    saveDocumentState,
    updateDocs,
    activeDocId
  };
}