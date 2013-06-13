function Ti_Asset_Loader(){

	this.numFilesLoaded = 0;
	this.options = {};
	this.arguments = {}
		this.arguments.dependencies = {};
		this.arguments.initialization = {};

	for (var key in arguments[0].dependencies) { 
		this.arguments['dependencies'][key] = arguments[0].dependencies[key];
	};
	for (var key2 in arguments[0].initialization) { 
		this.arguments['initialization'][key2] = arguments[0].initialization[key2];
	};
	for (var key3 in arguments[0].options) { 
		this.options[key3] = arguments[0].options[key3];
	};
	this.setNumDependencies( this.arguments.dependencies , this.allAssetsLoaded );
	this.checkForAssets( this.arguments.dependencies , this.allAssetsLoaded );
};


Ti_Asset_Loader.prototype.setNumDependencies = function(dependencies_obj) {
	this.arguments.dependencies.numDependencies = 0;
	for (var key in dependencies_obj) { 	

		for ( var key2 in dependencies_obj[key] ) {
			if (key2 !== 'version'){
				this.arguments.dependencies.numDependencies += 1;
			}
		};
	};
	if (this.options.showLogs) console.log('Total Dependencies : ', this.arguments.dependencies.numDependencies);
};


Ti_Asset_Loader.prototype.checkForAssets = function(dependencies_obj, finalCallback_fn ) {

	for (var key in dependencies_obj) { 

		switch( key ){
			case "QUnit" :
				if ( typeof QUnit === "undefined" || "" || null ) {
					if (this.options.showLogs) console.log('No QUnit drop it along with tests...');
					this.loadFile( dependencies_obj.QUnit.src , "script" , this.fileLoaded);
					this.loadFile( dependencies_obj.QUnit.testFile , "script" , this.fileLoaded);
					this.loadFile( dependencies_obj.QUnit.cssFile , "css" , this.fileLoaded);
				};
			break;	
			case "jQuery" :
				
				if ( typeof jQuery === "undefined" || "" || null || jQuery.fn.jquery != dependencies_obj.jQuery.version ) {
					if (this.options.showLogs) console.log('Not the jQuery we need... drop it...');
					this.loadFile( dependencies_obj.jQuery.src , "script" , this.fileLoaded);
				};
			break;
			case "Handlebars" :
				if ( typeof Handlebars === "undefined" || "" || null || Handlebars.VERSION != dependencies_obj.Handlebars.version ) {
					if (this.options.showLogs) console.log('No the Handlebars drop it...');

					this.loadFile( dependencies_obj.Handlebars.src , "script" , this.fileLoaded);
				};
			break;			
		}; // end switch
	}; // end loop
};


Ti_Asset_Loader.prototype.loadFile = function(path_str, fileType_str, callback_fn) {

	if (this.options.showLogs) console.log('Load File : ', path_str , ' , of Type : ' , fileType_str);
    
    var _assetLoader = this;
    var done = false;

    switch (fileType_str) {
    	case "script" :
    		var file = document.createElement('script');
    		file.src = path_str;
    	break;
    	case "css":
	    	var file=document.createElement("link")
			file.setAttribute("rel", "stylesheet")
			file.setAttribute("type", "text/css")
			file.setAttribute("href", path_str)
    	break;
    };

    file.onload = handleLoad;
    file.onreadystatechange = handleReadyStateChange;
    file.onerror = handleError;

    document.head.appendChild(file);

    function handleLoad() {
        if (!done) {
            done = true;
            callback_fn(path_str, "ok", _assetLoader);
        }
    };
    //for IE
    function handleReadyStateChange() {
        var state;
        if (!done) {
            state = file.readyState;
            if (state === "complete") {
                handleLoad();
            }
        }
    };
    function handleError() {
        if (!done) {
        	console.log('error!!!');
            done = true;
            callback_fn(path_str, "error", _assetLoader);
        }
    };
};


Ti_Asset_Loader.prototype.fileLoaded = function(path_str, status_str, _assetLoader_obj) {
	var numDependencies = _assetLoader_obj.arguments.dependencies.numDependencies;
	switch (status_str){
		case "ok":
			_assetLoader_obj.numFilesLoaded+=1;
			if (_assetLoader_obj.numFilesLoaded === numDependencies) {
				_assetLoader_obj.allAssetsLoaded( _assetLoader_obj.arguments.initialization );
			};
		break;
		case "error":
			alert('error retrieving file... fail');
		break;
	};
};


Ti_Asset_Loader.prototype.allAssetsLoaded = function(init_obj) {
	if (this.options.showLogs) console.log('Congratulations, all assets have finished loading....', init_obj);



};