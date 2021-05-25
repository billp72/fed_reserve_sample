import React, { createRef, useEffect } from 'react';
import * as d3 from 'd3';
import classnames from 'classnames';
import drawAxis from './axis';
import drawTooltip from './tooltips';

import './index.scss';

const BaseChart = (drawChart, extraProps) => {
  function Chart(props) {
    const svgRef = React.createRef();
    const tooltipRef = React.createRef();
    const { axisProps, data, svgProps, tooltipClass, scaleBandPadding, ...restProps } = props;
    const { useScaleBands, findHoverData } = extraProps;

    const { margin, width, height, svgContainerClass } = svgProps;

    const yMinValue = d3.min(data, (d) => d.value);
    const yMaxValue = d3.max(data, (d) => d.value);

    const xMinValue = d3.min(data, (d) => d.label);
    const xMaxValue = d3.max(data, (d) => d.label);

    let xScale = d3
      .scaleLinear()
      .domain([xMinValue, xMaxValue])
      .range([0, width]);

    if (useScaleBands.x) {
      xScale = d3.scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.label))
        .padding(scaleBandPadding);
    }

    let yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, yMaxValue]);

    if (useScaleBands.y) {
      yScale = d3.scaleBand()
        .range([height, 0])
        .domain(data.map((d) => d.value))
        .padding(scaleBandPadding);
    }

    useEffect(() => {
      flushChart();
      draw();
    });

    function flushChart() {
      d3.select(svgRef.current).selectAll('*').remove();
    }

    function draw() {
      const svg = d3
        .select(svgRef.current)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr('viewBox', `0 0 1097 405`)
        //.attr('width', boxWidth)
        //.attr('height', boxHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${10})`);

      drawAxis({
        ...axisProps,
        ...svgProps,
        ...extraProps,
        data,
        svgRef,
        xScale,
        yScale,
      });

      drawChart({
        svgRef,
        data,
        xScale,
        yScale,
        ...svgProps,
        ...restProps,
      });

      drawTooltip({
        useScaleBands,
        svgRef,
        tooltipRef,
        data,
        xScale,
        yScale,
        findHoverData,
        ...svgProps,
        ...restProps,
      });
    }

    return (
      <div className="base__container">
        <svg
          ref={svgRef}
          className={classnames('base__svg-container', svgContainerClass)}
        />
        <div className={classnames('base__tooltip', tooltipClass)} ref={tooltipRef} />
      </div>
    )
  }

  Chart.defaultProps = {
    scaleBandPadding: 0.05,
  }

  return Chart;
}
export default BaseChart;