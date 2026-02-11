const { addition, soustraction, multiplication, division } = require("../functions/mathOperations.js");

describe("mathOperations", () => {
    describe("addition", () => {
        it("should return 9 (6 + 3)", async () => {
            expect(addition(6, 3)).toBe(9);
        });
    });
    describe("soustraction", () => {
        it("should return 3 (6 - 3)", async () => {
            expect(soustraction(6, 3)).toBe(3);
        });
    });
    describe("multiplication", () => {
        it("should return 3 (6 - 3)", async () => {
            expect(multiplication(6, 3)).toBe(18);
        });
    });
    describe("division", () => {
        it("should return an error (division by 0)", async () => {
            expect(() => division(9, 0)).toThrow("Division par zéro impossible");
        });
        it("should return 2 (6 / 3)", async () => {
            expect(division(6, 3)).toBe(2);
        });
    });
});
