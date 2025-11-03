import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save,
}


const bugs = readJsonFile('./data/bug.json')


function query() {
    return Promise.resolve(bugs)
}


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
        const idx = bugs.findIndex(c => c._id === bug._id)
        if (idx === -1) return Promise.reject('Bug not found')
        bugs[idx] = bug
    } else {
        bug._id = makeId()
        bugs.push(bug)
    }
    return _saveBugs()
        .then(() => bug)
}


function _saveBugs() {
    return writeJsonFile('./data/bug.json', bugs)
}
