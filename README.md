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
##### Request Headers
The following HTTP header is mandatory:
`Content-Type: application/json`

##### Request Body
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

### Sample Invocation with CURL:

The following example demonstrates how to invoke the service via cUrl. Note the use of the `Content-Type: application/json` header.

```bash
$ curl -i -H "Content-Type: application/json" -X POST -d @test.json http://admin:admin@localhost:8080/alfresco/s/ext/cis/node/workspace/SpacesStore/e400f07a-3b69-47f5-b2f1-9470a0d168b3
```

### License
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


*Copyright (C) 2012, Alfresco Software Limited - All Rights Reserved*