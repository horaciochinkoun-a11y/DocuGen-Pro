# Dossier de Pré-Audit Juridique — DocuGen Pro

> Ce document constitue un dossier d'analyse technique et d'inventaire de traitement de données pour DocuGen Pro, sous la propriété exclusive de **Horacio Chinkoun**. Il est destiné à être transmis à un cabinet d'avocats spécialisé en droit du numérique et de la protection des données personnelles, ou à être utilisé comme base de prompt pour des moteurs de recherche juridique spécialisés (ex. Perplexity AI).
>
> **RAPPEL IMPORTANT :** Ce document est une analyse factuelle technique et fonctionnelle du projet. Il ne constitue pas un conseil juridique formel et ne remplace pas l'avis d'un professionnel du droit. Aucun document contractuel (Mentions légales, CGU ou Politique de confidentialité) n'est rédigé ici.

---

## 📅 Métadonnées du Dossier
- **Projet** : DocuGen Pro (générateur intelligent de documents et de livrables professionnels)
- **Propriétaire & Éditeur** : Horacio Chinkoun (nom propre, à titre personnel)
- **Date de l'audit** : 03 Juillet 2026
- **Version du rapport** : 1.0 (Initial)
- **Juridiction Principale** : République du Bénin (Code du Numérique, Loi n° 2017-20)
- **Juridictions Secondaires** : Union Européenne (RGPD), États-Unis (COPPA/CCPA)

---

## ========================================
## ÉTAPE 1 — ANALYSE TECHNIQUE ET FONCTIONNELLE DU PROJET

### 1.1. Nature et finalité de l'application
DocuGen Pro est une application web monopage (SPA) construite avec React, TypeScript, Vite et Tailwind CSS v4. Sa fonction principale est l'assistance à la création, la formalisation et la génération de documents professionnels, contractuels, et de livrables stratégiques (Attestations professionnelles, résumés techniques, CVs, posts LinkedIn, feuilles de route, architectures de projets, backlogs MVP et pitchs) à partir de données saisies par l'utilisateur.

### 1.2. Cartographie technique (Pages, routes, composants)
- **Frontend** : Application Client-Side SPA réactive (React 18+, Vite, Tailwind v4).
- **Navigation/Pages** : Interface unifiée fluide avec gestion d'onglets locaux :
  - *Landing Page* : Présentation marketing, fonctionnalités, politiques de l'application.
  - *Formulaire principal* : Saisie des données de projets (noms, technologies, objectifs, jalons).
  - *Historique de génération* : Consultation locale et suppression des anciens exports.
  - *Panneau Paramètres* : Sélection du thème (clair/sombre), choix de la charte graphique des documents exportés, et configuration de la clé API Gemini personnelle (mode autonome).
- **Exportation** :
  - Export PDF : Génération dynamique côté client via `html2pdf.js` / `html2canvas` / `jsPDF`.
  - Export Word (DOCX) : Génération de documents natifs et certifiés Office OpenXML côté client, avec intégration dynamique de codes QR d'authenticité.

### 1.3. Base de données, authentification et stockage
- **Authentification** : L'application n'exige pas de création de compte par défaut. Un module d'authentification Google OAuth (Firebase Auth) est pré-intégré mais actuellement désactivé (stubbed) pour assurer un fonctionnement 100% autonome et local de l'application.
- **Stockage de données** :
  - **Aucun stockage serveur** : L'application ne stocke aucune donnée utilisateur sur des serveurs centralisés ou bases de données distantes (pas de stockage Firestore actif par défaut).
  - **Souveraineté Locale (Client-Side)** : Toutes les données saisies par l'utilisateur (données de formulaires, profil développeur, historique de génération, clé API Gemini) sont stockées exclusivement dans la mémoire locale du navigateur de l'utilisateur (`localStorage`).
  - **Cycle de vie du cache** : Les données persistent localement jusqu'à ce que l'utilisateur vide son cache de navigateur ou clique sur le bouton de suppression de l'historique et de réinitialisation des paramètres dans l'application.

