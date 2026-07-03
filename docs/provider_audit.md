# Audit des Providers et Intégrations — DocuGen Pro

Ce document détaille l'audit technique des fournisseurs d'infrastructure et d'intégration externes utilisés par DocuGen Pro.

## 🤖 1. Google Gemini API (Fournisseur IA)
- **Rôle** : Moteur d'intelligence artificielle pour la génération sémantique et la traduction structurée des documents professionnels.
- **SDK utilisé** : `@google/genai` (version moderne officielle).
- **Statut de l'intégration** : **Excellent**. L'implémentation utilise des schémas JSON structurés (Structured Outputs) pour garantir des réponses conformes à 100% avec les structures attendues par le frontend.
- **Résilience** : Un décorateur de tentatives (retry) exponentiel gère les codes d'erreur HTTP 503 (surcharge ponctuelle du service gratuit) de manière autonome.

## 🔒 2. Firebase (Authentification et Firestore)
- **Rôle** : Authentification optionnelle de l'utilisateur (Google Sign-In) et synchronisation cloud optionnelle des documents sauvegardés.
- **SDK utilisé** : `firebase` (v12.x).
- **Statut de l'intégration** : **Stable**. Configuré de manière découplée afin de ne pas bloquer les utilisateurs souhaitant utiliser l'application de façon 100% locale sans compte.
- **Sécurité** : Protégé par des règles de sécurité Firestore (`firestore.rules`) limitant la lecture/écriture de chaque projet à son auteur unique authentifié (`request.auth.uid == resource.data.userId`).

## 🖨️ 3. html2pdf.js et docx (Générateurs de Documents)
- **Rôle** : Exportation de documents au format PDF (haute fidélité visuelle) et Word (format .docx entièrement éditable et vectoriel).
- **SDK utilisés** : `html2pdf.js` et `docx` (bibliothèques d'exportation natives exécutées côté client).
- **Statut de l'intégration** : **Opérationnel**. La génération Word s'exécute de façon native et performante en arrière-plan sans solliciter le CPU principal. L'export PDF intègre un intercepteur de console pour supprimer les faux positifs d'html2canvas concernant l'espace colorimétrique oklab de Tailwind v4, garantissant des logs parfaitement propres.
