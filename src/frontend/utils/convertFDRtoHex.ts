export function convertFDRtoHex(fdr: string, fdrToColor: any) {
    if (isEmpty(fdrToColor)) return "";
    var float = parseFloat(fdr);
    if (float == 0.5) return "#df78df";
    if (float == 0.5) return "#" + fdrToColor[0.5].substring(2);
    var int = parseInt(fdr);
    if (int == 1) return "#8EB88A"; // grønn
    if (int == 1) return "#6bc895";
    if (int == 1) return "#" + fdrToColor[1].substring(2);
    if (int == 2) return "#b2dc85"; // grønn
    if (int == 2) return "#b2dc85";
    if (int == 2) return "#" + fdrToColor[2].substring(2);
    if (int == 3) return "#edee92"; // gul
    if (int == 3) return "#eaea8f";
    if (int == 3) return "#" + fdrToColor[3].substring(2);
    if (int == 4) return "#f0d67d"; // oransje
    if (int == 4) return "#f0ce67";
    if (int == 4) return "#" + fdrToColor[4].substring(2);
    if (int == 5) return "#f07272"; // rød
    if (int == 5) return "#f07272";
    if (int == 5) return "#" + fdrToColor[5].substring(2);
    return "#4a4949";
    // return "#000";
}

function isEmpty(obj: {}) {
    if (obj == null) { return true; }
    return Object.keys(obj).length === 0;
}