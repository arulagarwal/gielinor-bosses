// Renders exactly one of loading / error / empty / content, and keeps a
// polite live region in the DOM the whole time so screen readers hear when
// the content changes. The region has to exist before its text changes, or
// some screen readers never announce it, which is why it's always rendered.
const AsyncSection = ({
    status,
    error,
    retry,
    isEmpty,
    label,
    messages,
    skeleton,
    empty,
    errorExtra,
    children
}) => {
    const announcement =
        status === 'loading' ? messages.loading
        : status === 'error' ? `Error: ${error?.message ?? 'something went wrong'}`
        : isEmpty ? messages.empty
        : messages.success

    return (
        <section aria-label={label} aria-busy={status === 'loading'} className="async-section">
            <p role="status" className="visually-hidden">{announcement}</p>

            {status === 'loading' && skeleton}

            {status === 'error' && (
                <article className="state-card state-error">
                    <h2>Couldn't load this</h2>
                    <p>{error?.message ?? 'Something went wrong.'}</p>
                    <div className="state-actions">
                        <button type="button" onClick={retry}>Try again</button>
                        {errorExtra}
                    </div>
                </article>
            )}

            {status === 'success' && isEmpty && (
                <article className="state-card state-empty">{empty}</article>
            )}

            {status === 'success' && !isEmpty && children}
        </section>
    )
}

export default AsyncSection
