// create a function to make the chart
function makeChart(sample){
    d3.json("samples.json").then(function(data) {
        var samples = data.samples;
        var resultsArray = samples.filter(function(data) {
            return data.id === sample;
        })
        var result = resultsArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        console.log(otu_ids);
        console.log(otu_labels);
        console.log(sample_values);

        var bubbleChart = {
            title: "Cultures per Sample",
            margin: {t: 50},
            xaxis: {title: "OTU ID"}
        }

        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Tealrose"
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleChart);

        var yticks = otu_ids.slice(0,10).map(function(otuID){
            return `OTU ${otuID}`;
        }).reverse();
        
        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0,10).reverse(),
                text: otu_labels.slice(0,10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];

        var barChart = {
            title: "Top Bacteria Cultures",
            margin: {t: 40, l: 100}
        };

        Plotly.newPlot("bar", barData, barChart);
    })
}



// create a function to supply the metadata
function addMetadata(sample) {
    d3.json("samples.json").then(function(data) {
        var metadata = data.metadata;
        var resultsArray = metadata.filter(function(data) {
            return data.id == sample;
        })
        var result = resultsArray[0];
        var panel = d3.select("#sample-metadata");

        panel.html("");

        Object.entries(result).forEach(function([key,value]){
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`)

        })
    })
}




// create a function for the drop down
function init(){    
    // create the selector 
    var selector = d3.select("#selDataset");

    // populate the drop down with sample names
    d3.json("samples.json").then(function(data) {
        console.log(data);
        var sampleNames = data.names;

        sampleNames.forEach(function(name){
            selector.append("option").text(name).property("value", name)
        })

        var firstSample = sampleNames[0];
        // console.log(firstSample);
        makeChart(firstSample);
        addMetadata(firstSample);

    })
}

// create a function to update for each sample
function optionChanged(newSample){
    makeChart(newSample);
    addMetadata(newSample);
}


// initialize
init()
