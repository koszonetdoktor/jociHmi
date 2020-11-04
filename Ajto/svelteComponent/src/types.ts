export type ValueChangeEventDetail =
    | AngleChange
    | LimitPositionsReached
    | PositionChange
    | GroupChange

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

interface GroupChange {
    key: "group"
    value: GroupNumbers
}

export type GroupNumbers = 0 | 1 | 2
