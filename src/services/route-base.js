const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/' :
    '//localhost:3034/api/'

export default BASE_URL

