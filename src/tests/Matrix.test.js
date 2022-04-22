// imports
require('../js/Matrix')
new p5()

// describe is overwritten in p5, rename to testGroup
const testGroup = require('@jest/globals').describe;

testGroup('constructor tests', () => {
    test('0 row matrix', () => {
        const zero = new Matrix(0,99);
        expect(zero.rows).toEqual(0);
    });
    test('0 col matrix', () => {
        const zero = new Matrix(99,0);
        expect(zero.cols).toEqual(0);
    });
    test('correct amount of m rows', () => {
        const trix = new Matrix(66,99);
        expect(trix.rows).toEqual(66);
    });
    test('correct amount of n cols', () => {
        const trix = new Matrix(66,99);
        expect(trix.cols).toEqual(99);
    });
});

testGroup('randomize() tests', () => {
    test('random values fall within the expected range of numbers', () => {
        const a = new Matrix(2,2); 

        expect(a.mat[0][0])

        a.randomize();

        const value1 = a.mat[0][0]
        expect(value1).toBeGreaterThanOrEqual(-1);
        expect(value1).toBeLessThanOrEqual(1);

        const value2 = a.mat[1][0]
        expect(value2).toBeGreaterThanOrEqual(-1);
        expect(value2).toBeLessThanOrEqual(1);

        const value3 = a.mat[0][1]
        expect(value3).toBeGreaterThanOrEqual(-1);
        expect(value3).toBeLessThanOrEqual(1);

        const value4 = a.mat[1][1]
        expect(value4).toBeGreaterThanOrEqual(-1);
        expect(value4).toBeLessThanOrEqual(1);
    });
});

testGroup('dot(n) tests', () => {

    test('dot product of two vectors', () => { 
        const a = new Matrix(1,3);
        const b = new Matrix(3,1);

        a.mat[0][0] = 1;
        a.mat[0][1] = 2;
        a.mat[0][2] = 3;
        b.mat[0][0] = 4;
        b.mat[1][0] = 5;
        b.mat[2][0] = 6;
        
        const value = a.dot(b).mat[0][0];
        expect(value).toEqual(32);
    });

    test('dot product mismatched row and cols failure', () => { 
        const a = new Matrix(3,1);
        const b = new Matrix(1,4);

        a.mat[0][0] = 1;
        a.mat[1][0] = 2;
        a.mat[2][0] = 3;
        b.mat[0][1] = 3;
        b.mat[0][2] = 1;
        b.mat[0][3] = 0;
        b.mat[0][4] = 2;
        
        //when rows and cols dont match, the function returns a 0 matrix.
        expect(a.dot(b).mat[0][0]).toEqual(0);        
    });

    test('dot product of two square matricies', () => { 
        const a = new Matrix(2,2);
        const b = new Matrix(2,2);

        a.mat[0][0] = 1;
        a.mat[0][1] = 2;
        a.mat[1][0] = 3;
        a.mat[1][1] = 4;

        b.mat[0][0] = 5;
        b.mat[0][1] = 6;
        b.mat[1][0] = 7;
        b.mat[1][1] = 8;

        expect(a.dot(b).mat[0][0]).toEqual(19);
        expect(a.dot(b).mat[0][1]).toEqual(22);
        expect(a.dot(b).mat[1][0]).toEqual(43);
        expect(a.dot(b).mat[1][1]).toEqual(50);
    });
});

testGroup('toArrary() tests', () => {
    test('test for correct length',() => {
        const a = new Matrix(5,3);
        expect(a.toArray().length).toEqual(15);

        const b = new Matrix(0,0);
        expect(b.toArray().length).toEqual(0);
    });

    test('test for correct ordering of array',() => {
        const a = new Matrix(2,2);
        a.mat[0][0] = 1;
        a.mat[0][1] = 2;
        a.mat[1][0] = 3;
        a.mat[1][1] = 4;
        expect(a.toArray()).toEqual([1,2,3,4]);
    });
});