# Limitations Connues et Dette Technique — DocuGen Pro

Ce registre documente de manière transparente les compromis techniques, les limitations actuelles du produit et la dette technique à adresser lors des prochaines itérations.

## ⚠️ Limitations Techniques Actuelles

### 1. Limite de Taille du LocalStorage
- **Problématique** : L'historique des documents générés est stocké dans le `localStorage` du navigateur. Le stockage total disponible par domaine est généralement limité à 5 Mo par les navigateurs.
- **Compromis** : Une limite stricte de **30 projets sauvegardés** a été implémentée dans l'application pour éviter les plantages ou les erreurs de dépassement de quota (QuotaExceededError).
- **Piste d'amélioration** : Migrer vers `IndexedDB` (via une bibliothèque comme `localForage` ou de façon native) pour autoriser un stockage volumineux et persistant sans limite arbitraire.

### 2. Exportation PDF Côté Client (html2pdf.js)
- **Problématique** : L'exportation au format PDF est réalisée entièrement côté client à l'aide d'html2pdf.js (qui convertit l'HTML en image de canevas puis en PDF). Cela peut créer des fichiers PDF lourds et du texte non sélectionnable sur certains anciens terminaux mobiles.
- **Compromis** : Des optimisations CSS spécifiques ont été apportées pour stabiliser le rendu, mais un export de qualité purement vectorielle nécessite de lourdes ressources.
- **Piste d'amélioration** : Proposer un export Word (déjà très performant et 100% vectoriel via `docx`) ou implémenter un micro-service de génération de PDF côté serveur (ex: Puppeteer).

### 3. Gestion des Erreurs et Quotas Gemini (Error 503)
- **Problématique** : Les appels API directs vers Gemini peuvent de temps en temps échouer avec des codes `503 Service Unavailable` ou `429 Too Many Requests` lorsque les quotas d'utilisation publique gratuite sont saturés.
- **Compromis** : Un intercepteur de retry automatique avec délai exponentiel est en place, mais un échec permanent reste possible si le réseau mondial de Google est saturé.
- **Piste d'amélioration** : Intégrer un système de fallback transparent vers un modèle alternatif de rechange ou inciter l'utilisateur à fournir sa clé d'API personnelle.
