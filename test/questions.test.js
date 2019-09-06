const {containsPolarQuestion, getQuestions} = require('../src/questions');

describe('questions', function () {
    describe('getQuestions', () => {
        it('should extract all questions out of a string', () => {
            const title = "Hello. This is a question: Is this a question? Delimiter! What about this one?";

            let questions = getQuestions(title);
            expect(questions).toContainEqual("Is this a question?");
            expect(questions).toContainEqual("What about this one?");
            expect(questions).not.toContainEqual("Hello");
            expect(questions).not.toContainEqual("This is a question");
        });

    });

    describe('containsPolarQuestion', () => {

        describe('polar questions', function () {

            const predicateQuestions = [
                "Did Trump draw on Dorian map to include Alabama in hurricane’s path?",
                "Is the President Engaging In Market Manipulation?",
                "Are African Artifacts Safer in Europe? Museum Conditions Revive Debate",
                "Does Comey deserve an apology? Not if you read the IG's report",
                "Fires, hurricanes, heat have Americans worrying about climate change. But will it affect the presidential race?",
                "Wouldn't It Be Great If People Could Vote on the Blockchain?",
                "Can the death penalty ever be 'justified'?",
            ];

            predicateQuestions.forEach(question => {
                it(`is true for "${question}"`, () => {
                    expect(containsPolarQuestion(question)).toBe(true);
                });
            })

        });

        describe('non-polar questions', function () {

            const nonPredicateQuestions = [
                "Foo?",
                "Bar",
                "Yang: You know what's expensive? Poisoning our kids",
                "World debt comparison: The global debt clock or How broke are you really?",
                "By adding justices to the Arizona Supreme Court, did Ducey help the state — or help himself?",
                "That Assault Weapon Ban? It Really Did Work",
                "Where Are America’s ‘Rebel Tories’?",
                "Sharpie-gate? Trump shows Dorian map with apparent addition",
                "What If Trump Supporters Love Chaos as Much as He Does?",
                "South Africa migrant attacks: 'Why can't we live with peace?' -- After wave of xenophobic violence, many foreign nationals say they do not feel welcome and fear for their safety.",
                "Ocasio-Cortez to Crenshaw: 'Why on earth' would you lend your handgun to friends?",
                "What If President Trump Truly Decompensated?",
                "Why has Trump turned against Fox News? It's an episode of \"Succession\" in real life",
                "Which Democratic Presidential Candidate Was Mentioned Most In The News Last Week?",
                "The Trump hush money mystery House Democrats should try to solve: Why did the investigation wrap up?",
                "Why Is Joe Biden Lowering Expectations? - His team wants to convince voters he can lose the early states and still take the nomination. That’d be a first.",
                "What would John McCain do?",
                "How many more names will be added to the list before Mitch McConnell acts on guns?",
                "Why is the Russian meddling in 2016 such a big secret? I’m not allowed to say."
            ];

            nonPredicateQuestions.forEach(question => {
                it(`is false for "${question}"`, function () {
                    expect(containsPolarQuestion(question)).toBe(false);
                });
            })

        });
    });
});
