// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5OTZkNGFkMy1kYTU3LTQ3Y2QtODQ3ZC1lZTNlNjcyODIxOTciLCJpZCI6NTg1NjAsImlhdCI6MTYyMzI2Njk0OH0.ge9UPLu8jEiobbOSJxTQh9Va8xQXjN6PBSEFQNy6q18";

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
  });  

// Add Cesium OSM Buildings, a global 3D buildings layer.
viewer.scene.primitives.add(Cesium.createOsmBuildings());   

let htmlElem;

//load geometry model
(async () => {
  try {
    const resource = await Cesium.IonResource.fromAssetId(1505637);
    const entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-104.8543615076, 39.7642649115, 1600),
      model: {
        uri: resource,
      },
      description : htmlElem
    });
    viewer.trackedEntity = entity;
  } catch (error) {
    console.log(error);
  }
})();
  
//accessing the IFC JSON properties
fetch('./properties.json')
.then(response => response.json())
.then(data => {
    //let features = data.features
    console.log(data);

    for (let elem in data)
    {
        if (data[elem].type === "IFCBUILDING")
        {
            console.log(data[elem]);
            console.log(Object.keys(data[elem]).length);

            htmlElem = createDescription(Object.keys(data[elem]).length , Object.keys(data[elem]), Object.values(data[elem]));
        }
    }
    //console.log(htmlElem)
    }
    )
.catch(error => console.log(error));

//create the html element to be inserted into 'description' and shown in the infoBox - returns a div

function createDescription(numberOfEntries, keys, values) { //Object.keys(data[elem]).length , Object.keys(data[elem]) , Object.values(data[elem])

    let tableElem = document.createElement("table");
    tableElem.setAttribute ("class" , "cesium-infoBox-defaultTable");

    let tableBodyElem = document.createElement("tbody");

    //create table entries based on ifc data
    for (let i = 0; i < numberOfEntries; i++)
    {
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

    //need to provide this in text format for Cesium infoBox
    let description = tableElem.outerHTML;

    return description;
}
