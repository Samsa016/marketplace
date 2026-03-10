const API_BASE_URL = 
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function getJson<T>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    console.log(`Серверный запрос к API: ${url}`);
    
    try {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            ...init,
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                ...(init?.headers || {}),
            },
        });

        if (!res.ok) {
            throw new Error(`API Error ${res.status}: ${res.statusText}`)
        }

        const json = await res.json()
        console.log(`Response from ${path}:`, json);
        
        return json as T;
    } catch (error) {
        console.error(`Failed to fetch ${url}:`, error);
        throw error;
    }
}