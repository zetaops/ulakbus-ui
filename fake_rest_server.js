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
        ],
        model: {
            name: "evren kutar",
            email: "a@a.com"
        }
    });

var student = new fake.Resource("list_student")
    .add({'deleted': false,
        'archived': false,
        'auth_info': {'email': 'suuper@suup.com',
            'password': '123',
            'username': 'foo_user'},
        'bio': 'Lorem impsum dolar sit amet falan filan',
        'join_date': '2015-05-16T00:00:00Z',
        'lectures': [{'attendance': [{'attended': false,
            'date': '2015-05-09T00:00:00Z',
            'hour': 2},
            {'attended': true,
                'date': '2015-05-10T00:00:00Z',
                'hour': 4}],
            'code': 'math101',
            'credit': 4,
            'exams': [
                {'date': '2015-05-11T00:00:00Z', 'point': 65,
                    'type': 'Q'}],
            'name': 'Introduction to Math',
            'node_in_list_node': {'foo': 'FOOOO'}},
            {'attendance': [{'attended': false,
                'date': '2015-05-13T00:00:00Z',
                'hour': 2},
                {'attended': true,
                    'date': '2015-05-14T00:00:00Z',
                    'hour': 4}],
                'code': 'rock101',
                'credit': 10,
                'exams': [
                    {'date': '2015-05-15T00:00:00Z', 'point': 65,
                        'type': 'Q'}],
                'name': 'Introduction to Rocking',
                'node_in_list_node': {'foo': 'FOOOO'}}],
        'name': 'Jack',
        'number': '20300344',
        'pno': '2343243433',
        'surname': 'Black',
        'timestamp': null});

var server = new fake.Server()
    .register(login)
    .register(form)
    .register(student)
    .listen(3000);