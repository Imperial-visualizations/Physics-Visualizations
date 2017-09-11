/*
This script enables quick plotting of objs from intersections module.
It works as long as the objects plotted provide 'plotId' field within their
'graphical object' (Plotly go) versions, and also provide goify(layout) method.
*/
//dependencies: [Plotly]
function fastPlotHandler(divHandle) {
  /* Fast plotter makes plotting easy! Keeps track internally of which trace is which object.*/
  this.handle = divHandle;
  this._layout = {};
  this.init = function() {
    console.log("fast-plotter : init")
    Plotly.newPlot(this.handle, [], this._layout);
  }
  this.setLayout = function(layout) {
    console.log("fast-plotter : setLayout", layout)
    this._layout = layout;
    Plotly.relayout(this.handle, this._layout);
  };

  //Manipulating plotObjs
  this.addPlotObj = function(plotObj) {
    console.log("fast-plotter : addPlotObj", plotObj)
    //use this to add plotObjs to graph
    this.addTrace(plotObj.goify(this._layout));
  }
  this.deletePlotObj = function(plotObj) {
    console.log("fast-plotter : deletePlotObj", plotObj)
    //use this to remove plotObjs from graph
    this.deleteTrace(plotObj.plotId);
  }
  this.refreshPlotObj = function(plotObj) {
    console.log("fast-plotter : refreshPlotObj :",plotObj)
    this.deletePlotObj(plotObj);
    this.addPlotObj(plotObj);
  }
  this.replacePlotObj = function(newObj,oldObj) {
    console.log("fast-plotter : replacePlotObj : replacing ", newObj, " with ", oldObj)
    this.deletePlotObj(oldObj);
    this.addPlotObj(newObj);
  }
  this.showPlotObj = function(plotObj) {
    console.log("fast-plotter : showPlotObj : ",plotObj)
    this.showTraces([plotObj.plotId]);
  }
  this.hidePlotObj = function(plotObj) {
    console.log("fast-plotter : hidePlotObj : ",plotObj)
    this.hideTraces([plotObj.plotId]);
  }
  this.highlightPlotObjs = function(plotObjArray) {
    console.log("fast-plotter : highlightPlotObjs : ",plotObjArray)
    var toHighlight = [];
    for(var idx=0;idx<plotObjArray.length;idx++) {
      toHighlight.push(plotObjArray[idx].plotId);
    }
    console.log("toHighlight", toHighlight)
    this.highlightTraces(toHighlight);
  }
  this.highlightPlotObj = function(plotObj) {
    console.log("fast-plotter : highlightPlotObj : ",plotObj)
    this.highlightTraces([plotObj.plotId]);
  }
  this.unHighlightPlotObjs = function() {
    console.log("fast-plotter : unHighlightPlotObjs ")
    this.unHighlightTraces();
  }

  //Manipulating traces instead of plotObjs
  this.addTrace = function(data) {
    //instead of operating on plotObjs, we can operate on addTrace & deleteTrace
    Plotly.addTraces(this.handle, data);
  };
  this.deleteTrace = function(plotId) {
    //instead of operating on plotObjs, we can operate on addTrace & deleteTrace
    var idx = _getIdxByPlotId(this.handle,plotId);
    if(idx!=-1) {
      Plotly.deleteTraces(this.handle,idx);
    }
    else {
      console.warn("fast-plotter : deleteTrace : Trace not plotted");
    }
  };
  this.showTraces = function(plotIdArray) {
    //show traces; if traces were already shown, then does nothing
    var toShow = [];
    var hide = {
      visible: true
    };
    for(var idx=0; idx<plotIdArray.length; idx++) {
      toShow.push(_getIdxByPlotId(this.handle,plotIdArray[idx])); //see which ones are supposed to be highlighed
    }
    Plotly.restyle(this.handle, hide, toShow); //decrease opacity of everthing
  };
  this.hideTraces = function(idArray) {
    /* Hiding traces; if traces were already hidden, then does nothing */
    var toHide = [];
    var hide = {
      visible: false
    };
    for(var idx=0; idx<idArray.length; idx++) {
      toHide.push(_getIdxByPlotId(this.handle,idArray[idx])); //see which ones are supposed to be highlighed
    }
    Plotly.restyle(this.handle, hide, toHide); //decrease opacity of everthing
  };
  this.highlightTraces = function(idArray) {
    /* Decreases opacity of evering except from objects whose ids are in idArray */
    toHighlight=[];
    var decreaseOpacity = {
    opacity: 0.2
    };
    var increaseOpacity = {
    opacity: 1.0
    };
    for(var idx=0; idx < idArray.length; idx++) {
      var index = _getIdxByPlotId(this.handle,idArray[idx]);
      if(index == -1) {
        throw new Error("not in the plot")
      }
      else {
        toHighlight.push(_getIdxByPlotId(this.handle, idArray[idx])); //see which ones are supposed to be highlighed
      }
    }
    Plotly.restyle(this.handle, decreaseOpacity); //decrease opacity of everthing
    Plotly.restyle(this.handle, increaseOpacity, toHighlight); //increase opacity of the ones highlighted
  };
  this.unHighlightTraces = function() {
    /* Bring everything to opacity=1 (no highlights at all) */
    var increaseOpacity = {
    opacity: 1.0
    };
    Plotly.restyle(this.handle, increaseOpacity); //decrease opacity of everthing
  }
  this.purge = function() {
    /*From Plotly docs:
    Using purge will clear the div, and remove any Plotly plots that have been placed in it.*/
    Plotly.purge(this.handle);
  }
}

function _getIdxByPlotId(plotDiv,plotId) {
  /* Find trace position in plotDiv.data using algObjId
  returns appropriate index if found or -1 if not found */
  var lookup = _createPlotId2UidLookup(plotDiv);
  //we convert plotId to plotly uid and return the appropriate index
  return _findIdxByUid(plotDiv, lookup[plotId]);
}

function _createPlotId2UidLookup(plotDiv) {
  // Construct a dictionary {plotId: uid}
  var plotData = document.getElementById(plotDiv).data; //retrieve data
  var lookup = {};
  for(var idx=0; idx<plotData.length; idx++) {
    //fill in the lookup dict
    lookup[plotData[idx].plotId] = plotData[idx].uid;
  }
  return lookup;
}

function _findIdxByUid(plotDiv,uid) {
  /* Find trace position in plotDiv.data using uid;
  returns appropriate index if found or -1 if not found */
  var plotData = document.getElementById(plotDiv).data;
  for (var idx=0; idx<plotData.length; idx++) {
    if(plotData[idx].uid == uid) {
      return idx; //found;return index needed
    }
  }
  return -1; //not found
}
