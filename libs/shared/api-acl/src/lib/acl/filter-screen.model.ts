export class FilterScreen {
  screen: number;
  filters: FilterChild[];
}

export class FilterChild {
  field: string;
  op: string;
  value: string;
}
