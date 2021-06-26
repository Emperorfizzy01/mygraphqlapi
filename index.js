const { ApolloServer, UserInputError } = require("apollo-server");
const typeDefs = require("./schema")
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const { authenticate } = require('./config/auth')




// Load config
dotenv.config({ path: './config/config.env'});

connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Mutation,
    Query
  },
  async context({ req }) {
      const user = await authenticate(req)
      return { user }
    }
  //   // get the user token from the headers
  // const token = req.headers.authentication || '';

  // // try to retrieve a user with the token
  // const user = getUser(token);

  // // optionally block the user
  // // we could also check user roles/permissions here
  // if (!user) throw new UserInputError('you must be logged in');	

  // // add the user to the context
  // return { user };
  
})

const PORT = process.env.PORT || 3000
// The `listen` method launches a web server.
server.listen(PORT, () => {
  console.log(`🚀  Server ready at ${process.env.PORT}`);
})