import type { DataProvider } from 'react-admin';
import { getService } from './service/registry';

export const dataProvider: DataProvider = {
    
    getList: async (resource) => {
        const service = getService(resource);
        const data = await service.getAll();
        
        return {
            data: data,
            total: data.length,
        } as any;
    },

    getOne: async (resource, params) => {
        const service = getService(resource);
        const data = await service.getOne(params.id.toString());
        
        return { data } as any;
    },

    create: async (resource, params) => {
        const service = getService(resource);
        const data = await service.create(params.data);
        
        return { data: { ...params.data, ...data } } as any;
    },

    update: async (resource, params) => {
        const service = getService(resource);
        const data = await service.update(params.id.toString(), params.data);
        
        return { data } as any;
    },

    delete: async (resource, params) => {
        const service = getService(resource);
        await service.delete(params.id.toString());
        
        return { data: params.previousData } as any;
    },

    getMany: async () => ({ data: [] } as any),
    getManyReference: async () => ({ data: [], total: 0 } as any),
    updateMany: async () => ({ data: [] } as any),
    deleteMany: async (resource, params) => {
        const service = getService(resource);
        await Promise.all(
            params.ids.map(id => service.delete(id.toString()))
        );
        return { data: params.ids } as any;
    },
};