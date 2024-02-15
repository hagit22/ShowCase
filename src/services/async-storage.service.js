export const storageService = {
    query,
    get,
    getByName,
    post,
    put,
    remove,
}

function query(entityType, delay = 500) {
    var entities = JSON.parse(localStorage.getItem(entityType)) || []
    return new Promise(resolve => setTimeout(() => resolve(entities), delay))
}

function get(entityType, entityId) {
    try {
        return query(entityType).then(entities => {
            const entity = entities.find(entity => entity._id === entityId)
            if (!entity) throw new Error(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
            return entity
        })
    }
    catch (err) {
        console.log("user.service exception - :",err)
        return null
    }
}

function getByName(entityType, entityName) {
    try {
        return query(entityType).then(entities => {
            const entity = entities.find(entity => entity.username.toLowerCase() === entityName.toLowerCase())
            if (!entity) throw new Error(`Get failed, cannot find entity with name: ${entityName} in: ${entityType}`)
            return entity
        })
    }
    catch (err) {
        console.log("user.service exception - :",err)
        return null
    }
}

function post(entityType, newEntity) {
    newEntity = JSON.parse(JSON.stringify(newEntity))    
    newEntity._id = _makeId()
    return query(entityType).then(entities => {
        entities.push(newEntity)
        _save(entityType, entities)
        return newEntity
    })
}

function put(entityType, updatedEntity) {
    try {
        updatedEntity = JSON.parse(JSON.stringify(updatedEntity))    
        return query(entityType).then(entities => {
            const idx = entities.findIndex(entity => entity._id === updatedEntity._id)
            if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${updatedEntity._id} in: ${entityType}`)
            entities.splice(idx, 1, updatedEntity)
            _save(entityType, entities)
            return updatedEntity
        })
    }
    catch (err) {
        console.log("user.service exception - :",err)
        return null
    }
}

async function remove(entityType, entityId) {
    try {
        const entities = await query(entityType)
        const idx = entities.findIndex(entity => entity._id === entityId)
        if (idx < 0)
            throw new Error(`Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        entities.splice(idx, 1)
        _save(entityType, entities)
    }
    catch (err) {
        console.log("user.service exception - :",err)
        return null
    }
}

// Private functions

function _save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}