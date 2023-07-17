function getPlots(id) {
    // Read samples.json
    const url =
      "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
    d3.json(url).then((sampledata) => {
      console.log(sampledata);
      var ids = sampledata.samples[0].otu_ids;
      console.log(ids);
      var sampleValues = sampledata.samples[0].sample_values.slice(0, 10).reverse();
      console.log(sampleValues);
      var labels = sampledata.samples[0].otu_labels.slice(0, 10);
      console.log(labels);
      // Get only top 10 otu ids for the plot OTU and reversing it.
      var OTU_top = sampledata.samples[0].otu_ids.slice(0, 10).reverse();
      // Get the otu id's to the desired form for the plot
      var OTU_id = OTU_top.map((d) => "OTU " + d);
      console.log(`OTU IDS: ${OTU_id}`);
      // Get the top 10 labels for the plot
      console.log(`OTU_labels: ${labels}`);
      var trace = {
        x: sampleValues,
        y: OTU_id,
        text: labels,
        marker: {
          color: "blue",
        },
        type: "bar",
        orientation: "h",
      };
      // Create data variable
      var data = [trace];
  
      // Create layout variable to set plot layout
      var layout = {
        title: "Top 10 OTU",
        yaxis: {
          tickmode: "linear",
        },
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 30,
        },
      };
  
      // Create the bar plot
      Plotly.newPlot("bar", data, layout);
      // The bubble chart
      var trace1 = {
        x: sampledata.samples[0].otu_ids,
        y: sampledata.samples[0].sample_values,
        mode: "markers",
        marker: {
          size: sampledata.samples[0].sample_values,
          color: sampledata.samples[0].otu_ids,
        },
        text: sampledata.samples[0].otu_labels,
      };
  
      // Set the layout for the bubble plot
      var layout_2 = {
        xaxis: {
          title: "OTU ID",
        },
        height: 600,
        width: 1000,
      };
  
      // Create data variable
      var data1 = [trace1];
  
      // Create the bubble plot
      Plotly.newPlot("bubble", data1, layout_2);
  
      // Call the function to build the gauge chart
      buildGaugeChart(sampledata, id);
    });
  }
  
  // Create the function to get the necessary data
  function getDemoInfo(id) {
    // Read the json file to get data
    d3.json("samples.json").then((data) => {
      // Get the metadata info for the demographic panel
      var metadata = data.metadata;
  
      console.log(metadata);
  
      // Filter meta data info by id
      var result = metadata.filter((meta) => meta.id.toString() === id)[0];
      // Select demographic panel to put data
      var demographicInfo = d3.select("#sample-metadata");
  
      // Empty the demographic info panel each time before getting new id info
      demographicInfo.html("");
  
      // Grab the necessary demographic data for the id and append the info to the panel
      Object.entries(result).forEach((key) => {
        demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1]);
      });
    });
  }
  
  function buildGaugeChart(sampledata, id) {
    // Retrieve metadata for the selected ID
    var metadata = sampledata.metadata;
    var washFrequency = metadata.filter((m) => m.id.toString() === id)[0].wfreq;
  
    // Set up the trace for the gauge chart
    var trace2 = {
      value: washFrequency,
      domain: { x: [0, 1], y: [0, 1] },
      title: {
        text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        font: { color: "black", size: 16 },
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 10], tickmode: "linear", tick0: 2, dtick: 2 },
        bar: { color: "black" },
        steps: [
          { range: [0, 1], color: "rgba(255, 255, 255, 0)" },
          { range: [1, 2], color: "rgba(232, 226, 202, .5)" },
          { range: [2, 3], color: "rgba(210, 206, 145, .5)" },
          { range: [3, 4], color: "rgba(202, 209, 95, .5)" },
          { range: [4, 5], color: "rgba(184, 205, 68, .5)" },
          { range: [5, 6], color: "rgba(170, 202, 42, .5)" },
          { range: [6, 7], color: "rgba(142, 178, 35 , .5)" },
          { range: [7, 8], color: "rgba(110, 154, 22, .5)" },
          { range: [8, 9], color: "rgba(50, 143, 10, 0.5)" },
          { range: [9, 10], color: "rgba(14, 127, 0, .5)" },
        ],
      },
    };
  
    // Set up the Layout
    var layout = {
      width: 400,
      height: 400,
      margin: { t: 0, b: 0 },
    };
  
    // Call Plotly to plot the gauge chart
    Plotly.newPlot("gauge", [trace2], layout);
  }
  
  // Create the function for the change event
  function optionChanged(id) {
    getPlots(id);
    getDemoInfo(id);
  }
  
  // Create the function for the initial data rendering
  function init() {
    // Select dropdown menu
    var dropdown = d3.select("#selDataset");
  
    // Read the data
    d3.json("samples.json").then((data) => {
      console.log(data);
  
      // Get the id data to the dropdown menu
      data.names.forEach(function (name) {
        dropdown.append("option").text(name).property("value", name);
      });
  
      // Call the functions to display the data and the plots on the page
      getPlots(data.names[0]);
      getDemoInfo(data.names[0]);
    });
  }
  
  init();
  