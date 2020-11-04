import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import livereload from "rollup-plugin-livereload"
import { terser } from "rollup-plugin-terser"
import autoPreprocess from "svelte-preprocess"
import typescript from "@rollup/plugin-typescript"

const production = !process.env.ROLLUP_WATCH

export default {
    input: "src/main.js", // (1)
    output: {
        format: "iife",
        name: "app",
        file: "public/dist/componentSrc.js", // (2)
    },
    plugins: [
        svelte({
            // enable run-time checks when not in production
            dev: !production,
            preprocess: autoPreprocess(),
        }),
        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs(),
        typescript({ sourceMap: !production }),
        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload("public"), // (4)

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
    ],
    watch: {
        clearScreen: false,
    },
}

function serve() {
    let started = false

    return {
        writeBundle() {
            if (!started) {
                started = true

                require("child_process").spawn(
                    "npm",
                    ["run", "start", "--", "--dev"],
                    {
                        stdio: ["ignore", "inherit", "inherit"],
                        shell: true,
                    }
                )
            }
        },
    }
}
