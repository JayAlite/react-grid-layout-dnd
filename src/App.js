import { useState } from "react";
import DragFromOutside from "./components/DragFromOutside";

function App() {
  const getLayout = JSON.parse(window.localStorage.getItem("layouts"));

  const [layout, setLayout] = useState(
    getLayout !== null && Object.keys(getLayout).length > 0
      ? getLayout
      : { lg: [], md: [], sm: [], xs: [], xxs: [] }
  );

  const onLayoutChange = (layout, allLayout) => {
    setLayout(allLayout);
  };

  return (
    <>
      <div>Hey I am making dynamic grid layout</div>
      <p>{JSON.stringify(layout, 2)}</p>
      <DragFromOutside
        onLayoutChange={onLayoutChange}
        layout={layout}
        setLayout={setLayout}
      />
    </>
  );
}

export default App;
