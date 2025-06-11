import app from "./app"
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

app.listen(port, host, () => console.log(`Server running on port ${port}`));