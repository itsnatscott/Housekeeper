$(document).ready(function(){
	console.log("views!")
	console.log(userId)
	currentFloors = FloorsCollection.fetch({
		success: function() {
			new FloorsView({collection: FloorsCollection});
		}
	});



	var FloorsView = Backbone.View.extend({
		tagName: 'div class="main"',
		template: _.template($('#floorTemplate').html()),
		//put event listeners under here

		//put event listeners above here
				render: function() {
			this.$el.html(this.template({
				floor: this.model.toJSON()
			}));
			console.log(this.model)
			return this;
		}

	// });
	new FloorView({
	collection: floors
});
});