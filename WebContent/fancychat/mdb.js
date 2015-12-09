var assert = require('assert');

module.exports = function(db, callback){
	db.dropDatabase();
	for(var i = 1; i <=10 ; i++){
		db.collection('rooms').insertOne( {
				"name" : "Room" + i,
				"description" : "Room " + i,
				"id" : i,
				"createdDate" : new Date(),
				"createdBy" : "Owner" + i
		}, function(err, result) {
			assert.equal(err, null);
			console.log("Inserted a document into the rooms collection.");
			callback(result);
		});
	}
	for(var j = 1; j <=100 ; j++){
		db.collection('users').insertOne( {
				"address" : {
					 "street" : "2 Avenue",
					 "zipcode" : "10075",
					 "building" : "1480",
					 "coord" : [ -73.9557413, 40.7720266 ],
				},
				"fname" : "User" + j,
				"fname" : "LUser" + j,
				"id" : j,
				"createdDate" : new Date(),
				"createdBy" : "Owner" + j,
				rooms: [j%10, j%10+1]
		}, function(err, result) {
//					assert.equal(err, null);
			console.log("Inserted a document into the users collection.");
			callback(result);
		});
	}
	return {
		init: function(){
		}
	};
};
