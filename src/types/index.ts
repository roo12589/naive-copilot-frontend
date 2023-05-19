import type { AxiosInstance } from 'axios'
export type Api = () => AxiosInstance
export interface Operation {
    id: number;
    upload_time: string;
    uploader: string;
    views: number;
    hot_score: number;
    available: boolean;
    rating_level: number;
    rating_ratio: number;
    rating_type: number;
    comments_count: number;
    content: {
        minimum_required: string;
        stage_name: string;
        actions: {
            type: string;
            name?: string;
            location?: [number, number];
            direction?: string;
            rear_delay?: number;
            costs?: number;
            skill_usage?: number;
            doc_color?: string;
            doc?: string;
        }[];
        doc: {
            title: string;
            details: string;
        };
        groups: any[];
        opers: {
            name: string;
            skill: number;
            skill_usage: number;
        }[];
    };
    not_enough_rating: boolean;
}

export interface Link {
    url: string;
    title: string;
}

export interface Response<T>{
    status_code: number;
    message?: string;
    data?:T,

}

export interface operationListInfo{
    has_next: boolean;
    page:number;
    total:number;
    data:Operation[]
}