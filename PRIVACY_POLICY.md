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
