import axios from 'axios';

export const customBaseQuery = async (args, api, extraOptions) => {
    const { url, method, data, body, params, headers } = args;

    // СМЕНА API URL
    const baseUrl = 'http://127.0.0.1:8080/api/';
    try {
        const result = await axios({
            url: baseUrl + url,
            method,
            data: body ?? data,
            params,
            headers: {
              ...headers,
              'Content-Type': 'application/json; charset=UTF-8'
            },
        });
        return { data: result.data };
    } catch (err) {
        console.log(err);
        // if (err?.response?.status === 401 || err?.status === 401) {
        //     if (window.location.pathname !== '/auth') {
        //         window.location.href = '/auth';
        //     }
        // }
        return {
            error: {
                data: err?.response?.data,
                summary: err?.response?.statusText || err?.data?.message,
                code: err?.response?.status || err?.status,
                text: err?.response?.data?.error || err?.response?.data?.message || err.message,
            }
        };
    }
}
