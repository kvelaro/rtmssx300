module.exports = {
    getYear: (date) => {
        return date.getFullYear().toString().substr(-2);
    },
    getMonth: (date) => {
        return ('0' + (date.getMonth()+1)).slice(-2);
    },
    getDate: (date) => {
        return ('0' + (date.getDate())).slice(-2);
    },
    getDay: (date) => {
        return ('0' + (date.getDay())).slice(-2);
    },
    getHours: (date) => {
        return ('0' + (date.getHours())).slice(-2);
    },
    getMinutes: (date) => {
        return ('0' + (date.getMinutes())).slice(-2);
    },
    getSeconds: (date) => {
        return ('0' + (date.getSeconds())).slice(-2);
    },
    getFormatted: (date) => {
        let customDate = 
            date.getFullYear() + '-' +
            ('0' + (date.getMonth()+1)).slice(-2) + '-' + 
            ('0' + (date.getDate())).slice(-2) + ' ' +
            ('0' + (date.getHours())).slice(-2) + ':' + 
            ('0' + (date.getMinutes())).slice(-2) + ':' + 
            ('0' + (date.getSeconds())).slice(-2);
        return customDate
    }
}