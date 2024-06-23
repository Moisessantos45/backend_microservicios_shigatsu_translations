import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import router from "./Router";
import app from "./server";

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

app.use("/api/user/1.0", router);

const PORT = process.env.PORT || 5000;

const servidor = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_HOST,
  },
});

io.on("connection", (server) => {
  server.on("inicio", (data) => {
    if (data?.idUser) {
      server.join(data.idUser);
      server.broadcast.emit("SesionActive", data);
    } else {
      server.join(data);
      server.broadcast.emit("SesionActive", data);
    }
  });
  server.on("addContent", (data) => {
    server.join(data.id);
    server.broadcast.emit("newContent", data);
  });
  server.on("updateContent", (data) => {
    server.join(data.id);
    server.broadcast.emit("newUpdateContent", data);
  });
  server.on("deleteContent", (data) => {
    server.join(data.id);
    server.broadcast.emit("newDeleteContent", data);
  });
  server.on("changeStatusState", (data) => {
    server.join(data.id);
    server.broadcast.emit("newChangeStatusState", data);
  });
  server.on("changeUserStatus", (data) => {
    server.join(data.id);
    server.broadcast.emit("newChangeUserStatus", data);
  });
  server.on("deleteUser", (data) => {
    server.join(data.id);
    server.broadcast.emit("newDeleteUser", data);
  });
});
