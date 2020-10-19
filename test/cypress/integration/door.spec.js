/// <reference types="Cypress" />

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

    it("chaanging angle", function () {
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
