const { sumArray, findMax, removeDuplicates, flatten} = require('../functions/arrayUtils.js');

describe('arrayUtils', () => {
    describe('sumArray', () => {
        it('should return error (not an array)', async () => {
            const array = undefined;
            expect(() =>sumArray(array)).toThrow("Input must be an array");
        });

        it('should return 0 from empty array', async () => {
            const array = [];
            expect(sumArray(array)).toBe(0);
        });

        it('should return the correct sum of the array', async () => {
            const array = [1, 3, 5, 7, 9];
            expect(sumArray(array)).toBe(25);
        });
    });

    describe('findMax', () => {
        it('should return error (not an array)', async () => {
            const array = undefined;
            expect(() => findMax(array)).toThrow("Input must be a non-empty array");
        });

        it('should return error (empty array)', async () => {
            const array = [];
            expect(() => findMax(array)).toThrow("Input must be a non-empty array");
        });

        it('should find the max (69) from the array', async () => {
            const array = [1, 2, 55, 69, 45, 12, 32];
            expect(findMax(array)).toEqual(69);
        });

        it('should find the max (-1) from the negative array', async () => {
            const array = [-69, -1,  -32, -50];
            expect(findMax(array)).toEqual(-1);
        });
    });

    describe('removeDuplicates', () => {
        it('should return error (not an array)', async () => {
            const array = undefined;
            expect(() => removeDuplicates(array)).toThrow("Input must be an array");
        });

        it('should return an array without diplicated elements', async () => {
            const array = [1,2,3,1,4,5];
            expect(removeDuplicates(array)).toEqual([1, 2, 3, 4, 5]);
        });

        it('should return an empty array', async () => {
            const array = [];
            expect(removeDuplicates(array)).toEqual([]);
        });
    });

    describe('flatten', () => {
        it('should return error (not an array)', async () => {
            const array = undefined;
            expect(() => flatten(array)).toThrow("Input must be an array");
        });

        it('should return a flattened array', async () => {
            const array = [1,6,7, [5, 2]];
            expect(flatten(array)).toEqual([1, 6, 7, 5, 2]);
        });

        it('should return an empty array', async () => {
            const array = [];
            expect(flatten(array)).toEqual([]);
        });
    });
});