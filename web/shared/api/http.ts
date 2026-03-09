import { ZodSchema } from "zod";

const API_BASE_URL = 
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function getJson<T>(
    path: string,
    schema: ZodSchema<T>,
    init?: RequestInit
): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
    });

    if (!res.ok) {
        throw new Error(`Error api_key error: ${res.status}`)
    }

    const json = await res.json()
    return schema.parse(json)

    
}