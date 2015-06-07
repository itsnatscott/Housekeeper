$(document).ready(function(){
	var floor_pics = [];	


	var FloorView = Backbone.View.extend({
		tagName: 'div class=floorField',
		template: Handlebars.compile($("#floorTemplate").html()),
		events:{
			"click button.floorButt": "showRooms",
			"click button.FlDel" : "floorDelete",
			"click button.rmCreate": "createRoom"
		},
		render: function(){
			floor_pics.push(this.model.attributes.fl_pic)
			this.$el.html(this.template({ floor: this.model.attributes
			}));
			return this;
		},

		floorDelete: function(){
			console.log("i'm gonna delete this floor:"+ this.model.id)
			this.model.destroy();
		},

		showRooms: function(){
			var rooms = this.model.rooms;
			var flId = this.model.attributes.id
			console.log(this.model.attributes.id)
			currentUser = this.model.attributes.username;
			rooms.fetch({
				success: function(){
					$("#top_pic").css('background-image', 'url(' + floor_pics[flId-1] + ')');
					new RoomsView({ collection: rooms})
					console.log("asking for new RoomsView?")
				},
				error: function(){
					console.log("error, no rooms!")
				}
			});
		}

});//closes floorView

	//RoomView to give to roomsView, has the functions for individual rooms
	var RoomView = Backbone.View.extend({
		tagName: 'div class=roomDiv',
		template: Handlebars.compile($("#roomTemplate").html()),
		events:{
			"click button#query" : "searchColor",

		},
		render: function() {
			this.$el.html(this.template({
				room: this.model.attributes
			}));
			return this;
		},

		searchColor: function(){
			color = $("#chosen-color"+this.model.attributes.id).val();
			console.log(color, "this color")
			var colorObject= {
				hex: color,
				numResults: 1}

			$.ajax({
				type: "POST",
				url: "/housekeepers/floors/"+this.model.attributes.floor_id+"/rooms/"+this.model.attributes.id,
				data: JSON.stringify(colorObject),
				contentType: "application/json",
				dataType: "json",
            success: function(data) {
            	console.log(data);
            	alert("Ajax call happened and got something back");
            }
        })
		}


    });

	//shows rooms on a given floor
	var RoomsView = Backbone.View.extend({
		el: 'div#rooms',
		initialize: function() {
			this.listenTo(this.collection, "sync remove", this.render);
		},
		events:{
			"click button#rmCreate" : "createRoom",
			"click button#chosen-color" : "searchColor",

		},
		render: function(){ 
			var spaces = this.$el;
			spaces.html("");
			spaces.append("<div class='newRoomFields'><div class = 'fieldlabel'>add new room<input type='text' id='newRmName' placeholder = 'room name'><input type='text' id='newRmPic' placeholder = 'picture url'><button class='addButton' id='rmCreate'>Add Room</button></div></div>")
			this.collection.each(function(space){
				spaces.append(new RoomView({
					model: space
				}).render().$el);
			});
			return this;
		},
		// create new room in this floor
		createRoom: function(){
			console.log(this.collection)
			var rmPic = this.$("#newRmPic").val();
			var rmName = this.$("#newRmName").val();
			var flId = this.collection.url.split("/")[2]
			console.log(rmPic, rmName, flId);
			var nwRm = new Room ({ 
				floor_id: flId, 
				roomname: rmName, 
				color_1: "#858685", 
				color_2: "#858685", 
				color_3: "#858685",
				rmPic: rmPic});
			this.collection.add(nwRm);
			nwRm.save(null);
			console.log(rooms)
		}


	});


var FloorsView = Backbone.View.extend({
	el: 'div#main',
	initialize: function() {
		this.listenTo(this.collection, "sync remove" ,this.render);
	},
		//put event listeners under here
		//put event listeners above here
		render: function() {
			var levels = this.$el;
			levels.html("");
			console.log(this.collection.toJSON())
			this.collection.each(function(level){
				levels.append(new FloorView({
					model: level,
				}).render().$el);
			});

			return this;
		}
	});

$("button#flAdd").click(function(){
	$("#flAddField").toggleClass("hidden")
	$("button#flAdd").toggleClass("hidden")
})
var CreateFloorView = Backbone.View.extend({
	el: '#flAddField',
	events:{"click button#flCreate" : "createFloor"
},
	//creates new floor
	createFloor: function(){
		console.log(this.collection)
		var flPic = this.$("#newFlPic").val();
		var flName = this.$("#newFlName").val();
		console.log(flPic, flName, userId);
		var nwFl = new Floor({ user_id: userId, fl_pic: flPic, fl_name: flName});
		this.collection.add(nwFl);
		nwFl.save(null);
		console.log(floors)
		$("#flAddField").toggleClass("hidden");
		$("button#flAdd").toggleClass("hidden");
	}

});

floors.fetch({
	success: function(){
		new FloorsView({
			collection: floors
		});
	}
});
new CreateFloorView({
	collection: floors
});
});