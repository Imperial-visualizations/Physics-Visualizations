var selectorcount = 0;

function Selector(handle) {
  var objscount = 0;
  this.objs = {}; //dictionary of selectable options
  this.id = "selector"+String(selectorcount);
  this.handle = handle; //id of the html item selector is linked to

  this.generate = function() {
    console.log("generating selector... id: " + this.id);
    console.log("make Ul from: ", this.objs);
    var list = document.createElement('div');
    list.id = this.id+":ul";
    list.class = 'dropdown';
    for(var id in this.objs) {
        var item = document.createElement('div');
        item.id = this.id+":"+id+":li";

        var label = document.createElement('label');
        label.className = 'checkbox';

        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = this.id+":"+id+":checkbox";//addressed by selectorid:objectid:checkbox

        var span = document.createElement('span');

        var label_outside = document.createElement('label');
        label_outside.className = 'checkboxTitle'
        label_outside.appendChild(document.createTextNode(this.objs[id].toString()));

        label.appendChild(cb);
        label.appendChild(span);
        item.append(label);
        item.append(label_outside);
        list.appendChild(item);
        /*
        var label = document.createElement('label')
        label.htmlFor = this.id+":"+id+":label"; //addressed by selectorid:objectid:label
        label.appendChild(document.createTextNode(this.objs[id].toString()));
        item.appendChild(cb);
        item.appendChild(label);
        list.appendChild(item);*/
    }
    console.log(list);
    return list;
  }

  this.add = function(array) {
    for(var idx in array) {
      var newid = "obj"+String(objscount);
      console.log("add "+array[idx]+" at id "+ newid +" to "+ this);
      this.objs[newid] = array[idx];
      objscount++;
    }
    if(this.handle != undefined) {
      //update the selector after adding
      this.update();
    }
    console.log("added an object, new objs container: "+this.objs)
  }

  this.checked = function() {
    var checked = [];
    for(id in this.objs) {
      retrievedId = this.id+":"+id+":checkbox";
      console.log("retrieving checkbox with id "+retrievedId+": " + document.getElementById(retrievedId).checked);
      if (document.getElementById(retrievedId).checked) {
        checked.push(id);
      }
    }
    return checked;
  }

  this.remove = function(idlist) {
    for(var idx in idlist) {
      delete this.objs[idlist[idx]];
    }
    if(this.handle != undefined) {
      this.update();
    }
  }

  this.retrieveById = function(idlist) {
    /*
    retrieves the objects by the list of their id, returns list.
    eg retrieveById(["obj1","obj4"]) returns [{some object},{some object}]
    */
    var ans = [];
    for(var idx in idlist) {
      console.log("retrieving by id " + idlist[idx] + ": ",this.objs[idlist[idx]])
      ans.push(this.objs[idlist[idx]]);
    }
    return ans;
  }

  this.update = function(elementid) {
    /*
    Update the selector, i.e. generate it and append to the container handle.
    */
    if(this.handle!=undefined) {
      var list = document.getElementById(this.handle);
      list.replaceChild(selector.generate(),list.childNodes[0]);
    }
    else {
      var list = document.getElementById(elementid);
      list.replaceChild(selector.generate(),list.childNodes[0]);
    }
  }

  this.rename = function(toRename) {
    console.log("to rename:", toRename, " length: ", toRename.length)
    for(var idx=0; idx<toRename.length; idx++) {
      console.log("obj: ", toRename[idx])
      var obj = selector.retrieveById([toRename[idx]])[0]
      //^ toRename[idx] must be in brackets as retrieve by ID takes array
      console.log("object to rename: "+obj)
      var newname = prompt("Please enter name for the object: ", obj.toString());
      if (newname == null || newname == "") {
        //do nothing
      } else {
        obj.name=String(newname);
      }
      selector.update();
    }
  }

  selectorcount++;
}
