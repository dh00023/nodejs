module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'}
	],
	route_info: [
	],
	facebook:{
		clientID : '1530568723684515',
		clientSecret: 'b92f1354cadb4b49027c3df8814744a4',
		callbackURL : 'http://localhost:3000/auth/facebook/callback'
	}
}