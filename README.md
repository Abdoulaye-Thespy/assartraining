# ASSAR Training

Plateforme de formations vidéo ASSAR avec NextAuth.js avec le Credentials Provider pour le démarrage local.

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

## Variables locales NextAuth.js Credentials

Copier `.env.example` vers `.env.local`, générer un hash bcrypt, puis renseigner :

```bash
openssl rand -hex 32
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('ChangeMe123!', 10).then(console.log)"
```

```env
NEXTAUTH_SECRET=une-valeur-secrete-longue-et-aleatoire
NEXTAUTH_URL=http://localhost:3000
APP_BASE_URL=http://localhost:3000
AUTH_USERS_JSON='[{"id":"admin-1","name":"Admin ASSAR","email":"admin@assar.org","passwordHash":"COLLER_LE_HASH_BCRYPT","accessLevel":"paid","isAdmin":true}]'
```

Ajoutez d’autres apprenants dans le tableau JSON avec `accessLevel` à `free` ou `paid`. Ne jamais committer `.env.local`.

## Démarrage

```bash
pnpm install
pnpm dev
```

Puis ouvrez `http://localhost:3000/login`.

## Auth0

Auth0 n’est pas utilisé par le flux Credentials actuel. Il pourra être réactivé ensuite comme provider OAuth sans changer l’interface.

1. Auth0 Dashboard → Applications → Create Application → **Regular Web Application**.
2. Dans Settings, ajouter :
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback/auth0`
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
