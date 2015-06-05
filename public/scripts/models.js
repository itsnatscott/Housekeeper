console.log(userId)

//backbone model for rooms
var Room = Backbone.Model.extend({
});


var Floor = Backbone.Model.extend({
	urlRoot: 'housekeepers/floors',
	initialize: function(){
		this.rooms = new RoomsCollection();
		this.rooms.url = 'housekeepers/floors/'+ this.id +'/rooms'
		console.log(this.rooms.url = 'housekeepers/floors/'+ this.id +'/rooms')
	}
});
