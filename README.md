# Cafeta UABC

App móvil de cafetería universitaria para pedir desde el celular.

## Requisitos

- Node.js 18+
- npm

## Backend

```bash
cd cafeteria-backend
npm install
npx nest start --watch
```

El API corre en `http://localhost:3000`.

## Frontend

```bash
cd cafeteria-front
npm install
```

Crea un archivo `.env` en `cafeteria-front/` con tu IP local:

```
EXPO_PUBLIC_API_URL=http://TU_IP:3000
```

```bash
npx expo start
```

Escanea el código QR con Expo Go en tu celular.

## Seed Data

```bash
cd cafeteria-backend
npx ts-node src/prisma/seed.ts
```

### Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| admin@cafeteria.com | admin123 | ADMIN |
| juan@correo.com | 123456 | ESTUDIANTE |
