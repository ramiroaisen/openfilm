import * as sapper from 'sapper/server';

// @ts-ignore
process.env.APP_DEV_BUILD = "1";

export default sapper;

// @ts-ignore
module.exports = sapper

// @ts-ignore
if(require.main === module) { 
	//@ts-ignore
	require("../../../../run.js")
}
