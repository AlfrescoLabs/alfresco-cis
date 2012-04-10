# Alfresco Content Import Service

### Description:

The Alfresco Content Importer allows a client to add new content into an Alfresco repository through a simple HTTP REST request *without* the use of an HTTP upload to transfer the corresponding file. This approach is well-suited for importing extremely large files and therefore assumes that the content be present in a filesystem accessible by the Alfresco server as noted further below.

### Features:

  * Create new Alfresco content via an HTTP POST
  * Directly sets the contentURL property to avoid file upload
  * Metadata support

### Synopsis:

#### Creating New Content

#### REST Endpoints
There are two REST endpoints (`/ext/cis/node/{space_type}/{store_id}/{node_id}` and `/ext/cis/path/{path}`), one supporting a parent NodeId and the other supporting a parent path relative to the repository root folder (Company Home). It is assumed that the parent object is of type `cm:folder`.

This integration is based on an Alfresco Web Script that accepts an *HTTP POST* with a JSON payload that comforms to the following specification:

```json
{
	"source_path": "cis/a/b/c/123123123123.bin",
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
The following properties are **mandatory** and therefore **must** be present in the client request:
  * `source_path`
  * `mime-type`
  * `size`
  * `encoding`
  * `locale`
  * `properties["cm:name"]`
  
The following is an explanation of these properties
  * **source_path:** The `source_path` property must be both *unique* and *relative* to the Alfresco Content Store directory path as defined via the Alfresco `dir.root` and/or `dir.contentstore` configuration properties.

  * **size:** The `size` property must be expressed in bytes.

  * **properties:** The keys in the `properties` hash must have a direct mapping in the corresponding Alfresco content model. The current implementation is rather simplistic and merely assumes the newly created content object is of type `cm:content`.

    * The filename of the newly created object will be derived from the `cm:name` property.

#### Updating Existing Content
*NOT YET IMPLEMENTED*

Existing content may be updated by using an HTTP PUT with a newly assigned and *unique* `source_path` property value. Along with the mandatory properties noted above, updated metadata properties may also be supplied.

#### Response
On success, the REST endpoint will respond with a 200 code and a JSON response as follows:

```json
{
	"status":"200",
	"message":"OK",
	"request_body": {
		"source_path":"fasp/test.txt",
		"locale":"en_US_",
		"encoding":"UTF-8",
		"mime-type":"text/plain",
		"size":"12",
		"properties":{
			"cm:description":"This is my description",
			"cm:name":"my_file3.txt",
			"cm:title":"My Title"
		}
	}
}
```

Note that the `request_body` property is simply the original client request being echoed back by the server.

Other error codes include:
  * `500 - Application Error` Usually means a mandatory parameter is missing.
  * `404 - Not Found` Usually means that the parent folder or document node was not located.

### Requirements:
This project requires an Alfresco Server running version 3.X or above.

### Problems & Roadmap:

  * PUT not yet supported
  * No support for types or aspects (defaults to `cm:content`)

### Install:

This importer will eventually be packaged as an Alfresco AMP. In the interim, it can be deployed by copying the `webscripts` directory (and all its contents) to `[ALFRESCO_HOME]/tomcat/shared/classes/alfresco/extension/templates`.

**Note:** The `templates` directory will not exist on new installations so please create it prior to copying.

*Copyright (c) 2012, Alfresco Software - All Rights Reserved*