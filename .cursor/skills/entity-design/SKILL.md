---
name: entity-design
description: Guides conceptual design of persistence entities with a clear identifier and UTC lifecycle timestamps. Use when modeling entities, tables, or domain records that map to storage.
disable-model-invocation: true
---

# Diseño de entidades

## Qué cubre

Criterios conceptuales al definir una entidad; no prescribe librerías, ORM ni sintaxis.

## Criterio central

Una buena entidad tiene dos cosas: un identificador claro y dos columnas created at y updated at, tratados con timestamp con tiempo y universalizada utc.

- **Identificador**: Debe ser inequívoco en el dominio de esa fila (quién o qué es ese registro frente a otros).
- **Marcas temporales**: Reflejan cuándo se creó y cuándo se actualizó por última vez; el significado es tiempo absoluto en UTC, no hora local ni zona implícita del servidor.

## Qué no incluye esta skill

Patrones de código, decoradores, tipos concretos de columna u opciones de migración: dependen del stack y se deciden fuera de esta guía.
