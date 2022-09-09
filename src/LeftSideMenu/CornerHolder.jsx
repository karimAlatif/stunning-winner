import React, { useState, useEffect } from "react";
import { Tabs, Input, Typography, Button, Form, Slider } from "antd";
import { GmContext } from "../Editor/";

const { Title } = Typography;

const CornerHolder = (props) => {
  const { maxLength, setCorner, mainType, height } = props;

  const onSliderChange = (gameManager, value, id) => {
    gameManager.studioSceneManager.loaderManager.adjustMorphingByIndex(
      mainType,
      id,
      value
    );
  };

  useEffect(() => {
    if (height <= 0) setCorner({ height, length: 0 });
  }, [height, setCorner]);

  const defualtMarks = {
    0: "0",
    100: "100",
  };
  const lengthMarks = {
    0: "0",
    [maxLength]: maxLength,
  };

  return (
    <GmContext.Consumer>
      {(gameManager) => {
        if (!gameManager) {
          return null;
        }
        return (
          <>
            <Title level={4} style={{ textAlign: "start" }}>
              Point H
            </Title>
            <Slider
              defaultValue={0}
              marks={defualtMarks}
              style={{ width: "80%", marginLeft: "10%", marginTop: "20px" }}
              onChange={(value) => {
                setCorner((corner) => ({ ...corner, height: value }));
                onSliderChange(gameManager, value, "H");
              }}
            />
            {height > 0 && (
              <>
                <Title level={4} style={{ width: "20%" }}>
                  Point L
                </Title>
                <Slider
                  marks={lengthMarks}
                  max={maxLength}
                  disabled={maxLength <= 0}
                  style={{ width: "80%", marginLeft: "10%", marginTop: "20px" }}
                  onChange={(value) => {
                    setCorner({ height, length: value });
                    onSliderChange(gameManager, value, "L");
                  }}
                />

                <Title level={4} style={{ textAlign: "start" }}>
                  Point TF Start
                </Title>
                <Slider
                  marks={defualtMarks}
                  style={{ width: "80%", marginLeft: "10%", marginTop: "20px" }}
                  onChange={(value) => onSliderChange(gameManager, value, "TF1")}
                />
                
                <Title level={4} style={{ textAlign: "start" }}>
                  Point TF End
                </Title>
                <Slider
                  marks={defualtMarks}
                  style={{ width: "80%", marginLeft: "10%", marginTop: "20px" }}
                  onChange={(value) => onSliderChange(gameManager, value, "TF2")}
                />
              </>
            )}
          </>
        );
      }}
    </GmContext.Consumer>
  );
};

export default CornerHolder;
