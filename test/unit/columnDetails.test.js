import {
  isColumnCategorical,
  isColumnNumerical,
  filterColumnsByType,
  getUniqueOptions,
  tooManyUniqueOptions
} from '../../src/helpers/columnDetails.js';
import {
  classificationState,
  allNumericalState,
  regressionState
} from './testData';
import { ColumnTypes, UNIQUE_OPTIONS_MAX } from "../../src/constants.js";

describe("column data types", () => {
  test("column is categorical", async () => {
    const result = isColumnCategorical(classificationState, 'play');
    expect(result).toBe(true);
  });

  test("column is not categorical", async () => {
    const result = isColumnCategorical(allNumericalState, 'batCount');
    expect(result).toBe(false);
  });

  test("column is numerical", async () => {
    const result = isColumnNumerical(allNumericalState, 'batCount');
    expect(result).toBe(true);
  });

  test("column is not numerical", async () => {
    const result = isColumnNumerical(classificationState, 'play');
    expect(result).toBe(false);
  });
});

describe("filter columns by datatype", () => {
  test("filter numerical columns", async () => {
    const result = filterColumnsByType(
      regressionState.columnsByDataType,
      ColumnTypes.NUMERICAL
    )
    expect(result).toEqual(['height']);
  });

  test("filter categorical columns", async () => {
    const result = filterColumnsByType(
      regressionState.columnsByDataType,
      ColumnTypes.CATEGORICAL
    )
    expect(result).toEqual(['sun']);
  });
});

describe("unique options", () => {
  const uniqueOptions = getUniqueOptions(classificationState.data, 'temp')
    .sort();

  test("get unique options", async () => {
    expect(uniqueOptions).toEqual(['cool', 'hot', 'mild']);
  });

  test("not too many unique options", async () => {
    const uniqueOptionsCount = uniqueOptions.length;
    const result = tooManyUniqueOptions(uniqueOptionsCount);
    expect(result).toBe(false);
  });

  test("too many unique options", async () => {
    const result = tooManyUniqueOptions(UNIQUE_OPTIONS_MAX + 1);
    expect(result).toBe(true);
  });
});
