/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Fichier Firebase Stub - Permet le fonctionnement 100% autonome et local en cas d'absence de configuration Firebase.
// Ce fichier a été mis en place suite à la suppression d'authentification centralisée pour éliminer les erreurs de compilation.


export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  tenantId: string | null;
  providerData: any[];
}

export const auth = null;
export const db = null;
export const googleProvider = {};

/**
 * Simule la connexion Google (désactivée en mode local autonome)
 */
export async function signInWithPopup() {
  console.warn("L'authentification Firebase est désactivée. DocuGen Pro fonctionne à 100% en mode autonome local.");
  return null;
}

/**
 * Simule la déconnexion
 */
export async function signOut() {
  console.warn("L'authentification Firebase est désactivée.");
}

/**
 * Observateur simulé qui renvoie toujours un utilisateur non connecté (visiteur local)
 */
export function onAuthStateChanged(authInstance: any, callback: (user: User | null) => void) {
  // L'utilisateur reste anonyme/visiteur en local
  setTimeout(() => callback(null), 0);
  return () => {};
}

// Stubs d'opérations Firestore pour éviter de casser les imports de App.tsx
export function doc(...args: any[]) {
  return {};
}

export async function getDoc() {
  return { 
    exists: () => false, 
    data: () => null 
  };
}

export async function setDoc() {
  return {};
}

export async function updateDoc() {
  return {};
}

export function onSnapshot(ref: any, onNext: (snapshot: any) => void, onError?: (err: any) => void) {
  return () => {};
}

// Opérations de diagnostic
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  console.warn(`[Firestore Bypass] Erreur d'opération de type ${operationType} sur ${path}:`, error);
  throw new Error(String(error));
}
