// Shared by every API service. Rejects with the server's own error message
// when there is one, so the error state can say what actually went wrong.
const request = async (url, init = {}) => {
    let response

    try {
        response = await fetch(url, init)
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
        // A 422 lists every rule the submission broke, keyed by field.
        error.problems = body?.problems ?? []
        throw error
    }

    return response.json()
}

export const getJSON = (url, { signal } = {}) => request(url, { signal })

// POST / PATCH / DELETE. body is sent as JSON when given.
export const sendJSON = (url, { method, body, signal } = {}) => request(url, {
    method,
    signal,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
})
