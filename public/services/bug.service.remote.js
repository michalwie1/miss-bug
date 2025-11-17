
const BASE_URL = '/api/bug'
// const BUG_KEY = 'bugs'

// _createBugs()

export const bugService = {
    query,
    get,
    remove,
    save,
    // getEmptyBug,
    getDefaultFilter,
    getById,
    getLabels
}


function query(queryOptions) {
    return axios.get(BASE_URL, { params: queryOptions })
        .then(res => res.data)
}



function getById(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)
}



function get(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)
}


function remove(bugId) {
    return axios.delete(BASE_URL + '/' + bugId)
}


function save(bug) {
    const method = bug._id ? 'put' : 'post'
    const bugId = bug._id || ''
    
    return axios.put(BASE_URL + '/' + bug._id, bug)
        .then(res => res.data)
}


function getDefaultFilter() {
    return { txt: '', minSeverity: 0, labels: [], sortField: '', sortDir: 1 }
}

function getLabels(){
    return ['back', 'front', 'critical']
}

