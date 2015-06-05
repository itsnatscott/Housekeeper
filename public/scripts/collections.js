
console.log('housekeepers/floors');
var FloorsCollection = Backbone.Collection.extend({
	model: Floor,
	url: '/housekeepers/floors'
});

var floors = new FloorsCollection();
	floors.fetch();





// var RoomsCollection = Backbone.Collection.extend({
// 	model: Room,
// 	url: 'user/rooms'
// });

// var ToDosCollection = Backbone.Collection.extend({
// 	model: ToDo,
// 	url: 'user/todos'
// })
