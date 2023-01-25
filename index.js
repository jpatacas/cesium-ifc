// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNjkzMzFhZC03ZjgwLTQ2NmItODU0ZS0xZGRmN2ViNzQ0ZTUiLCJpZCI6NTg1NjAsImlhdCI6MTY3NDU2MzU5Nn0.1fIBYuxgsizyyPiOMnE9uUSyqGSXTuC9rd93TamHJdk";

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: Cesium.createWorldTerrain(),
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
const buildingTileset = viewer.scene.primitives.add(
  Cesium.createOsmBuildings()
);

let htmlElem;

// define building position and orientation
const position = Cesium.Cartesian3.fromDegrees(-2.261282, 53.398754, 88);
const heading = Cesium.Math.toRadians(25.0);
const pitch = Cesium.Math.toRadians(0.0);
const roll = Cesium.Math.toRadians(0.0);
const orientation = Cesium.Transforms.headingPitchRollQuaternion(
  position,
  new Cesium.HeadingPitchRoll(heading, pitch, roll)
);

(async () => {
  "use strict";
  try {
    const resource = await Cesium.IonResource.fromAssetId(1511359);
    const entity = viewer.entities.add({
      position: position,
      model: {
        uri: resource,
      },
      description: htmlElem,
      orientation: orientation,
    });
    viewer.zoomTo(entity); //zoom to the building on start up
  } catch (error) {
    console.log(error);
  }
})();

getJSONProperties();

async function getJSONProperties() {
  try {
    const rawProperties = await fetch("./model_properties/properties.json");
    const properties = await rawProperties.json();
    // console.log(properties);

    for (let elem in properties) {
      if (properties[elem].type === "IFCBUILDING") {
        // console.log(properties[elem]);
        // console.log(Object.keys(properties[elem]).length);

        htmlElem = createDescription(
          Object.keys(properties[elem]).length,
          Object.keys(properties[elem]),
          Object.values(properties[elem])
        );
      }
    }
    // console.log(htmlElem);
    return htmlElem;
  } catch (error) {
    console.log(error);
  }
}

//create the html element to be inserted into 'description' and shown in the infoBox

function createDescription(numberOfEntries, keys, values) {

  let tableElem = document.createElement("table");
  tableElem.setAttribute("class", "cesium-infoBox-defaultTable");

  let tableBodyElem = document.createElement("tbody");

  //create table entries based on ifc data
  for (let i = 0; i < numberOfEntries; i++) {
    let tableEntryElem = document.createElement("tr");

    let thElem = document.createElement("th");
    thElem.innerText = keys[i];

    let tdElem = document.createElement("td");
    tdElem.innerText = values[i];

    tableEntryElem.appendChild(thElem);
    tableEntryElem.appendChild(tdElem);

    tableBodyElem.appendChild(tableEntryElem);
  }

  tableElem.appendChild(tableBodyElem);

  let description = tableElem.outerHTML;   //need to provide this in text format for Cesium infoBox

  return description;
}