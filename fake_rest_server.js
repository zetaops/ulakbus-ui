var fake = require('fake-api-server');

var login = new fake.Resource("login")
    .add({
        id: 1,
        user: {
            id: 12,
            role: 'admin'
        }
    });

var form = new fake.Resource("add_student")
    .add({
        id: 1,
        user: {
            id: 12,
            role: 'admin'
        }
    });

var server = new fake.Server()
    .register(login)
    .register(form)
    .listen(3000);