$(document).ready(function(){
               
	var FloorView = Backbone.View.extend({
		tagName: 'div class=floorField',
		template: Handlebars.compile($("#floorTemplate").html()),
		render: function(){
			this.$el.html(this.template({ floor: this.model.attributes
			 }));
			return this;
		}
});//closes floorView




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
			console.log("CL: rendering floorsview");
			this.collection.each(function(level){
				levels.append(new FloorView({
					model: level,
				}).render().$el);
			});

			return this;
		}
	});
	new FloorsView({
		collection: floors
	});
});