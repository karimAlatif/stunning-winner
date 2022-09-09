import React, { useState, useMemo, useCallback } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { GmContext } from "../Editor";
import { Tabs, Input, Typography, Button, Form, Slider } from "antd";
import CornerHolder from "./CornerHolder";
import { CornersTypes } from "../utils";

const { Title } = Typography;


const LeftSideMenu = (props) => {

  const { selectedShapeData, onUpdatePramter } = props;
  const getMarksPerId = useCallback((parameterId) => {
    switch (parameterId) {
      default:
      case "width":
      case "height":
      case "depth":
      case "diameter":
        return {
          0.1: "0.1",
          2: "2",
        };
      case "subdivisions":
        return {
          1: "1",
          10: "10",
        };
    }
  }, [])

  return (
    <GmContext.Consumer>
      {(gameManager) => {
        if (!gameManager) {
          return null;
        }
        return (
          <React.Fragment>
            <Title
              style={{ color: "#000", textDecoration: "underline" }}
              level={2}
            >
              Shape Panel
            </Title>

            {selectedShapeData && <div key={selectedShapeData.name} style={{ padding: "10px" }} >
              <Title level={4} style={{ textAlign: "start" }}>
                {`Selected Shape ${selectedShapeData.name}`}
              </Title>
              {selectedShapeData.options.map((option) => {
                return <div key={option.id} style={{ padding: "10px" }} >
                  <Title level={5} style={{ textAlign: "start" }}>
                    {`${option.id}`}
                  </Title>
                  <Slider
                    defaultValue={option.value}
                    step={.1}
                    marks={getMarksPerId(option.id)}
                    min={Math.min(...Object.keys(getMarksPerId(option.id)).map((value) => Number(value)))}
                    max={Math.max(...Object.keys(getMarksPerId(option.id)).map((value) => Number(value)))}
                    style={{ width: "80%", marginLeft: "10%", marginTop: "20px" }}
                    onChange={(value) => {
                      onUpdatePramter({
                        name: selectedShapeData.name,
                        param: option.id,
                        value,
                      })
                      console.log("value", value)
                    }}
                  />
                </div>
              })
              }
            </div>
            }

          </React.Fragment>
        );
      }}
    </GmContext.Consumer>
  );
};
export default LeftSideMenu;
