import { useCallback, useEffect, useState } from 'react'

// Runs an async load and tracks the three states a page has to render:
// 'loading' (nothing to show yet), 'success' (data is set, possibly an empty
// list) and 'error'. `load` receives an AbortSignal; when the deps change or
// the component unmounts the request is aborted, so a slow response for an
// old page can never overwrite the current one. `retry` runs it again.
export const useFetch = (load, deps) => {
    const [state, setState] = useState({ status: 'loading', data: null, error: null })
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        const controller = new AbortController()
        setState({ status: 'loading', data: null, error: null })

        load(controller.signal)
            .then(data => setState({ status: 'success', data, error: null }))
            .catch(error => {
                if (!controller.signal.aborted) {
                    setState({ status: 'error', data: null, error })
                }
            })

        return () => controller.abort()
        // The caller's deps decide when to reload; `load` is a new function every render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, attempt])

    const retry = useCallback(() => setAttempt(n => n + 1), [])

    return { ...state, retry }
}
