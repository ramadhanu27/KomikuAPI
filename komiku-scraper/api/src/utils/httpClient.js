import axios from 'axios';

const USER_AGENT = process.env.USER_AGENT ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const REQUEST_TIMEOUT = Number(process.env.REQUEST_TIMEOUT ?? 15000);
const MAX_RETRY = Number(process.env.REQUEST_MAX_RETRY ?? 3);
const RETRY_DELAY = Number(process.env.REQUEST_RETRY_DELAY ?? 750);

const client = axios.create({
    timeout: REQUEST_TIMEOUT,
    headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, compress, deflate, br'
    },
    maxRedirects: 5
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error) => {
    if (!error) return false;
    const retriableCodes = ['ETIMEDOUT', 'ECONNRESET', 'ECONNABORTED', 'EHOSTUNREACH', 'ENETUNREACH', 'EAI_AGAIN'];
    if (error.code && retriableCodes.includes(error.code)) return true;
    if (error.response && error.response.status >= 500) return true;
    return false;
};

export const fetchWithRetry = async (url, config = {}) => {
    const { maxAttempts = MAX_RETRY, retryDelay = RETRY_DELAY, ...axiosConfig } = config;
    let attempt = 0;
    let lastError;

    while (attempt < maxAttempts) {
        try {
            return await client.get(url, axiosConfig);
        } catch (error) {
            lastError = error;
            attempt += 1;
            if (attempt >= maxAttempts || !shouldRetry(error)) {
                throw error;
            }
            const waitTime = retryDelay * attempt;
            await sleep(waitTime);
        }
    }

    throw lastError;
};

export default client;
