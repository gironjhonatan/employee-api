PostgreSQL: Base de datos employees_db - puerto 5432
pgAdmin: Interfaz web para manejar PostgreSQL http://localhost:8080
Backend: Servidor Node.js (API) http://localhost:4000

PostgreSQL
POSTGRES_USER: admin
POSTGRES_PASSWORD: 123456
POSTGRES_DB: employees_db

pgAdmin
PGADMIN_DEFAULT_EMAIL: admin@admin.com
PGADMIN_DEFAULT_PASSWORD: admin123

PORT: 4000
DATABASE_URL: postgres://admin:123456@db:5432/employees_db
JWT_SECRET: supersecretkey

Levantar los servicios
docker-compose up --build
Detener los servicios
docker-compose down

Iniciará:
La base de datos PostgreSQL
La interfaz de administración pgAdmin (puerto 8080)
El backend de Node.js (puerto 4000)

Añadir un server en pgAdmin conexión con:
Host: db
User: admin
Password: 123456

Tests
npm install --save-dev jest node-mocks-http
Ejecutar los tests con:
npm test