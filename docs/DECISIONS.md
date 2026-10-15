# DECISIONS — LOCACTIF.CA

## D-001 — Ne pas inventer le produit
**2026-10-14, conservé 2026-10-15.** Le dépôt d'origine ne comportait qu'un README de titre. Le nom « LOCACTIF » ne suffit pas à inférer l'activité, les parcours, les tarifs ou les utilisateurs. Une page de préparation explicite reste le seul contenu justifié.

## D-002 — Site public sans collecte
**2026-10-14.** La première itération est en HTML/CSS/JS, bilingue FR/EN, sans API ni formulaire factice, sans données client. Les traductions sont dans `site/translations.mjs`.

## D-003 — Vercel pour la version de préparation
**2026-10-14, revérifié 2026-10-15.** Le projet Vercel `locactif-ca` est associé à GitHub `takatakca/LOCACTIF.CA`. Le déploiement de production précédent est marqué READY. La configuration du répertoire public doit être explicite dans `vercel.json`. Ne pas configurer MochaHost/Coolify sans preuve de changement d'hébergeur.

## D-004 — GitHub Pages facultatif
**2026-10-14.** Une tentative Pages a échoué faute d'autorisation. L'action `publish` reste conditionnée à `vars.ENABLE_GITHUB_PAGES == 'true'`. Vercel est la voie existante ; ne pas configurer deux domaines concurrents.

## D-005 — Prudence SEO et DNS
**2026-10-15.** Conserver `noindex,nofollow` et `robots.txt` de blocage tant que le produit final n'est pas approuvé. Ne pas modifier le DNS officiel sans validation.

## D-006 — Architecture TAKATAK
**2026-10-15.** Si une identité est nécessaire à l'avenir, TAKATAK demeure l'autorité centrale ; chaque entreprise dispose d'un périmètre de données tenant-scoped et de droits d'accès par produit. Ce principe n'autorise pas à connecter des API non documentées.
