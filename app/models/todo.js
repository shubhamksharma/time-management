var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
	created_at:{
		type: Date,
		default: new Date()
	},
    items: {
        type: Array,
        default: ''
    }
});