import { Media } from "../types/media.type";
import { SuccessResponse } from "../types/utils.type";
import http from "../utils/http";

export const URL_UPLOAD_FILE = "api/v1/medias/upload";
export const URL_UPLOAD_FILES  = "api/v1/medias/uploads";

 const mediaAPI = {
    uploadFile(file: File) {
        const formData = new FormData();
        formData.append("file", file);
        return http.post<SuccessResponse<Media>>(URL_UPLOAD_FILE, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });
    },
    
    uploadFiles(files: File[]) {
        const formData = new FormData();
        files.forEach((file) => {
        formData.append("files", file);
        });
        return http.post<SuccessResponse<Media[]>>(URL_UPLOAD_FILES, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });
    },
}

export default mediaAPI;