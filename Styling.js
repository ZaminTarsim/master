
function openTab(evt, tabID) {
  var i, x, tablinks;
  x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].classList.remove("w3-light-grey");
  }
  document.getElementById(tabID).style.display = "block";
  evt.currentTarget.classList.add("w3-light-grey");
}


let style = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(0, 255, 255, 0.2)',
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0, 100, 0, 0.5)',
        width: 1,
    })
});


// let fill = { color: "#5babd7" };
// let stroke = {
//     color: 'rgb(200, 0, 0)',
//     lineCap: 'round',
//     lineJoin: 'round',
//     lineDash: [10, 10],
//     width: 2
// }

// let text = {
//     font: '14px Calibri,sans-serif',
//     fill_color: 'rgba(200, 0, 0, 0.5)',
//     background_fill_color: 'rgba(200, 205, 200, 0.7)',
//     padding: [3, 3, 3, 3],
//     textBaseline: 'bottom',
//     offsetY: -15,
//     textAlign: 'center',
//     textBaseline: 'center',
//     rotation: 0,
//     stroke_color: 'rgb(200, 150, 150)',
//     stroke_lineCap: 'round',
//     stroke_lineJoin: 'round',
//     stroke_lineDash: [2, 2],
//     stroke_width: 1
// }
$("#create-symbology").on("click", function () {
    const fill_color = $("#fill-color-pick").val();
    const stroke_color = $("#stroke-color-pick").val();
    const stroke_line_cap = $("#line-cap").val();
    const stroke_line_join = $("#line-join").val();
    // const stroke_line_dash_size = $("#line-dash-size").val();
    const stroke_line_width = $("#line-width").val();
    const font = $("#font").val();
    const font_size = $("#font-size").val() + "px";
    const fill_text_color = $("#fill-color-text").val();
    const textAlign = $("#textAlign").val();

    const TextFont = font_size + ' ' + font


    function styleFunction(feature) {
        const new_styles = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: stroke_color,
                lineCap: stroke_line_cap,
                lineJoin: stroke_line_join,
                // lineDash: stroke_line_dash_size,
                width: stroke_line_width
            }),
            fill: new ol.style.Fill({
                color: fill_color
            }),
            text: new ol.style.Text({
                text: feature.get("NAME"),
                font: TextFont,
                fill: new ol.style.Fill({
                    color: fill_text_color,
                }),
                textAlign: textAlign,
            })
        })
        return new_styles;
    }

    vector.setStyle(styleFunction);
    $("#simbolize").hide();
})

const vectorSource = new ol.source.Vector({
    url: 'http://localhost:7585/geoserver/GIS/wfs?' +
        'service=WFS&version=1.0.0&request=GetFeature&typeName=GIS%3ABAKHSH&' +
        'maxFeatures=1000000&outputFormat=application%2Fjson&srsname=EPSG:3857',
    format: new ol.format.GeoJSON(),
});
const vector = new ol.layer.Vector({
    source: vectorSource,
    style: style
});
// const vectorSource = new ol.source.TileWMS({
//     url: 'http://localhost:7585/geoserver/GIS/wms',
//     params: {'LAYERS': 'GIS:AMLAK', 'STYLE':'green', 'TILED': true},
//     serverType: 'geoserver',
//     format: new ol.format.GeoJSON(),
// });


// const vector = new ol.layer.Tile({
//     source: vectorSource,
//     style: style
// });



const raster = new ol.layer.Tile({
    source: new ol.source.OSM()
});


const view = new ol.View({
    center: ol.proj.fromLonLat([51.02, 34.61]),
    zoom: 9,
    projection: 'EPSG:3857'
})

var overviewMapControl = new ol.control.OverviewMap({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM(),
        }),
    ],
    collapseLabel: '\u00BB',
    collapsed: false
})
var mousePosition = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(2),
    projection: 'EPSG:3857',
    undefinedHTML: '&nbsp;',
    className: 'mouse-position',
});

const map = new ol.Map({
    controls:
        ol.control.defaults().extend([
            new ol.control.ZoomSlider(), overviewMapControl, mousePosition
        ]),
    layers: [raster, vector],
    target: 'map',
    view: view,
});


$("#symbology").on("click", function () {
    $("#simbolize").show();

});


$("#cancel-symbology").on("click", function () {
    $("#simbolize").hide();

});
