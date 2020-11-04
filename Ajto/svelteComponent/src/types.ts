export type ValueChangeEventDetail =
    | AngleChange
    | LimitPositionsReached
    | PositionChange

interface AngleChange {
    key: "open_angle" | "end_angle"
    value: string
}

interface LimitPositionsReached {
    key: "end_position" | "start_position"
    value: boolean
}

interface PositionChange {
    key: "target_position" | "current_position"
    value: string
}
