interface typesJwt {
  idToken: string;
  iat: number;
  exp: number;
}

interface volumenData {
  portadaVolumen: string;
  volumen: number;
  links: string[];
  createdAt: number;
  nombreNovela: string;
  disponibilidad: string;
  novelId: string;
  volumenId?: string;
  id?: string;
}

type volumenDataWithoutVolumen = Omit<
  volumenData,
  "portadaVolumen" | "links" | "disponibilidad"
>;

interface chapterData {
  capituloId?: string;
  capitulo: number;
  createdAt: number;
  nombreNovela: string;
  novelId: string;
  contenido: string;
  volumenPertenece: number;
  nombreCapitulo: string;
  id?: string;
}

type chapterDataWithoutContentChapter = Omit<
  chapterData,
  "contenido" | "capitulo"
>;

interface novelData {
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
  idNovel?: string;
  novelId: string;
  id?: string;
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