### 1.4. Intégrations d'Intelligence Artificielle et APIs tierces
- **Moteur IA** : SDK officiel `@google/genai` (TypeScript) pour appeler l'API Gemini de Google.
- **Gestion des Clés API** :
  1. *Clé serveur par défaut* : Stockée dans les variables d'environnement (`import.meta.env.VITE_GEMINI_API_KEY` ou `process.env.GEMINI_API_KEY`) et utilisée pour authentifier les requêtes.
  2. *Clé utilisateur (Mode autonome)* : L'utilisateur peut saisir sa propre clé API Gemini dans le panneau de paramètres de l'application. Dans ce cas, sa clé est stockée localement dans son `localStorage` et prévaut sur la clé par défaut.
- **Transit des données** : Les prompts envoyés à l'API Gemini contiennent l'intégralité des champs textuels saisis dans le formulaire de projet.

### 1.5. Points d'audit spécifiques
- **Logs serveur et monitoring** : L'application s'exécute côté client (Cloud Run pour le serveur de fichiers statiques Nginx/Vite). Les logs d'accès serveur web enregistrent l'adresse IP publique de l'utilisateur, l'horodatage, et le User-Agent du navigateur lors du chargement initial de l'application. Aucun service de monitoring de performance tiers (type Sentry, Datadog ou LogRocket) n'est déployé actuellement.
- **Statut de vérification OAuth** : Firebase Authentication (Google Login) est inactif. Si activé ultérieurement, il demanderait les scopes `email` et `profile`. Le statut actuel est "Non applicable" (Stub local).
- **Contenu des Prompts et Données Personnelles** : Les prompts contiennent potentiellement des données à caractère personnel (Nom du développeur, contact client, liens GitHub et LinkedIn, description de projets). Aucun mécanisme de masquage préalable ou d'anonymisation n'est implémenté avant l'envoi à l'API Gemini.
- **Filtrage des outputs IA** : L'application applique une validation stricte du format JSON retourné par Gemini via un validateur JSON Schema, mais ne filtre pas le contenu sémantique de l'output (pas de filtre de modération ou de détection de biais).
- **CDN et caches tiers** : Les fichiers statiques de l'application sont servis via Cloud Run, pouvant transiter par le CDN global de Google Cloud.
- **Webhooks externes** : Aucun webhook actif n'envoie de données vers des services tiers.

---

## ========================================
## ÉTAPE 2 — INVENTAIRE DES DONNÉES ET TRAITEMENTS (INVENTAIRE JURIDIQUE)

L'inventaire ci-dessous décrit la nature, la source, la finalité et la rétention de chaque donnée manipulée par DocuGen Pro :

