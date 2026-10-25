/** همان پوشش پاسخی که بک‌اند برمی‌گرداند — فیکسچرها هم همین شکل را تقلید می‌کنند */
export interface GenericResponse<T> {
    data?: T;
    page?: number;
    page_size?: number;
    total?: number;
}
