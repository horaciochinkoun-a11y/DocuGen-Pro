// examples/all-types.examples.js
// Données de test pour les 6 types restants (architecture, backlog, pitch, technicalSummary, cvVersion, linkedinVersion)
// Basées sur le vrai modèle ProjectData de DocuGen-Pro

const BASE_FORM = {
  developerName:   "Horacio Chinkoun",
  developerStatus: "Architecte Logiciel & Développeur Full Stack",
  clientName:      "M. Kofi Mensah",
  companyName:     "AfriTech Solutions",
  projectName:     "MarketLink Bénin",
  projectType:     "Marketplace B2B pour PME béninoises",
  technologies:    "React, TypeScript, Node.js, PostgreSQL, Kkiapay, AWS S3",
  keyFeatures:     "Catalogue produits, moteur de recherche, paiement mobile money (MTN/Moov), tableau de bord analytics, notifications SMS",
  results:         "500 PME connectées, 1 000 transactions/mois, réduction de 60% du temps de prospection",
  duration:        "8 mois",
  clientContact:   "kofi@afritech.bj",
  manualTime:      "18 Juin 2026",
  manualLocation:  "Cotonou, Bénin",
  githubLink:      "https://github.com/afritech/marketlink",
  linkedinLink:    "https://linkedin.com/in/horacio-chinkoun"
};

const makeMeta = (type) => ({
  documentId:   `test-${type}-001`,
  documentType: type,
  theme:        "premium-light",
  generatedAt:  "2026-06-18T14:30:00.000Z"
});

