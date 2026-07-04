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
