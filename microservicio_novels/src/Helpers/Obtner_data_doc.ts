import { MyTypes } from "../Types/types";

const mapearId = (data: any): any => {
  if ("novelaId" in data) {
    return { id: data.novelaId, ...data };
  } else if ("idCapitulo" in data) {
    return { id: data.idCapitulo, ...data };
  }
};

const extraerData = (doc: any): MyTypes[] => {
  const datos: MyTypes[] = [];
  if (doc.empty) {
    return datos;
  }
  doc.forEach((dosc: any) => {
    const dataConId = mapearId(dosc.data());
    datos.push({ ...dataConId });
  });
  return datos;
};

function transformData<T>(data: MyTypes, transform: (data: MyTypes) => T): T {
  if (transform.name in data) {
    return transform(data);
  } else {
    throw new Error("Los datos no tienen la forma esperada");
  }
}

export { extraerData, transformData };
