// A dismissible notice. The status region stays in the DOM, so a message
// added later (like "Deleted …" on the list) is announced politely.
const Flash = ({ message, onDismiss, tone = 'success' }) => (
    <div role="status" className="flash-region">
        {message && (
            <p className={`flash flash-${tone}`}>
                <span>{message}</span>
                <button type="button" className="flash-close" onClick={onDismiss} aria-label="Dismiss message">×</button>
            </p>
        )}
    </div>
)

export default Flash
