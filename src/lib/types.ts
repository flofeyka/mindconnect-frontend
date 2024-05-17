export type authType = {
  isAuth: boolean;
  captchaUrl: null | string
  usersData: usersDataType
};

export type usersDataType = {
  email: string;
  firstName: string;
  lastName: string;
  number: number;
  image: string;
};
