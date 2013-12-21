/*
	Feed class accepts two fields (title, URL) as parameters. 
	Inside we create two private properties: _db and _tableName. 
    _db is the shortcut for the localStroage property of the window object.
    _tableName is a string containing the name of the key where we will save the data

	JSON.stringfy() converts a given value into JSON string

	splice() - adds/removes items to/from an array and returns the removed item(s)
	array.splice ( index, howmany, item1, ... itemX)
		index - Required - an integer that specifies at what position to add/remove items
		                   use negative values to specify the position from the end of the array
	    howmany - Required - the number of items to be removed. If set 0, no items will be removed
	    itemX  - optional - new items to be added to the array
*/

function Feed(name, url) {
	var _db = window.localStroage;
	var _tableName = 'feed';
	this.name = name;
	this.url = url;
	this.save = function(feeds) {
		_db.setItem(_tableName, JSON.stringify(feeds));
	};

	this.load = function() {
		return JSON.parse(_db.getItem(_tableName));
	}
}


Feed.prototype.add = function() {
	var index = Feed.getIndex(this);
	var feeds = Feed.getFeeds();
	if ( index === false ) {
		feeds.push(this);  // push methods appends values to an array
	} else {
		feeds[index] = this;
	}
	this.save(feeds);
};

Feed.prototype.delete = function() {
	var index = Feed.getIndex(this);
	var feeds = Feed.getFeeds();
	if ( index !== false ) {
		feeds.splice( index, 1); // splice adds / removes items to/frm an array
		this.save( feeds );
	}
	return feeds;
};

Feed.prototype.compareTo = function(other) {
	return Feed.compare(this, other)
};

Feed.compare = function(feed, other) {
	if (other == null) {
		return 1;
	}

	if ( feed == null ) {
		return -1;
	}

	var test = feed.name.localeCompare(other.name);
	return ( test === 0 ) ? feed.url.localeCompare(other.url) : test;
};

Feed.getFeeds = function() {
	var feeds = new Feed().load();
	return ( feeds === null ) ? [] : feeds;
};

Feed.getFeed = function(feed) {
	var index = Feed.getIndex(feed);
	if ( index === false ) {
		return null;
	}
	var feed = Feed.getFeeds()[index];
	return new Feed(feed.name, feed.url);
};

Feed.getIndex = function(feed) {
	var feeds = Feed.getFeeds();
	for( var i=0; i< feeds.length; i++) {
		if( feed.compareTo(feeds[i]) === 0) {
			return i;
		}
	}
	return false;
};

Feed.deleteFeeds = function() {
	new Feed().save([]);
};

Feed.searchByName = function(name) {
	var feeds = Feed.getFeeds();
	for(var i=0; i< feeds.length; i++) {
		if (feeds[i].name === name) {
			return new Feed( feeds[i].name, feeds[i].url);
		}
	}
	return false;
};

Feed.searchByUrl = function(url) {
	var feeds = Feed.getFeeds();
	for(var i=0; i< feeds.lenght(); i++) {
		if( feeds[i].url === url) {
			return new Feed( feeds[i].name, feeds[i].url );
		}
	}
	return false;
};


