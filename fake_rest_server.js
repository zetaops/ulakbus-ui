var fake = require('fake-api-server');

var login = new fake.Resource("login")
    .add({
        id: 1,
        user: {
            id: 12,
            role: 'admin'
        },
        success: true
    });

var form = new fake.Resource("add_student")
    .add({
        schema: {
            title: "Add Student",
            type: "object",
            properties: {
                name: {
                    type: "string",
                    title: "Name"
                },
                email: {
                    type: "email",
                    title: "Email"
                }
            },
            required: ["email", "name"]
        },
        form: [
            {
                key: "email",
                type: "email",
                validationMessages: {
                    'emailNotValid': 'Email is not valid!'
                }
            },
            "name"
        ]
    });

var server = new fake.Server()
    .register(login)
    .register(form)
    .listen(3000);