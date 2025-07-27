export function lowerCaseText(text: string): string {
    if (!text || text.length == 1) { return ""; }
    return text.slice(0, 1).toUpperCase() + text.slice(1).toLowerCase();
}