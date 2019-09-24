import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from "victory";

import calc from "./calc";

function App() {
  const turns = 10000000;

  const bob = calc(turns);

  const props = {};
  props.data = bob.map(thing => thing[0]);

  props.label = bob.map(thing => thing[1]);
  // https://codepen.io/mkate/pen/WEZqmm?editors=1000
  const d3Container = useRef(null);

  const svgWidth = 1000;
  const svgHeight = 1000;

  return (
    <VictoryChart domainPadding={10}>
      <VictoryBar
        style={{ data: { fill: "#c43a31" } }}
        alignment="start"
        labels={d => d.datum.y.toFixed(2)}
        data={bob.map(thing => {
          return {
            // x: thing[1],
            y: (100 * thing[0]) / turns
          };
        })}
        style={{ labels: { fontSize: 4, textAnchor: "start", padding: 2 } }}
      />
      <VictoryAxis
        tickValues={Array.from(Array(props.label.length).keys())}
        tickFormat={t => props.label[t]}
        verticalAnchor="start"
        style={{
          tickLabels: {
            fontSize: 5,
            padding: 5,
            angle: 90,
            verticalAnchor: "end",
            textAnchor: "start"
          }
        }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={t => t + "%"}
        style={{ tickLabels: { fontSize: 8 } }}
      />
    </VictoryChart>
  );
}

export default App;
