import { useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import LoadoutPreview from './LoadoutPreview.jsx'
import { totalPrice, formatGp } from '../utilities/calcPrice.js'
import {
    NAME_MAX,
    REQUIRED_SLOTS,
    SLOTS,
    SLOT_LABELS,
    disabledReason,
    emptySelection,
    findProblems,
    toRequestBody
} from '../utilities/validation.js'

// One option in a slot's radio group: icon, name and price. A disabled option
// says why, so the stretch-goal blocking is never a mystery.
const OptionCard = ({ name, value, checked, onChange, option, reason }) => (
    <label className={`option-card${checked ? ' checked' : ''}${reason ? ' disabled' : ''}`}>
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={Boolean(reason)}
        />
        {option
            ? <img src={option.image} alt="" loading="lazy" />
            : <span className="option-none" aria-hidden="true">∅</span>}
        <span className="option-text">
            <span className="option-name">{option ? option.name : 'Nothing'}</span>
            <span className="option-price">{option ? formatGp(option.priceGp) : '0 gp'}</span>
            {reason && <span className="option-reason">{reason}</span>}
        </span>
    </label>
)

// The builder, shared by the create and edit pages. gear is every option from
// /api/gear. onSubmit gets the request body and returns the API's promise; if
// it rejects, the server's message (and any per-field problems) are shown.
const LoadoutForm = ({ gear, initialName = '', initialSelection = emptySelection(), submitLabel, cancelTo, onSubmit }) => {
    const formId = useId()
    const errorRef = useRef(null)

    const [name, setName] = useState(initialName)
    const [selection, setSelection] = useState(initialSelection)
    const [attempted, setAttempted] = useState(false)
    const [saving, setSaving] = useState(false)
    const [serverError, setServerError] = useState(null)

    const gearById = useMemo(() => new Map(gear.map(option => [option.id, option])), [gear])
    const gearBySlot = useMemo(
        () => Object.fromEntries(SLOTS.map(slot => [slot, gear.filter(option => option.slot === slot)])),
        [gear]
    )

    const items = Object.fromEntries(SLOTS.map(slot => [slot, gearById.get(selection[slot]) ?? null]))
    const total = totalPrice(selection, gearById)
    const problems = findProblems(name, selection, gearById)

    // A clash between the weapon and off-hand is shown as soon as it happens
    // (the early alert). Missing fields wait until the first save attempt, so
    // a fresh form doesn't open covered in errors.
    const shown = attempted ? problems : problems.filter(problem => problem.field === 'offhand')
    const problemFor = (field) => shown.find(problem => problem.field === field)

    const choose = (slot, id) => {
        setSelection(current => ({ ...current, [slot]: id }))
        setServerError(null)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setAttempted(true)
        setServerError(null)

        if (problems.length > 0) {
            errorRef.current?.focus()
            return
        }

        setSaving(true)
        try {
            await onSubmit(toRequestBody(name, selection))
        } catch (error) {
            setServerError(error)
            setSaving(false)
            // The alert region is always rendered, so it can take focus now.
            errorRef.current?.focus()
        }
    }

    const blocking = attempted && problems.length > 0

    return (
        <form className="loadout-builder" onSubmit={handleSubmit} noValidate>
            <aside className="builder-preview">
                <LoadoutPreview items={items} total={total} live />
            </aside>

            <div className="builder-fields">
                {/* Always in the DOM so screen readers announce it when it fills in. */}
                <div id={`${formId}-errors`} ref={errorRef} tabIndex={-1} role="alert" className="form-errors-region">
                    {(serverError || blocking) && (
                        <article className="form-errors">
                            <h2>Can't save this loadout</h2>
                            {serverError
                                ? (
                                    <ul>
                                        {(serverError.problems?.length ? serverError.problems : [{ message: serverError.message }])
                                            .map((problem, index) => <li key={index}>{problem.message}</li>)}
                                    </ul>
                                )
                                : <ul>{problems.map(problem => <li key={problem.field}>{problem.message}</li>)}</ul>}
                        </article>
                    )}
                </div>

                <label htmlFor={`${formId}-name`}>
                    Loadout name
                    <input
                        id={`${formId}-name`}
                        type="text"
                        value={name}
                        maxLength={NAME_MAX}
                        placeholder="e.g. Bandos tank"
                        autoComplete="off"
                        onChange={(event) => { setName(event.target.value); setServerError(null) }}
                        aria-invalid={problemFor('name') ? true : undefined}
                        aria-describedby={problemFor('name') ? `${formId}-name-error` : undefined}
                    />
                    {problemFor('name') && <small id={`${formId}-name-error`} className="field-error">{problemFor('name').message}</small>}
                </label>

                {SLOTS.map(slot => {
                    const required = REQUIRED_SLOTS.includes(slot)
                    const problem = problemFor(slot)
                    const groupName = `${formId}-${slot}`

                    return (
                        <fieldset key={slot} className="slot-group" aria-invalid={problem ? true : undefined}>
                            <legend>
                                {SLOT_LABELS[slot]}{' '}
                                <span className="muted">{required ? '(required)' : '(optional)'}</span>
                            </legend>

                            {problem && (
                                <p className="field-error slot-error" role={slot === 'offhand' ? 'alert' : undefined}>
                                    {problem.message}
                                    {slot === 'offhand' && selection.offhand && (
                                        <button type="button" className="outline secondary" onClick={() => choose('offhand', null)}>
                                            Remove off-hand
                                        </button>
                                    )}
                                </p>
                            )}

                            <div className="option-grid">
                                {!required && (
                                    <OptionCard
                                        name={groupName}
                                        value=""
                                        checked={selection[slot] === null}
                                        onChange={() => choose(slot, null)}
                                        option={null}
                                    />
                                )}
                                {gearBySlot[slot].map(option => {
                                    const checked = selection[slot] === option.id
                                    return (
                                        <OptionCard
                                            key={option.id}
                                            name={groupName}
                                            value={option.id}
                                            checked={checked}
                                            onChange={() => choose(slot, option.id)}
                                            option={option}
                                            // Never disable the current choice, or it couldn't be seen or changed.
                                            reason={checked ? null : disabledReason(option, selection, gearById)}
                                        />
                                    )
                                })}
                            </div>
                        </fieldset>
                    )
                })}

                <div className="form-actions">
                    <button type="submit" aria-busy={saving} disabled={saving}>
                        {saving ? 'Saving…' : submitLabel}
                    </button>
                    {cancelTo && <Link to={cancelTo} role="button" className="secondary outline">Cancel</Link>}
                </div>
            </div>
        </form>
    )
}

export default LoadoutForm
