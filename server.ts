import app from "./app"
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));
//TODO: RETORNAR USUARIO NA ROTA DE AUTENTICAÇÃO, SE CONSEGUIR, LEMBRAR DE ALTERAR O FRONT