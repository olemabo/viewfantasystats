export function getObjectDataFromKeys(data: any, gw: number, keys: any) {
    if (gw in keys) {
      return data[keys[gw]];
    }
    
    return [];
}