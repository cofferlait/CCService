 var local,drawLine, lineLayer;
 var       styleLiangSuan = {
            strokeColor: "#304DBE",
            strokeWidth: 2,
            pointerEvents: "visiblePainted",
            fillColor: "#304DBE",
            fillOpacity: 0.8
        };
        
 var drawPolygon,polygonLayer;
function initLine()
{
	//新建线矢量图层
            lineLayer = new SuperMap.Layer.Vector("lineLayer");
            //对线图层应用样式style（前面有定义）
            lineLayer.style = styleLiangSuan;


            //创建画线控制，图层是lineLayer;这里DrawFeature(图层,类型,属性)；multi:true在将要素放入图层之前是否现将其放入几何图层中
            drawLine = new SuperMap.Control.DrawFeature(lineLayer, SuperMap.Handler.Path, { multi: true });

            /*
             注册featureadded事件,触发drawCompleted()方法
             例如注册"loadstart"事件的单独监听
             events.on({ "loadstart": loadStartListener });
             */
            drawLine.events.on({"featureadded": drawCompletedLine});
            
            
            
             //新建面矢量图层
            polygonLayer = new SuperMap.Layer.Vector("polygonLayer");
            //对面图层应用样式style（前面有定义）
            polygonLayer.style = styleLiangSuan;
            /*
             注册featureadded事件,触发drawCompleted()方法
             例如注册"loadstart"事件的单独监听
             events.on({ "loadstart": loadStartListener });
             */
            //创建画面控制，图层是polygonLayer
            drawPolygon = new SuperMap.Control.DrawFeature(polygonLayer, SuperMap.Handler.Polygon);
            drawPolygon.events.on({"featureadded": drawCompletedPolugon});
             
             
             map.addControls([drawLine,drawPolygon]);
             map.addLayers([lineLayer,polygonLayer]);            
}
function distanceMeasure(){
           //clearFeaturesLine();
           clearFeatures();
            drawLine.activate();
       }
        //绘完触发事件
        function drawCompletedLine(drawGeometryArgs) {
            //停止画面控制
            drawLine.deactivate();
            //获得图层几何对象
            var geometry = drawGeometryArgs.feature.geometry,
                    measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
                    myMeasuerService = new SuperMap.REST.MeasureService(url); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
            myMeasuerService.events.on({ "processCompleted": measureCompleted });

            //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA

            myMeasuerService.measureMode = SuperMap.REST.MeasureMode.DISTANCE;

            myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
        }

        //测量结束调用事件
        function measureCompleted(measureEventArgs) {
            var distance = measureEventArgs.result.distance;
            var  unit = measureEventArgs.result.unit;
            alert("量算结果:"+distance + "米");
        }

        //移除图层要素
        function clearFeaturesLine(){
            lineLayer.removeAllFeatures();
        }
        
function areaMeasure(){
            clearFeatures();
            drawPolygon.activate();
        }

//绘完触发事件
        function drawCompletedPolugon(drawGeometryArgs) {
            //停止画面控制

            drawPolygon.deactivate();
            //获得图层几何对象
            var geometry = drawGeometryArgs.feature.geometry,
                    measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
                    myMeasuerService = new SuperMap.REST.MeasureService(url); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
            myMeasuerService.events.on({ "processCompleted": measureCompletedPolugon });

            //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA

            myMeasuerService.measureMode = SuperMap.REST.MeasureMode.AREA;

            myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
        }

        //测量结束调用事件
        function measureCompletedPolugon(measureEventArgs) {
            var   area = measureEventArgs.result.area,
                    unit = measureEventArgs.result.unit;
            alert("量算结果:"+ area + "平方米");
        }