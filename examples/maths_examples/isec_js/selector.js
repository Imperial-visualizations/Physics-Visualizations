var selectorcount = 0;
function Selector() {
  this.objs = {}; //dictionary of selectable options
  this.id = "selector"+String(selectorcount);

  this.generate = function() {
    console.log("generating selector... id: " + this.id);
    console.log("make Ul from: ", this.objs);
    var list = document.createElement('ul');
    list.id = this.id+":ul";
    for(var id in this.objs) {
        var item = document.createElement('li');
        item.id = this.id+":"+this.objs[id].id+":li";
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = this.id+":"+this.objs[id].id+":checkbox";//addressed by selectorid:objectid:checkbox
        var label = document.createElement('label')
        label.htmlFor = this.id+":"+this.objs[id].id+":label"; //addressed by selectorid:objectid:label
        label.appendChild(document.createTextNode(this.objs[id].id.toString()+", "+this.objs[id].toString()));
        item.appendChild(cb);
        item.appendChild(label);
        list.appendChild(item);
    }
    console.log(list);
    return list;
  }

  this.add = function(array) {
    for(var idx in array) {
      console.log("add "+array[idx]+" at id "+ array[idx].id +" to "+this);
      this.objs[array[idx].id] = array[idx];
    }
    console.log(this.objs)
  }

  this.checked = function() {
    var handle = document.getElementById(this.id);
    var checked = [];
    for(id in this.objs) {
      retrievedId = this.id+":"+this.objs[id].id+":checkbox";
      console.log("retrieving checkbox with id "+retrievedId+", ", document.getElementById(retrievedId).checked);
      if (document.getElementById(retrievedId).checked) {
        checked.push(this.objs[id].id)
      }
    }
    return checked;
  }

  this.remove = function(idlist) {
    for(var idx in idlist) {
      delete this.objs[idlist[idx]];
    }
  }
  selectorcount++;
}
