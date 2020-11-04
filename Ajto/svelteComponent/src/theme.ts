import type { GroupNumbers } from "./types"

type Theme = typeof defaultTheme & { name?: string }

const defaultTheme = {
    color: {
        green: "#27AA83",
        yellow: "#CBCF06",
        gray: "#617D98",
        blue: "#5B5DEC",
        lightGreen: "#8CEDC6",
        lightBlue: "#A2A7FB",
    },
}

export const createRootTheme = (theme: Theme = defaultTheme) => {
    let themeName = "theme"
    if (theme.name) {
        themeName = theme.name
    }
    document.documentElement.style.setProperty("--theme-name", theme.name)
    if (theme.color) {
        Object.keys(theme.color).forEach((colorKey) => {
            document.documentElement.style.setProperty(
                `--${themeName}-color-${colorKey}`,
                theme.color[colorKey]
            )
        })
    }
}

export const groupColorMap = {
    [0]: "var(--theme-color-gray)",
    [1]: "var(--theme-color-lightGreen)",
    [2]: "var(--theme-color-blue)",
}
