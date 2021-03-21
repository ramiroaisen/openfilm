require("source-map-support").install();

const server = require("./server/dist/server");

/*
const community = process.env.COMMUNITY_DEV_BUILD ?
  require("./community/__sapper__/dev/server/server").middleware :
  require("./community/__sapper__/build/server/server").middleware;

const admin = process.env.ADMIN_DEV_BUILD ?
  require("./admin/__sapper__/dev/server/server").middleware :
  require("./admin/__sapper__/build/server/server").middleware;
*/

const app = process.env.APP_DEV_BUILD ?
  require("./app/__sapper__/dev/server/server").middleware :
  require("./app/__sapper__/build/server/server").middleware;


server.start({ app });