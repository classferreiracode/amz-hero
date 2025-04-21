// Define uma hitbox baseada nas coordenadas e tamanho do sprite
export function getHitbox(x, y, width = 48, height = 48) {
    return {
        left: x,
        right: x + width,
        top: y,
        bottom: y + height
    }
}

// Verifica se duas hitboxes colidem
export function colide(boxA, boxB) {
    return (
        boxA.left < boxB.right &&
        boxA.right > boxB.left &&
        boxA.top < boxB.bottom &&
        boxA.bottom > boxB.top
    )
}
