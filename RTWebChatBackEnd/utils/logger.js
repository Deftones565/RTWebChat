const info = (...params) => {
    if(process.env.NODE_ENV !== 'test'){
        console.log(...params, '\n')
    }
}

const error = (...params) => {
    if(process.env.NODE_ENV !== 'test') {
        console.error(...params, '\n')
    }
}

module.exports = {
    info, error
}