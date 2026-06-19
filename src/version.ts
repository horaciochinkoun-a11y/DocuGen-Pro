export const APP_VERSION = '2.5.0';
export const RELEASE_DATE = '2026-06-17';

export interface ReleaseNote {
  version: string;
  date: string;
  changes: string[];
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: '2.5.0',
    date: '2026-06-17',
    changes: [
      'Correction majeure de l\'installabilité PWA (Android/iOS)',
      'Optimisation de la structure des assets (/icons)',
      'Conformité Lighthouse PWA améliorée',
      'SEO : Ajout des liens canoniques et métadonnées sociales enrichies'
    ]
  },
  {
    version: '2.4.0',
    date: '2026-06-16',
    changes: [
      'Transformation complète en Progressive Web App (PWA) installable',
      'Système de mise à jour silencieuse avec notifications',
      'Optimisation SEO et partage social (Open Graph)',
      'Intégration d\'un système de versionnement global',
      'Ajout d\'un bouton d\'installation dédié'
    ]
  },
  {
    version: '2.3.0',
    date: '2026-06-15',
    changes: [
      'Nouvelle Landing Page professionnelle immersive',
      'Certification par QR Code dynamique en fin d\'attestation',
      'Ajout du support LinkedIn/GitHub certifié'
    ]
  }
];
