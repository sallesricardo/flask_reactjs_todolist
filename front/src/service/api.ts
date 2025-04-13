const API_URL = 'http://localhost:5000/api';

type Methods = 'GET' | 'POST';

export class Api {

    static async fetch(method: Methods, path: string, query?: Record<string, string>,params?: Record<string, string>, headers?: Record<string, string>) {
        const queryString = query ? Object.entries(query).map((item) => `${item[0]}=${item[1]}`).join('&') : '';
        const response = await fetch(`${API_URL}${path}${queryString ? `?${queryString}` : ''}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            ...(params ? { body: JSON.stringify(params) } : {}),
        });
        return response;
    }

    static async post(path: string, params?: Record<string, string>, headers?: Record<string, string>) {
        return await Api.fetch('POST', path, undefined, params, headers);
    }

    static async get(path: string, params?: Record<string, string>, headers?: Record<string, string>) {
        return await Api.fetch('GET', path, params, undefined, headers);
    }
};
