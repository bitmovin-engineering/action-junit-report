import {parseFile} from "../src/testParser";
import {generateFailedTestsReport} from "../src/failedTestsReport";

describe('generate failed tests report', () => {
    it('does not exceed char limit', async () => {
        const { annotations } = await parseFile('test_results/failed-tests-report/junit.xml');
        let charLimit = 5
        let output = generateFailedTestsReport(annotations, charLimit)

        expect(output.length).toBe(charLimit)
    });

    it('only returns the first test with additional failed tests description', async () => {
        const { annotations } = await parseFile('test_results/failed-tests-report/junit.xml');
        let charLimit = 200
        let testLimit = 1
        let output = generateFailedTestsReport(annotations, charLimit, testLimit)

        expect(output).toBe("*FirstFailedTest*\\n```failure```\\n\\n+ additional *2* failed tests.")
    });

    it('only returns the first test and does not exceed char limit', async () => {
        const { annotations } = await parseFile('test_results/failed-tests-report/junit.xml');
        let charLimit = 17
        let testLimit = 1
        let output = generateFailedTestsReport(annotations, charLimit, testLimit)

        expect(output).toBe("*FirstFailedTest*")
    });

    it('returns a valid json field string', async () => {
        const { annotations } = await parseFile('test_results/failed-tests-report/junit.xml');
        let output = generateFailedTestsReport(annotations)

        // This will throw if output contains invalid json field chars and the test will fail.
        JSON.parse(`{"report": "${output}"}`)
    });
})
