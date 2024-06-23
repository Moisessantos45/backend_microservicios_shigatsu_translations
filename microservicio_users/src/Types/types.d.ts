interface userData {
  id: number;
  password: string;
  userEmail: string;
  userStatus: boolean;
  token: string;
  userActive: boolean;
  profilePicture: string;
  userName: string;
  userType: string;
  idUser: string;
  is_first_login: boolean;
  has_2fa: boolean;
}

type UserWithoutPassword = Omit<
  userData,
  "password" | "token" | "has_2fa" | "is_first_login"
>;

type UserWithoutToken = Omit<userData, "password">;

interface typesJwt {
  idToken: string;
  iat: number;
  exp: number;
}

interface siteConfig {
  backgroud: string;
  backgroudSite: string;
  linkFacebook: string;
  mensajeSite: string;
  titleSite: string;
  titleSiteWeb: string;
  id: number;
}

enum MyTypesStatus {
  activo = "activo",
  inactivo = "inactivo",
  proceso = "proceso",
  pendiente = "pendiente",
}

type MyTypes = userData | siteConfig;

export {
  userData,
  UserWithoutPassword,
  UserWithoutToken,
  typesJwt,
  MyTypes,
  MyTypesStatus,
  siteConfig,
};
