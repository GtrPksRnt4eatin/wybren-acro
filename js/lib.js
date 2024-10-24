function updateModel(model, data, nested_arr){
    if(typeof data == 'number' || typeof data == 'string') { model=data; }
    if(model == null) { return data; }
    if(data == null) { return model;}
    for(var prop in model) { 
        if(data.hasOwnProperty(prop)) {
        	if(model[prop]==null) { model[prop] = ""; }
            if( typeof model[prop]=='object')
            {   if ( Object.prototype.toString.call( model[prop] ) == '[object Array]' )
                {   if( nested_arr && nested_arr[prop] )
                    {   fill_array(model[prop], data[prop], nested_arr[prop]); }
                    else { fill_array(model[prop], data[prop]); }
                }                
                else 
                {   updateModel(model[prop], data[prop], nested_arr); }
            }
            else { model[prop] = data[prop]; }
        }
    }
    model.update && model.update();
    return model;
}

function fill_array(array, data, cls, nested_arr) {
    while(array.length>data.length) 
    {   remove_ref(array,array[array.length-1]); }
    for(var i=0; i<array.length; i++)
    {   array[i] = updateModel(array[i],data[i], nested_arr); }
    for(var i=array.length; i<data.length; i++)
    {   if(cls)   {   array.push(updateModel(new cls(), data[i], nested_arr)); }
        else      {   array.splice(array.length,0,data[i]); }
    }
}

function id(tag) { return document.getElementById(tag); }