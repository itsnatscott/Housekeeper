

var RoomsCollection = Backbone.Collection.extend({
	model: Room,
	url: '/housekeepers/floors/:flid/rooms'
})


var FloorsCollection = Backbone.Collection.extend({
	model: Floor,
	url: '/housekeepers/floors'
});

var floors = new FloorsCollection();
	// floors.fetch();


var rooms = new RoomsCollection();
rooms.fetch();


// var RoomsCollection = Backbone.Collection.extend({
// 	model: Room,
// 	url: 'user/rooms'
// });

// var ToDosCollection = Backbone.Collection.extend({
// 	model: ToDo,
// 	url: 'user/todos'
// })
