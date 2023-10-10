import * as d3 from "d3"
import * as druid from '@saehrimnir/druidjs';

export default class DimRed {
    /**************************************************************************************************/
    constructor() {
        //initiate the status
        this.csvFilePath = "./data/EverythingEverwhereAATO85Clusters.csv";
        this.data = null;
        this.dataArray = null;
        this.attributes = null; //["ra","er_ra","dec","er_dec","parallax","er_parallax","pmra","er_pmra","pmdec","er_pmdec","Gmag","BP","RP","Gaia_rad_v","er_Gaia_radial_velo","Mass","X_obs","Y_obs","Z_obs","X_cor","Y_cor","Z_cor","Dist_cor"];
        this.selectedAttributes = document.getElementById("selectedAttributes");
        this.selectedAttributesIndex=[0, 1];
        this.DRresults = null;
        this.attributeCheckboxes = document.getElementById("attributeCheckboxes");
        this.dimRedContainer = document.getElementById("dimRed"); 
        this.formContainer = document.getElementById("attributeForm"); 
        this.scatterContainer = document.getElementById("scatterplot");     
        this.selectedAttributesIndex=[0, 1];  
        this.margin = {top: 3, left: 35, right: 10, bottom: 10};  

        //load and plor the dataset
        if (this.csvFilePath)  {
            this.readData(this.csvFilePath);
        }        
    }
    /**************************************************************************************************/

    /**************************************************************************************************/
    //load data
   readData(csvFilePath) {
    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvData => {
            this.data = d3.csvParse(csvData);
            //setup the container
            this.setupContainer();
        })
        .catch(error => {
            // 处理错误
            console.error("Error fetching the CSV file:", error);
        });
    }
    /**************************************************************************************************/


    /**************************************************************************************************/
    //setup the html container
    setupContainer() {
        const data = this.data;
        this.attributes = data.columns;
        const dataArray = data.map(row => Object.values(row)); 
        this.dataArray = dataArray;

        //plot attributes
        this.plotAttrs();

        //setup the form lisenner
        this.addFormListener();

        //generate the view
        const chartSVG = this.Generator(dataArray);    
        document.getElementById("scatterplot").appendChild(chartSVG);
    }
    /**************************************************************************************************/
   
    /**************************************************************************************************/
    //plot attributes and related checkboxes & linstener
    plotAttrs() {           
        const attributes = this.attributes
        //output all attributes for the selected dataset
        attributes.forEach((attribute) => {
            const label = document.createElement("label");
            label.innerHTML = `<input style="width:8px; height:8px" type="checkbox" name="attribute" value="${attribute}"> ${attribute}`;
            this.attributeCheckboxes.appendChild(label);
        });

        //add linstener to the former
        this.addFormListener("attributeForm");
    }
    /**************************************************************************************************/
    
    /**************************************************************************************************/
    getIndicesOfElementsInBigArray(selectedAttributes) {
        const AllAttributes = this.attributes;
        const indices = [];
        
        for (let i = 0; i < selectedAttributes.length; i++) {
            const element = selectedAttributes[i];
            const index = AllAttributes.indexOf(element);

            if (index !== -1) {
                indices.push(index);
            }
        }
    
        return indices;
    }
    /**************************************************************************************************/

    /**************************************************************************************************/
    dimReduction() {
        // 从CSV数据中提取所需属性的值
        const data = this.dataArray;
        let results = [];    
        data.forEach(item => {
            const filteredData = this.selectedAttributesIndex.map(attribute => item[attribute]);
            results.push(filteredData);
        });
    
        //perform dimension reduction
        let matrix = druid.Matrix.from(results);
        const DR = new druid.PCA(matrix).transform(); //new druid.PCA(matrix).transform();
        let DRresults = [];
        let dataIndex = 0;
        let numRows = DR._rows; // 获取行数 (23434)
        let numCols = DR._cols; // 获取列数 (2)
              
        for (var i = 0; i < numRows; i++) {
            var rowData = [];
            for (var j = 0; j < numCols; j++) {
                rowData.push(DR._data[dataIndex]);
                dataIndex++;
            }
            DRresults.push(rowData);
        }

        this.DRresults = DRresults;         
    }
    /**************************************************************************************************/

    /**************************************************************************************************/
    Generator() {    
        
        const width = this.dimRedContainer.offsetWidth;  
        const height = this.dimRedContainer.offsetHeight - document.getElementById("attriRegion").offsetHeight; 
        const margin = this.margin;   
    
        const svg = d3.create("svg")
        svg.attr("viewBox", [0, 0, width, height])
            .style("margin", "0 0px")
            .style("background", "#ffff")
            .style("color", "#0000")
            .style("display", "block")
            .attr("fill", "currentColor")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10); 
        
        //perform dimension reduction
        this.dimReduction()
        const DRresults = this.DRresults;
            
        let proXValues = DRresults.map(item => item[0]);
        let proYValues = DRresults.map(item => item[1]);
       
    
        let minXPro = Math.min(...proXValues);
        let maxXPro = Math.max(...proXValues);
        let minYPro = Math.min(...proYValues);
        let maxYPro = Math.max(...proYValues);
     
        let xScale = d3.scaleLinear([minXPro, maxXPro], [margin.left, width - margin.right-20]);
        let yScale = d3.scaleLinear([maxYPro, minYPro], [margin.top, height - margin.bottom-20]);

 svg.append("g")
            .selectAll("circle")
            .data(DRresults)
            .join("circle")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("fill","blue")
            .attr("r", 1);

     svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(null, "f"))
            .selectAll("text")
            .style("font-size", "10px")
            .style("fill", "black");
                
        //plot x-axis 
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom-20})`)
            .call(d3.axisBottom(xScale).ticks(null, "f"))
            .selectAll("text")
            .style("font-size", "10px")
            .style("fill", "black");

            svg.selectAll(".domain")
            .style("stroke", "black");
            
        
            return svg.node();
    }
    /**************************************************************************************************/

    /**************************************************************************************************/
    addFormListener() {       
        this.formContainer.addEventListener("submit", (event) => this.lowDimPlot(event, "HHHHH"));
    }
    /**************************************************************************************************/    

    /**************************************************************************************************/
    //plot low dimension view
    lowDimPlot (event) {
        event.preventDefault();
    
        let selectedValues = [];
        const checkboxes = document.querySelectorAll('input[name="attribute"]:checked');
    
        checkboxes.forEach((checkbox) => {
            selectedValues.push(checkbox.value);
        }); 

        //output the selected attributes
        this.selectedAttributes.textContent = "Selected properties：" + selectedValues.join(", ");

        //plot the low dimension view        
        this.lowDimView(selectedValues);
    }

    lowDimView (selectedValues){
        this.selectedAttributesIndex = this.getIndicesOfElementsInBigArray(selectedValues);

        if (selectedValues.length >= 2) {          
            var resultArray = selectedValues.slice();
    
            // 过滤出大数组中没有重复的数，并添加到结果数组中
            resultArray = resultArray.concat(this.attributes.filter(function(item) {
                return selectedValues.indexOf(item) === -1;
            }));

            const chartSVG = this.Generator();
            const svgElement = this.scatterContainer.querySelector("svg");
            if (svgElement) {
                svgElement.parentNode.removeChild(svgElement);
            }
            this.scatterContainer.appendChild(chartSVG);
    
        } else {
            selectedAttributes.textContent = "Please select more than one property.";
        }
    }
    /**************************************************************************************************/
}









