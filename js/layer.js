var vectorLayer;
var markerLayer;
function addLayer()
{
	markerLayer = new SuperMap.Layer.Markers("Markers");
	vectorLayer= new SuperMap.Layer.Vector("VectorLayer");
	
	map.addLayers([layer, vectorLayer,markerLayer]);
	//添加比例尺
	addBiLiChi();
	//添加选择图层
	addSwitchLayer();
	pathInit();	
	initLine();
	//显示地图范围
    map.setCenter(new SuperMap.LonLat(4503.62 , -3861.91), 1);
}
