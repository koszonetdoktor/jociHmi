type Theme = typeof defaultTheme & { name?: string }

const defaultTheme = {
    color: {
        green: "#3DBD92",
        yellow: "#CBCF06",
        gray: "#9F9F9F",
        blue: "#6D6DF3",
    },
}

export const createRootTheme = (theme: Theme = defaultTheme) => {
    console.log("theme", theme)
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
