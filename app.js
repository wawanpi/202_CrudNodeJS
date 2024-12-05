require('dotenv').config();
const express = require('express');
const app = express();
const todoRoutes = require('./routes/tododb.js');

const port = process.env.PORT;
const db = require('./database/db');
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');

app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET, // Gunakan secret key yang aman
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

app.use('/', authRoutes);

app.use('/todos', todoRoutes);
app.set('view engine', 'ejs');

app.get('/', isAuthenticated,(req, res) => {
    res.render('index', {
        layout : 'layouts/main-layout',
    });
});

app.get('/contact',isAuthenticated, (req, res) => {
    res.render('contact', {
        layout : 'layouts/main-layout',
    });
});

app.get('/todo-view', (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main-layout',
            todos: todos
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});