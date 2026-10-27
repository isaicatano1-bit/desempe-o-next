# CoSpace

CoSpace es una aplicación web de reserva de espacios de coworking construida con Next.js 16, TypeScript, Prisma y PostgreSQL. La plataforma incluye flujo de autenticación por roles, catálogo público de espacios, dashboard de usuario, gestión de reservas y panel administrativo.

## Stack principal

- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- JWT con cookies HttpOnly
- Vitest para pruebas

## Funcionalidades principales

### Autenticación y roles
- Registro e inicio de sesión para usuarios normales y administradores.
- Roles soportados:
  - USER
  - ADMIN
- Redirección automática según el rol.
- Protección de rutas por nivel de acceso.
- Admin restringido al panel administrativo y bloqueado fuera de /admin.

### Catálogo público
- Vista de espacios disponibles.
- Filtros básicos por tipo y capacidad.
- Tarjetas de espacios con información clave y disponibilidad.
- Enlace a detalle del espacio.

### Reservas
- Creación de reservas desde la UI pública.
- Validaciones de negocio implementadas:
  - duración mínima y máxima: 1 a 4 horas completas
  - horario permitido: 07:00 a 21:00
  - máximo 30 días en el futuro
  - sin solapamientos con otras reservas
  - máximo 3 reservas futuras por usuario
  - cancelación permitida solo hasta 2 horas antes del inicio

### Dashboard del usuario
- Consulta y filtro de reservas por estado.
- Vista de reservas activas, pasadas y canceladas.
- Cancelación de reservas con validación de negocio.
- Resumen general del gasto y próximas reservas.

### Panel administrativo
- Vista exclusiva para administradores.
- Gestión de espacios y reservas desde el panel privado.
- Logout funcional desde el admin layout.
- Aislamiento del panel para que no muestre la navegación pública.

### UX y calidad
- Header con selector de idioma (es/en).
- Feedback al usuario en acciones de reserva y cancelación.
- Manejo de errores y mensajes claros en formularios.
- Protección de rutas e integración con cookies de sesión.

## Estructura del proyecto

```text
.
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   │   ├── (admin)/
│   │   ├── (private)/
│   │   ├── (public)/
│   │   ├── api/
│   │   └── explore/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── reservations/
│   ├── lib/
│   ├── types/
│   └── i18n/
├── docker-compose.test.yml
├── next.config.ts
├── package.json
├── proxy.ts
├── tsconfig.json
├── vitest.config.ts
├── .env.local.example (si se usa en tu entorno)
└── README.md
```

## Variables de entorno

Crea un archivo .env.local con lo siguiente:

```bash
DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db"
JWT_ACCESS_SECRET="tu_secret_de_acceso_muy_seguro"
JWT_REFRESH_SECRET="tu_secret_de_refresh_muy_seguro"
```

### Recomendaciones
- En desarrollo puedes usar valores temporales pero con longitud suficiente.
- En producción usa secretos robustos y completamente distintos.
- No compartas estas variables en repositorios públicos.

## Base de datos

El proyecto usa Prisma con PostgreSQL. Los modelos principales son:

- User
- Space
- Reservation
- RefreshToken

### Generación del cliente Prisma

```bash
npx prisma generate
```

### Migraciones

Si la base de datos está vacía o necesitas sincronizarla:

```bash
npx prisma migrate deploy
```

Si quieres crear una nueva migración localmente:

```bash
npx prisma migrate dev
```

## Ejecutar la app localmente

### 1. Instalar dependencias

```bash
npm install
```

### 2. Levantar PostgreSQL para pruebas

```bash
docker compose -f docker-compose.test.yml up -d
```

### 3. Configurar variables de entorno

Asegúrate de tener .env.local con DATABASE_URL y secretos JWT.

### 4. Iniciar app en modo desarrollo

```bash
npm run dev
```

La aplicación quedará disponible normalmente en:

```text
http://localhost:3000
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run prisma:seed
```

## Pruebas

El proyecto incluye pruebas de validación para el flujo de protección de rutas y autenticación.

Ejecuta:

```bash
npm run test
```

## Reglas del flujo de seguridad

Se añadió una capa de control de acceso para administrar la navegación:

- usuarios con rol ADMIN no pueden entrar a rutas públicas de usuario
- usuarios con rol USER no pueden ingresar al panel administrativo
- rutas de login/registro redirigen según el rol autenticado
- rutas privadas requieren sesión válida

## Flujo principal de usuario

### Visitante
- llega a la home y puede explorar espacios
- puede registrarse o iniciar sesión

### Usuario autenticado
- entra a /explorar y /dashboard
- puede reservar espacios
- puede cancelar reservas con validación de reglas

### Administrador autenticado
- entra a /admin
- gestiona contenido y permisos del sistema
- queda bloqueado fuera del área administrativa

## Cambios agregados en este proyecto

Entre las mejoras incorporadas están:

- autenticación con JWT y cookies
- validación por rol junto con middleware de redirección
- panel de administración aislado
- flujo completo de reservas con reglas de negocio
- dashboard con filtros reales
- selector de idioma
- mejora de UX y mensajes de feedback en acciones reales
- integración con Prisma para reservas y espacios

## Notas importantes

- El proyecto usa un enfoque de App Router en Next.js.
- La lógica de autorización está centralizada para evitar rutas inseguras.
- El archivo proxy.ts actúa como gate principal para rutas protegidas.
- El modelo de base de datos define entidades clave para operar la plataforma con consistencia.

## Créditos

Proyecto desarrollado para CoSpace como una plataforma de coworking con gestión de espacio y reservas.
