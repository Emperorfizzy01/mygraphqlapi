const { gql } = require("apollo-server");


const typeDefs = gql`

type User {
    id: ID!
    emailAddress: String!
    firstName: String!
    lastName: String!
    cart: [Item]
}

type Item {
    name: String!
    imageUrl: String!
    price: String!
    quantity: Int!
    description: String!
    category: String!
}


input ItemInput {
    name: String!
    imageUrl: String!
    price: String!
    quantity: Int!
    description: String!
    category: String!
}

type Order {
    cart: [Item!]!
    totalPrice: Int!
}

input OrderInput {
    name: String!
    imageUrl: String!
    price: String!
    quantity: Int!
    description: String!
    category: String!
    totalPrice: Int!
}

type Token {
    token: String!
}

type Query {
    users: [User!]!
    user(emailAddress: String!): User
    items: [Item!]! 
    order: [Order!]!
}

type Mutation {
    addNewItem(
        name: String!
        imageUrl: String!
        price: String!
        quantity: Int!
        description: String!
        category: String!
    ): Item,
    removeItem(id: ID!): Boolean,
    signUp(
        emailAddress: String!
        firstName: String!
        lastName: String!
        password: String!
    ): User,
    removeUser(id: ID!): Boolean!,
    loginUser(
        emailAddress: String!
        password: String!
    ): Token
    addToCart(input: [ItemInput]): User,
    order(input: OrderInput): Order
}



`;

module.exports = typeDefs