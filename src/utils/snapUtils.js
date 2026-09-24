const SNAP_THRESHOLD = 10; // Distancia en píxeles para activar el "imán"

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
        // Izquierda con Izquierda
        if (Math.abs(currentLeft - targetLeft) < SNAP_THRESHOLD) {
            snappedX = targetLeft;
            activeGuideX = targetLeft;
        }
        // Centro con Centro
        else if (Math.abs(currentCenterX - targetCenterX) < SNAP_THRESHOLD) {
            snappedX = targetCenterX - width / 2;
            activeGuideX = targetCenterX;
        }
        // Derecha con Derecha
        else if (Math.abs(currentRight - targetRight) < SNAP_THRESHOLD) {
            snappedX = targetRight - width;
            activeGuideX = targetRight;
        }
        // Izquierda con Derecha
        else if (Math.abs(currentLeft - targetRight) < SNAP_THRESHOLD) {
            snappedX = targetRight;
            activeGuideX = targetRight;
        }
        // Derecha con Izquierda
        else if (Math.abs(currentRight - targetLeft) < SNAP_THRESHOLD) {
            snappedX = targetLeft - width;
            activeGuideX = targetLeft;
        }

        // --- ALINEACIÓN HORIZONTAL (EJE Y) ---
        // Superior con Superior
        if (Math.abs(currentTop - targetTop) < SNAP_THRESHOLD) {
            snappedY = targetTop;
            activeGuideY = targetTop;
        }
        // Centro con Centro
        else if (Math.abs(currentCenterY - targetCenterY) < SNAP_THRESHOLD) {
            snappedY = targetCenterY - height / 2;
            activeGuideY = targetCenterY;
        }
        // Inferior con Inferior
        else if (Math.abs(currentBottom - targetBottom) < SNAP_THRESHOLD) {
            snappedY = targetBottom - height;
            activeGuideY = targetBottom;
        }
        // Superior con Inferior
        else if (Math.abs(currentTop - targetBottom) < SNAP_THRESHOLD) {
            snappedY = targetBottom;
            activeGuideY = targetBottom;
        }
        // Inferior con Superior
        else if (Math.abs(currentBottom - targetTop) < SNAP_THRESHOLD) {
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