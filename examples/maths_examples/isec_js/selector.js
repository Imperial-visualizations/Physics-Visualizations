function Selector(array) {
  this.arr = array;
  function makeUL(array) {
    var list = document.createElement('ul');
    for(var i = 0; i < array.length; i++) {
        var item = document.createElement('li');
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = array[i].id;
        var label = document.createElement('label')
        label.htmlFor = array[i].id;
        label.appendChild(document.createTextNode(array[i].id.toString() + array[i].toString()));
        item.appendChild(cb);
        item.appendChild(label);
        list.appendChild(item);
    }
    return list;
  }

  this.generate = function() {
    return makeUL(this.arr)
  }
}
