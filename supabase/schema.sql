create table if not exists public.agents (
  id text primary key,
  nombre text not null,
  rol text not null,
  estado text not null check (estado in ('idle', 'activo', 'ejecutando')),
  herramientas text[] not null default '{}',
  subagentes text[] not null default '{}',
  provider text not null default 'openrouter',
  model text not null default 'openai/gpt-4o-mini',
  system_prompt text not null default 'Eres un agente especializado.',
  temperature double precision not null default 0.6,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_agents_updated_at on public.agents;
create trigger trg_agents_updated_at
before update on public.agents
for each row
execute procedure public.set_updated_at();

create table if not exists public.tasks (
  id text primary key,
  titulo text not null default 'Nueva tarea',
  descripcion text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'en_ejecucion', 'completada', 'error')),
  prioridad text not null default 'media' check (prioridad in ('baja', 'media', 'alta')),
  requested_by text not null default 'ui',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
before update on public.tasks
for each row
execute procedure public.set_updated_at();

create table if not exists public.task_runs (
  id text primary key,
  task_id text not null references public.tasks(id) on delete cascade,
  executor text not null check (executor in ('claw', 'n8n', 'agent')),
  estado text not null check (estado in ('pendiente', 'ejecutando', 'completado', 'error')),
  input jsonb not null default '{}',
  output jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_task_runs_task_id on public.task_runs(task_id);

drop trigger if exists trg_task_runs_updated_at on public.task_runs;
create trigger trg_task_runs_updated_at
before update on public.task_runs
for each row
execute procedure public.set_updated_at();

create table if not exists public.workflows (
  id text primary key,
  nombre text not null,
  descripcion text not null default '',
  categoria text not null default 'general' check (categoria in ('general', 'marketing', 'sales', 'support', 'devops')),
  estado text not null default 'draft' check (estado in ('draft', 'active', 'archived')),
  is_template boolean not null default false,
  definition jsonb not null default '{}',
  created_by text not null default 'ui',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_workflows_categoria on public.workflows(categoria);
create index if not exists idx_workflows_estado on public.workflows(estado);

drop trigger if exists trg_workflows_updated_at on public.workflows;
create trigger trg_workflows_updated_at
before update on public.workflows
for each row
execute procedure public.set_updated_at();

create table if not exists public.workflow_runs (
  id text primary key,
  workflow_id text not null references public.workflows(id) on delete cascade,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'ejecutando', 'completado', 'error')),
  input jsonb not null default '{}',
  output jsonb,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_workflow_runs_workflow_id on public.workflow_runs(workflow_id);
create index if not exists idx_workflow_runs_estado on public.workflow_runs(estado);

drop trigger if exists trg_workflow_runs_updated_at on public.workflow_runs;
create trigger trg_workflow_runs_updated_at
before update on public.workflow_runs
for each row
execute procedure public.set_updated_at();

create table if not exists public.workflow_run_logs (
  id text primary key,
  workflow_run_id text not null references public.workflow_runs(id) on delete cascade,
  nivel text not null default 'info' check (nivel in ('info', 'warning', 'error')),
  mensaje text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_workflow_run_logs_run_id on public.workflow_run_logs(workflow_run_id);
