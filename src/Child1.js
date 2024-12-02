import React, { Component } from 'react';
import * as d3 from 'd3';
import './Child1.css';

class Child1 extends Component {
    constructor(props) {
        super(props);
        
    }
   
  componentDidMount() {
    this.renderStreamgraph(this.props.csv_data);
  }

  componentDidUpdate() {
    this.renderStreamgraph(this.props.csv_data);
  }

  renderStreamgraph = (csv_data) => {
    console.log("Data received in renderStreamgraph:", csv_data);
    console.log("Data type:", typeof csv_data);
    console.log("Is Array:", Array.isArray(csv_data));
    if (!csv_data || !csv_data.length) {
        console.error("No data provided for rendering the streamgraph.");
        return;
    }
    console.log("Rendering Streamgraph with Data:", csv_data); // Debugging

    d3.select("#chart-container").selectAll("*").remove();

    const colors = {
      'GPT-4': '#e41a1c',
      'Gemini': '#377eb8',
      'PaLM-2': '#4daf4a',
      'Claude': '#984ea3',
      'LLaMA-3.1': '#ff7f00'
    };

    const margin = { top: 20, right: 150, bottom: 30, left: 50 };
    const width = 660 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const keys = Object.keys(csv_data[0]).filter(d => d !== "Date");
    const keys2 = ["LLaMA-3.1", "Claude", "PaLM-2", "Gemini", "GPT-4"];


    csv_data.forEach(d => {
      d.Date = new Date(d.Date);
      keys.forEach(key => d[key] = +d[key]);
    });

    const stack = d3.stack().keys(keys).offset(d3.stackOffsetWiggle);
    const stackedData = stack(csv_data);

    const x = d3.scaleTime()
      .domain(d3.extent(csv_data, d => d.Date))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
      .range([height-90, 0]);

    const area = d3.area()
      .x(d => x(d.data.Date))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveCardinal);

    svg.selectAll("path")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("d", area)
      .attr("fill", d => colors[d.key])
      .on("mouseover", (event, d) => {
        d3.select(".tooltip").style("opacity", 1);
        this.updateTooltip(d);
      })
      .on("mousemove", (event) => {
        d3.select(".tooltip")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        d3.select(".tooltip").style("opacity", 0);
      });

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    

    const legend = svg.append("g")
      .attr("transform", `translate(${width + 20},150)`);

    keys2.forEach((key, i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(0,${i * 25})`);

      legendItem.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", colors[key]);

      legendItem.append("text")
        .text(key)
        .attr("x", 30)
        .attr("y", 15);
    });

    const tooltip = d3.select("#chart-container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    this.updateTooltip = (layer) => {
      tooltip.html("");
      const tooltipWidth = 190;
      const tooltipHeight = 140;

      const miniSvg = tooltip.append("svg")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("transform", `translate(25,25)`);

      const miniX = d3.scaleBand()
        .domain(csv_data.map(d => d.Date))
        .range([0, 150])
        .padding(0.1);

      const miniY = d3.scaleLinear()
        .domain([0, d3.max(layer, d => d[1] - d[0])])
        .range([100, 0]);

      miniSvg.selectAll("rect")
        .data(layer)
        .join("rect")
        .attr("x", d => miniX(d.data.Date))
        .attr("y", d => miniY(d[1] - d[0]))
        .attr("width", miniX.bandwidth())
        .attr("height", d => 100 - miniY(d[1] - d[0]))
        .attr("fill", colors[layer.key]);

        miniSvg.append("g")
        .attr("transform", `translate(0,${tooltipHeight-40})`) 
        .call(d3.axisBottom(miniX))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "2px");

        miniSvg.append("g")
        .attr("transform", "translate(2,0)")
        .call(d3.axisLeft(miniY))
        .selectAll("text")
        .style("font-size", "5px");
    };
  }

  render() {
    return (
      <div id="chart-container"></div>
    );
  }
}

export default Child1;
