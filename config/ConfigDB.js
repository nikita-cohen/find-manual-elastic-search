const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/findManual-complete').then()
    .catch(e => {
        console.log(e)
    })
