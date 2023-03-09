# preview-utils
web client preview utils
## install 
```bash
npm i preview-utils
```
## base64 utils

### parseBase64
```javascript
const {content,contentType} = parseBase64(base64)
```
return base64 contentType and content

### fileToBase64
```javascript
const base64 =await  fileToBase64(file)
```
convert a file object to base64,this is a promise

### imageToBase64
```javascript
const base64 = imageToBase64(image)
// args (image, type = 'image/png', quality = .8)
```
convert a html image  object to base64 ,use canvas,this is a sync function


### imageToBlob
```javascript
const file = imageToFile(image)
```
convert a html image object to blob 


### imageToFile
```javascript
const blob = imageToBlob(image,"file.png")
//args (image, fileName, { lastModified = Date.now() } = {})
```
convert a html image  object to File 

### imageUrlToBase64
```javascript
const base64 = await imageUrlToBase64(url)
```
use a image  url (the url allow cross domain ) from remote ,convert  to base64

### blobToFile
```javascript
const file =  blobToFile(blob)
//args  (blob, fileName, { contentType, lastModified = Date.now() } = {}) 
```
convert a blob to File

### base64ToBlob
```javascript
const blob =  base64ToBlob(base64)
```
convert a base64 to Blob


### base64ToFile
```javascript
const file =  base64ToFile(base64,"file.txt")
//args (base64, fileName, { contentType, lastModified = Date.now() } = {}) 
```
convert a base64 to File


### urlToBlob
```javascript
const blob = await urlToBlob(url)
 
```
fetch a remote url as Blob

### urlToFile
```javascript
const file = await urlToFile(url,"image.png")
//args  (url, fileName, { contentType, lastModified = Date.now() } = {})
```
fetch a remote url as File


### createThumb
```javascript
const thumbBase64 = await createThumb(url,100,100)
//args   (file, width, height, { timeout = 2048, currentTime = 1, type = "image/png", quality = .8 } = {})
```
create File | Image | Video 's  thumb base64，

### creatPreviewUrl
```javascript
const url = await creatPreviewUrl(file)
//args  (file, timeout = 2048) 
```
use URL.createObjectURL(file) to create url，and use settimeout to revokeObjectURL


