		url1="http://localhost:8090/iserver/services/map-changchun/rest/maps/长春市区图",
        url2="http://localhost:8090/iserver/services/transportationanalyst-sample/rest/networkanalyst/RoadNet@Changchun";

		var local,drawPoint, select,
        nodeArray = [], pathTime, pathListIndex = 0, routeCompsIndex = 0,
        style = {
        	stroke: true,
            strokeColor: "red",
            strokeWidth: 3,
            pointerEvents: "visiblePainted",
            fill: false,
            strokeDashstyle: "longdashdot",
            externalGraphic: "JT.png"
            },
        styleGuidePoint = {
            pointRadius: 10,
            externalGraphic: "JT.png"
            },
        styleGuideLine = {
            strokeColor: "#25FF25",
            strokeWidth: 6,
            fill: false
            };
      	function pathInit()
      	{
      		drawPoint = new SuperMap.Control.DrawFeature(vectorLayer, SuperMap.Handler.Point);
            select = new SuperMap.Control.SelectFeature(vectorLayer, {onSelect: onFeatureSelect, onUnselect: onFeatureUnselect});
            drawPoint.events.on({ "featureadded": drawCompleted });
            map.addControls([drawPoint,select]); 
            //markerLayer = new SuperMap.Layer.Markers("Markers");
            //map.addLayers([markerLayer]);
      	}
		function selectPoints() {
                clearElements();
                drawPoint.activate();
            }
            function drawCompleted(drawGeometryArgs) {
                var point = drawGeometryArgs.feature.geometry,
                        size = new SuperMap.Size(32, 32),
                        offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                        icon = new SuperMap.Icon("SuperMap/images/markerbig_select.png", size, offset);
                markerLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon));
                nodeArray.push(point);
            }

            //选中时显示路径指引信息
            function onFeatureSelect(feature) {
                if(feature.attributes.description) {
                    popup = new SuperMap.Popup("chicken",
                            feature.geometry.getBounds().getCenterLonLat(),
                            new SuperMap.Size(200,30),
                            "<div style='font-size:.8em; opacity: 0.8'>" + feature.attributes.description + "</div>",
                            null, false);
                    feature.popup = popup;
                    map.addPopup(popup);
                }
                if(feature.geometry.CLASS_NAME != "SuperMap.Geometry.Point"){
                    feature.style = styleGuideLine;
                    vectorLayer.redraw();
                }
            }

            //清除要素时调用此函数
            function onFeatureUnselect(feature) {
                map.removePopup(feature.popup);
                feature.popup.destroy();
                feature.popup = null;
                if(feature.geometry.CLASS_NAME != "SuperMap.Geometry.Point"){
                    feature.style = style;
                }
                vectorLayer.redraw();

            }

            function findPath() {
                drawPoint.deactivate();
                var findPathService, parameter, analystParameter, resultSetting;
                resultSetting = new SuperMap.REST.TransportationAnalystResultSetting({
                    returnEdgeFeatures: true,
                    returnEdgeGeometry: true,
                    returnEdgeIDs: true,
                    returnNodeFeatures: true,
                    returnNodeGeometry: true,
                    returnNodeIDs: true,
                    returnPathGuides: true,
                    returnRoutes: true
                });
                analystParameter = new SuperMap.REST.TransportationAnalystParameter({
                    resultSetting: resultSetting,
                    weightFieldName: "length"
                });
                parameter = new SuperMap.REST.FindPathParameters({
                    isAnalyzeById: false,
                    nodes: nodeArray,
                    hasLeastEdgeCount: false,
                    parameter: analystParameter
                });
                if (nodeArray.length <= 1) {
                    alert("站点数目有误");
                }
                findPathService = new SuperMap.REST.FindPathService(url2, {
                    eventListeners: { "processCompleted": processCompletedPath }
                });
                findPathService.processAsync(parameter);
            }
            function processCompletedPath(findPathEventArgs) {
                var result = findPathEventArgs.result;
                allScheme(result);
            }
            function allScheme(result) {
                if (pathListIndex < result.pathList.length) {
                    addPath(result);
                } else {
                    pathListIndex = 0;
                    //线绘制完成后会绘制关于路径指引点的信息
                    //暂时不显示
                   addPathGuideItems(result);
                    
                    //激活选择控件
                    //select.activate();
                }
            }
            //以动画效果显示分析结果
            function addPath(result) {
                if (routeCompsIndex < result.pathList[pathListIndex].route.components.length) {
                    var pathFeature = new SuperMap.Feature.Vector();
                    var points = [];
                    for (var k = 0; k < 2; k++) {
                        if (result.pathList[pathListIndex].route.components[routeCompsIndex + k]) {
                            points.push(new SuperMap.Geometry.Point(result.pathList[pathListIndex].route.components[routeCompsIndex + k].x, result.pathList[pathListIndex].route.components[routeCompsIndex + k].y));
                        }
                    }
                    var curLine = new SuperMap.Geometry.LinearRing(points);
                    pathFeature.geometry = curLine;
                    pathFeature.style = style;
                    vectorLayer.addFeatures(pathFeature);
                    //每隔0.001毫秒加载一条弧段
                    pathTime = setTimeout(function () { addPath(result); }, 0.001);
                    routeCompsIndex++;
                } else {
                    clearTimeout(pathTime);
                    routeCompsIndex = 0;
                    pathListIndex++;
                    allScheme(result);
                }
            }

            function addPathGuideItems(result){
                vectorLayer.removeAllFeatures();
                //显示每个pathGuideItem和对应的描述信息
                for(var k = 0; k < result.pathList.length; k++){
                    var pathGuideItems = result.pathList[pathListIndex].pathGuideItems, len = pathGuideItems.length;
                    for(var m = 0; m < len; m++){
                        var guideFeature = new SuperMap.Feature.Vector();
                        guideFeature.geometry = pathGuideItems[m].geometry;
                        guideFeature.attributes = {description: pathGuideItems[m].description};
                        if(guideFeature.geometry.CLASS_NAME === "SuperMap.Geometry.Point"){
                            //guideFeature.style = styleGuidePoint;
                            guideFeature.style = null;
                        }
                        else{
                        	//LineString
                            guideFeature.style = style;
                        }
                        vectorLayer.addFeatures(guideFeature);
                    }
                }
                select.activate();
            }

            function clearElements() {
                pathListIndex = 0;
                routeCompsIndex = 0;
                nodeArray = [];
                select.deactivate();
                if(vectorLayer.selectedFeatures.length > 0) {
                    map.removePopup(vectorLayer.selectedFeatures[0].popup);
                }
                vectorLayer.removeAllFeatures();
                markerLayer.clearMarkers();
            }
