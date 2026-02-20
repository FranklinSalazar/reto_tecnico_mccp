# 🚀 Multi-Channel Content Processor (MCCP)

Aplicación fullstack desarrollada con Laravel 11 y React que permite redactar contenido, procesarlo mediante Inteligencia Artificial para generar un resumen ejecutivo (máx. 100 caracteres) y distribuirlo a múltiples canales de comunicación (Email, Slack Webhook y SMS SOAP).

La solución garantiza trazabilidad completa, resiliencia ante fallos y arquitectura modular para facilitar futuras extensiones.

---

## 🎯 Objetivo

Centralizar el envío de información empresarial permitiendo:

* Generación automática de resumen ejecutivo mediante IA.
* Distribución multi-canal.
* Registro detallado del estado de cada envío.
* Resiliencia ante fallos parciales.

---

## 🧠 Arquitectura de la Solución

### Backend

* Arquitectura basada en Service Layer.
* Procesamiento asíncrono mediante Jobs.
* Separación de responsabilidades por canal.
* Persistencia con trazabilidad completa.
* Manejo independiente de errores por canal.
* Cancelación del flujo si falla la IA.

### Frontend

* Formulario de envío dinámico.
* Dashboard con historial detallado.
* Consumo de API REST mediante Axios.

---


## 🔌 API Endpoints


### Crear y procesar mensaje

**POST** `/api/messages`

---

### 📥 Request Body

```json
{
  "title": "Prueba canales gh",
  "original_content": "Contenido de prueba para ser enviado por email a todos nuestros clientes",
  "channels": ["email", "slack"]
}

```

### 📤 Response

```json
{
  "message": "Mensaje en procesamiento",
  "data": {
    "id": 111,
    "title": "Prueba canales gh",
    "original_content": "Contenido de prueba para ser enviado por email a todos nuestros clientes",
    "status": "pendiente",
    "created_at": "2026-02-20T01:37:20.000000Z",
    "updated_at": "2026-02-20T01:37:20.000000Z"
  }
}
```
---

## 🗄 Modelo de Datos

### Tabla: messages

| Campo            | Descripción             |
| ---------------- | ----------------------- |
| id               | Identificador           |
| title            | Título original         |
| original_content | Contenido completo      |
| summary          | Resumen generado por IA |
| status           | Estado de respuesta AI  |
| created_at       | Fecha de creación       |

### Tabla: delivery_logs

| Campo      | Descripción               |
| ---------- | ------------------------- |
| id         | Identificador             |
| message_id | Relación con mensaje      |
| channel    | Canal (email, slack, sms) |
| status     | Estado del envío          |
| payload    | Respuesta                 |
| created_at | Fecha del intento         |

---

## 🤖 Procesamiento con Inteligencia Artificial

Se implementó un servicio `AIService` encargado de:

* Enviar el contenido al proveedor de IA.
* Generar un resumen máximo de 100 caracteres.
* Validar la respuesta.
* Cancelar el flujo completo si ocurre un error.

Si la IA falla:

* No se ejecuta ningún canal.
* Se registra el error.
* No se despachan Jobs.

---

## 📡 Simulación de Canales

Cada canal recibe el siguiente payload:

```json
{
  "title": "Título original",
  "summary": "Resumen generado por IA",
  "original_content": "Contenido completo"
}
```

### 📧 Email (Simulado REST)

* Se simula la integración.
* Se registra el payload completo en `storage/logs/laravel.log`.
* No se realiza envío real.

### 💬 Slack (Webhook)

* Se realiza un POST real a una URL configurada en `.env`.
* Se valida la recepción desde Webhook.site o Beeceptor.

Variable requerida:

```
SLACK_WEBHOOK_URL=https://webhook.site/f0e9564c-bc9f-405f-9874-feb24ce1e2f1

```

### 📱 SMS (SOAP Simulado)

* Se genera un XML estructurado conforme a SOAP.
* Se registra el XML completo en logs.
* No se realiza integración real.

---

## 🛡 Resiliencia

* Si la IA falla → No se envía ningún canal.
* Si un canal falla → Los demás continúan procesándose.
* Cada intento queda registrado en `delivery_logs`.

---

## 🔄 Procesamiento Asíncrono con Jobs

Después de generar exitosamente el resumen con IA, se despacha un Job por cada canal seleccionado:

* `SendEmailJob`
* `SendSlackJob`
* `SendSmsJob`

Cada Job:

* Ejecuta el envío del canal correspondiente.
* Maneja sus propios errores.
* Registra el resultado en `delivery_logs`.
* No afecta la ejecución de los demás canales si falla.

---

## ⚙️ Instalación Local

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configurar variables en `.env`:

```
DB_CONNECTION=mysql
DB_DATABASE=mccp
DB_USERNAME=root
DB_PASSWORD=

GEMINI_API_KEY=tu_api_key_aqui
QUEUE_CONNECTION=database
SLACK_WEBHOOK_URL=https://webhook.site/f0e9564c-bc9f-405f-9874-feb24ce1e2f1
```

Ejecutar migraciones y crear tabla de jobs:

```bash

php artisan queue:table
php artisan migrate
```

Iniciar servidor:

```bash
php artisan serve
```

### Ejecutar Worker de Colas

En otra terminal ejecutar:

```bash
php artisan queue:work
```

Este comando debe permanecer activo para que los Jobs se procesen correctamente.

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📸 Evidencias

Se incluyen capturas de:

* Generación del resumen con IA.
* Registro de payload en `laravel.log`.
* Recepción del POST en Webhook.site.
* Generación del XML SOAP.
* Peticion Postman endpoint.

Las imágenes se encuentran en:

```
/docs/images
```

---
