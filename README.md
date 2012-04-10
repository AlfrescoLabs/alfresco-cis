# Alfresco-Aspera Content Importer

### Description:

The Alfresco-Aspera Content Importer allows an Aspera FASP server to add new content into an Alfresco repository through a simple HTTP request.

### Features / Problems:

  * Create new Alfresco content via an HTTP POST
  * Metadata support

### Synopsis:

#### Creating New Content

#### REST Endpoints
There are two REST endpoints (`/ext/fasp/node/{node_id}` and `/ext/fasp/path/{path}`), one supporting a parent NodeId and the other supporting a parent path relative to the repository root folder (Company Home). It is assumed that the content is going to the default store (workspace://SpacesStore) and that the parent object is of type `cm:folder`.

This integration is based on an Alfresco Web Script that accepts an *HTTP POST* with a JSON payload that comforms to the following specification:

```json
{
	"source_path": "aspera/a/b/c/123123123123.bin",
	"mime-type": "video/mp4",
	"size": "5000000",
	"encoding": "UTF-8",
	"locale": "en_US_",
	"properties": {
			"cm:title": "My Title",
			"cm:name": "my_file.mp4",
			"cm:description": "This is my description"
		}
}
```

##### Property Requirements

*source_path:* The `source_path` property must be both *unique* and *relative* to the Alfresco Content Store directory path as defined via the Alfresco `dir.root` and/or `dir.contentstore` configuration properties.

*size:* The `size` property must be expressed in bytes.

*properties:* The keys in the `properties` hash must have a direct mapping in the corresponding Alfresco content model. The current implementation is rather simplistic and merely assumes the newly created content object is of type `cm:content`.

** The filename of the newly created ibject will be derived from th `cm:name` property.

#### Updating Existing Content
*NOT YET IMPLEMENTED*
Existing content may be updated by using an HTTP PUT with a newly assigned and *unique* `source_path` property value. Updated metadata properties may also be supplied though the `cm:name` property will be ignored. This is not a limitation, rather an implementation choice.

#### Response
On success, the REST endpoint will respond with a 200 code and a JSON response as follows:

```json
{
"status":"200",
"message":"OK",
"request_body":{
	"source_path":"fasp/test.txt",
	"locale":"en_US_",
	"encoding":"UTF-8",
	"properties":{
		"cm:description":"This is my description",
		"cm:name":"my_file3.txt",
		"cm:title":"My Title"},
		"mime-type":"text/plain",
		"size":"12"
		}
	}
}
```

Note that the `request_body` property is simply the original client request being echoed back by the server.

Other error codes include:
`500 - Application Error` Usually means a mandatory parameter is missing.
`404 - Not Found` Usually means that the parent folder or document node was not located.

### Requirements:
This project requires an Alfresco Server running version 3.X or above.

### Install:

  * Deploy the projects' WebScripts to the Alfresco server as noted in the Alfresco documentation.

Copyright (c) 2012, Alfresco Software - All Rights Reserved