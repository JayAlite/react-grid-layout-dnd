import { useState } from "react";

import { Responsive, WidthProvider } from "react-grid-layout";

import "./drag-from-outside.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

function DragFromOutside(props) {
  const [currentBreakPoint, setCurrentBreakPoint] = useState("lg");

  const mirrorToLocalStorage = (localStorageKey, itemToBeStore) => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(itemToBeStore));
  };

  const onAddItem = () => {
    props.setLayout((prevValue) => {
      return {
        ...prevValue,
        [currentBreakPoint]: prevValue[currentBreakPoint]?.concat({
          i: (prevValue[currentBreakPoint]?.length + 1).toString(),
          x: (prevValue[currentBreakPoint].length * 2) % 12,
          y: Infinity,
          w: 2,
          h: 1,
        }),
      };
    });
  };

  const onRemoveItem = (currentItem, index) => {
    props.setLayout((prevValue) => {
      const filterItems = prevValue[currentBreakPoint]?.filter(
        (item) => item?.i !== currentItem?.i
      );
      return {
        ...prevValue,
        [currentBreakPoint]: filterItems,
      };
    });
  };

  const onDragStart = (event) => {
    const setWidgetID = event?.target?.getAttribute("data-widget-id");
    event?.dataTransfer?.setData("text/plain", setWidgetID);
  };

  const onLayoutChange = (currentLayout, allLayout) => {
    // if (
    //   !allLayout[currentBreakPoint].find((li) => li.i === "__dropping-elem__")
    // ) {
    //   props.onLayoutChange(currentLayout, allLayout);
    //   mirrorToLocalStorage("layouts", allLayout);
    // }

    props.onLayoutChange(currentLayout, allLayout);
    mirrorToLocalStorage("layouts", allLayout);
  };

  const onBreakpointChange = (newBreakpoint) => {
    setCurrentBreakPoint(newBreakpoint);
  };

  const onDrop = (layout, currentItem, event) => {
    alert(JSON.stringify(currentItem, 2));
    // const getWidgetID = event?.dataTransfer?.getData("text/plain");
    // const tempArray = [];
    // const allLayout = { lg: [], md: [], sm: [], xs: [], xxs: [] };

    // tempArray.push({
    //   i: getWidgetID,
    //   x: currentItem?.x,
    //   y: currentItem?.y,
    //   w: currentItem?.w,
    //   h: currentItem?.h,
    // });

    // allLayout[currentBreakPoint].push({
    //   i: getWidgetID,
    //   x: currentItem?.x,
    //   y: currentItem?.y,
    //   w: currentItem?.w,
    //   h: currentItem?.h,
    // });

    // console.log('tempArray, allLayout', {tempArray, allLayout})

    // onLayoutChange(tempArray, allLayout);

    // props.setLayout((prevValue) => {
    //   return {
    //     ...prevValue,
    //     [currentBreakPoint]: prevValue[currentBreakPoint]?.concat({
    //       i: getWidgetID,
    //       x: currentItem.x,
    //       y: currentItem.y,
    //       w: currentItem.w,
    //       h: currentItem.h,
    //     }),
    //   };
    // });
  };

  return (
    <>
      <div
        className="droppable-element"
        draggable
        data-widget-id="google-analytics-total-user-widget"
        onDragStart={onDragStart}
      ></div>
      <button onClick={onAddItem}>Add Items</button>
      <ResponsiveGridLayout
        className="layout responsive-grid-layout"
        layouts={props?.layout}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        onLayoutChange={onLayoutChange}
        onBreakpointChange={onBreakpointChange}
        isDroppable
        useCSSTransforms
        onDrop={onDrop}
        onDropDragOver={(event) => {
          event.preventDefault();
        }}
      >
        {props?.layout[currentBreakPoint]?.map((item, itemIndex) => {
          return (
            <div key={itemIndex}>
              <span className="text">{item?.i}</span>
              <button onClick={() => onRemoveItem(item, itemIndex)}>
                Remove Item
              </button>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </>
  );
}

export default DragFromOutside;
