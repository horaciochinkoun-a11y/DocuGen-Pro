cat << 'INNER_EOF' > PRIVACY_POLICY.md
# Politique de Confidentialité — DocuGen Pro

**Date de dernière mise à jour :** 03 Juillet 2026

La protection de vos données personnelles et professionnelles est une priorité pour DocuGen Pro, édité par **Horacio CHINKOUN**. Cette politique détaille de façon transparente la manière dont vos informations sont traitées dans l'application, selon une approche stricte de minimisation et de stockage local.

## Table des matières
1. [Architecture "Client-Side" et Stockage Local](#1-architecture-client-side-et-stockage-local)
2. [Transmission ponctuelle des données à l'IA](#2-transmission-ponctuelle-des-données-à-lia)
3. [Données collectées lors de la navigation (Hébergement)](#3-données-collectées-lors-de-la-navigation-hébergement)
4. [Cookies et Traceurs](#4-cookies-et-traceurs)
5. [Vos Droits et Effacement des données](#5-vos-droits-et-effacement-des-données)
6. [Protection des mineurs](#6-protection-des-mineurs)
7. [Modifications de la Politique de Confidentialité](#7-modifications-de-la-politique-de-confidentialité)
8. [Contact](#8-contact)

## 1. Architecture "Client-Side" et Stockage Local
Contrairement aux services web traditionnels, **DocuGen Pro ne dispose pas de base de données centralisée stockant les informations des utilisateurs.**

*   **Zéro base de données serveur :** Nous ne collectons, ne stockons et n'analysons aucune de vos données professionnelles (nom, entreprise, détails des documents, requêtes, etc.) sur nos serveurs.
*   **Utilisation du `localStorage` :** L'historique de vos documents, vos préférences d'interface (thème sombre/clair) et les données saisies dans les formulaires sont sauvegardés *exclusivement en local*, dans la mémoire de votre navigateur internet (via l'API standard `localStorage`). Vous gardez ainsi le contrôle physique total de vos informations.

## 2. Transmission ponctuelle des données à l'IA
Pour générer ou reformater vos documents, l'application doit transmettre ponctuellement vos requêtes (prompts) à notre fournisseur de modèle d'Intelligence Artificielle : **Google Gemini (Google LLC)**.

*   Cette transmission s'effectue de manière sécurisée (chiffrement TLS).
*   L'Éditeur n'enregistre aucune copie de ces requêtes lors de leur transit.
*   Les données envoyées à l'API Google Gemini sont soumises à la [Politique de confidentialité de Google](https://policies.google.com/privacy). Pour les utilisateurs du "Mode Autonome" utilisant leur propre clé d'API Google, le traitement dépend de leurs propres accords avec Google LLC.

## 3. Données collectées lors de la navigation (Hébergement)
L'application web est hébergée sur l'infrastructure Google Cloud Run. Lors de votre visite, des données techniques standard (logs de connexion, adresse IP, type de navigateur, horodatage) sont automatiquement collectées par l'hébergeur pour des raisons de sécurité, de diagnostic et de maintien en conditions opérationnelles, conformément à la réglementation.

## 4. Cookies et Traceurs
L'application **n'utilise aucun cookie de ciblage publicitaire ni aucun traceur marketing invasif**.
Seul le `localStorage` est exploité pour le fonctionnement technique de l'outil et l'enregistrement de vos préférences et historiques locaux.

## 5. Vos Droits et Effacement des données
Puisque nous ne stockons aucune donnée personnelle sur nos serveurs (à l'exception potentielle des logs de connexion techniques conservés temporairement par l'hébergeur), **l'exercice du droit à l'effacement ou à la portabilité se fait directement par vous-même, en toute autonomie**.

Il vous suffit de :
1. Vous rendre dans les paramètres ou l'historique de l'application DocuGen Pro.
2. Cliquer sur le bouton permettant de purger les données locales.
3. Vider le cache de votre navigateur.

## 6. Protection des mineurs
L'application DocuGen Pro s'adresse à un public de professionnels. Elle n'est pas destinée ni conçue pour être utilisée par des mineurs. Nous ne collectons sciemment aucune donnée personnelle relative à des enfants. Si vous êtes mineur, vous n'êtes pas autorisé à utiliser ce service.

## 7. Modifications de la Politique de Confidentialité
L'Éditeur se réserve le droit de modifier la présente Politique de Confidentialité afin de l'adapter aux évolutions législatives, réglementaires ou techniques. La date de dernière mise à jour figurant en haut de cette page sera modifiée en conséquence. Il est de la responsabilité de l'utilisateur de consulter régulièrement ce document.

## 8. Contact
Pour toute question relative à cette politique ou pour l'exercice de vos droits concernant les logs de connexion éventuels, vous pouvez contacter Horacio CHINKOUN à l'adresse suivante : horaciochinkoun@gmail.com.
INNER_EOF

cat << 'INNER_EOF' > LEGAL_MENTIONS.md
# Mentions Légales — DocuGen Pro

**Date de dernière mise à jour :** 03 Juillet 2026

Conformément aux dispositions de la législation en vigueur, notamment en République du Bénin et à l'international concernant la confiance dans l'économie numérique, il est porté à la connaissance des utilisateurs de l'application **DocuGen Pro** les présentes mentions légales.

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
* Pour tous dommages, directs ou indirects, quelles qu'en soient les causes, origines, natures ou conséquences, provoqués par l'accès de quiconque à l'application, par l'impossibilité d'y accéder ou par l'utilisation de documents finaux non vérifiés.

Pour plus de détails, veuillez consulter nos **Conditions Générales d'Utilisation (CGU)**.

## 5. Données Personnelles et Stockage
Pour toute information relative à la collecte, au stockage local (`localStorage`), au transfert technique (via l'API Google Gemini) et à la protection de vos données, veuillez consulter notre **Politique de Confidentialité**.

## 6. Contact
Pour toute demande, vous pouvez contacter l'Éditeur à l'adresse suivante : horaciochinkoun@gmail.com.
INNER_EOF

cat << 'INNER_EOF' > AI_POLICY.md
# Charte d'Utilisation de l'Intelligence Artificielle (IA)

**Date de dernière mise à jour :** 03 Juillet 2026

DocuGen Pro intègre des technologies d'Intelligence Artificielle (via l'API Google Gemini) pour assister les professionnels dans la rédaction et le formatage de leurs documents. Cette charte vise à informer les utilisateurs sur le fonctionnement, les limites et les responsabilités liées à l'usage de ces outils.

## Table des matières
1. [Fonctionnement de l'IA](#1-fonctionnement-de-lia)
2. [Limites et "Hallucinations"](#2-limites-et-hallucinations)
3. [Responsabilité de l'Utilisateur](#3-responsabilité-de-lutilisateur)
4. [Confidentialité des Prompts](#4-confidentialité-des-prompts)
5. [Contact](#5-contact)

## 1. Fonctionnement de l'IA
L'IA agit comme un assistant de rédaction. Elle analyse les informations brutes (prompts) que vous fournissez et génère un contenu structuré et professionnel.

## 2. Limites et "Hallucinations"
Malgré ses performances, l'IA n'est pas infaillible. Elle peut occasionnellement :
- Produire des informations inexactes, hors contexte ou inventées (phénomène d'"hallucination").
- Omettre des détails cruciaux présents dans votre requête initiale.
- Proposer des formulations qui ne correspondent pas aux normes juridiques ou techniques de votre secteur.

## 3. Responsabilité de l'Utilisateur
**L'utilisateur est le seul et unique responsable du document final.**
En utilisant DocuGen Pro, vous vous engagez à :
- **Relire attentivement** chaque document généré.
- **Vérifier l'exactitude** des faits, dates, chiffres et références légales.
- **Valider et amender** le contenu avant toute signature, publication ou transmission à un tiers.

L'Éditeur de DocuGen Pro décline toute responsabilité quant aux conséquences directes ou indirectes liées à l'exploitation d'un document généré par l'IA et non vérifié par l'utilisateur.

## 4. Confidentialité des Prompts
Ne soumettez pas de données sensibles, confidentielles, classifiées ou de secrets industriels dans vos requêtes. Le traitement de vos données est soumis à notre Politique de Confidentialité.

## 5. Contact
Pour toute question relative à l'utilisation de l'IA dans DocuGen Pro, vous pouvez nous contacter à l'adresse suivante : horaciochinkoun@gmail.com.
INNER_EOF

cat << 'INNER_EOF' > LOCAL_DATA_POLICY.md
# Politique de Gestion des Données Locales

**Date de dernière mise à jour :** 03 Juillet 2026

DocuGen Pro a été pensé avec une approche "Privacy by Design" (la protection de la vie privée dès la conception). Ce document explique de manière transparente et pédagogique comment vos données sont stockées et comment vous pouvez les gérer.

## Table des matières
1. [Qu'est-ce que le Stockage Local (`localStorage`) ?](#1-quest-ce-que-le-stockage-local-localstorage)
2. [Pourquoi utilisons-nous ce système ?](#2-pourquoi-utilisons-nous-ce-système)
3. [Quelles données sont stockées ?](#3-quelles-données-sont-stockées)
4. [Comment supprimer toutes vos données ?](#4-comment-supprimer-toutes-vos-données)
5. [Contact](#5-contact)

## 1. Qu'est-ce que le Stockage Local (`localStorage`) ?
L'application n'utilise pas de base de données centralisée sur nos serveurs. À la place, nous utilisons le `localStorage` : une technologie intégrée à votre navigateur web (Chrome, Firefox, Safari, etc.) qui permet de sauvegarder des informations directement sur votre appareil (ordinateur, tablette, smartphone).

## 2. Pourquoi utilisons-nous ce système ?
- **Sécurité et Souveraineté :** Vos historiques et vos données professionnelles ne quittent pas votre appareil (sauf lors de l'envoi ponctuel à l'IA pour la génération).
- **Performance :** L'application est plus rapide car elle ne dépend pas de requêtes permanentes vers un serveur externe.
- **Transparence :** Nous n'avons aucun moyen d'accéder à vos documents ou de les analyser à votre insu.

## 3. Quelles données sont stockées ?
- Vos préférences d'interface (ex: thème sombre ou clair).
- L'historique de vos documents générés.
- Vos informations de profil saisies dans les formulaires.
- Votre clé API personnelle (si vous avez activé le Mode Autonome).

## 4. Comment supprimer toutes vos données ?
Conformément aux réglementations sur la protection des données (APDP, RGPD), vous gardez le contrôle total :
- **Dans l'application :** Rendez-vous dans le panneau latéral (Historique) et cliquez sur l'icône de la corbeille pour supprimer l'historique complet.
- **Via le navigateur :** Vous pouvez à tout moment vider le cache et les données de site de votre navigateur pour effacer définitivement toute trace de DocuGen Pro sur votre appareil.

## 5. Contact
Pour toute demande concernant la gestion de vos données locales, vous pouvez nous contacter à l'adresse suivante : horaciochinkoun@gmail.com.
INNER_EOF
