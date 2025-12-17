import prisma from '../prisma.js';

const getModel = (model, tx) => (tx || prisma)[model];

export const create = async (model, data, tx) =>
    await getModel(model, tx).create({
        data,
    });

export const getOne = async (model, data, tx) =>
    await getModel(model, tx).findUnique({
        where: data,
    });

export const getAll = async (model, options = {}, tx) =>
    await getModel(model, tx).findMany(options);
    
export const update = async (model, cond, data, tx) =>
    await getModel(model, tx).update({
        where: cond, 
        data: data, 
    });

export const updateMany = async (model, cond, data, tx) =>
    await getModel(model, tx).updateMany({
        where: cond,
        data: data,
    });

export const remove = async (model, data, tx) =>
    await getModel(model, tx).delete({
        where: data,
    });

export const count = (model, where = {}) => {
    return prisma[model].count({ where });
};
