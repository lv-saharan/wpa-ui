/**
 * 取出base64 的content-type 和 content
 * @param {String} base64 字符串
 */
export const parseBase64 = base64 => {
    if (typeof base64 !== "string") return null
    const parts = base64.split(";base64,");
    if (parts.length != 2) return null
    const contentType = parts[0].split(":")[1];
    const content = parts[1];
    return {
        contentType,
        content
    }
}


/**
 * file,blob 对象转换成base64
 * @param {File|Blob} file 
 */
export const fileToBase64 = (file) => {
    return new Promise(resolve => {
        let fs = new FileReader();
        fs.readAsDataURL(file);
        fs.onload = e => {
            resolve(e.target.result);
        };
    });
};

/**
 * 将图像转换成Base64
 * @param {Image} image 
 * @param {String} type 默认 image/png
 * @param {Number} quality 图像质量，默认0.8
 */
export const imageToBase64 = (image, type = 'image/png', quality = .8) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    ctx.drawImage(image, 0, 0)
    return canvas.toDataURL(type, quality)
}
/**
 * 将图像对象转换成blob
 * @param {Image} image 
 */
export const imageToBlob = (image) => {
    return base64ToBlob(imageToBase64(image))
}
/**
 * 将图像对象转换成文件对象
 * @param {Image} image 
 * @param {String} fileName 
 */
export const imageToFile = (image, fileName, { lastModified = Date.now() } = {}) => {
    const imageBlob = imageToBlob(image)
    return blobToFile(imageBlob, fileName, { contentType: imageBlob.type, lastModified })
}
/**
 * 通过图片Url地址，将图片转换成base64
 * 跨域图片不一定可以成功
 * @param {String} url 图片的URL
 */
export const imageUrlToBase64 = url => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.crossOrigin = 'anonymous'
        image.src = url
        image.onload = () => {
            resolve(imageToBase64(image))
        }
        image.onerror = (e) => {
            reject(e)
        }
    })
}

/**
 * 将blob转换成文件
 * @param {Blob} blob 
 * @param {String} fileName 
 * @param {String} contentType 
 * @param {Date} lastModified 
 */
export const blobToFile = (blob, fileName, { contentType, lastModified = Date.now() } = {}) => {
    return new File([blob], fileName, { type: contentType ?? blob.type, lastModified });
}
/**
 * 将base64转换成blob
 * @param {String} base64 
 */
export const base64ToBlob = (base64) => {
    if (!base64) return null
    const { content, contentType } = parseBase64(base64) ?? {}
    const raw = window.atob(content);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
}
/**
 * 将base64 转化成文件对象
 * @param {String} base64 
 * @param {String} fileName 
 * @param {Date} lastModified 
 * @returns 
 */
export const base64ToFile = (base64, fileName, { contentType, lastModified = Date.now() } = {}) => {
    const blob = base64ToBlob(base64)
    return blob && blobToFile(blob, fileName, { type: contentType ?? blob.type, lastModified })
}

/**
 * 使用fetch将 url转换成blob对象
 * 需要跨域是需要对应url允许当前域访问
 * @param {String} url 
 */
export const urlToBlob = url => {
    return new Promise((resolve, reject) => {
        try {
            fetch(url).then(async response => {
                if (response.status == 200) {
                    resolve(await response.blob())
                } else {
                    reject(new Error(response.status))
                }
            })
        } catch (exc) {
            reject(exc)
        }
    })
}

/**
 * 
 * @param {String} url 
 * @param {String} fileName 
 * @param {Object} options {contentType, lastModified}
 * @returns 
 */
export const urlToFile = (url, fileName, { contentType, lastModified = Date.now() } = {}) => {
    return urlToBlob(url).then(blob => {
        return blobToFile(blob, fileName, { contentType, lastModified })
    })
}
/**
 * 创建Image、Video 、File（图片、视频）的缩略图
 * @param {File | Image | Video} file 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Object} options {timeout = 2048,currentTime = 1, type = "image/png", quality = .8} 
 * @returns 
 */
export const createThumb = async (file, width, height, { timeout = 2048, currentTime = 1, type = "image/png", quality = .8 } = {}) => {
    let rawWidth = 0, rawHeight = 0
    if (file instanceof File) {

        file = await new Promise((resolve, reject) => {
            if (file.type.startsWith("image/")) {
                const image = new Image()
                const url = window.URL.createObjectURL(file)
                image.src = url
                image.onload = () => {
                    resolve(image)
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                    }, timeout);
                }
                image.onerror = (error) => {
                    window.URL.revokeObjectURL(url);
                    reject(error)
                }
            } else if (file.type.startsWith("video/")) {
                const video = document.createElement("video")
                const url = window.URL.createObjectURL(file)
                video.src = url
                video.preload = "auto"
                video.currentTime = currentTime
                video.onloadeddata = () => {
                    resolve(video)
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                    }, timeout);
                }
                video.onerror = (e) => {
                    window.URL.revokeObjectURL(url);
                    reject(e)
                }
            }

        })
    }

    if (file instanceof Image) {
        rawWidth = file.naturalWidth
        rawHeight = file.naturalHeight
    } else if (file instanceof HTMLVideoElement) {
        rawWidth = file.videoWidth
        rawHeight = file.videoHeight
    }
    let ratio = rawWidth / width
    let newHeight = rawHeight / ratio
    if (height < newHeight) {
        ratio = newHeight / height
        width = width / ratio
    } else {
        height = newHeight
    }
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    ctx.drawImage(file, 0, 0, rawWidth, rawHeight, 0, 0, width, height)
    return canvas.toDataURL(type, quality)
}
/**
 * 创建一个URL对象，若干时间后销毁
 * @param {File} file 
 * @returns 
 */
export const creatPreviewUrl = (file, timeout = 2048) => {
    if (!(file instanceof File)) return null
    const url = URL.createObjectURL(file);
    setTimeout(() => {
        URL.revokeObjectURL(url)
    }, timeout);
    return url
}
