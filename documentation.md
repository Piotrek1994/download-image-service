## Error codes
- 0 - Invalid ID format
- 1 - Image with provided ID does not exist
- 2 - Link to image by query parameter must be provided
***

## Routes

#### GET /api/v1/images

Get all images.

success:
```json
{
    "success": true,
    "data": [images]
}
```

***

#### GET /api/v1/images/:id

Get image with requested ID.

note:
- If you want to get {imageData} image should have been a `downloaded` status.
- `statusMessage` is optional. It is only responding if image has a `error` status.

success if image has a `downloaded` status:
```json
{
    "success": true,
    "data": {imageData}
}
```

success if image has a `non-downloaded` status:
```json
{
    "success": true,
    "data": {
        "status": {imageStatus},
        "statusMessage": {statusMessage},
    }
}
```

errors:
- response status 400, error code - 0 - Invalid ID format
- response status 400, error code - 1 - Image with provided ID does not exist

***

#### POST /api/v1/images?linkToImage={imageUrl}

Add new image to queue and download if could

note:
- link to image is required.
- link to image should have a valid mime type. 
`allowedMimeTypes: 
'image/jpeg',
'image/png',
'image/jpg'`.
If you want to add new extension just add it to `config.js`

 
success:
```json
{
    "success": true,
    "data": {
        "id": {imageId},
        "checkImage": {linkToCheckImage}
    }
}
```

errors:
- response status 400, error code - 2 - Link to image by query parameter must be provided
