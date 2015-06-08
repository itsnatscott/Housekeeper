console.log(userId)

//backbone model for rooms
var Room = Backbone.Model.extend({
});
//backbone model for rooms collection must go here because it is referrenced in floors model
var RoomsCollection = Backbone.Collection.extend({
	model: Room
})





var Floor = Backbone.Model.extend({
	urlRoot: 'housekeepers/floors',
	initialize: function(){
		console.log("floor_model "+this.id);
		this.rooms = new RoomsCollection();
		this.rooms.url = 'housekeepers/floors/'+ this.id +'/rooms'
	}
});

var nwFl = new Floor();
var nwRm = new Room();