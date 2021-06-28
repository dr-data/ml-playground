import { getSelectedColumns } from "../../src/selectors.js";
import {
  getUniqueOptionsCurrentColumn,
  getExtremaCurrentColumn,
  getOptionFrequenciesCurrentColumn,
  isCurrentColumnReadOnly
} from "../../src/selectors/currentColumnSelectors";
import {
  classificationState,
  allNumericalState,
  premadeDatasetState
} from "./testData";

describe("derives details about current column", () => {
  test("gets unique options current column", async () => {
    const uniqueOptions = getUniqueOptionsCurrentColumn.resultFunc(
      classificationState.currentColumn,
      classificationState.data
    )
    expect(uniqueOptions).toEqual(['cool', 'hot', 'mild']);
  });

  test("gets option frequencies current column", async () => {
    const optionFrequencies = getOptionFrequenciesCurrentColumn.resultFunc(
      classificationState.currentColumn,
      classificationState.data
    )
    expect(optionFrequencies).toEqual({ hot: 2, mild: 2, cool: 2 });
  });

  test("gets extrema current column", async () => {
    const extrema = getExtremaCurrentColumn.resultFunc(
      allNumericalState.currentColumn,
      allNumericalState.data
    )
    expect(extrema.max).toBe(100);
    expect(extrema.min).toBe(40);
    expect(extrema.range).toBe(60);
  });
});

describe("is current column readOnly", () => {
  test("current column is readOnly", async () => {
    const isReadOnly = isCurrentColumnReadOnly.resultFunc(
      premadeDatasetState.currentColumn,
      premadeDatasetState.metadata
    )
    expect(isReadOnly).toBe(true)
  });

  test("current column is not readOnly", async () => {
    const isReadOnly = isCurrentColumnReadOnly.resultFunc(
      allNumericalState.currentColumn,
      allNumericalState.metadata
    )
    expect(isReadOnly).toBe(false)
  });
});
