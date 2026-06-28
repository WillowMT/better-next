type EnvSource = Pick<NodeJS.ProcessEnv, string>;

const sslModesWithPg8VerifyFullSemantics = new Set([
  "prefer",
  "require",
  "verify-ca",
]);

export function getOptionalEnv(name: string, env: EnvSource = process.env) {
  const value = env[name]?.trim();
  return value ? value : undefined;
}

export function getEnv(name: string, env: EnvSource = process.env) {
  const value = getOptionalEnv(name, env);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function normalizeDatabaseUrl(value: string) {
  const url = new URL(value);
  const sslMode = url.searchParams.get("sslmode");

  if (sslMode && sslModesWithPg8VerifyFullSemantics.has(sslMode)) {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
}

export function getDatabaseUrl(env: EnvSource = process.env) {
  return normalizeDatabaseUrl(getEnv("DATABASE_URL", env));
}
