# Contexte IA et Modèles (AI Context) — DocuGen Pro

Ce document détaille les modèles d'intelligence artificielle utilisés, la stratégie d'ingénierie des requêtes (Prompt Engineering) et les protocoles d'exécution de l'IA dans DocuGen Pro.

## 🤖 Modèle d'IA Référent
- **Modèle principal** : `gemini-1.5-flash`
- **Fournisseur** : Google Gen AI (via le SDK officiel `@google/genai`)
- **Format de réponse** : JSON Structuré (Structured Outputs) pour garantir un typage parfait et une intégration directe dans les formulaires de l'application sans risque d'erreur d'analyse (parsing).

## 🧠 Stratégie d'Ingénierie de Prompt
Les invites envoyées au modèle sont construites de manière modulaire dans `src/services/geminiService.ts`. Chaque prompt contient :
1. **Un Rôle d'Expert** : Le modèle est invité à se comporter comme un rédacteur technique, un conseiller juridique ou un expert marketing senior selon le type de document demandé.
2. **Des Consignes de Clarté** : Exigence de supprimer le jargon inutile, d'adopter un ton professionnel et de respecter une structure logique stricte.
3. **Une Structure de Schéma** : Un schéma JSON précis est fourni pour que l'IA retourne directement les sections du document (titre, sous-titre, métadonnées, paragraphes et listes de puces) sous forme d'un objet typé.

## 🔄 Gestion des Appels et Résilience
- **Sécurité des clés** : Possibilité pour l'utilisateur de configurer sa clé d'API personnelle, conservée localement dans le navigateur.
- **Retry Automatique** : En cas de surcharge temporaire de l'API (code HTTP `503`), l'application effectue jusqu'à 3 tentatives de génération successives avec un délai d'attente progressif avant de déclarer un échec.
- **Zéro Log** : Les prompts et les réponses de l'utilisateur restent confidentiels et ne sont stockés sur aucun serveur intermédiaire, respectant la souveraineté absolue de la donnée.
