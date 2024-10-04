
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/db');
const XLSX = require('xlsx');
require('dotenv').config();  

const app = express(); 


const URI = process.env.URI; 
const PORT = process.env.PORT || 8000;  

app.use(express.json()); 
app.use(cors());

// Endpoint Root
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Endpoint env
app.get('/env', (req, res) => {
    res.json({
        URI: process.env.URI,
        PORT: process.env.PORT,
    });
});

// Endpoint Get Users
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint Get Users Count
app.get('/api/users/count', (req, res) => {
    db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});

// Endpoint Post User
app.post('/api/users', (req, res) => {
    const { name, username, email, address, phone } = req.body;
    const { street, prov, city } = address;


    if (!name || !username || !email || !address || !street || !prov || !city|| !phone) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }


    db.run(
        `INSERT INTO users (name, username, email, address, phone) VALUES (?, ?, ?, ?, ?)`,
        [name, username, email, JSON.stringify(address), phone], 
        function (err) {
            if (err) {
                console.error('Error al insertar el usuario:', err.message); 
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, name });
        }
    );
});


// Endpoint Export User Excel
app.get('/api/export-users-excel', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }


        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');


        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });


        res.setHeader('Content-Disposition', 'attachment; filename=usuarios.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');



        res.send(excelBuffer);
    });
});


// Endpoint Export User Json
app.get('/api/export-users-json', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const jsonContent = JSON.stringify(rows, null, 2);
        res.header('Content-Type', 'application/json');
        res.attachment('users.json');
        res.send(jsonContent);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${URI}:${PORT}`);
});
