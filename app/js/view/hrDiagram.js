import * as d3 from "d3"

export default class hrDiagram {
  /**************************************************************************************************/  
    constructor() {
      this.hrDiagContainer = document.getElementById("hrDiagram");    
      this.width = this.hrDiagContainer.offsetWidth; 
      this.height = this.hrDiagContainer.offsetHeight;
      this.margin = ({top: 30, left: 40, right:40, bottom:40});
      this.xScale = [];
      this.yScale = [];

      this.id = "hrDiagram";
      this.csvFilePath = "./data/XYZ85Clusters.csv";
      this.data = null;

      this.readFile(this.csvFilePath);
    }
  /**************************************************************************************************/     

  /**************************************************************************************************/     
    readFile(csvFilePath) {
      fetch(csvFilePath)
      .then(response => response.text())
      .then(csvData => {
          const data = d3.csvParse(csvData);
          this.data = data;
          let maxX = d3.max(data, function(d) { return d.color; } );
          let minX = d3.min(data, function(d) { return d.color; } );
          this.xScale = d3.scaleLinear([minX, maxX], [this.margin.left +40, this.width - this.margin.right]);
          let maxY = d3.max(data, function(d) { return d.absolute_magnitude; } );
          let minY = d3.min(data, function(d) { return d.absolute_magnitude; } );
          this.yScale = d3.scaleLinear([minY, maxY], [this.margin.top, this.height - this.margin.bottom]);

          const hrDiagContainer = this.hrDiagContainer;
          const chartSVG = this.chartGenerator(data, this.xScale, this.yScale, this.colormap, this.width, this.height, this.margin, this.temperature);
          hrDiagContainer.appendChild(chartSVG);
      })
      .catch(error => {
          // 处理错误
          console.error("Error fetching the CSV file:", error);
      });
    }
  /**************************************************************************************************/     
  