const examples = {

  architecture: {
    meta:     makeMeta("architecture"),
    formData: BASE_FORM,
    content: {
      architectureMarkdown: `# Architecture Technique — MarketLink Bénin

## Vue d'ensemble

MarketLink Bénin est une marketplace B2B construite sur une architecture microservices découplée, optimisée pour la connectivité mobile en Afrique de l'Ouest.

## Stack Technique

### Frontend
- **React 18** + TypeScript — SPA avec SSR partiel via Next.js
- **Tailwind CSS** — design system responsive mobile-first
- **React Query** — gestion du cache et des états asynchrones

### Backend
- **Node.js / Express** — API REST + API Gateway
- **PostgreSQL 15** — base de données principale (relations, transactions)
- **Redis** — cache sessions, file de jobs (BullMQ)

### Infrastructure
- **AWS EC2** — serveurs applicatifs (région eu-west-3 Paris pour la latence)
- **AWS S3** — stockage médias et exports PDF/DOCX
- **Vercel** — déploiement frontend (CDN global)

## Schéma de Base de Données

Tables principales : \`users\`, \`products\`, \`orders\`, \`transactions\`, \`reviews\`.

\`\`\`sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XOF',
  provider VARCHAR(20), -- 'mtn', 'moov', 'kkiapay'
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

## Flux de Paiement Mobile Money

1. Client initie la commande → API crée \`transaction\` avec status \`pending\`
2. Requête Kkiapay API avec \`amount\` + \`phone\` + \`callback_url\`
3. Kkiapay envoie USSD push au client (MTN/Moov)
4. Webhook Kkiapay → mise à jour status (\`success\` | \`failed\`)
5. Notification SMS vendeur via API Vonage

## Décisions d'Architecture Clés

| Décision | Choix | Raison |
|---|---|---|
| Base de données | PostgreSQL | Transactions ACID critiques pour les paiements |
| Paiement | Kkiapay | Seul agrégateur supportant MTN + Moov au Bénin |
| Région AWS | eu-west-3 | Meilleure latence vers Cotonou vs us-east |
| Cache | Redis | Sessions + BullMQ pour les jobs d'export DOCX |`
    }
  },

  backlog: {
    meta:     makeMeta("backlog"),
    formData: BASE_FORM,
    content: {
      backlogMarkdown: `# Backlog & Périmètre MVP — MarketLink Bénin

**Principe :** Le MVP doit permettre une première transaction réelle entre un acheteur et un vendeur en moins de 5 minutes d'utilisation.

---

## ☑ In Scope — MVP (Mois 1-5)

### Authentification & Profils
- ☐ Inscription/connexion email + OTP SMS
- ☐ Profil vendeur : informations légales (RCCM, IFU), catalogue, photo
- ☐ Profil acheteur : historique commandes, adresses de livraison
- ☐ Vérification vendeur par l'admin (validation manuelle)

### Catalogue & Recherche
- ☐ CRUD catalogue produits/services avec photos (max 5 photos/produit)
- ☐ Catégories et sous-catégories (arborescence 2 niveaux)
- ☐ Recherche full-text (titre, description, ville)
- ☐ Filtres : prix, catégorie, ville, note vendeur

### Commandes & Paiement
- ☐ Panier multi-vendeur
- ☐ Paiement mobile money via Kkiapay (MTN Bénin + Moov Africa)
- ☐ Confirmation de commande par SMS (vendeur + acheteur)
- ☐ Tableau de bord vendeur : commandes entrantes, solde, historique

### Administration
- ☐ Back-office admin : gestion utilisateurs, litiges, statistiques

---

## ✗ Out of Scope — MVP (Mois 6+)

- ☐ Application mobile native (iOS / Android) — priorité post-lancement
- ☐ Système de notation et avis vérifiés — V2
- ☐ Livraison intégrée (partenariat transporteur) — V2
- ☐ Programme de fidélité / points — V3
- ☐ Facturation automatique PDF — V2
- ☐ API publique partenaires — V3

---

## Critères de Succès MVP

| Métrique | Seuil minimum | Seuil cible |
|---|---|---|
| Temps 1ère transaction | < 10 min | < 5 min |
| Taux de complétion inscription | > 60% | > 80% |
| Uptime | > 99% | > 99.9% |
| Taux d'erreur paiement | < 5% | < 2% |`
    }
  },

  pitch: {
    meta:     makeMeta("pitch"),
    formData: BASE_FORM,
    content: {
      pitchMarkdown: `# Pitch & Go-To-Market — MarketLink Bénin

## Elevator Pitch

> Au Bénin, 80% des PME trouvent leurs clients par bouche-à-oreille. MarketLink Bénin change ça : une marketplace B2B qui connecte acheteurs et vendeurs professionnels en 3 clics, avec paiement mobile money intégré. Pas de compte bancaire requis. Pas de déplacement. Juste du business.

---

## Proposition de Valeur Unique (USP)

- **Pour les vendeurs :** visibilité nationale sans budget pub, paiement sécurisé garanti avant expédition
- **Pour les acheteurs :** catalogue vérifié, paiement mobile money (MTN / Moov), suivi de commande SMS
- **Différenciateur clé :** seule marketplace B2B intégrant nativement Kkiapay pour les paiements MTN + Moov au Bénin

---

## Marché Cible

**Segment primaire :** PME béninoises du secteur commerce (import/export, distribution, artisanat) — ~15 000 entreprises RCCM actives à Cotonou.

**Segment secondaire :** Prestataires de services B2B (imprimeries, agences, transporteurs) — ~8 000 prestataires.

---

## Canaux d'Acquisition

| Canal | Tactique | Coût estimé | Timeline |
|---|---|---|---|
| WhatsApp Business | Groupes commerçants + broadcast liste | Faible | Mois 1-3 |
| Partenaires CCIB | Présentation aux membres de la chambre de commerce | Moyen | Mois 2-4 |
| Terrain Dantokpa | Démonstration directe au grand marché | Faible | Mois 3-5 |
| Facebook Ads | Ciblage géographique Cotonou + secteurs clés | Moyen | Mois 4-6 |

---

## Modèle Économique

- **Freemium vendeur :** inscription gratuite, 5 produits max
- **Abonnement Pro :** 5 000 FCFA/mois — catalogue illimité, analytics, badge vérifié
- **Commission transaction :** 2% sur chaque paiement réussi (minimum 500 FCFA)

**Objectif revenus mois 12 :** 2 500 000 FCFA/mois (500 vendeurs Pro + commissions)`
    }
  },

  technicalSummary: {
    meta:     makeMeta("technicalSummary"),
    formData: BASE_FORM,
    content: {
      technicalSummaryMarkdown: `# Résumé Technique — MarketLink Bénin

## Contexte du Projet

Développement d'une marketplace B2B pour AfriTech Solutions, permettant la mise en relation de PME béninoises avec paiement mobile money intégré.

**Durée :** 8 mois | **Équipe :** 1 architecte lead + 1 développeur junior

---

## Architecture & Stack

### Décisions Techniques Clés

- **PostgreSQL** plutôt que MongoDB : transactions financières ACID-critiques
- **Next.js** plutôt que CRA : SEO indispensable pour la visibilité des catalogues
- **Kkiapay** plutôt qu'intégration directe MTN/Moov : agrégateur unique, une seule API

### Infrastructure

- Frontend : Vercel (CDN global, déploiement continu)
- Backend : AWS EC2 eu-west-3 (Paris — latence optimale depuis Cotonou)
- Base de données : AWS RDS PostgreSQL avec réplication read-replica
- Médias : AWS S3 + CloudFront

---

## Mon Rôle

- **Architecture complète** du système (BDD, API, infra, sécurité)
- **Lead développement backend** : API REST, intégration Kkiapay, webhooks paiement
- **Revue de code** et mentoring développeur junior
- **DevOps** : CI/CD GitHub Actions, monitoring AWS CloudWatch

---

## Défis Techniques Résolus

### Fiabilité des Webhooks Paiement
**Problème :** Les webhooks Kkiapay pouvaient arriver hors ordre ou en doublon.
**Solution :** Idempotency key sur chaque transaction + statut machine d'état (pending → processing → success/failed) avec verrou Redis.

### Performance Recherche
**Problème :** Recherche full-text lente sur 50 000+ produits avec PostgreSQL LIKE.
**Solution :** Index GIN + tsvector (PostgreSQL full-text natif), p95 < 120ms.

---

## Résultats

- **500 PME** onboardées à 8 mois
- **1 000 transactions/mois** au lancement
- **99.7% uptime** sur les 3 premiers mois de production
- **Taux d'erreur paiement < 1.8%** (objectif : < 2%)`
    }
  },

  cvVersion: {
    meta:     makeMeta("cvVersion"),
    formData: BASE_FORM,
    content: {
      cvMarkdown: `# Expérience CV — Horacio Chinkoun

---

## PROJET RÉCENT

**Développeur Lead & Architecte — MarketLink Bénin**
*AfriTech Solutions | Mars 2026 – Présent | Cotonou, Bénin*

Conception et développement d'une marketplace B2B pour PME béninoises, avec intégration du paiement mobile money (MTN Bénin / Moov Africa).

---

## TECHNOLOGIES UTILISÉES

**Frontend :** React 18, TypeScript, Next.js, Tailwind CSS, React Query

**Backend :** Node.js, Express, PostgreSQL 15, Redis, BullMQ

**Cloud & DevOps :** AWS (EC2, RDS, S3, CloudFront), Vercel, GitHub Actions CI/CD

**Paiements :** Kkiapay API (agrégateur mobile money Bénin)

---

## RÉALISATIONS MESURABLES

- Architecturé et livré la plateforme complète en **8 mois** avec une équipe de 2 développeurs
- Intégré le paiement mobile money Kkiapay : **taux d'erreur transaction < 1.8%**
- Optimisé la recherche full-text PostgreSQL : **p95 < 120ms** sur 50 000+ produits
- Onboardé **500 PME** dans les 8 mois suivant le lancement
- Atteint **99.7% d'uptime** en production sur les 3 premiers mois

---

## COMPÉTENCES DÉMONTRÉES

- Architecture microservices et API REST scalables
- Intégration de systèmes de paiement mobile money (spécificités Afrique de l'Ouest)
- Optimisation performance base de données (index GIN, tsvector, connexion pooling)
- Mentoring développeur junior, revue de code, documentation technique`
    }
  },

  linkedinVersion: {
    meta:     makeMeta("linkedinVersion"),
    formData: BASE_FORM,
    content: {
      linkedinMarkdown: `# Post LinkedIn — MarketLink Bénin

---

Au Bénin, trouver un fournisseur fiable prend encore 2 à 3 semaines de terrain.

J'ai passé 8 mois à construire quelque chose pour changer ça.

**MarketLink Bénin** est maintenant live.

---

**Le problème qu'on a résolu :**

80% des PME béninoises trouvent leurs clients par bouche-à-oreille. Pas de catalogue en ligne. Pas de paiement sécurisé. Beaucoup de temps perdu, beaucoup de transactions qui n'aboutissent pas.

---

**Ce qu'on a construit :**

Une marketplace B2B qui permet à n'importe quelle PME de Cotonou de :
- Publier son catalogue en 15 minutes
- Recevoir des commandes avec paiement MTN / Moov intégré
- Suivre ses transactions sans compte bancaire requis

---

**Le défi technique qui m'a le plus appris :**

Construire un système de paiement fiable avec Kkiapay. Les webhooks peuvent arriver hors ordre, en doublon, avec 30 secondes de délai. J'ai implémenté une machine d'état avec idempotency keys et verrou Redis. Résultat : moins de 1.8% d'erreurs de transaction.

---

**8 mois après le lancement :**

✅ 500 PME actives sur la plateforme
✅ 1 000 transactions par mois
✅ 99.7% d'uptime

---

Si tu construis pour des marchés africains et que tu veux parler intégration mobile money, DM ouvert.

*#AfriTech #Bénin #MarketplaceB2B #MobileMoney #NodeJS #React*`
    }
  }
};

module.exports = examples;
