import { v2 } from 'cloudinary';
import { unlink } from 'fs';
export const CloudinaryProvider = {
    provide: 'Cloudinary',
    useFactory: (): any => {
        return v2.config({
            cloud_name: 'quangtung',
            api_key: '691767399919572',
            api_secret: 'bzVUcJRt5iQ7fjwKNJtopXkrfzo',
        })
    }
}

export const removeTmp = (path) => {
    unlink(path, err => {
        if (err) throw err;
    })
}