/* React component to handle training. */
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import train from "../train";
import { readyToTrain } from "../redux";
import { styles, getFadeOpacity } from "../constants";
import aiBotHead from "@public/images/ai-bot/ai-bot-head.png";
import aiBotBody from "@public/images/ai-bot/ai-bot-body.png";
import background from "@public/images/results-background-light.png";
import DataTable from "./DataTable";

const framesPerCycle = 80;
const numItems = 7;

class TrainModel extends Component {
  static propTypes = {
    data: PropTypes.array,
    readyToTrain: PropTypes.bool,
    modelSize: PropTypes.number,
    labelColumn: PropTypes.string,
    selectedFeatures: PropTypes.array,
    instructionsOverlayActive: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      frame: 0,
      animationtimer: undefined,
      headOpen: false,
      finished: false
    };
  }

  componentDidMount() {
    train.init();
    train.onClickTrain();

    const animationTimer = setInterval(
      this.updateAnimation.bind(this),
      1000 / 30
    );

    this.setState({ animationTimer });
  };

  updateAnimation = () => {
    if (this.state.frame === 15) {
      this.setState({ headOpen: true });
    }

    if (this.getAnimationStep() >= numItems) {
      this.setState({ headOpen: false, finished: true });
    }

    if (!this.props.instructionsOverlayActive) {
      this.setState({ frame: this.state.frame + 1 });
    }
  };

  componentWillUnmount = () => {
    if (this.state.animationTimer) {
      clearInterval(this.state.animationTimer);
      this.setState({ animationTimer: undefined });
    }
  };

  getAnimationProgess = () => {
    let amount = (this.state.frame % framesPerCycle) / framesPerCycle;
    amount -= Math.sin(amount * 2 * Math.PI) / (2 * Math.PI);
    return amount;
  };

  getAnimationStep = () => {
    return Math.floor(this.state.frame / framesPerCycle);
  };

  render() {
    const animationProgress = this.getAnimationProgess();
    const translateX = 15 + animationProgress * (100 - 15);
    const translateY = 80 - Math.sin(animationProgress * Math.PI) * 30;
    const rotateZ = animationProgress * 60;
    const transform = `translateX(-50%) translateY(-50%) rotateZ(${rotateZ}deg)`;
    const opacity = getFadeOpacity(animationProgress);
    const showAnimation = this.getAnimationStep() < numItems;

    const maxFrames = framesPerCycle * (numItems - 1.5);
    const tableOpacity =
      this.state.frame < framesPerCycle
        ? this.state.frame / framesPerCycle
        : this.state.frame >= maxFrames &&
          this.state.frame < maxFrames + framesPerCycle
        ? 1 - (this.state.frame - maxFrames) / framesPerCycle
        : this.state.frame >= maxFrames + framesPerCycle
        ? 0
        : 1;

    // Let's still show the starting row on our very first frame, because we might
    // be paused waiting for the overlay to be dismissed.
    const startingRow =
      this.state.frame === 0 ? undefined : this.getAnimationStep();

    return (
      <div
        id="train-model"
        style={{
          ...styles.panel,
          justifyContent: "center",
          backgroundSize: "cover",
          backgroundImage: "url(" + background + ")"
        }}
      >
        <div style={styles.statementWithBackground}>Training</div>

        <div
          style={{
            ...styles.trainModelDataTable,
            opacity: tableOpacity
          }}
        >
          <DataTable reducedColumns={true} startingRow={startingRow} />
        </div>

        <div style={styles.trainModelContainer}>
          {showAnimation && (
            <div
              style={{
                position: "absolute",
                transformOrigin: "center center",
                top: translateY + "%",
                left: translateX + "%",
                transform: transform,
                opacity: opacity * tableOpacity
              }}
            >
              <DataTable
                reducedColumns={true}
                singleRow={this.getAnimationStep()}
              />
            </div>
          )}
        </div>

        {this.props.readyToTrain && (
          <div style={styles.trainModelBotContainer}>
            <div style={{ ...styles.trainBot, margin: "0 auto" }}>
              <img
                src={aiBotHead}
                style={{
                  ...styles.trainBotHead,
                  ...(this.state.headOpen && styles.trainBotOpen)
                }}
              />
              <img src={aiBotBody} style={styles.trainBotBody} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(state => ({
  readyToTrain: readyToTrain(state),
  modelSize: state.modelSize,
  labelColumn: state.labelColumn,
  selectedFeatures: state.selectedFeatures,
  instructionsOverlayActive: state.instructionsOverlayActive
}))(TrainModel);
