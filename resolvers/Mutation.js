const User = require('../model.js/User')
const Item = require('../model.js/Item')
const Order = require('../model.js/Order')
const bcrypt = require('bcrypt')
const { UserInputError } = require('apollo-server');
const { newApiKey }  = require('../config/auth')


const Mutation = {
    addNewItem: async (parent, { name, imageUrl, price, quantity, description, category }) => {
        const item = await Item.findOne({ name })
        if(item) {
            const items = await Item.findOneAndUpdate({_id: item._id}, { quantity: item.quantity + quantity }, {new: true})
            return items
        } else {
            const newItem = await new Item({ name, imageUrl, price, quantity, description, category }).save()
            return newItem
        }
    },
    removeItem: async (parent, { id } ) => {
       await Item.deleteOne({_id: id})
       return true
    },
    signUp: async (parent, { emailAddress, firstName, lastName, password }) => {
        const user = await User.findOne({ emailAddress })
        if(user) {
            throw new UserInputError('A user with that email already exist')
        } else {
            const user = await User.create({
                emailAddress,
                firstName,
                lastName,
                password: await bcrypt.hash(password, 10)
              })
            return user
        }
    },
    removeUser: async(parent, { id} ) => {
        await User.deleteOne({ _id: id })
        return true
    },
    loginUser: async(parent, { emailAddress, password }) => {
        const user = await User.findOne({ emailAddress })
        if (!user) {
            throw new UserInputError('No user with that email')
          } 
        const valid = await bcrypt.compare(password, user.password)
        if(!valid) {
            throw new UserInputError('Invalid password')
        } else {
            return newApiKey(emailAddress)
        }
    },
    addToCart: async(parent, args , ctx) => {
      if (!ctx.user) {
          throw new UserInputError('No user')
      } else {
        const user = await User.findOneAndUpdate({_id: ctx.user._id}, { $set: { modified_on: new Date(), cart: [...args.input]}})
        return user
      }
    },
    order: async(parent, args, ctx) => {
        if(!ctx.user) {
            throw new UserInputError('No user')
        } else {
            const order = await new Order({ cart: args.input, totalPrice: args.input.totalPrice, userId: ctx.user._id }).save()
            return order
        }
    }
}
    


module.exports = Mutation