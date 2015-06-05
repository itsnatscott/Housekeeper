console.log("collections" + " " + userId)
console.log('housekeepers/'+ userId +'/floors');
var FloorsCollection = Backbone.Collection.extend({
	model: Floor,
	initialize: function(){
		console.log(userId);
	},
	url: '/housekeepers/'+ userId +'/floors'
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
