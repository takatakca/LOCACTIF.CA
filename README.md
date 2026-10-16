# LOCACTIF.CA

LOCACTIF est un projet de **découverte et réservation d'activités et d'expériences locales**. L'orientation issue de travaux antérieurs prévoit des sorties, ateliers, événements, dégustations et expériences ; le catalogue historique utilisait WordPress/WooCommerce et des extensions de réservation.

L'ancien dépôt GitHub ne contenait initialement qu'un titre. Le code actuel fournit un socle public indépendant et **ne prétend pas que le système complet de réservation est opérationnel**.

## Disponible
- Accueil bilingue FR/EN, responsive et accessible.
- Page `/explore.html` : recherche, catégories, favoris locaux, filtres et liens vers les offres réellement importées. Aucun exemple fictif n'est montré comme disponible.
- Source de données : `site/catalog.json`, issue d'un import explicite du WooCommerce Store API public via `npm run sync:catalog`.
- Sécurité des liens de réservation (HTTPS limité à l'origine de la boutique configurée).
- Statut minimal : `/health.json` (son résultat atteste uniquement la disponibilité du fichier statique).
- GitHub Actions pour tests sur `main`, déploiement automatique par intégration Vercel/GitHub, GitHub Pages facultatif.

## Exécuter et vérifier
Node.js 20+ :

```bash
npm run check
python3 -m http.server 8080 --directory site
```

Ouvrir http://localhost:8080 puis http://localhost:8080/explore.html.

## Importer des offres réelles
Requiert l'accès à une **boutique WooCommerce validée** exposant l'API publique Store API. Ne pas utiliser un autre site arbitraire.

```bash
# 1. Inventorier les catégories WooCommerce, sans écriture locale ni distante :
LOCACTIF_WP_STORE_BASE_URL=https://votre-boutique-approuvee.example npm run inspect:catalog

# 2. Après approbation des identifiants de catégories d'expériences :
LOCACTIF_WP_STORE_BASE_URL=https://votre-boutique-approuvee.example LOCACTIF_CATEGORY_IDS=12,34 npm run sync:catalog

# 3. Vérifier avant tout commit :
npm run verify:catalog && npm run check
```

- Aucune clé WooCommerce n'est utilisée ni demandée par cet import public.
- L'import de publication exige `LOCACTIF_CATEGORY_IDS` : liste explicite des catégories WooCommerce **réellement approuvées** comme activités/expériences. Aucun autre produit n'est publié par défaut.
- Les produits hors stock, hors catégories et les enregistrements invalides sont exclus ; tous les liens sont contrôlés HTTPS même origine. Aucun créneau ni prix de réservation n'est généré.
- Si l'API échoue, si une page est redirigée, si des doublons surviennent, si les réponses sont malformées ou si la liste dépasse 500 éléments, l'import échoue sans écriture. Un import vide est refusé sauf `ALLOW_EMPTY_CATALOG=true` après revue.
- Si un nouvel import retire plus de la moitié du catalogue, il est refusé sauf `CONFIRM_CATALOG_SHRINK=true` après revue. Un changement d'origine avec un catalogue déjà rempli exige une intervention manuelle.
- Après revue du résultat, ajouter `site/catalog.json` dans un commit : la publication passe par `main` et Vercel.
- Les réservations/achats restent sur la boutique d'origine. Le présent front ne contient **aucun panier ni paiement local**.
- Les favoris sur l'appareil ne constituent pas un compte utilisateur ; une future connexion requiert TAKATAK Auth avec entitlements appropriés.

## Production et déploiement
Projet Vercel identifié : `locactif-ca`. Publication statique depuis `site/` via `vercel.json`. Alias : https://locactif-ca.vercel.app. Le domaine `locactif.ca` ne doit pas être routé avant inspection de la version WordPress et du DNS, afin d'éviter d'interrompre le catalogue/réservations historique. Voir `docs/DEPLOYMENT.md`.

## Reprise par agent
Lire `AGENTS.md`, `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md` et `docs/AGENT_HANDOFF.md`. Les besoins retrouvés concernent un marché local, mais le fonctionnement du futur back-office, les règles tarifaires et la migration WooCommerce -> TAKATAK doivent encore être décidés et testés.

## Fiches détaillées et tests de déploiement
Chaque entrée importée offre un lien interne vers `/experience.html?id=ID`, sans prétendre offrir une disponibilité ou un paiement sur LOCACTIF. La fiche propose le lien original vers l'organisateur, les catégories, le dernier tarif importé s'il existe et des favoris locaux.

Avant de publier un catalogue : `npm run verify:catalog` (inclus dans `npm run check`). Le script d'import refuse les redirections HTTP, les données malformées et le dépassement silencieux de sa limite de 500 produits. L'exécution s'effectue depuis une origine explicitement autorisée, pas depuis l'URL d'un tiers non contrôlé.

Sur `main`, GitHub Actions exécute aussi le smoke HTTPS du site Vercel : `npm run smoke -- https://locactif-ca.vercel.app`. Le résultat d'un smoke prouve les réponses HTTP publiques, pas l'exactitude de la version SHA ni le fonctionnement de paiements/réservations.

## État de la source historique — vérifié le 15 octobre 2026
Les sondes publiques exécutées sur GitHub Actions ont constaté : `locactif.ca` et `www.locactif.ca` résolvent en DNS, mais répondent HTTP 403 à la racine et HTTP 404 pour les endpoints WordPress/WooCommerce publics. **Aucun produit réel ne peut donc être importé depuis ces adresses à ce stade.** Voir [SOURCE_AUDIT.md](docs/SOURCE_AUDIT.md).

Les chemins publics de la vitrine Vercel conservent les extensions `.html` (option `cleanUrls=false`). Le workflow GitHub valide maintenant ces chemins par de vrais appels HTTPS. L'alias Vercel est une **préparation** et ne remplace pas automatiquement les réservations historiques.

## Qualité des données et expérience
Le même schéma `site/catalog-schema.mjs` est appliqué au fichier publié, à l'importateur et au navigateur. Une réponse malformée bloque l'affichage plutôt que de créer des cartes ou des liens dangereux. Les catégories approuvées doivent représenter de vraies expériences — la seule présence d'un produit dans WooCommerce ne garantit **aucun créneau réservable**.

Les pages conservent les termes de recherche et la catégorie au passage vers une fiche et au retour. La date du dernier import apparaît lorsqu'une liste réelle est publiée. Les favoris restent locaux à l'appareil, sans compte ni synchronisation TAKATAK non vérifiée.

Le système de vérification n'interroge jamais de commandes clients WooCommerce et ne collecte aucun identifiant.

## En-têtes HTTP Vercel — corrigés et vérifiés
Le projet Vercel utilise le sous-dossier `site/` comme racine active. Par conséquent **`site/vercel.json` est la configuration effectivement appliquée**, tandis que `vercel.json` dans le dépôt garde une configuration équivalente pour les déploiements depuis la racine. Les règles de sécurité des deux fichiers sont testées pour empêcher toute divergence.

Depuis le commit `f868b7f`, le smoke CI vérifie directement sur HTTPS les en-têtes `X-Robots-Tag`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` et la CSP stricte (`frame-ancestors 'none'`). Les tests sont **réellement passés** sur l'alias de production. Toute disparition des en-têtes fait échouer le pipeline.

## Protection des catalogues et récupération de l'hébergement (16 octobre 2026)

L'import `npm run sync:catalog` refuse de remplacer un inventaire existant devenu invalide, non vérifié ou trop réduit. Son écriture est désormais **atomique** : un échec de fichier ne doit pas tronquer le catalogue publié. Les tests simulent ces pannes sans employer de vraies fiches clients.

Le contrôle HTTP GitHub Actions vérifie aussi les modules `.mjs` chargés par les pages (schéma et fonctions de catalogue), pour détecter les erreurs de publication invisibles dans un simple test de page HTML.

L'audit public de `locactif.ca` constate l'IP `209.42.24.127`, les nameservers `mysecurecloudhost.com` et un serveur Apache qui répond 403/404 sur les points d'entrée historiques WordPress. Voir [WORDPRESS_RECOVERY.md](docs/WORDPRESS_RECOVERY.md) pour l'inventaire non destructif à effectuer depuis le compte d'hébergement autorisé, **avant** toute modification du DNS ou des réservations.
