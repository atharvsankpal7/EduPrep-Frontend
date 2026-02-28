const AUTH_PUBLIC_PATHS = ["/sign-in", "/sign-up"] as const;

const APP_PUBLIC_PATHS = ["/", ...AUTH_PUBLIC_PATHS] as const;

function matchesPath(pathname: string, paths: readonly string[]): boolean {
  return paths.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

export function isAuthPublicPath(pathname: string): boolean {
  return matchesPath(pathname, AUTH_PUBLIC_PATHS);
}

export function isAppPublicPath(pathname: string): boolean {
  return matchesPath(pathname, APP_PUBLIC_PATHS);
}

export { AUTH_PUBLIC_PATHS, APP_PUBLIC_PATHS };
