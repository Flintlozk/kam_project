export const getProductCatalogRedisKey = (auth: string, pageID: number): string => `CATALOG_${pageID}_${auth}`;
