$(document).ready(function(){

	var FloorView = Backbone.View.extend({
		tagName: 'div class=floorField',
		template: _.template($("#floorTemplate").html()),
		render: function(){
			this.$el.html(this.template({
				floor: this.model.toJSON()
			}));
			return this;
		}
});//closes floorView




	var FloorsView = Backbone.View.extend({
		el: 'div#main',
		template: _.template($('#floorsTemplate').html()), 
		initialize: function() {
			this.listenTo(this.collection, "sync remove" ,this.render);
		},
		//put event listeners under here
		//put event listeners above here
		render: function() {
			console.log("CL: rendering floorsview");
			fl = floors.toJSON()
			console.log(this.$el);
			// this.$el.append("<h3>"+fl[0].fl_name+"</h3>")
			console.log(fl.length);
			// for(var i=0; i<fl.length; i++){
			// 	console.log("can you see... " + fl[i] + "?")
			// };
			// fl.each(function (level){	
			// 	this.$el.html(this.template({
			// 		floor: level
			// 	}));
	$(".floorbar").append(this.$el)
}
			// return this;
		});
	new FloorsView({
		collection: floors
	});
});