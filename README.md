# Ejercicio Node - CRUD de Usuarios

CRUD de usuarios hecho con **TypeScript**, **Programación Orientada a Objetos**,
**axios** y **json-server** como base de datos.

La clase `UserController` tiene métodos **estáticos** para:
get, getById, create, update, delete y login.
Incluye validación de **email repetido** e **identificación repetida**.

## Requisitos

- Node.js instalado (versión 18 o superior).

## Instalación

Después de clonar el repositorio:

```bash
npm install
```

Esto instala axios, typescript, json-server y los tipos de node.

## Cómo ejecutar

Necesitas **dos terminales**.

**Terminal 1** — levantar la base de datos (json-server) y dejarla abierta:

```bash
npm run db
```

**Terminal 2** — compilar el TypeScript y ejecutar el programa:

```bash
npm run dev
```

`npm run dev` hace dos cosas: compila (`tsc`) y luego ejecuta (`node dist/index.js`).

## Estructura

```
.
├── db.json                  # "base de datos" que usa json-server
├── package.json
├── tsconfig.json
└── src
    ├── user.controller.ts   # la clase UserController con el CRUD
    └── index.ts             # archivo que prueba todos los métodos
```

## Nota

Las contraseñas se guardan en texto plano solo porque es un ejercicio de aprendizaje.
En un proyecto real NUNCA se hace: se deben encriptar (por ejemplo con bcrypt).