| Nom de la donnée | Source | Finalité | Durée de conservation | Niveau de sensibilité |
| :--- | :--- | :--- | :--- | :--- |
| **Nom et Prénom** | Formulaire (Saisie utilisateur) | Personnalisation des documents générés (CV, Attestations, etc.) | Permanente dans le `localStorage` de l'utilisateur (effaçable par lui-même). | Faible |
| **Coordonnées de contact (Email, Téléphone)** | Formulaire (Saisie utilisateur) | Insertion dans les sections de contact des documents exportés. | Permanente dans le `localStorage` de l'utilisateur (effaçable par lui-même). | Moyen |
| **Profils Professionnels (GitHub, LinkedIn)** | Formulaire (Saisie utilisateur) | Intégration de liens de réseaux professionnels dans les exports. | Permanente dans le `localStorage` de l'utilisateur. | Faible |
| **Détails des Projets (Description, Technologies, Résultats, Jalons)** | Formulaire (Saisie utilisateur) | Structuration des prompts envoyés à Gemini pour concevoir la documentation technique et stratégique. | Permanente dans le `localStorage` de l'utilisateur. | Moyen |
| **Clé API Gemini personnelle** | Paramètres (Saisie utilisateur) | Authentification des requêtes IA en mode d'utilisation autonome. | Permanente dans le `localStorage` (chiffrée ou en texte brut selon le navigateur, non partagée). | Élevé (Secret d'authentification) |
| **Historique des Documents Générés** | Générations IA précédentes | Permettre à l'utilisateur de retrouver ses anciens documents (limité à 30 entrées). | Stockage local (`localStorage`) jusqu'à purge manuelle par l'utilisateur. | Moyen (Contient des synthèses de projets) |
| **Adresse IP de l'utilisateur** | En-tête réseau HTTP | Acheminement réseau et sécurité (journalisation technique de l'hébergeur Cloud Run). | Selon les politiques standard de Google Cloud Run (généralement 30 jours dans les logs système). | Moyen |
| **User-Agent du navigateur** | En-tête HTTP du navigateur | Optimisation de l'affichage et diagnostic de compatibilité. | Selon les politiques de conservation des logs de l'hébergeur Cloud Run. | Faible |
| **Prompts envoyés à l'API Gemini** | Assemblage de formulaires | Fourniture du contexte d'instruction à l'IA pour générer les documents requis. | Éphémère en mémoire client lors de l'appel. Soumis à la politique de rétention de l'API Google Gemini. | Moyen |
| **Outputs générés par l'IA** | Réponse de l'API Gemini | Affichage à l'écran et conversion en fichiers exportables (PDF, DOCX). | Stocké éphémèrement en mémoire, puis historisé localement si accepté. | Moyen |
| **Fichiers Importés/Uploadés (PDF, DOCX)** | Téléchargement local | Aucune fonction d'upload de fichiers sur serveur n'est implémentée. Tout traitement de document d'entrée se fait purement en mémoire locale client. | Éphémère en mémoire volatile du navigateur (0 seconde sur le serveur). | Élevé (Contenus confidentiels possibles) |
| **Tokens Google OAuth** | Firebase Authentication | Non applicable (authentification désactivée). | Non applicable | Moyen |
| **Données de cache CDN** | Requêtes HTTP | Accélération du chargement des composants statiques et du CSS. | Géré par le navigateur et le CDN Google Cloud (durée variable, non nominatif). | Faible |

---

## ========================================
## ÉTAPE 3 — IDENTIFICATION DES RISQUES JURIDIQUES ET TECHNIQUES

### 3.1. Risques liés à la vie privée (Privacy)
- **Risque d'accès physique local** : Les données du formulaire et l'historique étant stockés en texte brut dans le `localStorage` du navigateur, toute personne ayant un accès physique ou à distance (via une extension malveillante) au terminal de l'utilisateur peut lire les clés API et les informations professionnelles saisies.
- **Absence de consentement formel pour le stockage local** : Bien que le stockage soit 100 % local, le droit moderne exige une information claire de l'utilisateur sur l'usage du stockage de son navigateur.

### 3.2. Risques liés à l'usage de l'Intelligence Artificielle (IA)
- **Traitement de données personnelles par des tiers** : Les données de projets saisies par l'utilisateur sont transmises directement aux serveurs de Google via l'API Gemini. Si ces serveurs sont situés hors du territoire béninois (notamment aux États-Unis ou en Europe), cela constitue un transfert transfrontalier de données personnelles.
- **Entraînement des modèles** : Selon le type de contrat et de clé de l'API Gemini (gratuite ou payante), Google pourrait utiliser les prompts pour entraîner ses modèles, ce qui pose un risque majeur de fuite de propriété intellectuelle ou de données confidentielles de clients d'Horacio Chinkoun.
- **Responsabilité des contenus générés** : L'IA peut générer des clauses contractuelles ou des affirmations inexactes (hallucinations). Si l'utilisateur final exploite ces documents auprès de tiers sans relecture, la responsabilité de l'éditeur (Horacio Chinkoun) pourrait être recherchée en cas de préjudice.

