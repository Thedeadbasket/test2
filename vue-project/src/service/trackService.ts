// services/trackService.ts
export function parseTracks(raw) {
    return raw.map(t => ({
        label: t.track,
        value: t.track,
        color: t.color,
    }))
}
