export const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/' :
    '//localhost:3035/api/'

export const BASE_SOCKET_URL = (process.env.NODE_ENV !== 'development') ?
    '' :
    '//localhost:3035'

