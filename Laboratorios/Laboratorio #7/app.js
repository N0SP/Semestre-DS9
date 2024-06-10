/*Bun.serve({
    port: 3000,
    fetch(req) {
        return new Response('Hello World!');
    }
}); */
import express from 'express';

const app = express();

app.get("/", (req, res) => {
    res.send("Hello bun !");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}); 
