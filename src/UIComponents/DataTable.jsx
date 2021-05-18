/* React component to handle displaying imported data. */
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentColumn, setHighlightColumn } from "../redux";
import { styles } from "../constants";

class DataTable extends Component {
  static propTypes = {
    currentPanel: PropTypes.string,
    data: PropTypes.array,
    labelColumn: PropTypes.string,
    selectedFeatures: PropTypes.array,
    setCurrentColumn: PropTypes.func,
    setHighlightColumn: PropTypes.func,
    currentColumn: PropTypes.string,
    highlightColumn: PropTypes.string,
    reducedColumns: PropTypes.bool,
    singleRow: PropTypes.number,
    startingRow: PropTypes.number,
    noLabel: PropTypes.bool,
    hideLabel: PropTypes.bool
  };

  getColumnHeaderStyle = key => {
    let style;

    if (key === this.props.labelColumn) {
      style = styles.dataDisplayHeaderLabel;
    } else if (this.props.selectedFeatures.includes(key)) {
      style = styles.dataDisplayHeaderFeature;
    }

    return { ...styles.dataDisplayHeader, ...style };
  };

  getColumnCellStyle = key => {
    let style;

    if (this.props.hideLabel && this.props.labelColumn === key) {
      style = styles.dataDisplayCellHidden;
    } else if (key === this.props.currentColumn) {
      if (this.props.currentPanel === "dataDisplayLabel") {
        style = styles.dataDisplayCellSelectedLabel;
      } else {
        style = styles.dataDisplayCellSelected;
      }
    } else if (key === this.props.highlightColumn) {
      if (this.props.currentPanel === "dataDisplayLabel") {
        style = styles.dataDisplayCellHighlightedLabel;
      } else {
        style = styles.dataDisplayCellHighlighted;
      }
    }

    return { ...styles.dataDisplayCell, ...style };
  };

  getColumns = () => {
    if (this.props.reducedColumns) {
      return Object.keys(this.props.data[0]).filter(key => {
        return (
          (!this.props.noLabel && this.props.labelColumn === key) ||
          this.props.selectedFeatures.includes(key)
        );
      }).sort((key1, key2) => {
        return this.props.labelColumn === key1 ? 1 : -1
      });
    }

    return Object.keys(this.props.data[0]);
  };

  getRows = () => {
    if (this.props.singleRow !== undefined) {
      return [
        this.props.data[
          Math.min(this.props.singleRow, this.props.data.length - 1)
        ]
      ];
    } else {
      return this.props.data.slice(0,100);
    }
  };

  render() {
    const { data, setCurrentColumn, setHighlightColumn, startingRow } = this.props;

    if (data.length === 0) {
      return null;
    }

    return (
      <table style={styles.displayTable}>
        <thead>
          <tr>
            {this.getColumns().map(key => {
              return (
                <th
                  key={key}
                  style={this.getColumnHeaderStyle(key)}
                  onClick={() => setCurrentColumn(key)}
                  onMouseEnter={() => setHighlightColumn(key)}
                  onMouseLeave={() => setHighlightColumn(undefined)}
                >
                  {key}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {this.getRows().map((row, index) => {
            return (
              <tr key={index}>
                {this.getColumns().map(key => {
                  return (
                    <td
                      key={key}
                      style={this.getColumnCellStyle(key)}
                      onClick={() => setCurrentColumn(key)}
                      onMouseEnter={() => setHighlightColumn(key)}
                      onMouseLeave={() => setHighlightColumn(undefined)}
                    >
                      {startingRow !== undefined &&
                      index <= startingRow
                        ? <span>&nbsp;</span>
                        : row[key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default connect(
  state => ({
    data: state.data,
    labelColumn: state.labelColumn,
    selectedFeatures: state.selectedFeatures,
    currentColumn: state.currentColumn,
    highlightColumn: state.highlightColumn,
    currentPanel: state.currentPanel
  }),
  dispatch => ({
    setCurrentColumn(column) {
      dispatch(setCurrentColumn(column));
    },
    setHighlightColumn(column) {
      dispatch(setHighlightColumn(column));
    }
  })
)(DataTable);
