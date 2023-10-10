import * as d3 from "d3"
import {parcoords} from "./multiviewLib/parcoords"

export default class multiVar {

    /**********************************************************************************************/
    constructor() {
        this.filePath = '../../data/EverythingEverwhereAATO85Clusters.csv';
        this.data = [];
        this.parviewContainer = document.getElementById("parView"); 
        this.readFile(this.filePath, "parView");
    }
    /**********************************************************************************************/


    /**********************************************************************************************/
    readFile(filePath, id) {
        fetch(filePath)
        .then(response => response.text())
        .then(csvData => {
            const data = d3.csvParse(csvData);
            const attributes = data.columns;
            const chartContainer = this.parviewContainer;    
            this.width = chartContainer.offsetWidth; 
            this.height = chartContainer.offsetHeight;
            //console.log(this.width,this.height);
            this.attributes = attributes;
            this.data = data;                   

            let parcoord =  parcoords()("#"+id)
                .dimensions(this.attributes)
                //.dimensions(["dec","er_dec","parallax","er_parallax","ra","er_ra","pmra","er_pmra","pmdec","er_pmdec","Gmag","BP","RP","Gaia_rad_v","er_Gaia_radial_velo","Mass","X_obs","Y_obs","Z_obs","X_cor","Y_cor","Z_cor","Dist_cor"])
                //.width(["100"])
                .color((d) => {return  this.color(d['ra']);})
                .alpha(0.4)
                .data(data)
                .hideAxis(["name"])
                .composite("darker")
                .render()
                .margin({ top: 44, left: 0, bottom: 0, right: 0 })
                .shadows()
                .reorderable()
                .mode("queue")
                .rate(250)
                .brushMode("1D-axes");  // enable brushing 
            //parcoord.getset(this.width, 100) 

                this.createBrush(parcoord);



        })
        .catch(error => {
            // 处理错误
            console.error("Error fetching the CSV file:", error);
        });
    }
    /**********************************************************************************************/

    /**********************************************************************************************/
    createBrush(parcoord) {
        let sltBrushMode = d3.select('#sltBrushMode'); 
    
        sltBrushMode
            .selectAll('option')
            .data(parcoord.brushModes())
            .enter()
            .append('option')
            .text(function(d) { return d; });  
    
        sltBrushMode.on('change', function() {
            parcoord.brushMode(this.value);
            
            switch(this.value) {
                case 'None':
                  d3.select("#pStrums").style("visibility", "hidden");
                  d3.select("#lblPredicate").style("visibility", "hidden");
                  d3.select("#sltPredicate").style("visibility", "hidden");
                  d3.select("#btnReset").style("visibility", "hidden");
                  break;
                case '2D-strums':
                  d3.select("#pStrums").style("visibility", "visible");
                  break;
                default:
                  d3.select("#pStrums").style("visibility", "hidden");
                  d3.select("#lblPredicate").style("visibility", "visible");
                  d3.select("#sltPredicate").style("visibility", "visible");
                  d3.select("#btnReset").style("visibility", "visible");
                  break;
                }
            });  
        sltBrushMode.property('value', '1D-axes');

        d3.select('#btnReset').on('click', function() {parcoord.brushReset();})
        d3.select('#sltPredicate').on('change', function() {
            parcoord.brushPredicate(this.value);
        });
    }
    /**********************************************************************************************/

    /**********************************************************************************************/
    color(val) {
        let bv = Math.max(-0.39, Math.min(360, val));
        let t = (bv+ 0.4) / (360 + 0.4);
        t = Math.max(0, Math.min(1, t));
    
        return "rgb("
            + Math.max(0, Math.min(255, Math.round(-4.54 - t * (35.34 - t * (2381.73 - t * (6402.7 - t * (7024.72 - t * 2710.57))))))) + ", "
            + Math.max(0, Math.min(255, Math.round(32.49 + t * (170.73 + t * (52.82 - t * (131.46 - t * (176.58 - t * 67.37))))))) + ", "
            + Math.max(0, Math.min(255, Math.round(81.24 + t * (442.36 - t * (2482.43 - t * (6167.24 - t * (6614.94 - t * 2475.67)))))))
            + ")";
    }  
    /**********************************************************************************************/ 
}