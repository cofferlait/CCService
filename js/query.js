	var urldata="http://localhost:8090/iserver/services/data-changchun/rest/data";
	//var urldata="http://support.supermap.com.cn:8090/iserver/services/data-changchun/rest/data";
	function queryBySQL() {
		if((getQueryInfo()=="")||(getQueryInfo()==null))
		{
			alert("查询不能为空");
			return null;
		}
			clearFeatures();
			var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;			
			getFeatureParam = new SuperMap.REST.FilterParameter({
			attributeFilter: "name like"+" '%"+getQueryInfo()+"%' ",
			fields:["SmID","name"]
			});
			getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
			queryParameter: getFeatureParam,
			datasetNames:["Changchun:School","Changchun:Hospital",
			"Changchun:Company","Changchun:Park","Changchun:BusPoint"]
			});
			getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(urldata, {
			eventListeners: {"processCompleted": processCompleted, "processFailed": processFailed}});
			
			getFeatureBySQLService.processAsync(getFeatureBySQLParams);
	}
            // 获取查询结果并显示
    function processCompleted(getFeaturesEventArgs) {
				var i, len, features, feature, result = getFeaturesEventArgs.result;
				if (result && result.features) {
				features = result.features				
				if(features.length==0)
				{
					alert("未查询到有关单位！请检查输入");
					return null;
				}				
				for (i=0, len=features.length; i<len; i++) {
				var point = features[i].geometry,
				size = new SuperMap.Size(44, 33),
				offset = new SuperMap.Pixel(-(size.w/2), -size.h),
				icon = new SuperMap.Icon("theme/images/marker.png", size, offset);
			    var	marker = new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon); 
				markerLayer.addMarker(marker);
				
				addGeoTest(point,result.features[i].data.name);
				}
				}
			}
    function processFailed(e) {
            alert(e.error.errorMsg);
    }
    function clearFeatures() {
            markerLayer.clearMarkers();
            //先清除上次的显示结果
            vectorLayer.removeAllFeatures();
            polygonLayer.removeAllFeatures();
            lineLayer.removeAllFeatures();
            vectorLayer.refresh();
    }
    function addGeoTest(point,info){ 
	var geometry = new SuperMap.Geometry.Point( point.x ,point.y); 
	var pointFeature = new SuperMap.Feature.Vector(geometry); 
	var styleTest = { 
	      label:info, 
	      fontColor:"#0000ff", 
	      fontOpacity:"0.5", 
	      fontFamily:"隶书", 
	      fontSize:"12pm", 
	      fontWeight:"bold", 
	      fontStyle:"italic", 
	      labelSelect:"true", 
	   } 
	         pointFeature.style = styleTest; 
	        vectorLayer.addFeatures([pointFeature]); 
    }