import { onMount } from "solid-js";
import * as d3 from "d3";
import worldData from "../lib/world.json";

const GlobeComponent = (props: { showLegend?: boolean }) => {
  let mapContainer: HTMLDivElement | undefined;

  const visitedCountries = [
    "Philippines",
  ];

  const plannedCountries = [
    "Japan",
    "Canada",
    "Australia",
    "Netherlands"
  ];

  onMount(() => {
    if (!mapContainer) return;

    const width = mapContainer.clientWidth;
    const height = 500;
    const sensitivity = 75;

    let projection = d3
      .geoOrthographic()
      .scale(250)
      .center([0, 0])
      .rotate([0, -30])
      .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    let pathGenerator = d3.geoPath().projection(projection);

    let svg = d3
      .select(mapContainer)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("circle")
      .attr("fill", "#EEE")
      .attr("stroke", "#000")
      .attr("stroke-width", "0.2")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", initialScale);

    let map = svg.append("g");

    map
      .append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(worldData.features)
      .enter()
      .append("path")
      .attr("d", (d: any) => pathGenerator(d as any))
      .attr("fill", (d: { properties: { name: string } }) =>
        visitedCountries.includes(d.properties.name) ? "#E63946" :
        plannedCountries.includes(d.properties.name) ? "#34883a" : "white"
      )
      .style("stroke", "black")
      .style("stroke-width", 0.3)
      .style("opacity", 0.8);

    const drag = d3.drag().on("drag", (event) => {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
      svg.selectAll("path").attr("d", (d: any) => pathGenerator(d as any));
    });

    svg.call(drag);

    d3.timer(() => {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([rotate[0] - 1 * k, rotate[1]]);
      svg.selectAll("path").attr("d", (d: any) => pathGenerator(d as any));
    }, 200);
  });

  return (
    <div class="flex flex-col text-white justify-center items-center w-full h-full">
      <div class="w-full" ref={mapContainer}></div>
      {props.showLegend !== false && (
        <div class="absolute top-0 right-0 flex flex-col mt-4 mr-4 p-4 bg-darkslate-500 shadow-lg rounded-lg border border-darkslate-100">
          <div class="flex items-center mb-4">
            <span class="block w-4 h-4 bg-[#E63946] mr-2 rounded-full"></span>
            <span>Visited</span>
          </div>
          <div class="flex items-center">
            <span class="block w-4 h-4 bg-[#34883a] mr-2 rounded-full"></span>
            <span>Planned</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
