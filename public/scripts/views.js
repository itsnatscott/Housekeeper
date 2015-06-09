$(document).ready(function(){
	var floor_pics = [];
	var user= userId	
	var clicks =0


	var FloorView = Backbone.View.extend({
		tagName: 'div class=floorField',
		template: Handlebars.compile($("#floorTemplate").html()),
		initialize: function() {
			this.listenTo(this.model, "sync remove", this.render);
		},
		events:{
			"click button.floorButt": "showRooms",
			"click button.FlDel" : "floorDelete",
			"click button#rmCreate" : "createRoom",
			"click button.fldCreate" : "showFields"
		},
		render: function(){
			floor_pics.push(this.model.attributes.fl_pic)
			this.$el.html(this.template({ floor: this.model.attributes
			}));
			return this;
		},

		floorDelete: function(){
			this.model.destroy();
		},

		showRooms: function(){
			console.log(this.model.attributes.id)
			var rooms = this.model.rooms;
			var flId = this.model.attributes.id;
			currentUser = this.model.attributes.username;
			rooms.fetch({
				success: function(){
					// $("#top_pic").css('background-image', 'url(' + floor_pics[flId-1] + ')');
					new RoomsView({ collection: rooms})
				},
				error: function(){
					console.log("error, no rooms!")
				}
			});
		},

			showFields: function(){
			$("#addrmField"+this.model.id).toggleClass("hidden")
			$("#fldCreate"+this.model.id).toggleClass("hidden")
			},

			createRoom: function(){
			console.log(this.model.collection)
			var rmPic = this.$("#newRmPic"+this.model.id).val();
			var rmName = this.$("#newRmName"+this.model.id).val();
			console.log(rmPic, rmName, this.model.id);
			var nwRm = new Room ({ 
				floor_id: this.model.id, 
				roomname: rmName, 
				color_1: "DDDDDD", 
				color_2: "A8A8A8", 
				color_3: "858685",
				rmPic: rmPic});
			debugger
			this.model.rooms.add(nwRm)
			nwRm.save()
			$("#addrmField"+this.model.id).toggleClass("hidden")
			$("#fldCreate"+this.model.id).toggleClass("hidden")
			console.log(nwRm)
		}

});//closes floorView

	//RoomView to give to roomsView, has the functions for individual rooms
	var RoomView = Backbone.View.extend({
		tagName: 'div class=roomDiv',
		template: Handlebars.compile($("#roomTemplate").html()),
		// initialize: function() {
		// 	this.listenTo(this.model, "sync remove", this.render);
		// },
		events:{
			"click .query" : "searchColor",
			"click button.rmDel" : "roomDelete",
			"click button.rmEdit" : "roomEdit",
			"click button.rmUpdate" : "updateRoom"

		},
		render: function() {
			this.$el.html(this.template({
				room: this.model.attributes
			}));
			return this;
		},
		roomEdit: function(){
			this.$("#rmEditField"+this.model.attributes.id).toggleClass("hiddenEdit");
		},

		updateRoom: function(){
			console.log("roomUpdate")
			var newName = this.$("#roomName"+this.model.attributes.id).val();
			var newPic = this.$("#roomPic"+this.model.attributes.id).val();
			console.log(this.model,newPic,newName)
			this.model.set({
				roomname: newName,
				rmPic: newPic
			});
			this.model.save();
			this.$("#rmEditField"+this.model.attributes.id).toggleClass("hiddenEdit");
		},

		roomDelete: function(){
			this.model.destroy();
		},

		searchColor: function(e){
			console.log(e.target)
			var color = $("#chosen-color"+this.model.attributes.id).val();
			var newPalette={}
			var colorObject= {
				hex: color,
				numResults: 1}

				var promise = $.ajax({
					type: "POST",
					url: "/housekeepers/floors/"+this.model.attributes.floor_id+"/rooms/"+this.model.attributes.id,
					data: JSON.stringify(colorObject),
					contentType: "application/json",
					dataType: "json",
					success: function(data) {
						$("#"+data.id+"rmCl1").css('background-color', data.color_1);
						$("#"+data.id+"rmCl2").css('background-color', data.color_2);
						$("#"+data.id+"rmCl3").css('background-color', data.color_3);
					}
				});
			}
		});

	//shows rooms on a given floor
	var RoomsView = Backbone.View.extend({
		el: 'div#rooms',
		initialize: function() {
			this.listenTo(this.collection, "sync remove", this.render);
		},
		events:{
			"click button#chosen-color" : "searchColor",

		},
		render: function(){ 
			var spaces = this.$el;
			spaces.html("");
			// spaces.append("<div class='newRoomFields'><input type='text' id='newRmName' placeholder = 'room name'><input type='text' id='newRmPic' placeholder = 'picture url'><button id='rmCreate'>Add Room</button></div>")
			this.collection.each(function(space){
				spaces.append(new RoomView({
					model: space
				}).render().$el);
			});
			return this;
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
		var flPic = this.$("#newFlPic").val();
		var flName = this.$("#newFlName").val();
		var nwFl = new Floor({ user_id: userId, fl_pic: flPic, fl_name: flName});
		this.collection.add(nwFl);
		nwFl.save(null);
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