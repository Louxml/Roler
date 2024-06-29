

const idCounts = Object.create(null);
const idHash = Object.create(null);

export function generateIdFromString(value, groupId) {
    let id = idHash[value];
    if (id) return id;

    idCounts[groupId] ??= 0;
    idHash[value] = id = ++idCounts[groupId];

    return id;
}