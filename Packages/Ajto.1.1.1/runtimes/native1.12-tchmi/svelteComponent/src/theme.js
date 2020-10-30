const defaultTheme = {
    color: {
        green: "#109D0D",
        yellow: "#CBCF06",
        gray: "#9F9F9F",
    },
}

export const createRootTheme = (theme = defaultTheme) => {
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
