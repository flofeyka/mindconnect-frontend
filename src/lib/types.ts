export interface PostType {
  id: string;
  owner: string;
  title: string;
  description?: string;
  image?: File;
  likes: string[];
  comments: string[];
  createdAt: string;
}

export type commentType = {
  id: string;
  owner: string;
  content: string;
  postId: string;
};

export type usersDataType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  image: string;
  age: number;
  city: string;
  country: string;
  isDoctor: boolean;
  username: string;
};
export type authType = {
  user: any;
  isAuth: boolean;
  captchaUrl: null | string;
  usersData: usersDataType;
  tokenIsValid: boolean | null;
  isPending: boolean;
  googleUrl: null | string;
  emails: string[];
};

export type calendarType = {
  id: number;
  date: Date;
  owner: {
    $oid: string;
  };
  __v: number;
  index: number;
  notes: calendarNoteType[];
};

export type calendarNoteType = {
  id: number;
  note: string;
  calendarId: number;
  time: string;
  createdAt: Date;
};

export type ResearchDataType = {
  page: number;
  limit: number;
};

export type ResearchType = {
  "@GROUP_ID": string;
};

export type DoctorCalendarType = {
  id: string;
  date: string;
  timeSlots: TimeSlot[];
};
export type TimeSlot = {
  id: string;
  time: string;
};

export interface ChatDialog {
  id: string;
  title: string;
  name: string;
  imgUrl: string;
  lastMessage?: {
    role: "user" | "assistant";
    content: "string";
    created_at: string;
  };
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NOT_SELECTED = "NOT SELECTED",
}

export enum Language {
  ENGLISH = "English",
  RUSSIAN = "Russian",
  SPANISH = "Spanish",
  GERMAN = "German",
  CHINESE = "Chinese",
  HINDI = "Hindi",
  UKRAINIAN = "Ukrainian",
}

export enum Problem {
  POST_TRAUMATIC_STRESS_DISORDER_PTSD = "Post-Traumatic Stress Disorder (PTSD)",
  GENERALIZED_ANXIETY_DISORDER_GAD = "Generalized Anxiety Disorder (GAD)",
  STRESS = "Stress",
  BURNOUT = "Burnout",
  ADHD = "ADHD",
  PANIC_DISORDER = "Panic Disorder",
  SOCIAL_ANXIETY_DISORDER = "Social Anxiety Disorder",
  SPECIFIC_PHOBIAS = "Specific Phobias",
  MAJOR_DEPRESSIVE_DISORDER = "Major Depressive Disorder",
  BIPOLAR_DISORDER = "Bipolar Disorder",
  SCHIZOAFFECTIVE_DISORDER = "Schizoaffective Disorder",
  ALCOHOL_USE_DISORDER = "Alcohol Use Disorder",
  GAMBLING_DISORDER = "Gambling Disorder",
  SUBSTANCE_USE_DISORDERS = "Substance Use Disorders",
  GENDER_DYSPHORIA = "Gender Dysphoria",
  DEPENDENT_PERSONALITY_DISORDER = "Dependent Personality Disorder",
}
