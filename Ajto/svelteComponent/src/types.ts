export type ValueChangeEventDetail =
    | AngleChange
    | LimitPositionsReached
    | PositionChange
    | GroupChange
    | BrakeOpenChange

interface AngleChange {
    key: "open_angle" | "end_angle"
    value: string
}

interface LimitPositionsReached {
    key: "end_position" | "start_position"
    value?: boolean
}

interface PositionChange {
    key: "target_position" | "current_position"
    value?: string
}

interface GroupChange {
    key: "group"
    value?: GroupNumbers
}

interface BrakeOpenChange {
    key: "brake_open"
    value?: boolean
}

export type GroupNumbers = 0 | 1 | 2
