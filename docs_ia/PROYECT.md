# Desafío técnico — Full Stack Take Home Challenge

Este documento recoge **solo el contexto del problema** y los **criterios de evaluación**. No describe una solución; sirve como referencia para el ejercicio práctico de estudio.

---

## Descripción

Desarrollar un sistema básico de gestión de **Notificaciones** para usuarios autenticados. El sistema debe permitir que cada usuario pueda gestionar y enviar notificaciones por distintos canales.

---

## Requerimientos funcionales

### 1. Autenticación de usuarios

- Registro de usuario con email y contraseña.
- Inicio de sesión que devuelva un token de acceso.
- Los endpoints deben requerir un token válido para ser accedidos.

### 2. Gestión de notificaciones

- Crear una notificación (campos: título, contenido, canal).
- Modificar una notificación existente.
- Eliminar una notificación.
- Consultar todas las notificaciones propias.

### 3. Envío de notificación

- Cada vez que una notificación sea creada, debe ejecutarse el “envío” de la misma por el canal especificado.

**Canales disponibles:**

- Email
- SMS
- Push Notification

**Comportamiento esperado por canal (ejemplos orientativos):**

- **Email:** Validar el formato del destinatario, generar un template, registrar el envío.
- **SMS:** Limitar el contenido a 160 caracteres, registrar número y fecha de envío.
- **Push Notification:** Validar el token de dispositivo, formatear el payload, registrar el estado del envío.

La lógica debe estar preparada para que **agregar un nuevo canal no implique modificar la lógica existente** de los canales ya implementados.

---

## Requerimientos técnicos

- Base de datos relacional (PostgreSQL, MySQL, SQLite, etc.).
- API RESTful utilizando la tecnología de backend que se prefiera.
- Opcional: frontend simple para consumir los endpoints.

---

## Criterios de evaluación

Se evaluará:

- Claridad y organización del código.
- Arquitectura elegida para manejar los distintos canales de notificación y sus lógicas.
- Correcta implementación de autenticación y autorización.
- Escalabilidad y mantenibilidad del sistema.
- Uso adecuado de la base de datos.

El proyecto debe entregarse aplicando las mejores prácticas que se consideren adecuadas en código, arquitectura, seguridad y documentación.

---

## Entrega

Incluir un README con:

- Instrucciones de instalación y ejecución.
- Breve descripción de las decisiones técnicas tomadas.
