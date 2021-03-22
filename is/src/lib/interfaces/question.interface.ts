export interface IQuestionStructure {
  main: IQuestion;
  dog: IQuestion;
  cat: IQuestion;
  yes3: IQuestion;
  no3: IQuestion;
}

export interface IQuestion {
  id: number;
  title: string;
  answer: string;
  options: IOption[];
}

export interface IOption {
  id: number;
  name: string;
  value: string;
}
