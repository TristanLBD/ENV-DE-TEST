const { isWeekend, addDays, formatDate, daysBetween } = require("../functions/dateUtils.js");

describe("dateUtils", () => {
    describe("isWeekend", () => {
        it("should return error (not a date)", async () => {
            const date = undefined;
            expect(() => isWeekend(date)).toThrow("Input must be a Date object");
        });

        it("should return trie because its a weekend", async () => {
            const date = new Date(2026, 2, 8);
            expect(isWeekend(date)).toBe(true);
        });

        it("should return false because its not a weekend", async () => {
            const date = new Date(2026, 2, 10);
            expect(isWeekend(date)).toBe(false);
        });
    });

    describe("addDays", () => {
        it("should return error (not a date)", async () => {
            expect(() => addDays(undefined, 6)).toThrow("First argument must be a Date object");
        });

        it("should return actual date + 6 days", async () => {
            let date = new Date();
            const expectedDate = new Date(date);
            expectedDate.setDate(date.getDate() + 6);

            expect(addDays(date, 6)).toEqual(expectedDate);
        });

        it("should return actual date - 6 days", async () => {
            let date = new Date();
            const expectedDate = new Date(date);
            expectedDate.setDate(date.getDate() - 6);

            expect(addDays(date, -6)).toEqual(expectedDate);
        });
    });

    describe("formatDate", () => {
        it("should format date as YYYY-MM-DD", () => {
            const date = new Date("2024-01-15T10:30:00Z");
            expect(formatDate(date)).toBe("2024-01-15");
        });

        it("should throw error if input is not a Date", () => {
            expect(() => formatDate("2024-01-15")).toThrow("Input must be a Date object");
            expect(() => formatDate(null)).toThrow();
            expect(() => formatDate(123)).toThrow();
        });

        it("should not mutate the original date", () => {
            const date = new Date("2024-01-15T10:30:00Z");
            const original = date.getTime();

            formatDate(date);

            expect(date.getTime()).toBe(original);
        });
    });

    describe("daysBetween", () => {
        it("should return number of days between two dates", () => {
            const date1 = new Date("2024-01-01");
            const date2 = new Date("2024-01-06");

            expect(daysBetween(date1, date2)).toBe(5);
        });

        it("should return positive value regardless of order", () => {
            const date1 = new Date("2024-01-10");
            const date2 = new Date("2024-01-05");

            expect(daysBetween(date1, date2)).toBe(5);
        });

        it("should return 0 when dates are the same day", () => {
            const date1 = new Date("2024-01-01");
            const date2 = new Date("2024-01-01");

            expect(daysBetween(date1, date2)).toBe(0);
        });

        it("should round up partial days", () => {
            const date1 = new Date("2024-01-01T00:00:00");
            const date2 = new Date("2024-01-02T01:00:00");

            expect(daysBetween(date1, date2)).toBe(2);
        });

        it("should throw error if arguments are not Dates", () => {
            expect(() => daysBetween("2024-01-01", new Date())).toThrow();
            expect(() => daysBetween(new Date(), null)).toThrow();
            expect(() => daysBetween(123, 456)).toThrow();
        });
    });
});
