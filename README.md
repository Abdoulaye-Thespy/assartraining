# ASSAR Training

Plateforme de formations vidéo ASSAR avec authentification Auth0.

## Installation locale rapide

```bash
git clone https://github.com/Abdoulaye-Thespy/assartraining.git
cd assartraining
git checkout v0/assar-training-platform
npm install
cp .env.example .env.local
npm run dev
```

Ouvrir `http://localhost:3000`.

## Variables Auth0

Renseigner `.env.local` :

```env
AUTH0_SECRET=une-valeur-secrete-longue-et-aleatoire
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=votre-tenant.eu.auth0.com
AUTH0_CLIENT_ID=votre-client-id
AUTH0_CLIENT_SECRET=votre-client-secret
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

`AUTH0_SECRET` peut être généré avec `openssl rand -hex 32`. Ne jamais committer `.env.local`.

## Configuration Auth0

1. Auth0 Dashboard → Applications → Create Application → **Regular Web Application**.
2. Dans Settings, ajouter :
   - Allowed Callback URLs: `http://localhost:3000/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
3. Copier Domain, Client ID et Client Secret dans `.env.local`.
4. Pour le compte admin de démonstration, utiliser l’adresse définie dans `NEXT_PUBLIC_ADMIN_EMAIL`.

Le code utilise aussi les claims Auth0 suivants pour l’accès réel :
- `https://assar.org/access_level`: `free` ou `paid`
- `https://assar.org/roles`: tableau contenant `admin`

Pour la production, remplacer `APP_BASE_URL` par l’URL canonique et ajouter les mêmes URLs Auth0 en HTTPS. Les variables `AUTH0_MANAGEMENT_API_CLIENT_ID` et `AUTH0_MANAGEMENT_API_CLIENT_SECRET` ne sont pas nécessaires pour lancer l’interface locale ; elles servent uniquement aux opérations d’administration Auth0 côté serveur.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
