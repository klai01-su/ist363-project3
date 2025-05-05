export const fetchWithRetry = async (url, options = {}, maxRetries = 3, initialDelay = 1000) => {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const response = await fetch(url, options);
        
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : initialDelay * Math.pow(2, retries);
          
          console.log(`Rate limited (429). Retrying in ${delayMs/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          retries++;
          continue;
        }
        
        if (!response.ok) {
          if (response.status === 404) {
            return { notFound: true, status: 404 };
          }
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        if (retries >= maxRetries - 1) {
          throw error;
        }
        retries++;
        const delayMs = initialDelay * Math.pow(2, retries);
        console.log(`Request failed. Retrying in ${delayMs/1000}s...`, error);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }