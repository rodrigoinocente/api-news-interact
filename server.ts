import app from "./app"
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));
//TODO: testar os comentarios. fazer um commit. e começar rota que exclui um comentario