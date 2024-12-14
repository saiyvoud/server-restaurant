import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;
const SCRETE_KEY = process.env.SCRETE_KEY;
const SCRETE_KEY_REFRESH = process.env.SCRETE_KEY_REFRESH;

export { PORT, SCRETE_KEY, SCRETE_KEY_REFRESH };
