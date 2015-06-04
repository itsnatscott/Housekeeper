var colourlovers = require('colourlovers');
colourlovers.get('/palettes', {
        hex:  'F7A33D',
        numResults: 3
    },function(err, data) {
    if(err) throw err;
    console.log(data);
});