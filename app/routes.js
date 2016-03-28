var Todo = require('./models/todo');

function getTodos(res) {
    var option = {
        skip: 0,
        limit: 4,
        sort: {created_at: -1}
    };

    Todo.find({},{},option).exec(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        console.log('todos',todos);
        res.json(todos); // return all todos in JSON format
    });
}
;

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all Items slots
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all Items slots in the database
        getTodos(res);
    });

    // Store items slots and send back 4 items after creation
    app.post('/api/todos', function (req, res) {
        // console.log('req.body',req.body);
        // create a todo, information comes from AJAX request from Angular
        Todo.create(req.body, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the ITEMS after you create another
            getTodos(res);
        });

    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};