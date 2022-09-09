import React, {
  createRef,
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import LeftSideMenu from "../LeftSideMenu";
import BabylonManager from "../BabylonManager";

const gmRef = createRef(null);
export const GmContext = createContext(null);

const Editor = () => {
  const [gameManager, setGameManager] = useState(null);
  const [selectedShapeData, setSelectedShapeData] = useState(null);

  const studioSceneHandlers = useMemo(() => {
    return {
      onSelect: (params) => { },
      onDrag: () => {
        console.log("Ui Drag Action !!");
      },
      onDrop: (_selectedShapeData) => {
        console.log("Ui Drop Action !!", _selectedShapeData);
        setSelectedShapeData(_selectedShapeData)
      },
      onDeselect: () => { },
    };
  }, []);

  const onUpdatePramter = useCallback((newData) => {
    const { name, param, value } = newData;
    gameManager.studioSceneManager.onUpdateShapeParamter(name, param, value);
  }, [gameManager]);

  useEffect(() => {
    const gManger = BabylonManager(gmRef.current).gManger; //Create Babylonjs Ref
    gManger.studioSceneManager.handlers = studioSceneHandlers; //Hnadlers
    setGameManager(gManger);
  }, [setGameManager, studioSceneHandlers]);

  return (
    <GmContext.Provider value={gameManager}>
      <Row style={{ height: "100%" }} type="flex">
        <Col span={7}>
          <LeftSideMenu selectedShapeData={selectedShapeData} onUpdatePramter={onUpdatePramter} />
        </Col>
        <Col span={17} style={{ height: "100%" }}>
          <canvas {...{}} className="canvas" ref={gmRef} />
        </Col>
      </Row>
    </GmContext.Provider>
  );
};
export default Editor;

// On Windows Shift + Alt + F.
// On Mac Shift + Option + F.
