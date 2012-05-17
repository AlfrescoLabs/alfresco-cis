/*
Copyright (C) 2012 Alfresco Software Limited

This file is part of an unsupported extension to Alfresco.

Alfresco Software Limited licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

var folder = null;
var nodeRef = "null";

var statusCode = 200;
var statusMessage = "Unknown";

// Determine how this script was invoked, whether by path or nodeRef
if (url.templateArgs['path']) {
	folder = companyhome.childByNamePath(url.templateArgs['path']);
} else if (url.templateArgs['node_id']) {

	var storetype = url.templateArgs['store_type'] || 'workspace';
	var storeid = url.templateArgs['store_id'] || 'SpacesStore';
	var id = url.templateArgs['node_id'];
	
	var nodeRef = storetype+'://'+storeid+'/'+id;
	
	folder = search.findNode(nodeRef);	
}

// Obtain mandatory values. If any of these are missing, the script will automatically fail with:
// 500 Internal Error
// [...] JSONObject[\"key_name\"] not found." [...]
var path = json.get('source_path');
var type = json.get('mime-type');
var encoding = json.get('encoding');
var locale = json.get('locale');
var size = json.get('size');

var props = json.getJSONObject('properties');
var name = props.get('cm:name');

if (folder) {
	// The JSON object is already included as a root-scoped object, so run it through jsonUtils
	var keys = json.getNames(props);

	var doc = folder.createFile(name);

	var contentUrl = "contentUrl=store://" + path + "|mimetype="+type+"|size="+size+"|encoding="+encoding+"|locale="+locale;
	doc.properties["cm:content"] = contentUrl;

	// Iterate through all optional metadata properties.
	for (i=0; i< keys.length; i++) {
		doc.properties[keys[i]] = props.get(keys[i]);
	}
	
	doc.save();
	
	nodeRef = doc.nodeRef;
		
	statusCode = 200;
	statusMessage = 'OK';

} else {
	// The folder was not found, so return a 404.
	statusCode = 404;
	statusMessage = "Parent Node/Folder not Found";
}

model.statusCode = statusCode;
model.statusMessage = statusMessage;
model.nodeRef = nodeRef;
model.req_json = json;

status.code = statusCode;
status.message = statusMessage;
