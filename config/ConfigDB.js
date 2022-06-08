const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/findManual_full_two').then()
    .catch(e => {
        console.log(e)
    })
