  // import { useState } from 'react';
  // import log from '../utils/logger';
  // import { Document } from '../types/Document';
  // import { getDocumentApi, getDocumentsApi, createDocumentApi, updateDocumentApi } from '../utils/docsApi';


  // export function useDocumentManager() {
  //   const [documentId, setDocumentId] = useState<number | null>(null);
  //   const [documentTitle, setDocumentTitle] = useState<string | null>(null);
  //   const [documentContent, setDocumentContent] = useState<string | null>(null);

  //   const updateDocumentState = async () => {
  //     log.info('Updating document state...');
  //     if (documentId === null) {
  //       log.warn('No document ID found to update state.');
  //       return;
  //     }

  //     if (!documentTitle || !documentContent) {
  //       log.warn('No valid title or content found to update state.');
  //       return;
  //     }
  //     const document: Document = await updateDocumentApi({
  //       id: documentId,
  //       title: documentTitle,
  //       content: documentContent,
  //     });
  //     setDocumentId(document.id);
  //     setDocumentTitle(document.title);
  //     setDocumentContent(document.content);
  //     log.info(`Updated document state for ID: ${documentId}`);
  //   }

  //   const updateDocumentTitle = async (newTitle: string) => {
  //     if (!newTitle.trim()) return; // Prevent empty titles
  //     if (documentId === null) {
  //       log.warn('No document ID found to update title.');
  //       return;
  //     }
  //     const document: Document = await updateDocumentApi({ id: documentId, title: newTitle });
  //     setDocumentId(document.id);
  //     setDocumentTitle(document.title);
  //     setDocumentContent(document.content);
  //     log.info(`Updated document title to: ${newTitle}`);
  //   }

  //   const updateDocumentContent = async (newContent: string) => {
  //     if (!newContent.trim()) return; // Prevent empty content
  //     if (documentId === null) {
  //       log.warn('No document ID found to update content.');
  //       return;
  //     }
  //     const document: Document = await updateDocumentApi({ id: documentId, content: newContent });
  //     setDocumentId(document.id);
  //     setDocumentTitle(document.title);
  //     setDocumentContent(document.content);
  //     log.info(`Updated document content for ID: ${documentId}`);
  //   }

  //   const getDocuments = async () => {
  //     log.info('Fetching all documents...');
  //     const docsArray: Document[] = await getDocumentsApi();
  //     return docsArray;
  //   }

  //   const loadDocument = async (id: number) => {
  //     log.info(`Loading document with ID: ${id}`);
  //     const document: Document = await getDocumentApi(id);
  //     setDocumentId(document.id);
  //     setDocumentTitle(document.title);
  //     setDocumentContent(document.content);
  //     return document;
  //   }

  //   const reloadDocument = async () => {
  //     if (documentId) {
  //       log.info(`Reloading current document with ID: ${documentId}`);
  //       const document: Document = await getDocumentApi(documentId);
  //       setDocumentId(document.id);
  //       setDocumentTitle(document.title);
  //       setDocumentContent(document.content);
  //       return document;
  //     } else {
  //       log.warn('No document ID found to reload.');
  //       return null;
  //     }
  //   }

  //   const createDocument = async (title: string, content: string) => {
  //     log.info('Creating new document...');
  //     const document: Document = await createDocumentApi(title, content);
  //     setDocumentId(document.id);
  //     setDocumentTitle(document.title);
  //     setDocumentContent(document.content);
  //     log.info(`Created document with ID: ${document.id}`);
  //     return document;
  //   }

  //   const clearDocumentState = () => {
  //     log.info('Clearing document state...');
  //     setDocumentId(null);
  //     setDocumentTitle(null);
  //     setDocumentContent(null);
  //     log.info('Document state cleared.');
  //   }

  //   return {
  //     documentId,
  //     documentTitle,
  //     documentContent,
  //     setDocumentId,
  //     setDocumentTitle,
  //     setDocumentContent,
  //     loadDocument,
  //     reloadDocument,
  //     createDocument,
  //     updateDocumentTitle,
  //     updateDocumentContent,
  //     getDocuments,
  //     updateDocumentState,
  //     clearDocumentState
  //   };
  // }