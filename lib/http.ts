export const AUTH_STORAGE_KEY = "petsetu_auth_v1";
export const AUTH_SESSION_COOKIE_NAME = "ps_access_token";
export const AUTH_LOGOUT_EVENT = "petsetu:auth-logout";

export function isUnauthorizedStatus(status: number) {
    return status === 401;
}

export function createUnauthorizedError(message = "Unauthorized") {
    const error = new Error(message) as Error & { status?: number };
    error.status = 401;
    return error;
}

export function clearAuthSession() {
    if (typeof window === "undefined") return;

    try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
        // ignore storage access errors
    }

    try {
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const trimmed = cookie.trim();
            if (!trimmed) continue;

            const [name] = trimmed.split("=");
            if (!name) continue;

            if (name === AUTH_SESSION_COOKIE_NAME || name.startsWith("ps_")) {
                document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            }
        }
    } catch {
        // ignore cookie access errors
    }

    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));

    void fetch("/api/auth/session", { method: "DELETE" }).catch(() => { });
}

export function installAuth401Interceptor() {
    if (typeof window === "undefined") return () => { };

    const originalFetch = window.fetch.bind(window);
    const wrappedFetch: typeof fetch = async (input, init) => {
        const response = await originalFetch(input, init);

        if (response && isUnauthorizedStatus(response.status)) {
            clearAuthSession();
        }

        return response;
    };

    window.fetch = wrappedFetch;

    return () => {
        window.fetch = originalFetch;
    };
}
