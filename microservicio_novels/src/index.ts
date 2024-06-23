import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./Routers";

const app = express();

app.use(express.json());
dotenv.config();

const dominiosPermitidos = [process.env.FRONTEND_HOST];
const opciones = {
  origin: function (origin: any, callback: Function) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

app.use(cors(opciones));

app.use("/api/2.0", router);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

