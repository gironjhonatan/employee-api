-- Tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL
);

-- Tabla de empleados
CREATE TABLE empleado (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50),
  fecha_ingreso DATE,
  salario NUMERIC,
  user_id INTEGER UNIQUE REFERENCES users(id)
);

-- Tabla de solicitudes
CREATE TABLE solicitud (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50),
  descripcion VARCHAR(50),
  resumen VARCHAR(50),
  id_empleado INTEGER REFERENCES empleado(id) 
);