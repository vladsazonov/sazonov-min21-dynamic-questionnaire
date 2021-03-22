export interface IQuestionStructure {
  key: IQuestion;
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
