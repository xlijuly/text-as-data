// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei = document.getElementById("folio");
let tei_xml = tei.innerHTML;
let extension = ".xml";
let folio_xml = tei_xml.concat(extension);
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);

// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});


// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_text.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }
  
// function to transform the metadata encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
  function statsLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }

  // Initial document load
  documentLoader();
  statsLoader();
  // Event listener for sel1 change
  function selectHand(event) {
  var visible_mary = document.getElementsByClassName('#MWS');
  var visible_percy = document.getElementsByClassName('#PBS');
  var mary_base_text = document.getElementsByClassName('MWS-base');
  // Convert the HTMLCollection to an array for forEach compatibility
  var MaryArray = Array.from(visible_mary);
  var PercyArray = Array.from(visible_percy);
  var MaryBaseArray = Array.from(mary_base_text); 
    if (event.target.value == 'both') {
    //write an forEach() method that shows all the text written and modified by both hand (in black?). The forEach() method of Array instances executes a provided function once for each array element.
        [...MaryArray, ...MaryBaseArray].forEach(element => {
          element.style.color = 'black';
        });
        PercyArray.forEach(element => {
          element.style.color = 'black';
        });
    } else if (event.target.value == 'Mary') {
     //write an forEach() method that shows all the text written and modified by Mary in a different color (or highlight it) and the text by Percy in black. 
        [...MaryArray, ...MaryBaseArray].forEach(element => {
          element.style.color = '#A0522D';
        });
        PercyArray.forEach(element => {
          element.style.color = '#999999';
        });     
    } else {
     //write an forEach() method that shows all the text written and modified by Percy in a different color (or highlight it) and the text by Mary in black.
        [...MaryArray, ...MaryBaseArray].forEach(element => {
          element.style.color = '#999999';
        });
        PercyArray.forEach(element => {
          element.style.color = '#A0522D';
        });    
    }
  }
// write another function that will toggle the display of the deletions by clicking on a button
function toggleDeletions() {
  var deletions = document.getElementsByTagName('del');
  var deletionsArray = Array.from(deletions);
  var button = document.querySelector('button[onclick="toggleDeletions()"]');
  deletionsArray.forEach(element => {
    if (element.style.display == 'none') {
      element.style.display = 'inline';
      button.textContent = 'Hide Deletions';
    } else {
      element.style.display = 'none';
      button.textContent = 'Show Deletions';
    }
  });
}
// EXTRA: write a function that will display the text as a reading text by clicking on a button or another dropdown list, meaning that all the deletions are removed and that the additions are shown inline (not in superscript)

// function for the navigation Buttons in HTML:
function setupNavigation() {
  var pages = ['21r', '21v', '22r', '22v', '23r', '23v', '24r', '24v', '25r', '25v'];
  var currentPage = document.getElementById('folio').textContent;
  var currentIndex = pages.indexOf(currentPage);
  
  var previousButton = document.getElementById('prev-page');
  var nextButton = document.getElementById('next-page');
  
  if (currentIndex > 0) {
    previousButton.href = pages[currentIndex - 1] + '.html';
  } else {
    previousButton.classList.add('disabled');
  }
  
  if (currentIndex < pages.length - 1) {
    nextButton.href = pages[currentIndex + 1] + '.html';
  } else {
    nextButton.classList.add('disabled');
  }
}

document.addEventListener('DOMContentLoaded', setupNavigation);