### 3.3. Risques liés aux comptes Google et OAuth (Évolutif)
- **Exposition en mode "Test"** : Si l'authentification Firebase est activée sans validation préalable de l'écran de consentement par Google, l'application sera limitée à 100 utilisateurs de test et affichera une barrière de sécurité dissuasive ("Application non validée par Google").

### 3.4. Risques liés aux fichiers manipulés
- **Absence de filtrage de sécurité** : Bien que les fichiers soient traités localement, l'importation de documents corrompus ou malveillants par l'utilisateur pourrait compromettre la sécurité du navigateur client.

### 3.5. Risques liés aux mineurs
- **Absence de barrière d'âge** : L'application n'exigeant pas d'inscription, des mineurs peuvent l'utiliser pour générer des documents sans le consentement de leurs représentants légaux.

---

## ========================================
## ÉTAPE 4 — CARTOGRAPHIE DES DOCUMENTS REQUIS ET RECOMMANDÉS

Pour se conformer pleinement aux législations béninoises et internationales, l'application DocuGen Pro devra s'appuyer sur la structure documentaire suivante :

| Type de document | Justification et Raison d'être | Niveau de nécessité |
| :--- | :--- | :--- |
| **Mentions Légales (LEGAL_MENTIONS.md)** | Obligation de transparence identitaire de l'éditeur et de l'hébergeur. Indispensable pour identifier Horacio Chinkoun comme propriétaire exclusif en son nom propre. | **Strictement Obligatoire** (Droit béninois et international) |
| **Conditions Générales d'Utilisation (TERMS_OF_SERVICE.md)** | Contrat régissant l'accès à l'application, déchargeant la responsabilité de l'éditeur quant aux hallucinations de l'IA et interdisant les abus de génération de documents. | **Strictement Obligatoire** (Protection contractuelle de l'éditeur) |
| **Politique de Confidentialité (PRIVACY_POLICY.md)** | Information complète des utilisateurs sur la collecte des adresses IP (logs), l'usage exclusif du stockage local (`localStorage`) et le transfert des données à Google Gemini. | **Strictement Obligatoire** (Conformité APDP Bénin / RGPD) |
| **Bandeau de consentement / Information Cookies & Stockage** | Notification à l'utilisateur de l'usage du `localStorage` pour persister ses formulaires et son historique. | **Hautement Recommandé** (RGPD / Pratiques APDP) |
| **Charte d'Utilisation de l'IA (Politique IA)** | Information spécifique sur l'usage de Gemini, les limites de fiabilité de l'IA et la recommandation impérative de relecture des documents générés. | **Recommandé** (Transparence éthique et légale) |
| **Politique de Rétention des Fichiers** | Document interne décrivant la politique d'exécution éphémère client des fichiers importés (aucune écriture disque serveur). | **Facultatif / Pratique Interne** |

---

## ========================================
## ÉTAPE 5 — DOSSIER POUR RECHERCHE JURIDIQUE EXTERNE (AVOCAT / PERPLEXITY)

