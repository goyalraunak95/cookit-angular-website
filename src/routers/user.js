const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const paytm = require('paytmchecksum')
const formidable = require('formidable')
const Order = require('../models/order')
const mongoose = require('mongoose')

const router = new express.Router()

router.post('/signup', async (req,res) => {
    
    const newUser = new User({...req.body})

    try{
        await newUser.save()
        const user = await newUser.generateAuthToken()
        res.status(201).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/login', async (req,res) => {
    try{
        user = await User.findByCredentials(req.body.name, req.body.password)
        user = await user.generateAuthToken()
        res.send(user)
    }
    catch(e){
        //console.log(e.message)
        res.status(400).send({errorMes: e.message})
    }
})

router.post('/logout', auth , async (req,res) => {
    try{
        await req.user.save()
        res.send()
    }
    catch(e) {
        res.status(500).send()
    }
})

router.get('/', auth , (req,res) => {
    res.send(req.user)
})

router.post('/bookmark', auth , async (req,res) => {
    try{
        user = req.user
        user.bookmarks = user.bookmarks.concat({recipeBookmarkedid: req.body.recipeBookmarkedid})
        user = await user.save()
        res.send(user.bookmarks)
    }
    catch(e) {
        res.status(400).send()
    }
})

router.delete('/bookmark/:id', auth , async (req,res) => {
    try{
        user = req.user
        const recipeId = req.params.id
        user.bookmarks = user.bookmarks.filter((bookmark) => {
            return bookmark.recipeBookmarkedid != recipeId
        })
        user = await user.save()
        res.send(user.bookmarks)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.post('/payment', auth ,async (req,res) => {
    const _id = mongoose.Types.ObjectId()
    const order = Order({_id, STATUS: 'PENDING', USERID: req.user._id});
    const params = {
        MID: process.env.PAYTM_MERCHANT_ID,
        WEBSITE: process.env.PAYTM_WEBSITE,
        CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
        INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE_ID,
        ORDER_ID: String(_id),
        CUST_ID: String(req.user._id),
        TXN_AMOUNT: String(req.body.amount),
        CALLBACK_URL: 'https://cookit-app-raunak.herokuapp.com/user/paymentcallback',
        EMAIL: String(req.user.email),
        MOBILE_NO: process.env.MOBILE_NO
    }

    try{
        const checksum = await paytm.generateSignature(params,process.env.PAYTM_MERCHANT_KEY)
        const paytmParams = {...params, CHECKSUMHASH: checksum}
        await order.save()
        res.send(paytmParams)
    }
    catch(e)
    {
        console.log(e)
        res.status(400).send({errorMes: e.message})
    }
})

router.post('/paymentcallback', async (req,res) => {
    const form = new formidable.IncomingForm()
    form.parse(req,async (err,fields,files) => {
        //console.log(fields)

        paytmChecksum = fields.CHECKSUMHASH;
        delete fields.CHECKSUMHASH;

        let isVerifySignature = paytm.verifySignature(fields, process.env.PAYTM_MERCHANT_KEY, paytmChecksum);
        if (isVerifySignature) {
            console.log("Checksum Matched");

            try{
                const order = await Order.findById(fields.ORDERID)
                if(order)
                {
                    order['TXNID'] = fields.TXNID
                    order['TXNAMOUNT'] = fields.TXNAMOUNT
                    order['PAYMENTMODE'] = fields.PAYMENTMODE
                    order['CURRENCY'] = fields.CURRENCY
                    order['TXNDATE'] = fields.TXNDATE
                    order['STATUS'] = fields.STATUS
                    order['RESPMSG'] = fields.RESPMSG
                    order['GATEWAYNAME'] = fields.GATEWAYNAME
                    order['BANKTXNID'] = fields.BANKTXNID
                    order['BANKNAME'] = fields.BANKNAME
                    await order.save()
                    //console.log(order)
                    //await order.populate('USERID').execPopulate()
                    //console.log(order)
                    //const token = jwt.sign({_id: order._id.to_String()},process.env.SECRET_KEY)
                    res.redirect(`/paymentinfo?id=${order._id.toString()}`)
                }
                else
                    throw new Error('Database server is down')
            }
            catch(e)
            {
                console.log(e)
            }

            // setTimeout(() => {
            //     var paytmParams = {};

            // paytmParams.body = {

            //     "mid" : fields.MID,

            //     "orderId" : fields.ORDER_ID,
            // };

            // paytm.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY).then((checksum) => {
            //     paytmParams.head = {

            //         "signature"	: checksum
            //     };

            //     var post_data = JSON.stringify(paytmParams);

            //     var options = {

            //         hostname: 'securegw-stage.paytm.in',

            //         port: 443,
            //         path: '/v3/order/status',
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Content-Length': post_data.length
            //         }
            //     };

            //     var response = "";
            //     var post_req = https.request(options,(post_res) => {
            //         post_res.on('data', (chunk) => {
            //             response += chunk;
            //         });

            //         post_res.on('end',() => {
            //             console.log('Response: ', response);
            //         });
            //     });

            //     post_req.write(post_data);
            //     post_req.end();
            // })
            // },5000)
        }
        else
            console.log("Not matched")
    })
})

router.get('/paymentStatus/:id', auth, async (req,res) => {
    const _id = req.params.id
    try{
        const order = await Order.findById(_id)
        if(order && String(req.user._id) === String(order.USERID) )
        {
            const response = {
                STATUS: order.STATUS,
                RESPMSG: order.RESPMSG
            }

            res.status(201).send(response)
        }
        else
            throw new Error('Transaction not found')
    }
    catch(e) {
        //console.log(e)
        res.status(400).send({errorMes: e.message})
    }
})


module.exports = router
