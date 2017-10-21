var scaleline,layerSwitcher; 
function addBiLiChi()
{
	//初始化比例尺控件类
	scaleline = new SuperMap.Control.ScaleLine();
	//是否使用依地量算，默认为false。推荐地图投影为EPSG:4326时设置为false；使用EPSG:900913时设置为true。为true时，比例值按照当前视图中心的水平线计算。
	scaleline.geodesic = true;
	map.addControl(scaleline);
}
function addSwitchLayer()
{
	layerSwitcher=new SuperMap.Control.LayerSwitcher();
	map.addControl(layerSwitcher);
}
