// import { utilService } from './util.service.js'
// import { storageService } from './async-storage.service.js'

const BASE_URL = '/api/bug'
// const BUG_KEY = 'bugs'

// _createBugs()

export const bugService = {
    query,
    get,
    remove,
    save,
    getEmptyBug,
    getDefaultFilter,
}

function query(filterBy = {}) {
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.severity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
            }
            return bugs
        })
}

function get(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)
}


function remove(bugId) {
    return axios.get(BASE_URL + '/' + bugId + '/remove')
}


function save(bug) {
    const queryStr = '/save?' +
        `title=${bug.title}&` +
        `severity=${bug.severity}&` +
        `id=${bug._id || ''}`


    return axios.get(BASE_URL + queryStr)
        .then(res => res.data)
}


function getEmptyBug(title = '', severity = '') {
    return { title, severity }
}


function getDefaultFilter() {
    return { txt: '', minseverity: '' }
}


// function _createBugs() {
//     let bugs = utilService.loadFromStorage(BUG_KEY)
//     if (!bugs || !bugs.length) {
//         bugs = []
//         bugs.push(_createBug('Cannot reload data', 3))
//         bugs.push(_createBug('Cannot upload image', 5))
//         bugs.push(_createBug('Cannot save item', 8))
//         bugs.push(_createBug('Cannot edit itm', 7))
//         utilService.saveToStorage(BUG_KEY, bugs)
//     }
// }


// function _createBug(title, severity = 5) {
//     const bug = getEmptyBug(title, severity)
//     bug._id = utilService.makeId()
//     bug.description = utilService.makeLorem(5)
//     bug.createdAt = Date.now()
//     return bug
// }
