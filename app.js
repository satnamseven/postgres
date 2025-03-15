const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

const db_config = new Pool({
  host: "localhost", // 127.0.0.1
  database: "satnam_db",
  user: "satnam",
  password: "password",
  port: 5432,
});

app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const result = await db_config.query("INSERT INTO users (name,email) VALUES($1, $2) RETURNING *" , [name , email]);

    res.status(201).json({msg :'user created successfully', data : result.rows});


  } catch (error) {
    res.status(500).json({ table : error.table, detail : error.detail });
  }
});

app.get("/users", async (_, res) => {
    try {
           
        const result = await db_config.query("SELECT * FROM users");
    
        res.status(201).json( result.rows );
    
    
      } catch (error) {
        res.status(500).json({ error });
      }
});

app.get("/user", async (req, res) => {
    try {
        const { id } = req.query;

        const result = await db_config.query("SELECT * FROM users WHERE id = $1", [id]);

        const rows = result.rows;
       
        if(rows.length === 0)
            return res.status(404).json( {msg : "user not found"});
        
        res.status(200).json(rows[0]);
    
      } catch (error) {
        res.status(500).json({ error });
      }
});

app.put("/users", async (req, res) => {
    try {
        const { id } = req.query;
        const { name, email } = req.body;

        const result = await db_config.query("UPDATE users SET name = $1 , email = $2 WHERE id = $3 RETURNING *", [name, email , id]);

        const rows = result.rows;

        if(rows.length === 0)
            return  res.status(404).json({msg :"user does not exist"});
        
        res.status(200).json({msg : "uesr updated"});
    
      } catch (error) {
        res.status(500).json({ error });
      }

});

app.delete("/users/:id", async (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
