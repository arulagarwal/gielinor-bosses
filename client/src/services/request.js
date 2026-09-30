// Shared by every API service. Rejects with the server's own error message
// when there is one, so the error state can say what actually went wrong.
export const getJSON = async (url, { signal } = {}) => {
    let response

    try {
        response = await fetch(url, { signal })
    } catch (error) {
        // An abort is expected (the page changed); let useFetch ignore it.
        if (error.name === 'AbortError') throw error
        // Otherwise fetch only rejects when no response arrived at all.
        throw new Error("Couldn't reach the server. Check your connection and try again.", { cause: error })
    }

    if (!response.ok) {
        const body = await response.json().catch(() => null)
        const error = new Error(body?.error ?? `Request failed (${response.status})`)
        error.status = response.status
        throw error
    }

    return response.json()
}
