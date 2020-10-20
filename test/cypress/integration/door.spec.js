/// <reference types="Cypress" />

const { capitalize, functionsIn } = require("cypress/types/lodash")

describe("Door", function () {
    before(function () {
        cy.visit("/")
        cy.window().then((win) => {
            cy.document().then((doc) => {
                console.log("ADDD the guys")
                new win.DoorComponent({
                    target: doc.getElementById("root"),
                    props: {
                        valueChangeEvent: "cypress_value",
                    },
                })
            })
        })
    })

    // it("reach end positions", function () {
    //     const yellowColor = "#9F9F9F"

    //     cy.get("[data-testid=marker_endPosition]").should(
    //         "have.css",
    //         "background-color",
    //         yellowColor
    //     )
    // })

    it("change end angle", function () {
        cy.document().trigger("cypress_value", {
            detail: {
                key: "end_angle",
                value: 50,
            },
        })

        cy.get("[data-testid=marker_endPosition]")
            .invoke("style")
            .then((style) => {
                cy.log("STYLE", style)
            })
    })

    it("reaches end positions", function () {
        cy.document().trigger("cypress_value", {
            detail: {
                key: "end_position",
                value: true,
            },
        })
        cy.wait(1000)
        cy.document().trigger("cypress_value", {
            detail: {
                key: "end_position",
                value: false,
            },
        })
        cy.wait(1000)
        cy.document().trigger("cypress_value", {
            detail: {
                key: "start_position",
                value: true,
            },
        })
        cy.wait(1000)
        cy.document().trigger("cypress_value", {
            detail: {
                key: "start_position",
                value: false,
            },
        })
    })

    it("changing angle", function () {
        cy.document().then((doc) => {
            let angle = 0
            let direction = 0
            for (let i = 0; i < 1800; i++) {
                cy.document().trigger(`cypress_value`, {
                    detail: { key: "open_angle", value: angle },
                })

                if (angle >= 90) {
                    direction = 1
                } else if (angle <= 0) {
                    direction = 0
                }
                if (direction === 0) {
                    angle = angle + 2.5
                } else {
                    angle = angle - 2.5
                }
                cy.wait(250)
            }
        })
    })
})
