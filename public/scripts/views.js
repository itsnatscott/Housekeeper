$(document).ready(function(){
	console.log("this console log is in the views.js")
	var FloorsView = Backbone.View.extend({
		el: '#main',
		template: _.template($('#floorTemplate').html()),
		initialize: function() {
			this.render();
		},
		//put event listeners under here

		//put event listeners above here
		render: function() {
			console.log("view");
			console.log("view");
			console.log(this.collection)
			this.$el.html(this.template({
				floor: this.model.toJSON()
			}));
			$("body").append(this.$el)
			return this;
		}
	});
});