const User = require('../model.js/User')
const Item = require('../model.js/Item')
const Order = require('../model.js/Order')
const { UserInputError } = require('apollo-server');

const Query = {
    users: async(parent, args) => {
       const user = await User.find({})
       return user
    },
    user: async(parent, { emailAddress }) => {
        const user = await User.findOne({ emailAddress })
        if(!user) {
            throw new UserInputError('There is no user with that email')
        } else {
            return user
        }
    },
    items: async() => {
        const items = await Item.find({})
        return items
    },
    order: async(parent, args, ctx) => {
        if(!ctx.user) {
            throw new UserInputError('You are not an authorised user')
        } else {
            const order = await Order.find({ userId: ctx.user._id})
            return order
        }
    }
}


module.exports = Query