/*
This script enables quick plotting of algObjs from intersections module.
It works as long as the objects plotted provide 'id' field within their
'graphical object' (Plotly go) versions.
*/
function fastPlotHandler(divHandle) {
  /* Fast plotter makes plotting easy! Keeps track internally of which trace is which object.*/
  this.handle = divHandle;
  this._layout = {};
  this.init = function() {
    Plotly.newPlot(this.handle, [], this._layout);
  }
  this.setLayout = function(layout) {
    this._layout = layout;
    Plotly.relayout(this.handle, this._layout);
  };

  //Manipulating algObjs
  this.addAlgObj = function(algObj) {
    //use this to add algObjs to graph
    this.addTrace(algObj.goify(this._layout));
  }
  this.deleteAlgObj = function(algObj) {
    //use this to remove algObjs from graph
    this.deleteTrace(algObj.id);
  }

  //Manipulating traces instead of algObjs
  this.addTrace = function(data) {
    //instead of operating on algObjs, we can operate on addTrace & deleteTrace
    Plotly.addTraces(this.handle, data);
  };
  this.deleteTrace = function(id) {
    //instead of operating on algObjs, we can operate on addTrace & deleteTrace
    var idx = _getIdxByAlgObjId(this.handle,id);
    if(idx!=-1) {
      Plotly.deleteTraces(this.handle,idx);
    }
    else {
      console.log("error, AlgObj not plotted");
    }
  };
  this.showTraces = function(idArray) {
    //show traces; if traces were already shown, then does nothing
    var toShow = [];
    var hide = {
      visible: true
    };
    for(var idx=0; idx<idArray.length; idx++) {
      toShow.push(_getIdxByAlgObjId(this.handle,idArray[idx])); //see which ones are supposed to be highlighed
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
      toHide.push(_getIdxByAlgObjId(this.handle,idArray[idx])); //see which ones are supposed to be highlighed
    }
    Plotly.restyle(this.handle, hide, toHide); //decrease opacity of everthing
  };
  this.highlightTraces = function(idArray) {
    /* Decreases opacity of evering except from objects whose ids are in idArray */
    toHighlight=[];
    var decreaseOpacity = {
    opacity: 0.4
    };
    var increaseOpacity = {
    opacity: 1.0
    };
    for(var idx=0; idx<idArray.length; idx++) {
      toHighlight.push(_getIdxByAlgObjId(this.handle,idArray[idx])); //see which ones are supposed to be highlighed
    }
    Plotly.restyle(this.handle, decreaseOpacity); //decrease opacity of everthing
    Plotly.restyle(this.handle, increaseOpacity, toHighlight); //increase opacity of the ones highlighted
  };
  this.unHighlight = function() {
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

function _getIdxByAlgObjId(plotDiv,algObjId) {
  /* Find trace position in plotDiv.data using algObjId
  returns appropriate index if found or -1 if not found */
  var lookup = _createAlgObjId2UidLookup(plotDiv);
  //we convert algoObjId to plotly uid and return the appropriate index
  return _findIdxByUid(plotDiv, lookup[algObjId]);
}

function _createAlgObjId2UidLookup(plotDiv) {
  // Construct a dictionary {algObjId: uid}
  var plotData = document.getElementById(plotDiv).data; //retrieve data
  var lookup = {};
  for(var idx=0; idx<plotData.length; idx++) {
    //fill in the lookup dict
    lookup[plotData[idx].algObjId] = plotData[idx].uid;
  }
  return lookup;
}

function _findIdxByUid(plotDiv,uid) {
  /* Find trace position in plotDiv.data using uid;
  returns appropriate index if found or -1 if not found */
  var plotData = document.getElementById(plotDiv).data;
  for (var idx=0; plotData.length;idx++) {
    if(plotData[idx].uid == uid) {
      return idx; //found;return index needed
    }
  }
  return -1; //not found
}
