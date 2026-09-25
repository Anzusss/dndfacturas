const SNAP_THRESHOLD = 5; // Distancia en píxeles para activar el "imán"

export const calculateSnap = (currentBlock, allElements, zoom = 1) => {
    let { x, y, width, height, id } = currentBlock;

    // Normalizamos por el zoom para que la matemática sea exacta
    let snappedX = x;
    let snappedY = y;

    let activeGuideX = null; // Línea vertical
    let activeGuideY = null; // Línea horizontal

    // Puntos clave del bloque que se está moviendo
    const currentLeft = x;
    const currentCenterX = x + width / 2;
    const currentRight = x + width;

    const currentTop = y;
    const currentCenterY = y + height / 2;
    const currentBottom = y + height;

    // Filtramos para no compararse consigo mismo
    const otherElements = allElements.filter((el) => el.id !== id);

    for (const target of otherElements) {
        const targetLeft = target.x;
        const targetCenterX = target.x + target.width / 2;
        const targetRight = target.x + target.width;

        const targetTop = target.y;
        const targetCenterY = target.y + target.height / 2;
        const targetBottom = target.y + target.height;

        // --- ALINEACIÓN VERTICAL (EJE X) ---
        if (Math.abs(currentLeft - targetLeft) < SNAP_THRESHOLD) {
            snappedX = targetLeft;
            activeGuideX = targetLeft;
        } else if (Math.abs(currentCenterX - targetCenterX) < SNAP_THRESHOLD) {
            snappedX = targetCenterX - width / 2;
            activeGuideX = targetCenterX;
        } else if (Math.abs(currentRight - targetRight) < SNAP_THRESHOLD) {
            snappedX = targetRight - width;
            activeGuideX = targetRight;
        } else if (Math.abs(currentLeft - targetRight) < SNAP_THRESHOLD) {
            snappedX = targetRight;
            activeGuideX = targetRight;
        } else if (Math.abs(currentRight - targetLeft) < SNAP_THRESHOLD) {
            snappedX = targetLeft - width;
            activeGuideX = targetLeft;
        }

        // --- ALINEACIÓN HORIZONTAL (EJE Y) ---
        if (Math.abs(currentTop - targetTop) < SNAP_THRESHOLD) {
            snappedY = targetTop;
            activeGuideY = targetTop;
        } else if (Math.abs(currentCenterY - targetCenterY) < SNAP_THRESHOLD) {
            snappedY = targetCenterY - height / 2;
            activeGuideY = targetCenterY;
        } else if (Math.abs(currentBottom - targetBottom) < SNAP_THRESHOLD) {
            snappedY = targetBottom - height;
            activeGuideY = targetBottom;
        } else if (Math.abs(currentTop - targetBottom) < SNAP_THRESHOLD) {
            snappedY = targetBottom;
            activeGuideY = targetBottom;
        } else if (Math.abs(currentBottom - targetTop) < SNAP_THRESHOLD) {
            snappedY = targetTop - height;
            activeGuideY = targetTop;
        }
    }

    return {
        snappedX,
        snappedY,
        activeGuideX,
        activeGuideY,
    };
};

/**
 * Nueva función para calcular el Snap durante el Resize
 * Considera la dirección (direction) desde la cual se está estirando el bloque.
 */
export const calculateResizeSnap = (currentBlock, allElements, direction) => {
    let { x, y, width, height, id } = currentBlock;

    let snappedX = x;
    let snappedY = y;
    let snappedWidth = width;
    let snappedHeight = height;

    let activeGuideX = null;
    let activeGuideY = null;

    const currentLeft = x;
    const currentRight = x + width;
    const currentTop = y;
    const currentBottom = y + height;

    const otherElements = allElements.filter((el) => el.id !== id);

    let snappedOnX = false;
    let snappedOnY = false;
    const dir = direction.toLowerCase();

    for (const target of otherElements) {
        const targetLeft = target.x;
        const targetCenterX = target.x + target.width / 2;
        const targetRight = target.x + target.width;

        const targetTop = target.y;
        const targetCenterY = target.y + target.height / 2;
        const targetBottom = target.y + target.height;

        const verticalLines = [targetLeft, targetCenterX, targetRight];
        const horizontalLines = [targetTop, targetCenterY, targetBottom];

        // Eje X
        if (!snappedOnX) {
            if (dir.includes('right')) {
                for (const line of verticalLines) {
                    if (Math.abs(currentRight - line) < SNAP_THRESHOLD) {
                        snappedWidth = line - x;
                        activeGuideX = line;
                        snappedOnX = true;
                        break;
                    }
                }
            } else if (dir.includes('left')) {
                for (const line of verticalLines) {
                    if (Math.abs(currentLeft - line) < SNAP_THRESHOLD) {
                        snappedX = line;
                        snappedWidth = currentRight - line; // El borde derecho queda intacto
                        activeGuideX = line;
                        snappedOnX = true;
                        break;
                    }
                }
            }
        }

        // Eje Y
        if (!snappedOnY) {
            if (dir.includes('bottom')) {
                for (const line of horizontalLines) {
                    if (Math.abs(currentBottom - line) < SNAP_THRESHOLD) {
                        snappedHeight = line - y;
                        activeGuideY = line;
                        snappedOnY = true;
                        break;
                    }
                }
            } else if (dir.includes('top')) {
                for (const line of horizontalLines) {
                    if (Math.abs(currentTop - line) < SNAP_THRESHOLD) {
                        snappedY = line;
                        snappedHeight = currentBottom - line; // El borde inferior queda intacto
                        activeGuideY = line;
                        snappedOnY = true;
                        break;
                    }
                }
            }
        }
    }

    return {
        snappedX,
        snappedY,
        snappedWidth,
        snappedHeight,
        activeGuideX,
        activeGuideY,
    };
};