-- Crear la tabla de empleados
create table empleados (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  cargo text not null,
  departamento text not null,
  salario decimal not null,
  fecha_contratacion date not null default current_date
);

-- Habilitar RLS (Row Level Security)
alter table empleados enable row level security;

-- Eliminar políticas existentes si las hay
drop policy if exists "Usuarios autenticados pueden ver empleados" on empleados;
drop policy if exists "Usuarios autenticados pueden insertar empleados" on empleados;
drop policy if exists "Usuarios autenticados pueden actualizar empleados" on empleados;
drop policy if exists "Usuarios autenticados pueden eliminar empleados" on empleados;

-- Crear política para permitir todas las operaciones (temporalmente para pruebas)
create policy "Enable all operations for all users" on empleados
  for all
  using (true)
  with check (true); 