  /**************************************************************************************************/ 
    chartGenerator(data, x, y, z, width, height, margin, temperature) {
      const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        //.style("margin", "0 0px")
        .style("background", "#fff")
        .style("color", "#000")
        .style("display", "block")
        .attr("fill", "currentColor")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);
      
   
      svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.color))
        .attr("cy", d => y(d.absolute_magnitude))
        .attr("fill", d => z(d.color))
        .attr("r", 1)
        .style("opacity", 1)
        .attr("data-index", (d, i) => i);  // 添加编号属性       
 
      // svg.append("g")
      //   .selectAll("rect")
      //   .data(data)
      //   .join("rect")
      //   .attr("x", d => x(d.color))
      //   .attr("y", d => y(d.absolute_magnitude))
      //   .attr("fill", "white")
      //   .attr("width", 1)
      //   .attr("height", 1)
      //   .style("opacity", 0.5);
    
      svg.selectAll("circle")
        .on("click", function(event, i, d) {
          let circleIndex = event.currentTarget.getAttribute("data-index");
          d3.select(this)
            .attr("r", 8) 
            .attr("fill", "black")
            .style("opacity", 1);  // 更改颜色以表示高亮
      
        let X=data[circleIndex].X;
        let Y=data[circleIndex].Y;
        let Z=data[circleIndex].Z;
      
        window.parent.postMessage({ type: 'circleClick', X:X,Y:Y,Z:Z }, '*');          
      });
        
      
      svg.selectAll("circle")
        .on("mouseover", function(event, d) {
            // 鼠标指向数据点时触发
            const circle = d3.select(this);
            circle.attr("r", 8) 
              .attr("fill", "red")
              .style("opacity", 1);  // 更改颜色以表示高亮
      
            // 获取圆点的位置信息
            const cx = +circle.attr("cx");
            const cy = +circle.attr("cy");
        
            // 绘制平行于 x 轴的线条
            svg.append("line")
              .attr("x1", cx)
              .attr("y1", 0)
              .attr("x2", cx)
              .attr("y2", height)
              .attr("stroke", "gray")
              .attr("stroke-width", 1);    
            // 绘制平行于 y 轴的线条
            svg.append("line")
              .attr("x1", 0)
              .attr("y1", cy)
              .attr("x2", width)
              .attr("y2", cy)
              .attr("stroke", "gray")
              .attr("stroke-width", 1);   
        })
        .on("mouseout", function(event, d) {
          // 鼠标移出数据点时触发
          d3.select(this)
            .attr("r", 1.5)   
            .attr("fill", d => z(d.color));  // 恢复原始颜色
      
            //remove the line
            svg.selectAll("line").remove();
        });
      
      // 8. 移除默认的轴线样式
      svg.selectAll(".domain").remove();

      /********************************************************************************************/
      // 4. 添加左侧y轴
      svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(
          d3.axisLeft(d3.scaleLog(y.domain().map(m => Math.pow(10, 4.83 - m)),  y.range()))
          )
        .selectAll("text")
        .style("font-size", "8px");
      // 9. 添加左侧y轴标题
      svg.append("text")
        //.attr("dy", -15)
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${10}, ${(height ) / 2}) rotate(-90)`)
        .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← darker\xa0"))
        .call(text => text.append("tspan").attr("font-weight", "bold").text("\xa0Luminosity L☉\xa0"))
        .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("\xa0brighter →"));
      /********************************************************************************************/

     /********************************************************************************************/
      // 5. 添加右侧y轴
      svg.append("g")
        .attr("transform", `translate(${width - margin.right-10},0)`)
        .call(d3.axisRight( y).ticks(null, "+"))
        .selectAll("text")
        .style("font-size", "10px");
          // 10. 添加右侧y轴标题
      svg.append("text")
        //.attr("dy", -6)
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${( width - 10)},${(height) / 2}) rotate(-90)`)
        .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← darker\xa0"))
        .call(text => text.append("tspan").attr("font-weight", "bold").text("\xa0Absolute magnitude M\xa0"))
        .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("\xa0brighter →"));
     /********************************************************************************************/

     /********************************************************************************************/
      // 6. 添加顶部x轴
      svg.append("g")
        .attr("transform", `translate(0, ${margin.top})`)
        .call(d3.axisTop(d3.scaleLinear(x.domain().map(temperature),  x.range())))
        .selectAll("text")
        .style("font-size", "10px");

      // 11. 添加顶部x轴标题
      svg.append("text")
        .attr("x", (width) / 2)
        .attr("y", 0)
        .attr("dy", 12)
        .attr("text-anchor", "middle")
        .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← hotter\xa0"))
        .call(text => text.append("tspan").attr("font-weight", "bold").text("\xa0Temperature K\xa0"))
        .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("\xa0colder →"));
     /********************************************************************************************/

      /********************************************************************************************/
      // 7. 添加底部x轴
      svg.append("g")
        .attr("transform", `translate(0,${height -  margin.bottom + 10})`)
        .call(d3.axisBottom(x).ticks(null, "+f"))
        .selectAll("text")
        .style("font-size", "10px");

      // 12. 添加底部x轴标题
      svg.append("text")
        .attr("x", (margin.left +  width -  margin.right) / 2)
        .attr("y", height-5)
        //.attr("dy", -6)
        .attr("text-anchor", "middle")
        .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← blue\xa0"))
        .call(text => text.append("tspan").attr("font-weight", "bold").text("\xa0Color B-V\xa0"))
        .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("\xa0red →"));
      /********************************************************************************************/

      // 8. 移除默认的轴线样式
      svg.selectAll(".domain").remove();
      // 13. 返回SVG元素
      return svg.node();
    }
  /**************************************************************************************************/ 

  /**************************************************************************************************/     
  colormap(value) { 
    let bv = Math.max(-0.39, Math.min(1.85, value));
    bv = (bv+ 0.4) / (1.85 + 0.4);    
    let t = Math.max(0, Math.min(1, bv));

    return "rgb("
        + Math.max(0, Math.min(255, Math.round(34.61 + t * (1172.33 - t * (10793.56 - t * (33300.12 - t * (38394.49 - t * 14825.05))))))) + ", "
        + Math.max(0, Math.min(255, Math.round(23.31 + t * (557.33 + t * (1225.33 - t * (3574.96 - t * (1073.77 + t * 707.56))))))) + ", "
        + Math.max(0, Math.min(255, Math.round(27.2 + t * (3211.1 - t * (15327.97 - t * (27814 - t * (22569.18 - t * 6838.66)))))))
         + ")";
    }
  /**************************************************************************************************/ 

  /**************************************************************************************************/ 
    temperature(color) {
        return 4600 * (1 / (0.92 * color + 1.7) + 1 / (0.92 * color + 0.62));
    }
  /**************************************************************************************************/ 

  /**************************************************************************************************/ 
    bv2rgb(value) {
      let bv = Math.max(-0.4, Math.min(2, value));
      let t;

      return `#${[
          bv < 0 ? (t = (bv + 0.4) / 0.4, 0.61 + (0.11 * t) + (0.1 * t * t))
            : bv < 0.4 ? (t = bv / 0.4, 0.83 + (0.17 * t))
            : 1,
          bv < 0 ? (t = (bv + 0.4) / 0.4, 0.70 + (0.07 * t) + (0.1 * t * t))
            : bv < 0.4 ? (t = bv / 0.4, 0.87 + (0.11 * t))
            : bv < 1.6 ? (t = (bv - 0.4) / 1.20, 0.98 - (0.16 * t))
            : (t = (bv - 1.6) / 0.4, 0.82 - (0.5 * t * t)), 
          bv < 0.4 ? 1
            : bv < 1.5 ? (t = (bv - 0.4) / 1.1, 1 - (0.47 * t) + (0.1 * t * t))
            : bv < 1.94 ? (t = (bv - 1.5) / 0.44, 0.63 - (0.6 * t * t))
            : 0
        ].map(t => Math.round(t * 255).toString(16).padStart(2, "0")).join("")}`;
    }
  /**************************************************************************************************/
}