export function limitAngle(angleValue: number): number {
    let limitedValue = angleValue
    if (limitedValue > 90) {
        limitedValue = 90
    } else if (limitedValue < 0) {
        limitedValue = 0
    }
    return limitedValue
}
