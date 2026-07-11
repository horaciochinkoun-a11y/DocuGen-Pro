cat << 'INNER_EOF' > LEGAL_MENTIONS.md
# Mentions Légales — DocuGen Pro

**Date de dernière mise à jour :** 03 Juillet 2026

Conformément aux dispositions de la législation en vigueur, notamment la **Loi n° 2017-20 portant code du numérique en République du Bénin** concernant la confiance dans l'économie numérique, il est porté à la connaissance des utilisateurs de l'application **DocuGen Pro** les présentes mentions légales.

L'utilisation du site et de l'application DocuGen Pro implique l'acceptation pleine et entière des présentes mentions légales, des Conditions Générales d'Utilisation (CGU) et de la Politique de Confidentialité.

## Table des matières
1. [Éditeur de l'application](#1-éditeur-de-lapplication)
2. [Hébergement](#2-hébergement)
3. [Propriété Intellectuelle](#3-propriété-intellectuelle)
4. [Limitation de Responsabilité](#4-limitation-de-responsabilité)
5. [Données Personnelles et Stockage](#5-données-personnelles-et-stockage)
6. [Contact](#6-contact)

## 1. Éditeur de l'application
Le site et l'application **DocuGen Pro** sont créés, édités et gérés à titre personnel par :

**Horacio CHINKOUN**
Entrepreneur Individuel / Développeur Indépendant

- **Siège social / Adresse :** [À COMPLÉTER : Adresse géographique complète]
- **Téléphone :** [À COMPLÉTER : Numéro de téléphone professionnel]
- **Email :** horaciochinkoun@gmail.com
- **RCCM :** [À COMPLÉTER : Numéro RCCM ou mention "En cours d'immatriculation" / "Dispensé"]
- **IFU :** [À COMPLÉTER : Numéro IFU]

## 2. Hébergement
L'application web DocuGen Pro est hébergée sur l'infrastructure cloud :

**Google Cloud (Cloud Run)**
Fournisseur : Google LLC
Siège social : 1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis
Site Web : [https://cloud.google.com](https://cloud.google.com)

## 3. Propriété Intellectuelle
L'ensemble des éléments constituant l'application DocuGen Pro (structure générale, textes, images animées ou non, savoir-faire, code source de l'interface spécifique, charte graphique, logos, etc.), à l'exclusion des bibliothèques open source tierces, sont la propriété intellectuelle et personnelle exclusive de **Horacio CHINKOUN**.

Toute représentation, reproduction, modification, dénaturation et/ou exploitation totale ou partielle du site, de l'application ou de leur contenu, par quelque procédé que ce soit et sur quelque support que ce soit, sans l'autorisation expresse et préalable de Horacio CHINKOUN, est prohibée et constituerait une contrefaçon sanctionnée par les lois applicables sur la propriété intellectuelle.

Les documents générés par l'utilisateur à partir de ses propres données restent sous sa responsabilité d'exploitation, conformément aux Conditions Générales d'Utilisation.

## 4. Limitation de Responsabilité
L'Éditeur s'efforce d'assurer au mieux de ses possibilités, l'exactitude et la mise à jour des informations diffusées sur DocuGen Pro. Toutefois, il ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition ni la pertinence absolue des documents générés par l'Intelligence Artificielle.

En conséquence, l'Éditeur décline toute responsabilité :
* Pour toute imprécision, inexactitude ou omission portant sur des informations disponibles via l'outil ou générées par l'IA ;
* Pour tous dommages, direct ou indirect, quelles qu'en soient les causes, origines, natures ou conséquences, provoqués par l'accès de quiconque à l'application, par l'impossibilité d'y accéder ou par l'utilisation de documents finaux non vérifiés.

Pour plus de détails, veuillez consulter nos **Conditions Générales d'Utilisation (CGU)**.

## 5. Données Personnelles et Stockage
Pour toute information relative à la collecte, au stockage local (`localStorage`), au transfert technique (via l'API Google Gemini) et à la protection de vos données, veuillez consulter notre **Politique de Confidentialité**.

## 6. Contact
Pour toute demande légale, vous pouvez contacter l'Éditeur par email à horaciochinkoun@gmail.com ou par téléphone au [À COMPLÉTER : Numéro de téléphone].
INNER_EOF

cat << 'INNER_EOF' > PRIVACY_POLICY.md
# Politique de Confidentialité — DocuGen Pro

**Date de dernière mise à jour :** 03 Juillet 2026

La protection de vos données personnelles et professionnelles est une priorité pour DocuGen Pro, édité par **Horacio CHINKOUN**. Cette politique détaille de façon transparente la manière dont vos informations sont traitées dans l'application, selon une approche stricte de minimisation et de stockage local, en conformité avec la **Loi n° 2017-20 portant code du numérique en République du Bénin** (Livre V sur la protection des données à caractère personnel).

## Table des matières
1. [Architecture "Client-Side" et Stockage Local](#1-architecture-client-side-et-stockage-local)
2. [Transmission ponctuelle des données à l'IA](#2-transmission-ponctuelle-des-données-à-lia)
3. [Données collectées lors de la navigation (Hébergement)](#3-données-collectées-lors-de-la-navigation-hébergement)
4. [Cookies et Traceurs](#4-cookies-et-traceurs)
5. [Vos Droits (Accès, Rectification, Effacement et Oubli Numérique)](#5-vos-droits-accès-rectification-effacement-et-oubli-numérique)
6. [Protection des mineurs](#6-protection-des-mineurs)
7. [Modifications de la Politique de Confidentialité](#7-modifications-de-la-politique-de-confidentialité)
8. [Contact et Réclamations](#8-contact-et-réclamations)

## 1. Architecture "Client-Side" et Stockage Local
Contrairement aux services web traditionnels, **DocuGen Pro ne dispose pas de base de données centralisée stockant les informations des utilisateurs.**

*   **Zéro base de données serveur :** Nous ne collectons, ne stockons et n'analysons aucune de vos données professionnelles (nom, entreprise, détails des documents, requêtes, etc.) sur nos serveurs.
*   **Utilisation du `localStorage` :** L'historique de vos documents, vos préférences d'interface (thème sombre/clair) et les données saisies dans les formulaires sont sauvegardés *exclusivement en local*, dans la mémoire de votre navigateur internet (via l'API standard `localStorage`). Vous gardez ainsi le contrôle physique total de vos informations.

## 2. Transmission ponctuelle des données à l'IA
Pour générer ou reformater vos documents, l'application doit transmettre ponctuellement vos requêtes (prompts) à notre fournisseur de modèle d'Intelligence Artificielle : **Google Gemini (Google LLC)**.

*   Cette transmission s'effectue de manière sécurisée (chiffrement TLS).
*   L'Éditeur n'enregistre aucune copie de ces requêtes lors de leur transit.
*   Les données envoyées à l'API Google Gemini sont soumises à la [Politique de confidentialité de Google](https://policies.google.com/privacy) constituant un transfert vers un État tiers (hors CEDEAO). Pour les utilisateurs du "Mode Autonome" utilisant leur propre clé d'API Google, le traitement dépend de leurs propres accords avec Google LLC.

## 3. Données collectées lors de la navigation (Hébergement)
L'application web est hébergée sur l'infrastructure Google Cloud Run. Lors de votre visite, des données techniques standard (logs de connexion, adresse IP, type de navigateur, horodatage) sont automatiquement collectées par l'hébergeur pour des raisons de sécurité, de diagnostic et de maintien en conditions opérationnelles, conformément à la réglementation.

## 4. Cookies et Traceurs
L'application **n'utilise aucun cookie de ciblage publicitaire ni aucun traceur marketing invasif**.
Seul le `localStorage` est exploité pour le fonctionnement technique de l'outil et l'enregistrement de vos préférences et historiques locaux.

## 5. Vos Droits (Accès, Rectification, Effacement et Oubli Numérique)
Conformément aux articles 437 à 443 de la Loi n° 2017-20, vous disposez des droits suivants concernant vos données à caractère personnel :
- **Droit d'accès et d'interrogation** : pour connaître les données traitées vous concernant.
- **Droit d'opposition** : pour vous opposer à un traitement pour des motifs légitimes.
- **Droit de rectification et de suppression** : pour exiger la correction ou l'effacement de données inexactes ou obsolètes.
- **Droit à l'oubli numérique** : pour demander l'effacement de liens ou de copies de vos données.

Puisque nous ne stockons aucune donnée personnelle sur nos serveurs (à l'exception potentielle des logs de connexion techniques conservés temporairement par l'hébergeur), **l'exercice de ces droits se fait directement par vous-même, en toute autonomie**.

Il vous suffit de :
1. Vous rendre dans les paramètres ou l'historique de l'application DocuGen Pro.
2. Cliquer sur le bouton permettant de purger les données locales.
3. Vider le cache de votre navigateur.

## 6. Protection des mineurs
L'application DocuGen Pro s'adresse à un public de professionnels. Elle n'est pas destinée ni conçue pour être utilisée par des mineurs. Nous ne collectons sciemment aucune donnée personnelle relative à des enfants. Si vous êtes mineur, vous n'êtes pas autorisé à utiliser ce service.

## 7. Modifications de la Politique de Confidentialité
L'Éditeur se réserve le droit de modifier la présente Politique de Confidentialité afin de l'adapter aux évolutions législatives, réglementaires ou techniques. La date de dernière mise à jour figurant en haut de cette page sera modifiée en conséquence. Il est de la responsabilité de l'utilisateur de consulter régulièrement ce document.

## 8. Contact et Réclamations
Pour toute question relative à cette politique ou pour l'exercice de vos droits concernant les logs de connexion éventuels, vous pouvez contacter le Responsable du Traitement :

**Horacio CHINKOUN**
- **Email :** horaciochinkoun@gmail.com
- **Adresse :** [À COMPLÉTER : Adresse géographique]
- **Téléphone :** [À COMPLÉTER : Numéro de téléphone]

**Droit de réclamation :** Vous avez également le droit d'introduire une réclamation auprès de l'**Autorité de Protection des Données Personnelles (APDP)** de la République du Bénin si vous estimez que le traitement de vos données constitue une violation de la loi.
INNER_EOF

cat << 'INNER_EOF' > REGISTRE_TRAITEMENTS.md
# Registre des Activités de Traitement (Conformité APDP / Loi n° 2017-20)

**Date de création :** 03 Juillet 2026
**Responsable du Traitement :** Horacio CHINKOUN (Éditeur de DocuGen Pro)
**Coordonnées :** horaciochinkoun@gmail.com / [À COMPLÉTER : Téléphone] / [À COMPLÉTER : Adresse géographique]

Ce registre documente de manière structurée les activités de traitement de données à caractère personnel effectuées dans le cadre de l'exploitation de l'application DocuGen Pro, conformément aux recommandations de l'Autorité de Protection des Données Personnelles (APDP) et à la **Loi n° 2017-20 portant code du numérique en République du Bénin** (Livre V).

---

## Traitement n°1 : Génération de documents via Intelligence Artificielle
*   **Finalité :** Analyse des requêtes (prompts) de l'utilisateur et génération de textes structurés (CV, attestations, etc.) via l'API Google Gemini.
*   **Catégories de données :** Informations professionnelles, coordonnées, parcours, et toute autre donnée saisie librement par l'utilisateur dans les formulaires.
*   **Catégories de personnes concernées :** Utilisateurs de l'application (Professionnels).
*   **Base légale :** Exécution d'un contrat (Conditions Générales d'Utilisation) / Consentement explicite.
*   **Destinataires (Sous-traitants) :** Google LLC (fournisseur du modèle Gemini).
*   **Transfert vers un État tiers (Hors CEDEAO) :** Oui (Transfert sécurisé vers les infrastructures de Google LLC aux États-Unis).
*   **Durée de conservation :** Aucune conservation côté Éditeur. Conservation éphémère ou "zéro rétention" côté Google selon les conditions spécifiques de l'API.

## Traitement n°2 : Stockage des historiques et paramètres utilisateur
*   **Finalité :** Amélioration de l'expérience utilisateur, mémorisation des documents générés et des préférences d'interface.
*   **Catégories de données :** Historique de navigation applicative, contenus des documents, clé API personnelle (optionnelle).
*   **Catégories de personnes concernées :** Utilisateurs de l'application.
*   **Base légale :** Intérêt légitime / Nécessité technique.
*   **Destinataires :** Aucun (traitement 100% local sur le terminal de l'utilisateur).
*   **Durée de conservation :** Jusqu'à la suppression par l'utilisateur (via le bouton dédié dans l'UI ou purge du cache navigateur).

## Traitement n°3 : Journalisation (Logs techniques) de l'infrastructure
*   **Finalité :** Sécurité de l'infrastructure, diagnostic technique et détection d'anomalies/attaques.
*   **Catégories de données :** Adresses IP, User-Agent, horodatage des requêtes.
*   **Catégories de personnes concernées :** Visiteurs de l'application.
*   **Base légale :** Intérêt légitime (Sécurité des systèmes d'information).
*   **Destinataires :** Google Cloud (hébergeur Cloud Run).
*   **Durée de conservation :** Standard de rotation des logs de l'hébergeur (généralement de 30 à 90 jours maximum).

---

## Mesures de Sécurité (Conformément à la Section IV du formulaire APDP)

*   **Sécurité Technique :** 
    - Chiffrement des flux en transit (HTTPS/TLS) pour toutes les communications, garantissant la confidentialité des prompts envoyés à l'API Google Gemini.
    - Architecture "Client-Side" : aucune donnée métier ou historique n'est stocké dans une base de données serveur centralisée (utilisation du `localStorage`).
*   **Sécurité Physique :** 
    - L'hébergement de l'application est délégué à Google Cloud Platform (PaaS) avec des serveurs physiques à l'accès restreint, conformes aux normes ISO/IEC 27001, 27017, 27018.
    - L'absence de base de données applicative centralisée côté Éditeur élimine le risque d'exfiltration massive depuis un serveur.
*   **Sécurité Organisationnelle :**
    - Accès restreint et unique à l'infrastructure d'hébergement et de déploiement (Horacio CHINKOUN), protégé par authentification forte multi-facteurs (MFA).
    - Les correctifs et mises à jour de sécurité des serveurs sont gérés de manière automatisée par le fournisseur de l'infrastructure (Google Cloud Run).
INNER_EOF
