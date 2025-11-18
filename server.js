import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js'
import { authService } from './services/auth.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')


// app.put('/api/bug/:id', (req, res) => {
//     const bug = { 
//         id: req.body._id,
//         title: req.body.title || '',
//         description: req.body.description || '',
//         severity: +req.body.severity,
//         labels: req.body.labels || []
//          } 
//         //  req.body = the object that we send in post/put/delete requests
//     if (!bug.title || bug.severity === undefined) return res.status(400).send('Miss bug info')

//     bugService.save(bug)
//         .then(bug => res.send(bug))
//         .catch(err => {
//             loggerService.error(err)
//             res.status(404).send(err)
//         })
// })

app.put('/api/bug/:id', (req, res) => {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const bug = { 
        id: req.body._id,
        title: req.body.title || '',
        description: req.body.description || '',
        severity: +req.body.severity,
        labels: req.body.labels || []
         } 
    // bugService.save(bug, loggedinUser)
    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})


// app.post('/api/bug', (req, res) => {
//     const bug = { 
//         title: req.body.title,
//         description: req.body.description || '',
//         severity: +req.body.severity,
//         labels: req.body.labels || []
//          } 

//     if (!bug.title || bug.severity === undefined) return res.status(400).send('Miss bug info')

//     bugService.save(bug)
//         .then(bug => res.send(bug))
//         .catch(err => {
//             loggerService.error(err)
//             res.status(404).send(err)
//         })
// })

app.post('/api/bug', (req, res) => {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot add bug')


    const bug = { 
        title: req.body.title,
        description: req.body.description || '',
        severity: +req.body.severity,
        labels: req.body.labels || []
         } 
    // bugService.save(bug, loggedinUser)
    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})


app.get('/api/bug', (req, res) => {
    const queryOptions = parseQueryParams(req.query)
    // req.query = query params (after the ? in the url)

	bugService.query(queryOptions)
		.then(bugs => {
			res.send(bugs)
		})
		.catch(err => {
			loggerService.error('Cannot get bugs', err)
			res.status(400).send('Cannot get bugs')
		})
})


app.get('/api/bug/:id', (req, res) => {
    const bugId  = req.params.id
    const visitedBugs = req.cookies.visitedBugs || []
    // req.params = parameters (endpoint)
    if (visitedBugs.length > 2) return res.status(401).send('Wait for a bit')
    if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

    res.cookie('visitedBugs', visitedBugs, { maxAge: 7_000 } )
    console.log('User visited at the following bugs:',visitedBugs )

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})


app.delete('/api/bug/:id', (req, res) => {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot delete bug')

    const bugId = req.params.id

    // bugService.remove(bugId, loggedinUser)
    bugService.remove(bugId)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.status(204).send('OK')
        })
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})

//* Auth API
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body
    authService.checkLogin({ username, password })
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(404).send('Invalid Credentials')
        })
})


app.post('/api/auth/signup', (req, res) => {
    const { username, password, fullname } = req.body
    userService.add({ username, password, fullname })
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})


app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


// Fallback route
app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})




function parseQueryParams(queryParams) {
    const filterBy = {
        txt: queryParams.txt || '',
        minSeverity: +queryParams.minSeverity || 0,
        labels: queryParams.labels || [],
    }


    const sortBy = {
        sortField: queryParams.sortField || '',
        sortDir: +queryParams.sortDir || 1,
    }
    
    const pagination = {
        pageIdx: queryParams.pageIdx !== undefined ? +queryParams.pageIdx || 0 : queryParams.pageIdx,
        pageSize: +queryParams.pageSize || 3,
    }

    return { filterBy, sortBy, pagination }
}

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}`))
