import { jest } from '@jest/globals';
const mockIsWord = jest.fn(() => true);
jest.unstable_mockModule('../src/words.js', () => {
    return {
      getWord: jest.fn(() => 'APPLE'),
      isWord: mockIsWord,
    };
});
const { Wordle, buildLetter } = await import('../src/wordle.js');

describe('building a letter object', () => {
    test('returns a letter object', () => {
        expect(buildLetter("x", "y")).toEqual({letter: "x", status: "y"})
    });
});

describe('constructing a new Wordle game', () => {
    test('sets maxGuesses to 6 if no argument is passed', () => {
        expect(new Wordle().maxGuesses).toEqual(6)
    })
    test('sets maxGuesses to argument', () => {
        expect(new Wordle(10).maxGuesses).toEqual(10)
    })
    test('sets guesses to array of length maxGuesses', () => {
        expect(new Wordle().guesses.length).toEqual(6)
    })
    test('sets currGuess to 0', () => {
        expect(new Wordle().currGuess).toEqual(0)
    })
    test('sets word to word from getWord', () => {
        expect(new Wordle().word).toEqual('APPLE')
    })
});

describe('building guess from word', () => {
    test('sets status of correct letter to CORRECT', () => {
        expect(new Wordle().buildGuessFromWord('A____')[0].status).toEqual('CORRECT')
    })
    test('sets status of present letter to PRESENT', () => {
        expect(new Wordle().buildGuessFromWord('E____')[0].status).toEqual('PRESENT')
    })
    test('sets status of absent letter to ABSENT', () => {
        expect(new Wordle().buildGuessFromWord('Z____')[0].status).toEqual('ABSENT')
    })
})

describe('appending guess in wordle', () => {
    test('throws error if no more guesses are allowed', () => {
        expect(() => {
            new Wordle(0).appendGuess('TESTS')
        }).toThrow()
    })
    test('throws error if guess is not of length 5', () => {
        expect(() => {
            new Wordle().appendGuess('APPLES')
        }).toThrow()
    })
    test('throws error if guess is not a word', () => {
        expect(() => {
            mockIsWord.mockReturnValueOnce(false)
            new Wordle().appendGuess('GUESS')
        }).toThrow()
    })
    test('increments current guess', () => {
        expect(new Wordle().appendGuess('GUESS').currGuess).toBe(1)
    })
})

describe('wordle getting solved', () => {
    test('returns true if latest guess is correct word', () => {
        expect(new Wordle().appendGuess('APPLE').isSolved()).toBe(true)
    })
    test('returns false if latest guess is not correct word', () => {
        expect(new Wordle().appendGuess('FINAL').isSolved()).toBe(false)
    })
})

describe('wordle ending the game', () => {
    test('returns true if latest guess is correct word', () => {
        expect(new Wordle().appendGuess('APPLE').shouldEndGame()).toBe(true)
    })
    test('returns true if no guesses are left', () => {
        expect(new Wordle(0).shouldEndGame()).toBe(true)
    })
    test('returns false if no guesses have been made', () => {
        expect(new Wordle().shouldEndGame()).toBe(false)
    })
    test('returns false if no guesses left and word has not been guessed', () => {
        const wordle = new Wordle(0)
        expect(wordle.isSolved() && wordle.shouldEndGame()).toBe(false)
    })
})