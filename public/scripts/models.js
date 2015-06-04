

	//Backbone model for user
	var User = Backbone.Model.extend({
		urlRoot: '/session',
		initialize: function(){
			console.log("user!")
			this.floors = new FloorsCollection();
		}
	});

	//Backbone model for floor
	var Floor = Backbone.Model.extend({
		urlRoot: '/users/'+ this.id +'/floors/',
		initialize: function(){
		//show that it is working
		console.log("flooring it.")
		
		// add a room collection to a floor
		this.rooms = new RoomsCollection();
				///////ASK ABOUT URL
		this.rooms.url = '/users/'+ this.id + '/floors/'+this.floor.id+'/rooms'
 },

});


	//Backbone model for room
// 	var Room = Backbone.Model.extend({
// 		url.Root: 'users/rooms',
// 		initialize: function(){
// 			console.log("make room!")
// 			this.todos = new ToDosCollection();
// 		///////ASK ABOUT URL	
// 		this.ToDos.url = '/users/'+ this.id + '/floors/'+this.floor.id+'/rooms'+this.floor.room.id+'/todos'
// 	},
// });

// 	//Backbone model for todos
// 	var ToDo = Backbone.Model.extend({
// 				///////ASK ABOUT URL
// 		// url.Root: 'users/rooms/todo',
// 		// initialize: function(){
// 		// 	console.log("it's the weekend")
// 		// },
// 	});