### 5.1. Fiche d'identité synthétique du projet
1. **Nom du projet** : DocuGen Pro
2. **Propriétaire principal** : Horacio Chinkoun (Bénin)
3. **Statut commercial** : Phase de prototype/déploiement pré-production autonome, transition vers un modèle SaaS individuel.
4. **Hébergeur ciblé** : Google Cloud Platform (infrastructure européenne et/ou américaine).
5. **Cible d'utilisateurs** : Développeurs, freelances, chefs de projets et professionnels indépendants.
6. **Localisation des cibles** :
   - *Priorité* : République du Bénin.
   - *Secondaire* : Utilisateurs internationaux (Afrique de l'Ouest, Union Européenne, États-Unis).

### 5.2. Résumé fonctionnel pour analyse juridique
L'application collecte des informations professionnelles et personnelles détaillées sur des projets informatiques ou organisationnels. Elle formate et structure ces données dans des schémas JSON strictes, puis utilise l'API Gemini de Google pour produire des textes administratifs et stratégiques en français. Les résultats sont présentés sous forme de fiches interactives et exportables directement sur le disque dur de l'utilisateur en PDF et en Word (DOCX). Aucune donnée n'est stockée de manière persistante sur un serveur contrôlé par Horacio Chinkoun, tout est conservé localement dans le navigateur de l'utilisateur.

---

## ========================================
## QUESTIONS À ADRESSER AUX RECHERCHES EXTERNES & CONSULTATIONS (AVOCAT ET PERPLEXITY)

Les questions suivantes doivent être soumises aux moteurs de recherche juridique et à l'avocat conseil du projet afin de valider et de finaliser le cadre réglementaire :

### A. CADRE JURIDIQUE BÉNINOIS (CODE DU NUMÉRIQUE & APDP)

1. **Régime d'autorisation/déclaration** : L'application DocuGen Pro, n'effectuant aucun stockage de données personnelles sur un serveur physique propre et s'appuyant uniquement sur du stockage local (`localStorage`) de l'utilisateur et un traitement IA externe (Google), est-elle soumise à une déclaration préalable obligatoire auprès de l'Autorité de Protection des Données Personnelles (APDP) du Bénin, ou relève-t-elle d'un régime de simple notification ou d'exemption ?
2. **Transfert transfrontalier** : L'envoi de données nominatives saisies par les utilisateurs béninois vers l'API Google Gemini (hébergée sur des serveurs aux États-Unis ou en Europe) constitue-t-il un transfert hors du territoire béninois selon le Code du Numérique ? Si oui, quelles clauses contractuelles ou mécanismes d'autorisation auprès de l'APDP sont nécessaires pour régulariser ce transfert ?
3. **Responsabilité de l'éditeur sur l'IA** : En vertu des lois du Bénin sur la responsabilité civile et le droit de la consommation, quelle est l'étendue de la responsabilité d'Horacio Chinkoun pour les éventuelles erreurs ou préjudices financiers causés par des documents erronés ou incomplets générés par l'IA et exportés par les utilisateurs ?
4. **Obligation de localisation des données** : Le Code du Numérique du Bénin (ou la loi modificative 2020-35 du 6 janvier 2021) impose-t-il une obligation de localisation ou de stockage des données de citoyens béninois sur des serveurs situés physiquement au Bénin ? L'usage exclusif du stockage local (`localStorage`) de l'utilisateur permet-il de contourner ou de satisfaire cette obligation ?
5. **Nomination d'un DPD/DPO au Bénin** : Une application gérée par un entrepreneur individuel (Horacio Chinkoun) au Bénin, traitant des données d'historiques professionnels d'utilisateurs locaux de manière purement automatisée et locale, doit-elle légalement nommer un Délégué à la Protection des Données (DPD) ?
6. **Protection des mineurs au Bénin** : Existe-t-il des dispositions spécifiques dans la législation béninoise concernant l'âge minimum requis pour consentir au traitement de ses données personnelles en ligne ? Une vérification d'âge ou un consentement parental est-il obligatoire pour une telle application de productivité ?
7. **Mentions Obligatoires et Sanctions** : Quelles sont les mentions légales et informations de transparence identitaire strictement exigées pour un éditeur béninois publiant un service numérique accessible au public ? Quelles sont les sanctions pénales ou financières réelles prévues par l'APDP en cas de défaut d'information des utilisateurs ?
8. **Droit à l'oubli et exportabilité** : Comment le droit à la portabilité et à l'effacement des données du Code du Numérique du Bénin s'applique-t-il à une architecture d'application où les données sont conservées uniquement en local chez l'utilisateur ? Suffit-il de fournir un bouton de suppression locale de l'historique et de réinitialisation des paramètres pour être en totale conformité ?

---

### B. CADRE JURIDIQUE ET BONNES PRATIQUES INTERNATIONALES (RGPD, GOOGLE API USER POLICY)

1. **RGPD et LocalStorage** : Le stockage persistant de données nominatives et de clés API de tiers dans le `localStorage` du navigateur de l'utilisateur est-il qualifié de "traitement de données à caractère personnel" soumis au RGPD européen ? Si oui, l'application doit-elle obtenir un consentement explicite par "Opt-in" (bandeau de cookies/stockage) ou le consentement est-il implicite pour les besoins fonctionnels de l'application (exécution du service demandé) ?
2. **Responsabilité vis-à-vis de Google API Services User Data Policy** : Quelles obligations contractuelles Google impose-t-il aux applications qui intègrent son API Gemini ou l'authentification Google OAuth en ce qui concerne la publication préalable d'une politique de confidentialité ? La non-publication d'un lien de politique de confidentialité valide sur l'écran d'autorisation Google OAuth peut-elle entraîner la révocation immédiate de l'accès à l'API ou le blocage du projet Cloud ?
3. **Entraînement des modèles Google Gemini** : Les conditions d'utilisation de l'API Google Gemini (Google Generative AI Terms of Service) prévoient-elles que les données et prompts soumis via l'API (et non via l'interface grand public Gemini) soient réutilisés pour l'entraînement des modèles de Google ? Quelles clauses ou paramètres d'API garantissent la confidentialité absolue des données soumises par DocuGen Pro ?
4. **Service de monitoring tiers (RGPD)** : Si des outils de télémétrie ou de diagnostic technique (comme Sentry ou Datadog) sont activés ultérieurement pour monitorer l'application et enregistrent les adresses IP ou des fragments d'historiques d'erreurs contenant des données de formulaires, ces outils qualifient-ils ces fournisseurs tiers de "sous-traitants" sous le RGPD ? Un accord de traitement des données (DPA) est-il obligatoire avec ces plateformes ?
5. **Mineurs et conformité internationale (COPPA / RGPD)** : Bien que l'application s'adresse à un public de professionnels, comment garantir qu'un mineur résidant aux États-Unis ou dans l'Union Européenne n'utilise pas l'outil en violation de la COPPA (Children's Online Privacy Protection Act) ou de l'âge de consentement numérique du RGPD ? Un avertissement ou une case à cocher dans les CGU est-il juridiquement protecteur ?
6. **Accessibilité numérique internationale** : En cas d'accès à l'application par des utilisateurs situés au sein de l'Union Européenne, les directives d'accessibilité numérique européenne (European Accessibility Act - Directive 2019/882) s'appliquent-elles à DocuGen Pro, bien que l'éditeur soit établi hors de l'UE ? Quelles sont les normes WCAG de référence recommandées pour éviter tout contentieux d'accessibilité ?

---

## ========================================
## ÉTAPE 6 — PROTOCOLE D'ARRÊT & PROCHAINES ÉTAPES

> **CONSIGNE DE BLOCAGE STRICTE ET PROTOCOLE DE SÉCURITÉ :**
> - Aucun document juridique contraignant (CGU, Politique de confidentialité, mentions légales détaillées) ne doit être rédigé à cette étape par l'agent IA afin d'éviter tout risque d'exercice illégal du droit et de génération de clauses invalides.
> - L'agent IA suspend tout développement ou modification de structure juridique et attend la transmission des résultats de recherche externe actualisés (recherches Perplexity AI sur la législation béninoise en vigueur et/ou retour écrit de l'avocat spécialisé d'Horacio Chinkoun).

---
*Ce dossier de pré-audit a été généré et validé techniquement pour DocuGen Pro le 03 Juillet 2026.*
