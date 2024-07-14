enum MyTypesStatus {
  activo = "activo",
  inactivo = "inactivo",
  proceso = "proceso",
  pendiente = "pendiente",
}

const isString = (value: string): boolean => {
  return typeof value === "string";
};

const parseStatus = (status: string): MyTypesStatus => {
  if (typeof status !== "string") {
    throw new Error("Status must be a string");
  }
  const foundStatus = Object.values(MyTypesStatus).find(
    (value) => value === status
  );
  if (foundStatus) {
    return foundStatus;
  }
  throw new Error("Status not found");
};

const obtenerFecha = (): number => {
  const fecha: number = Date.now();
  return fecha;
  // const dia: number = fecha.getDate();
  // const mes: number = fecha.getMonth() + 1;
  // const año: number = fecha.getFullYear();
  // return `${año}-${mes}-${dia}`;
};

const arraysIguales = (array1: string[], array2: string[]): boolean => {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
};

// const SECRET_key: Secret = speakeasy.generateSecret({
//   name: "",
// }) as Secret;

// console.log(SECRET_key);

// qrcode.toDataURL(SECRET_key.otpauth_url, function (err, data_url) {
//   if (err) {
//     console.log("Error: ", err);
//   } else {
//     console.log(data_url);
//     const base64Image = data_url.split(";base64,").pop();
//     const imageBuffer = Buffer.from(base64Image, "base64");
//     fs.writeFile("img/codigoQR.png", imageBuffer, function (err) {
//       if (err) throw err;
//       console.log("La imagen del código QR se ha guardado correctamente.");
//     });
//   }
// });

// import speakeasy from "speakeasy";
// import QRCode from "qrcode";

// let secret = speakeasy.generateSecret({
//   name: "Shigatsu45$",
// });
// console.log(secret);

// QRCode.toFile("qrcode.png", secret.otpauth_url ?? "NA", function (err) {
//   if (err) {
//     console.log("Error", err);
//     return;
//   }
//   console.log("Imagen de código QR creada");
// });

export { isString, parseStatus, obtenerFecha, arraysIguales };
