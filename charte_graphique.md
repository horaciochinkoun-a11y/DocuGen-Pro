# Charte Graphique - DocuGen Pro

Ce document définit l'identité visuelle et les standards de design de l'application DocuGen Pro.

## 1. Philosophie du Design
DocuGen Pro adopte un style **moderne, épuré et professionnel**. L'accent est mis sur la lisibilité, la clarté des informations et une hiérarchie visuelle forte pour faciliter la génération de documents complexes.

## 2. Palette de Couleurs

### Couleurs Principales
- **Primaire (Bleu) :** `#2563eb` (Tailwind `blue-600`)
  - Utilisé pour les actions principales, les boutons d'appel à l'action et l'identité de marque.
- **Accent (Indigo) :** `#4f46e5` (Tailwind `indigo-600`)
  - Utilisé pour les dégradés et les accents visuels secondaires.

### Couleurs Neutres
- **Fond (Clair) :** `#fafafa` (Tailwind `neutral-50`)
- **Fond (Sombre) :** `#0a0a0a` (Tailwind `neutral-950`)
- **Texte (Clair) :** `#171717` (Tailwind `neutral-900`)
- **Texte (Sombre) :** `#fafafa` (Tailwind `neutral-50`)
- **Bordures :** `#e5e5e5` (Tailwind `neutral-200`) / `#262626` (Tailwind `neutral-800`)

### Couleurs Sémantiques
- **Succès :** `#22c55e` (Tailwind `green-500`)
- **Alerte :** `#f59e0b` (Tailwind `amber-500`)
- **Erreur :** `#dc2626` (Tailwind `red-600`)

## 3. Typographie

### Polices de Caractères
- **Interface Utilisateur (Sans-serif) :** `Inter`, `ui-sans-serif`, `system-ui`.
  - Utilisée pour toute l'interface de l'application.
- **Documents Officiels (Serif) :** `ui-serif`, `Georgia`, `Cambria`.
  - Utilisée spécifiquement pour le rendu des attestations afin de renforcer l'aspect formel.

### Hiérarchie
- **Titres (H1) :** `font-extrabold`, `tracking-tight`.
- **Sous-titres (H2) :** `font-semibold`.
- **Corps de texte :** `leading-relaxed`.

## 4. Composants et Formes
- **Arrondis (Border Radius) :**
  - Boutons et petits éléments : `rounded-lg` (8px).
  - Cartes et sections : `rounded-2xl` (16px) ou `rounded-3xl` (24px).
- **Ombres (Shadows) :**
  - Légères : `shadow-sm`.
  - Prononcées (Modales/Hero) : `shadow-xl`.
- **Bordures :** Fines (`1px`) et discrètes pour séparer les sections sans alourdir le design.

## 5. Iconographie
- **Bibliothèque :** `Lucide React`.
- **Style :** Icônes filaires (outline), épaisseur de trait standard.
- **Couleurs :** Généralement en `neutral-500` pour le repos, et aux couleurs de la marque pour l'interaction.

## 6. Mode Sombre (Dark Mode)
L'application supporte nativement le mode sombre. 
- Inversion des contrastes tout en conservant les couleurs de marque.
- Utilisation de gris très profonds (`neutral-900/950`) au lieu du noir pur pour un meilleur confort visuel.

## 7. Spécificités des Documents
- **Attestation :** Double bordure (`border-double`), filigrane "CERTIFIÉ" à 4% d'opacité, mise en page centrée.
- **CV :** Accentuation par une bordure supérieure colorée (`border-t-4 border-blue-600`).
