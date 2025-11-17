import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save,
}


const bugs = readJsonFile('./data/bug.json')

function query(queryOptions) {
    const { filterBy, sortBy, pagination } = queryOptions 
    var bugsToReturn = [ ...bugs ]

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToReturn = 
            bugsToReturn.filter(bug => regExp.test(bug.title))
    }


    if (filterBy.minSeverity) {
        bugsToReturn = 
            bugsToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
    }


    if (filterBy.labels && filterBy.labels.length > 0) {
        bugsToReturn = 
            bugsToReturn.filter(bug => 
                filterBy.labels.some(label => bug?.labels?.includes(label)))
    }


    if (sortBy.sortField === 'severity' || sortBy.sortField === 'createdAt') {
        const { sortField } = sortBy


        bugsToReturn.sort((bug1, bug2) => 
            (bug1[sortField] - bug2[sortField]) * sortBy.sortDir)
    } else if (sortBy.sortField === 'title') {
        bugsToReturn.sort((bug1, bug2) => 
            (bug1.title.localeCompare(bug2.title)) * sortBy.sortDir)
    } 


    if (pagination.pageIdx !== undefined) {
        const { pageIdx, pageSize} = pagination
        
        const startIdx = pageIdx * pageSize
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + pageSize)
    }


    return Promise.resolve(bugsToReturn)
}


// function query() {
//     return Promise.resolve(bugs)
// }

// function query(filterBy = {}) {
//     let filteredBugs = bugs

// 	if (filterBy.txt) {
// 		const regExp = new RegExp(filterBy.txt, 'i')
// 		filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
// 	}


// 	if (filterBy.minSeverity) {
// 		filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
// 	}


// 	// if (filterBy.paginationOn) {
// 	// 	const startIdx = filterBy.pageIdx * PAGE_SIZE
// 	// 	const endIdx = startIdx + PAGE_SIZE


// 	// 	filteredBugs = filteredBugs.slice(startIdx, endIdx)
// 	// }


// 	return Promise.resolve(filteredBugs)
// }



function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug not found')
        return Promise.resolve(bug)
}


function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)

    if (idx === -1) return Promise.reject('Bug not found')
    bugs.splice(idx, 1)
    
    return _saveBugs()
}


function save(bug) {

    if (bug._id) {
        const idx = bugs.findIndex(b => b._id === bug._id)
        if (idx === -1) return Promise.reject('Bug not found')
        bugs[idx] = { ...bugs[idx], ...bug } // patch
    } else {
        bug._id = makeId()
        bug.createdAt = Date.now()
        bugs.push(bug)
    }
    return _saveBugs().then(() => bug)


    // if (bug._id) {
    //     const idx = bugs.findIndex(c => c._id === bug._id)
    //     if (idx === -1) return Promise.reject('Bug not found')
    //     bugs[idx] = bug
    // } else {
    //     bug._id = makeId()
    //     bugs.push(bug)
    // }
    // return _saveBugs()
    //     .then(() => bug)
}




function _saveBugs() {
    return writeJsonFile('./data/bug.json', bugs)
}
