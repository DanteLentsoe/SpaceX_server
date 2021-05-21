const { ApolloServer, gql } = require('apollo-server');
const fetch = require("node-fetch")
    // The GraphQL schema
const typeDefs = gql `
  type Launches{
     flight_number: Int
     mission_name: String
     upcoming: Boolean
     launch_year: String
     launch_date_unix: String
     launch_date_utc: String
     launch_success: Boolean
     launch_date_local: String
     is_tentative: Boolean
     tentative_max_precision: String
     tbd: Boolean
     launch_window: Int
     details: String
     rocket: Rocket
  }
    type Rocket {
      rocket_id: String
      rocket_name: String
      rocket_type: String
 }

type SingleLaunch {
  flight_number: Int
}
  type Query{
    launches: [Launches]
    launch: SingleLaunch
  }
`;

let Launch_Data;
let Single_Launch_Data;

 fetch("https://api.spacexdata.com/v3/launches")
    .then(launches => launches.json())
    .then(responseInfo => {
        Launch_Data = responseInfo
    })

fetch(`https://api.spacexdata.com/v3/launches/${1}`)
    .then(launch => launch.json())
    .then(responseInfo => {
        Launch_Data = responseInfo
    })
    // A map of functions which return data for the schema.
const getLaunchData = () => {
   return Launch_Data
}

const getSingleLaunchData = () => {
   return Single_Launch_Data
}

const resolvers = {
    Query: {
        launches: () => getLaunchData(),
        launch: () => getSingleLaunchData(),
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});