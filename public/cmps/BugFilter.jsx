import { bugService } from "../services/bug.service.remote.js"

const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const labels = bugService.getLabels()

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
        console.log(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked ? -1 : 1
                break

            case 'radio':
                value = target.value
                break              

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    function onResetSort() {
        setFilterByToEdit(prev => ({ ...prev, sortField: '', sortDir: 1 }))
    }


    function onResetFilter() {
        setFilterByToEdit(prev => ({ ...prev, txt: '', minSeverity: 0 }))
    }


    const { txt, minSeverity } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form onSubmit={onSubmitFilter}>

                <div className="filter">
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                {/* <label htmlFor="labels">Labels: </label>
                <input value={labels} onChange={handleChange} type="text" placeholder="By Labels" id="labels" name="labels" /> */}

                <button onClick={onResetFilter}>Reset Filter</button>
                </div>

                <div className="sort">
                    <label htmlFor="title">Title</label>
                    <input value="title" onChange={handleChange} type="radio" id="title" name="sortField" checked={filterByToEdit.sortField === 'title'}/>

                    <label htmlFor="severity">Severity</label>
                    <input value="severity" onChange={handleChange} type="radio" id="severity" name="sortField" checked={filterByToEdit.sortField === 'severity'}/>
                    
                    <label htmlFor="createdAt">Created at</label>
                    <input value="createdAt" onChange={handleChange} type="radio" id="createdAt" name="sortField" checked={filterByToEdit.sortField === 'createdAt'}/>
                
                <button onClick={onResetSort}>Reset Sort</button>
                </div>

                <div className="sort-dir">
                    <label htmlFor="dir" >Direction</label>
                    <input type="checkbox" id="dir" name="sortDir" checked={filterByToEdit.sortDir === -1} onChange={handleChange}/>    
                </div>

            </form>
        </section>
    )
}