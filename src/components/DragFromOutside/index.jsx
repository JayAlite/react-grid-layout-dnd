import { useState } from "react";

import { Responsive, WidthProvider } from "react-grid-layout";

import "./drag-from-outside.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

function DragFromOutside(props) {
  const [appLayout, setAppLayout] = useState(null);
  const [layoutComponent, setLayoutComponent] = useState({});
  const [currentBreakPoint, setCurrentBreakPoint] = useState("lg");

  const onAddItem = () => {
    const identifier = appLayout?.[currentBreakPoint]?.length
      ? appLayout?.[currentBreakPoint]?.length.toString()
      : "0";
    setAppLayout({
      ...appLayout,
      [currentBreakPoint]: appLayout?.[currentBreakPoint]
        ? [
            ...appLayout[currentBreakPoint],
            {
              i: identifier,
              x: (appLayout[currentBreakPoint].length * 2) % 12,
              y: Infinity,
              w: 2,
              h: 1,
            },
          ]
        : [
            {
              i: identifier,
              x: 0,
              y: Infinity,
              w: 2,
              h: 1,
            },
          ],
    });
    setLayoutComponent({
      ...layoutComponent,
      [identifier]: {
        label: `widget - ${Math.random()}`,
        properties: { id: "xyz", type: "chart" },
      },
    });
  };

  const onRemoveItem = (currentItem, index) => {
    const layoutObject = {};
    //remove item === current item from app layout
    //result -> 0,1,3,4
    let currentLayout = appLayout[currentBreakPoint].filter(
      (item) => item.i !== currentItem.i
    );

    // create new layout component data i.e. key-value pair based on new layout having indices reseted in order (eg 0,1,2,3)
    currentLayout = currentLayout.map((item, index) => {
      if (parseInt(item.i) === index + 1) {
        layoutObject[index.toString()] =
          layoutComponent[(index + 1).toString()];
      } else {
        layoutObject[index.toString()] = layoutComponent[index.toString()];
      }

      if (parseInt(item.i) === index + 1) {
        item.i = index.toString();
      }
      return item;
    });

    setAppLayout({
      ...appLayout,
      [currentBreakPoint]: currentLayout,
    });

    setLayoutComponent(layoutObject);
  };

  const onDragStart = (event) => {
    const setWidgetID = event?.target?.getAttribute("data-widget-id");
    event?.dataTransfer?.setData("text/plain", setWidgetID);
  };

  const onBreakpointChange = (newBreakpoint) => {
    setCurrentBreakPoint(newBreakpoint);
  };

  const onDrop = (layout, currentItem, event) => {
    const getWidgetID = event?.dataTransfer?.getData("text/plain");

    const identifier = layout?.[currentBreakPoint]?.length
      ? layout?.[currentBreakPoint]?.length.toString()
      : "0";

    setAppLayout({
      ...appLayout,
      [currentBreakPoint]: appLayout?.[currentBreakPoint]
        ? [
            ...appLayout[currentBreakPoint],
            {
              i: identifier,
              x: currentItem?.x,
              y: currentItem?.y,
              w: currentItem?.w,
              h: currentItem?.h,
            },
          ]
        : [
            {
              i: identifier,
              x: currentItem?.x,
              y: currentItem?.y,
              w: currentItem?.w,
              h: currentItem?.h,
            },
          ],
    });

    setLayoutComponent({
      ...layoutComponent,
      [identifier]: {
        label: `widget - ${Math.random()}`,
        properties: { id: getWidgetID, type: "chart" },
      },
    });
  };

  const onDragStop = (
    layout,
    oldItem,
    newItem,
    placeHolder,
    event,
    element
  ) => {
    setAppLayout({
      ...appLayout,
      [currentBreakPoint]: layout?.map((item) => item),
    });
  };

  const onResizeStop = (
    layout,
    oldItem,
    newItem,
    placeHolder,
    event,
    element
  ) => {
    setAppLayout({
      ...appLayout,
      [currentBreakPoint]: layout?.map((item) => item),
    });
  };

  return (
    <>
      <div
        className="droppable-element"
        draggable
        unselectable="on"
        data-widget-id="google-analytics-total-user-widget"
        onDragStart={onDragStart}
      ></div>

      <div
        className="droppable-element"
        draggable
        unselectable="on"
        data-widget-id="google-analytics-total-widget"
        onDragStart={onDragStart}
      ></div>

      <button onClick={onAddItem}>Add Items</button>
      <ResponsiveGridLayout
        // onLayoutChange={onLayoutChange}
        onBreakpointChange={onBreakpointChange}
        layout={appLayout}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        useCSSTransforms
        isDroppable
        className="layout responsive-grid-layout"
        onDrop={onDrop}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
      >
        {appLayout?.[currentBreakPoint]?.map(
          (childElement, childElementIndex) => (
            <div className="react-grid-item" key={childElementIndex}>
              <button
                className="deleteButton"
                onClick={() => onRemoveItem(childElement, childElementIndex)}
              >
                Remove
              </button>
              <div>{layoutComponent[childElement?.i]?.label}</div>
            </div>
          )
        )}
      </ResponsiveGridLayout>
    </>
  );
}

export default DragFromOutside;
