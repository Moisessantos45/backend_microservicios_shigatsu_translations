interface typesJwt {
  idToken: string;
  iat: number;
  exp: number;
}
interface novelData {
  id: string;
  titleNovel: string;
  volumenesActuales: string;
  nombresAlternos: string;
  background: string;
  portada: string;
  tipoNovela: string;
  generos: string;
  autor: string;
  sinopsis: string;
  ilustracionesAtuales: string;
  statusNovel: string;
  personajes: string;
  novelId: string;
}

type novelDataWithoutVolumenes = Omit<
  novelData,
  | "volumenesActuales"
  | "nombresAlternos"
  | "background"
  | "generos"
  | "autor"
  | "ilustracionesAtuales"
  | "personajes"
>;

interface volumenData {
  id: string;
  volumenId: string;
  portadaVolumen: string;
  volumen: number;
  links: string[];
  createdAt: number;
  nombreNovela: string;
  disponibilidad: string;
  novelId: string;
}

type volumenDataWithoutVolumen = Omit<
  volumenData,
  "portadaVolumen" | "links" | "disponibilidad"
>;

interface chapterData {
  id: string;
  capituloId: string;
  capitulo: number;
  createdAt: number;
  nombreNovela: string;
  novelId: string;
  contenido: string;
  volumenPertenece: number;
  nombreCapitulo: string;
}

type chapterDataWithoutContentChapter = Omit<
  chapterData,
  "contenido" | "capitulo"
>;

interface siteConfig {
  backgroud: string;
  backgroudSite: string;
  linkFacebook: string;
  mensajeSite: string;
  titleSite: string;
  titleSiteWeb: string;
  id?: string;
}

enum MyTypesStatus {
  activo = "activo",
  inactivo = "inactivo",
  proceso = "proceso",
  pendiente = "pendiente",
}

type MyTypes = userData | volumenData | chapterData | siteConfig;

export {
  userData,
  UserWithoutPassword,
  UserWithoutToken,
  typesJwt,
  volumenData,
  volumenDataWithoutVolumen,
  chapterData,
  chapterDataWithoutContentChapter,
  MyTypes,
  siteConfig,
  novelData,
  novelDataWithoutVolumenes,
  MyTypesStatus,
};
