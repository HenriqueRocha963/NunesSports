const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./db/database.sqlite');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

// tabla de produtos
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT ,
            quantidade INTEGER ,
            valorCompra REAL ,
            valorVenda REAL 
)`);
});

//roteamento utilizando express
app.get('/api/produtos', (req, res) => {
    db.all('SELECT * FROM produtos', (err, rows) => {
        if (err) {
            return console.log("Errorget");
        }
        res.json(rows);
    });
});

app.post('/api/produtos', (req, res) => {
    const { nome, quantidade, valorCompra, valorVenda } = req.body;
    db.run('INSERT INTO produtos (nome, quantidade, valorCompra, valorVenda) VALUES (?, ?, ?, ?)', [nome, quantidade, valorCompra, valorVenda], function (err) {
        if (err) {
            return console.log("Errorpost");
        }
        res.json({ id: this.lastID });
    });
});

app.put('/api/produtos/:id', (req, res) => {
    const {  nome, quantidade, valorCompra, valorVenda } = req.body;
    db.run(
        'UPDATE produtos SET nome = ?, quantidade = ?, valorCompra = ? , valorVenda = ? WHERE id = ?',
        [nome, quantidade, valorCompra, valorVenda, req.params.id],
        function (err) {
            if (err) {
                return console.log("Errorput");
            }
            res.json({ changes: this.changes });
        }
    );
});

app.delete('/api/produtos/:id', (req, res) => {
    db.run('DELETE FROM produtos WHERE id = ?', req.params.id, function (err) {
        if (err) {
            return console.log("Errordelete");
        }
        res.json({ changes: this.changes });
    });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
