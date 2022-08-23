export function convertFDRtoHex(fdr: string, fdrToColor: any) {
    if (isEmpty(fdrToColor)) return "";
    var float = parseFloat(fdr);
    if (float == 0.5) return "#" + fdrToColor[0.5].substring(2);
    var int = parseInt(fdr);
    if (int == 1) return "#" + fdrToColor[1].substring(2);
    if (int == 2) return "#" + fdrToColor[2].substring(2);
    if (int == 3) return "#" + fdrToColor[3].substring(2);
    if (int == 4) return "#" + fdrToColor[4].substring(2);
    if (int == 5) return "#" + fdrToColor[5].substring(2);
    return "#000";
}

function isEmpty(obj: {}) {
    if (obj == null) { return true; }
    return Object.keys(obj).length === 0;
}