import { utils, writeFile } from 'xlsx';
import { FinalJson } from '../types/final';

export const toXlsx = (values: FinalJson[] | undefined) => {
  if (!values) return;
  const wb = utils.book_new();
  const ws = utils.json_to_sheet(values);
  utils.book_append_sheet(wb, ws, `Reports`);
  writeFile(wb, 'test.xlsx');
};
