const mongoose = require('mongoose')

const schema = mongoose.Schema({
    TXNID: {
        type: String
    },
    TXNAMOUNT: {
        type: String
    },
    PAYMENTMODE: {
        type: String
    },
    CURRENCY: {
        type: String
    },
    TXNDATE: {
        type: String
    },
    STATUS: {
        type: String,
        required: true
    },
    RESPMSG: {
        type: String
    },
    GATEWAYNAME: {
        type: String
    },
    BANKTXNID: {
        type: String
    },
    BANKNAME: {
        type: String
    },
    USERID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Order = mongoose.model('Order',schema)

module.exports = Order